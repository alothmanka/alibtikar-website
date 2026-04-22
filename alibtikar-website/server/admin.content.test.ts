import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user-123",
    email: "admin@ibtikar-agri.sa",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user-456",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("content.getAll (public)", () => {
  it("returns an array of site content items", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.content.getAll();
    expect(Array.isArray(result)).toBe(true);
    // After seeding, should have content items
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("contentKey");
      expect(result[0]).toHaveProperty("valueEn");
      expect(result[0]).toHaveProperty("valueAr");
      expect(result[0]).toHaveProperty("category");
    }
  });
});

describe("admin.getAllContent", () => {
  it("returns content for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.getAllContent();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.getAllContent()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.getAllContent()).rejects.toThrow();
  });
});

describe("admin.updateContent", () => {
  it("updates content values for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.updateContent({
      contentKey: "contact.phone",
      valueEn: "+966 50 123 4567",
      valueAr: "+966 50 123 4567",
    });

    expect(result).toEqual({ success: true });

    // Verify the update persisted
    const allContent = await caller.admin.getAllContent();
    const phoneItem = allContent.find(
      (item: { contentKey: string }) => item.contentKey === "contact.phone",
    );
    expect(phoneItem?.valueEn).toBe("+966 50 123 4567");
    expect(phoneItem?.valueAr).toBe("+966 50 123 4567");
  });

  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.updateContent({
        contentKey: "contact.phone",
        valueEn: "hacked",
        valueAr: "hacked",
      }),
    ).rejects.toThrow();
  });
});

describe("admin.upsertContent", () => {
  it("creates new content items for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.upsertContent({
      contentKey: "test.new_item",
      valueEn: "Test English",
      valueAr: "Test Arabic",
      category: "test",
      label: "Test Item",
      fieldType: "text",
      sortOrder: 1,
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.upsertContent({
        contentKey: "test.hacked",
        valueEn: "hacked",
        valueAr: "hacked",
        category: "test",
        label: "Hacked",
        fieldType: "text",
        sortOrder: 0,
      }),
    ).rejects.toThrow();
  });
});

describe("admin.deleteContent", () => {
  it("deletes a content item for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create an item to delete
    await caller.admin.upsertContent({
      contentKey: "test.to_delete",
      valueEn: "Delete Me EN",
      valueAr: "Delete Me AR",
      category: "test",
      label: "Item To Delete",
      fieldType: "text",
      sortOrder: 99,
    });

    // Verify it exists
    const before = await caller.admin.getAllContent();
    const existsBefore = before.some(
      (item: { contentKey: string }) => item.contentKey === "test.to_delete",
    );
    expect(existsBefore).toBe(true);

    // Delete it
    const result = await caller.admin.deleteContent({ contentKey: "test.to_delete" });
    expect(result).toEqual({ success: true });

    // Verify it's gone
    const after = await caller.admin.getAllContent();
    const existsAfter = after.some(
      (item: { contentKey: string }) => item.contentKey === "test.to_delete",
    );
    expect(existsAfter).toBe(false);
  });

  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.deleteContent({ contentKey: "contact.phone" }),
    ).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.deleteContent({ contentKey: "contact.phone" }),
    ).rejects.toThrow();
  });
});
