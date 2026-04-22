import { getDb } from './db';
import { siteContent } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Clear existing content
    await db.delete(siteContent);

    // Seed Hero Section
    const heroItems = [
      {
        contentKey: 'hero.title',
        valueEn: 'We plant the future, design beauty',
        valueAr: 'نزرع المستقبل نصمم الجمال',
        category: 'hero',
        label: 'Hero Title',
        fieldType: 'text',
        sortOrder: 1,
      },
      {
        contentKey: 'hero.description',
        valueEn: 'Pioneers in creating sustainable greenhouses, landscaping, and advanced agricultural solutions in Saudi Arabia',
        valueAr: 'رواد في إنشاء البيوت المحمية المستدامة، وتنسيق الحدائق، والحلول الزراعية المتقدمة في المملكة العربية السعودية',
        category: 'hero',
        label: 'Hero Description',
        fieldType: 'textarea',
        sortOrder: 2,
      },
      {
        contentKey: 'hero.image',
        valueEn: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=1200&h=600&fit=crop',
        valueAr: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=1200&h=600&fit=crop',
        category: 'hero',
        label: 'Hero Image URL',
        fieldType: 'url',
        sortOrder: 3,
      },
    ];

    for (const item of heroItems) {
      await db.insert(siteContent).values(item);
    }

    // Seed Services
    const services = [
      {
        contentKey: 'service.1.title',
        valueEn: 'Greenhouse Construction',
        valueAr: 'إنشاء البيوت المحمية',
        category: 'services',
        label: 'Service 1: Title',
        fieldType: 'text',
        sortOrder: 1,
      },
      {
        contentKey: 'service.1.description',
        valueEn: 'Advanced greenhouse structures designed for optimal climate control and maximum productivity',
        valueAr: 'هياكل بيوت محمية متطورة مصممة للتحكم الأمثل في المناخ وتحقيق أقصى إنتاجية',
        category: 'services',
        label: 'Service 1: Description',
        fieldType: 'textarea',
        sortOrder: 2,
      },
      {
        contentKey: 'service.1.image',
        valueEn: 'https://images.unsplash.com/photo-1530836369250-ef72a3649cda?w=600&h=400&fit=crop',
        valueAr: 'https://images.unsplash.com/photo-1530836369250-ef72a3649cda?w=600&h=400&fit=crop',
        category: 'services',
        label: 'Service 1: Image URL',
        fieldType: 'url',
        sortOrder: 3,
      },
      {
        contentKey: 'service.2.title',
        valueEn: 'Landscaping & Design',
        valueAr: 'تنسيق الحدائق والتصميم',
        category: 'services',
        label: 'Service 2: Title',
        fieldType: 'text',
        sortOrder: 4,
      },
      {
        contentKey: 'service.2.description',
        valueEn: 'Transform outdoor spaces into sustainable green environments that thrive in local climate',
        valueAr: 'تحويل المساحات الخارجية إلى بيئات خضراء مستدامة تزدهر في المناخ المحلي',
        category: 'services',
        label: 'Service 2: Description',
        fieldType: 'textarea',
        sortOrder: 5,
      },
      {
        contentKey: 'service.2.image',
        valueEn: 'https://images.unsplash.com/photo-1585320806997-c33953f03a98?w=600&h=400&fit=crop',
        valueAr: 'https://images.unsplash.com/photo-1585320806997-c33953f03a98?w=600&h=400&fit=crop',
        category: 'services',
        label: 'Service 2: Image URL',
        fieldType: 'url',
        sortOrder: 6,
      },
      {
        contentKey: 'service.3.title',
        valueEn: 'Hydroponic Systems',
        valueAr: 'الأنظمة المائية',
        category: 'services',
        label: 'Service 3: Title',
        fieldType: 'text',
        sortOrder: 7,
      },
      {
        contentKey: 'service.3.description',
        valueEn: 'Advanced water-saving hydroponic farming systems for high-efficiency crop production without soil',
        valueAr: 'أنظمة زراعة مائية متقدمة وموفرة للمياه لإنتاج محاصيل بكفاءة عالية بدون تربة',
        category: 'services',
        label: 'Service 3: Description',
        fieldType: 'textarea',
        sortOrder: 8,
      },
      {
        contentKey: 'service.3.image',
        valueEn: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
        valueAr: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
        category: 'services',
        label: 'Service 3: Image URL',
        fieldType: 'url',
        sortOrder: 9,
      },
      {
        contentKey: 'service.4.title',
        valueEn: 'Agricultural Equipment',
        valueAr: 'المعدات الزراعية',
        category: 'services',
        label: 'Service 4: Title',
        fieldType: 'text',
        sortOrder: 10,
      },
      {
        contentKey: 'service.4.description',
        valueEn: 'Supply of latest agricultural machinery and equipment to support modern farming operations',
        valueAr: 'توفير أحدث الآلات والمعدات الزراعية لدعم العمليات الزراعية الحديثة',
        category: 'services',
        label: 'Service 4: Description',
        fieldType: 'textarea',
        sortOrder: 11,
      },
      {
        contentKey: 'service.4.image',
        valueEn: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
        valueAr: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
        category: 'services',
        label: 'Service 4: Image URL',
        fieldType: 'url',
        sortOrder: 12,
      },
    ];

    for (const service of services) {
      await db.insert(siteContent).values(service);
    }

    // Seed Contact Section
    const contactItems = [
      {
        contentKey: 'contact.phone',
        valueEn: '+966501234567',
        valueAr: '+966501234567',
        category: 'contact',
        label: 'Phone Number',
        fieldType: 'phone',
        sortOrder: 1,
      },
      {
        contentKey: 'contact.whatsapp',
        valueEn: '+966501234567',
        valueAr: '+966501234567',
        category: 'contact',
        label: 'WhatsApp Number',
        fieldType: 'phone',
        sortOrder: 2,
      },
      {
        contentKey: 'contact.email',
        valueEn: 'admin@ibtikar-agri.sa',
        valueAr: 'admin@ibtikar-agri.sa',
        category: 'contact',
        label: 'Email',
        fieldType: 'email',
        sortOrder: 3,
      },
      {
        contentKey: 'contact.address',
        valueEn: 'Riyadh, Saudi Arabia',
        valueAr: 'الرياض، المملكة العربية السعودية',
        category: 'contact',
        label: 'Address',
        fieldType: 'text',
        sortOrder: 4,
      },
    ];

    for (const item of contactItems) {
      await db.insert(siteContent).values(item);
    }

    // Seed Social Media Links
    const socialItems = [
      {
        contentKey: 'social.youtube',
        valueEn: 'https://youtube.com',
        valueAr: 'https://youtube.com',
        category: 'social',
        label: 'YouTube Channel',
        fieldType: 'url',
        sortOrder: 1,
      },
      {
        contentKey: 'social.facebook',
        valueEn: 'https://facebook.com',
        valueAr: 'https://facebook.com',
        category: 'social',
        label: 'Facebook Page',
        fieldType: 'url',
        sortOrder: 2,
      },
      {
        contentKey: 'social.instagram',
        valueEn: 'https://instagram.com',
        valueAr: 'https://instagram.com',
        category: 'social',
        label: 'Instagram Profile',
        fieldType: 'url',
        sortOrder: 3,
      },
      {
        contentKey: 'social.twitter',
        valueEn: 'https://twitter.com',
        valueAr: 'https://twitter.com',
        category: 'social',
        label: 'Twitter/X Account',
        fieldType: 'url',
        sortOrder: 4,
      },
      {
        contentKey: 'social.linkedin',
        valueEn: 'https://linkedin.com',
        valueAr: 'https://linkedin.com',
        category: 'social',
        label: 'LinkedIn Profile',
        fieldType: 'url',
        sortOrder: 5,
      },
    ];

    for (const item of socialItems) {
      await db.insert(siteContent).values(item);
    }

    console.log('✅ Database seeded successfully with all content!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
