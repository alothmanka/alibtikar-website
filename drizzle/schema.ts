import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Site content table for storing all editable website content.
 * Each row is a key-value pair with English and Arabic values.
 * Category groups related content together for the admin UI.
 */
export const siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique content key matching the translation keys (e.g., 'contact.phone', 'hero.title') */
  contentKey: varchar("contentKey", { length: 128 }).notNull().unique(),
  /** English value */
  valueEn: text("valueEn").notNull(),
  /** Arabic value */
  valueAr: text("valueAr").notNull(),
  /** Category for grouping in admin UI: hero, services, contact, footer, general */
  category: varchar("category", { length: 64 }).notNull(),
  /** Display label for the admin UI */
  label: varchar("label", { length: 256 }).notNull(),
  /** Field type hint for the admin UI: text, textarea, phone, email, url */
  fieldType: varchar("fieldType", { length: 32 }).default("text").notNull(),
  /** Sort order within category */
  sortOrder: int("sortOrder").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;
