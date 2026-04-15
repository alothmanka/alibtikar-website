import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, adminSessionProcedure, publicProcedure, router } from "./_core/trpc";
import { getAllSiteContent, getSiteContentByCategory, updateSiteContentValues, upsertSiteContent, seedSiteContentIfEmpty, deleteSiteContent } from "./db";
import { z } from "zod";
import crypto from "crypto";

// Admin credentials (hashed password for security)
const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update("@7654321").digest("hex");
const ADMIN_SESSION_COOKIE = "admin_session_token";

// Store valid admin session tokens in memory
const validAdminSessions = new Map<string, number>();
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isValidAdminToken(token: string): boolean {
  const timestamp = validAdminSessions.get(token);
  if (!timestamp) return false;
  if (Date.now() - timestamp > SESSION_EXPIRY_MS) {
    validAdminSessions.delete(token);
    return false;
  }
  return true;
}

function createAdminSession(): string {
  const token = crypto.randomBytes(32).toString("hex");
  validAdminSessions.set(token, Date.now());
  return token;
}

function invalidateAdminSession(token: string): void {
  validAdminSessions.delete(token);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Standalone admin login (independent of Manus OAuth)
  adminAuth: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(({ input, ctx }) => {
        const passwordHash = crypto.createHash("sha256").update(input.password).digest("hex");
        
        if (input.username !== ADMIN_USERNAME || passwordHash !== ADMIN_PASSWORD_HASH) {
          throw new Error("Invalid username or password");
        }

        // Create a new session token
        const sessionToken = createAdminSession();
        
        // Set secure cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(ADMIN_SESSION_COOKIE, sessionToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return { success: true, token: sessionToken };
      }),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const token = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
      if (token) {
        invalidateAdminSession(token);
      }
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),

    checkSession: publicProcedure.query(({ ctx }) => {
      const token = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
      const isValid = token && isValidAdminToken(token);
      return { isAuthenticated: isValid };
    }),
  }),

  // Public: get all site content for the frontend
  content: router({
    getAll: publicProcedure.query(async () => {
      // Seed defaults if the table is empty
      await seedSiteContentIfEmpty();
      return getAllSiteContent();
    }),
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return getSiteContentByCategory(input.category);
      }),
  }),

  // Admin-only: manage site content
  admin: router({
    getAllContent: adminSessionProcedure.query(async () => {
      await seedSiteContentIfEmpty();
      return getAllSiteContent();
    }),
    updateContent: adminSessionProcedure
      .input(z.object({
        contentKey: z.string().min(1),
        valueEn: z.string(),
        valueAr: z.string(),
      }))
      .mutation(async ({ input }) => {
        await updateSiteContentValues(input.contentKey, input.valueEn, input.valueAr);
        return { success: true };
      }),
    upsertContent: adminSessionProcedure
      .input(z.object({
        contentKey: z.string().min(1),
        valueEn: z.string(),
        valueAr: z.string(),
        category: z.string().min(1),
        label: z.string().min(1),
        fieldType: z.string().default("text"),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await upsertSiteContent(input);
        return { success: true };
      }),
    deleteContent: adminSessionProcedure
      .input(z.object({ contentKey: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await deleteSiteContent(input.contentKey);
        return { success: true };
      }),
    addCategory: adminSessionProcedure
      .input(z.object({ category: z.string() }))
      .mutation(async ({ input }) => {
        // Category is just a label, no database operation needed
        return { success: true };
      }),
    seedDefaults: adminSessionProcedure.mutation(async () => {
      await seedSiteContentIfEmpty();
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
