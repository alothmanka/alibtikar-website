import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; setCookies: Map<string, string> } {
  const setCookies = new Map<string, string>();

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options?: any) => {
        setCookies.set(name, value);
      },
      clearCookie: (name: string, options?: any) => {
        setCookies.delete(name);
      },
    } as TrpcContext["res"],
  };

  return { ctx, setCookies };
}

describe("adminAuth.login", () => {
  it("should successfully login with correct credentials", async () => {
    const { ctx, setCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.login({
      username: "Admin",
      password: "@7654321",
    });

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(setCookies.has("admin_session_token")).toBe(true);
  });

  it("should fail with incorrect username", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.adminAuth.login({
        username: "WrongUser",
        password: "@7654321",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain("Invalid username or password");
    }
  });

  it("should fail with incorrect password", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.adminAuth.login({
        username: "Admin",
        password: "wrongpassword",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain("Invalid username or password");
    }
  });
});

describe("adminAuth.logout", () => {
  it("should clear the admin session cookie", async () => {
    const { ctx, setCookies } = createAuthContext();
    
    // First set a cookie
    setCookies.set("admin_session_token", "test-token");
    
    const caller = appRouter.createCaller(ctx);
    const result = await caller.adminAuth.logout();

    expect(result.success).toBe(true);
    expect(setCookies.has("admin_session_token")).toBe(false);
  });
});

describe("adminAuth.checkSession", () => {
  it("should return true when admin session cookie exists", async () => {
    const { ctx } = createAuthContext();
    ctx.req.cookies = { admin_session_token: "test-token" };
    
    const caller = appRouter.createCaller(ctx);
    const result = await caller.adminAuth.checkSession();

    expect(result.isAuthenticated).toBe(true);
  });

  it("should return false when admin session cookie does not exist", async () => {
    const { ctx } = createAuthContext();
    ctx.req.cookies = {};
    
    const caller = appRouter.createCaller(ctx);
    const result = await caller.adminAuth.checkSession();

    expect(result.isAuthenticated).toBe(false);
  });
});
