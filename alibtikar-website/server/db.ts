import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, siteContent, InsertSiteContent, SiteContent } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Site Content Helpers ──

/** Get all site content rows */
export async function getAllSiteContent(): Promise<SiteContent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteContent);
}

/** Get site content by category */
export async function getSiteContentByCategory(category: string): Promise<SiteContent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteContent).where(eq(siteContent.category, category));
}

/** Get a single content item by key */
export async function getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(siteContent).where(eq(siteContent.contentKey, key)).limit(1);
  return rows[0];
}

/** Upsert a site content row (insert or update) */
export async function upsertSiteContent(item: InsertSiteContent): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(siteContent).values(item).onDuplicateKeyUpdate({
    set: {
      valueEn: item.valueEn,
      valueAr: item.valueAr,
      label: item.label,
      category: item.category,
      fieldType: item.fieldType,
      sortOrder: item.sortOrder,
    },
  });
}

/** Delete a site content row by key */
export async function deleteSiteContent(contentKey: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(siteContent).where(eq(siteContent.contentKey, contentKey));
}

/** Update only the values (en/ar) for a content key */
export async function updateSiteContentValues(contentKey: string, valueEn: string, valueAr: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(siteContent)
    .set({ valueEn, valueAr })
    .where(eq(siteContent.contentKey, contentKey));
}

/** Seed the database with default content if empty */
export async function seedSiteContentIfEmpty(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await db.select().from(siteContent).limit(1);
  if (existing.length > 0) return; // Already seeded

  const defaults: InsertSiteContent[] = [
    // Hero section
    { contentKey: "hero.title", valueEn: "Cultivating the Future of Agriculture", valueAr: "نزرع المستقبل\nنصمم الجمال", category: "hero", label: "Hero Title", fieldType: "textarea", sortOrder: 1 },
    { contentKey: "hero.subtitle", valueEn: "Leading the way in sustainable greenhouse construction, landscaping, and advanced agricultural solutions in Saudi Arabia.", valueAr: "رواد في إنشاء البيوت المحمية المستدامة، وتنسيق الحدائق، والحلول الزراعية المتقدمة في المملكة العربية السعودية.", category: "hero", label: "Hero Subtitle", fieldType: "textarea", sortOrder: 2 },
    { contentKey: "hero.cta", valueEn: "Explore Our Services", valueAr: "اكتشف خدماتنا", category: "hero", label: "Hero Button Text", fieldType: "text", sortOrder: 3 },

    // Navigation
    { contentKey: "nav.home", valueEn: "Home", valueAr: "الرئيسية", category: "navigation", label: "Nav: Home", fieldType: "text", sortOrder: 1 },
    { contentKey: "nav.about", valueEn: "About Us", valueAr: "من نحن", category: "navigation", label: "Nav: About Us", fieldType: "text", sortOrder: 2 },
    { contentKey: "nav.services", valueEn: "Services", valueAr: "خدماتنا", category: "navigation", label: "Nav: Services", fieldType: "text", sortOrder: 3 },
    { contentKey: "nav.projects", valueEn: "Projects", valueAr: "مشاريعنا", category: "navigation", label: "Nav: Projects", fieldType: "text", sortOrder: 4 },
    { contentKey: "nav.contact", valueEn: "Find a Quotation", valueAr: "طلب عرض سعر", category: "navigation", label: "Nav: Contact", fieldType: "text", sortOrder: 5 },

    // Services
    { contentKey: "services.title", valueEn: "Our Expertise", valueAr: "خبراتنا", category: "services", label: "Services Section Title", fieldType: "text", sortOrder: 1 },
    { contentKey: "services.greenhouses", valueEn: "Greenhouse Construction", valueAr: "إنشاء البيوت المحمية", category: "services", label: "Service: Greenhouses Title", fieldType: "text", sortOrder: 2 },
    { contentKey: "services.greenhouses_desc", valueEn: "State-of-the-art greenhouse structures designed for optimal climate control and maximum yield.", valueAr: "هياكل بيوت محمية متطورة مصممة للتحكم الأمثل في المناخ وتحقيق أقصى إنتاجية.", category: "services", label: "Service: Greenhouses Description", fieldType: "textarea", sortOrder: 3 },
    { contentKey: "services.landscaping", valueEn: "Landscaping & Design", valueAr: "تنسيق الحدائق والتصميم", category: "services", label: "Service: Landscaping Title", fieldType: "text", sortOrder: 4 },
    { contentKey: "services.landscaping_desc", valueEn: "Transforming outdoor spaces into lush, sustainable environments that thrive in the local climate.", valueAr: "تحويل المساحات الخارجية إلى بيئات خضراء مستدامة تزدهر في المناخ المحلي.", category: "services", label: "Service: Landscaping Description", fieldType: "textarea", sortOrder: 5 },
    { contentKey: "services.hydroponics", valueEn: "Hydroponic Systems", valueAr: "الأنظمة المائية", category: "services", label: "Service: Hydroponics Title", fieldType: "text", sortOrder: 6 },
    { contentKey: "services.hydroponics_desc", valueEn: "Advanced water-saving hydroponic systems for efficient, soil-less crop production.", valueAr: "أنظمة زراعة مائية متقدمة وموفرة للمياه لإنتاج محاصيل بكفاءة عالية بدون تربة.", category: "services", label: "Service: Hydroponics Description", fieldType: "textarea", sortOrder: 7 },
    { contentKey: "services.equipment", valueEn: "Agricultural Equipment", valueAr: "المعدات الزراعية", category: "services", label: "Service: Equipment Title", fieldType: "text", sortOrder: 8 },
    { contentKey: "services.equipment_desc", valueEn: "Supplying top-tier agricultural machinery and tools to support modern farming operations.", valueAr: "توفير أحدث الآلات والمعدات الزراعية لدعم العمليات الزراعية الحديثة.", category: "services", label: "Service: Equipment Description", fieldType: "textarea", sortOrder: 9 },

    // Contact
    { contentKey: "contact.title", valueEn: "Find a Quotation", valueAr: "طلب عرض سعر", category: "contact", label: "Contact Section Title", fieldType: "text", sortOrder: 1 },
    { contentKey: "contact.subtitle", valueEn: "Ready to transform your agricultural projects? Reach out to our expert team for a consultation.", valueAr: "هل أنت مستعد لتحويل مشاريعك الزراعية؟ تواصل مع فريق خبرائنا للحصول على استشارة.", category: "contact", label: "Contact Subtitle", fieldType: "textarea", sortOrder: 2 },
    { contentKey: "contact.phone", valueEn: "", valueAr: "", category: "contact", label: "Phone Number", fieldType: "phone", sortOrder: 3 },
    { contentKey: "contact.email", valueEn: "admin@ibtikar-agri.sa", valueAr: "admin@ibtikar-agri.sa", category: "contact", label: "Email Address", fieldType: "email", sortOrder: 4 },
    { contentKey: "contact.address", valueEn: "Riyadh, Saudi Arabia", valueAr: "الرياض، المملكة العربية السعودية", category: "contact", label: "Office Address", fieldType: "text", sortOrder: 5 },
    { contentKey: "contact.call", valueEn: "Call Us", valueAr: "اتصل بنا", category: "contact", label: "Label: Call Us", fieldType: "text", sortOrder: 6 },
    { contentKey: "contact.email_label", valueEn: "Email Us", valueAr: "راسلنا", category: "contact", label: "Label: Email Us", fieldType: "text", sortOrder: 7 },
    { contentKey: "contact.visit", valueEn: "Visit Us", valueAr: "زرنا", category: "contact", label: "Label: Visit Us", fieldType: "text", sortOrder: 8 },

    // Form labels
    { contentKey: "form.name", valueEn: "Name", valueAr: "الاسم", category: "form", label: "Form: Name Label", fieldType: "text", sortOrder: 1 },
    { contentKey: "form.phone", valueEn: "Phone", valueAr: "رقم الهاتف", category: "form", label: "Form: Phone Label", fieldType: "text", sortOrder: 2 },
    { contentKey: "form.email", valueEn: "Email", valueAr: "البريد الإلكتروني", category: "form", label: "Form: Email Label", fieldType: "text", sortOrder: 3 },
    { contentKey: "form.message", valueEn: "Message", valueAr: "الرسالة", category: "form", label: "Form: Message Label", fieldType: "text", sortOrder: 4 },
    { contentKey: "form.send", valueEn: "Send Message", valueAr: "إرسال الرسالة", category: "form", label: "Form: Send Button", fieldType: "text", sortOrder: 5 },
    { contentKey: "form.name_ph", valueEn: "Your Name", valueAr: "اسمك", category: "form", label: "Form: Name Placeholder", fieldType: "text", sortOrder: 6 },
    { contentKey: "form.phone_ph", valueEn: "Your Phone", valueAr: "رقم هاتفك", category: "form", label: "Form: Phone Placeholder", fieldType: "text", sortOrder: 7 },
    { contentKey: "form.email_ph", valueEn: "your@email.com", valueAr: "بريدك الإلكتروني", category: "form", label: "Form: Email Placeholder", fieldType: "text", sortOrder: 8 },
    { contentKey: "form.message_ph", valueEn: "How can we help you?", valueAr: "كيف يمكننا مساعدتك؟", category: "form", label: "Form: Message Placeholder", fieldType: "text", sortOrder: 9 },

    // Footer
    { contentKey: "footer.rights", valueEn: "© 2026 Alibtikar Agriculture Co. All rights reserved.", valueAr: "© 2026 شركة الابتكار الزراعية. جميع الحقوق محفوظة.", category: "footer", label: "Footer Copyright Text", fieldType: "text", sortOrder: 1 },
  ];

  for (const item of defaults) {
    await db.insert(siteContent).values(item).onDuplicateKeyUpdate({
      set: {
        valueEn: item.valueEn,
        valueAr: item.valueAr,
      },
    });
  }
}
