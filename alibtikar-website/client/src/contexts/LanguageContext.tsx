import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isContentLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const FALLBACK_EN: Record<string, string> = {
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.services": "Services",
  "nav.projects": "Projects",
  "nav.contact": "Find a Quotation",
  "hero.title": "Cultivating the Future of Agriculture",
  "hero.subtitle":
    "Leading the way in sustainable greenhouse construction, landscaping, and advanced agricultural solutions in Saudi Arabia.",
  "hero.cta": "Explore Our Services",
  "services.title": "Our Expertise",
  "services.greenhouses": "Greenhouse Construction",
  "services.greenhouses_desc":
    "State-of-the-art greenhouse structures designed for optimal climate control and maximum yield.",
  "services.landscaping": "Landscaping & Design",
  "services.landscaping_desc":
    "Transforming outdoor spaces into lush, sustainable environments that thrive in the local climate.",
  "services.hydroponics": "Hydroponic Systems",
  "services.hydroponics_desc":
    "Advanced water-saving hydroponic systems for efficient, soil-less crop production.",
  "services.equipment": "Agricultural Equipment",
  "services.equipment_desc":
    "Supplying top-tier agricultural machinery and tools to support modern farming operations.",
  "footer.rights":
    "\u00A9 2026 Alibtikar Agriculture Co. All rights reserved.",
  "contact.title": "Find a Quotation",
  "contact.address": "Riyadh, Saudi Arabia",
  "contact.phone": "",
  "contact.email": "admin@ibtikar-agri.sa",
  "contact.subtitle":
    "Ready to transform your agricultural projects? Reach out to our expert team for a consultation.",
  "contact.call": "Call Us",
  "contact.email_label": "Email Us",
  "contact.visit": "Visit Us",
  "form.name": "Name",
  "form.phone": "Phone",
  "form.email": "Email",
  "form.message": "Message",
  "form.send": "Send Message",
  "form.name_ph": "Your Name",
  "form.phone_ph": "Your Phone",
  "form.email_ph": "your@email.com",
  "form.message_ph": "How can we help you?",
};

const FALLBACK_AR: Record<string, string> = {
  "nav.home": "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
  "nav.about": "\u0645\u0646 \u0646\u062D\u0646",
  "nav.services": "\u062E\u062F\u0645\u0627\u062A\u0646\u0627",
  "nav.projects": "\u0645\u0634\u0627\u0631\u064A\u0639\u0646\u0627",
  "nav.contact":
    "\u0637\u0644\u0628 \u0639\u0631\u0636 \u0633\u0639\u0631",
  "hero.title":
    "\u0646\u0632\u0631\u0639 \u0627\u0644\u0645\u0633\u062A\u0642\u0628\u0644\n\u0646\u0635\u0645\u0645 \u0627\u0644\u062C\u0645\u0627\u0644",
  "hero.subtitle":
    "\u0631\u0648\u0627\u062F \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0628\u064A\u0648\u062A \u0627\u0644\u0645\u062D\u0645\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u062F\u0627\u0645\u0629\u060C \u0648\u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u062D\u062F\u0627\u0626\u0642\u060C \u0648\u0627\u0644\u062D\u0644\u0648\u0644 \u0627\u0644\u0632\u0631\u0627\u0639\u064A\u0629 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629 \u0641\u064A \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629.",
  "hero.cta":
    "\u0627\u0643\u062A\u0634\u0641 \u062E\u062F\u0645\u0627\u062A\u0646\u0627",
  "services.title": "\u062E\u0628\u0631\u0627\u062A\u0646\u0627",
  "services.greenhouses":
    "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0628\u064A\u0648\u062A \u0627\u0644\u0645\u062D\u0645\u064A\u0629",
  "services.greenhouses_desc":
    "\u0647\u064A\u0627\u0643\u0644 \u0628\u064A\u0648\u062A \u0645\u062D\u0645\u064A\u0629 \u0645\u062A\u0637\u0648\u0631\u0629 \u0645\u0635\u0645\u0645\u0629 \u0644\u0644\u062A\u062D\u0643\u0645 \u0627\u0644\u0623\u0645\u062B\u0644 \u0641\u064A \u0627\u0644\u0645\u0646\u0627\u062E \u0648\u062A\u062D\u0642\u064A\u0642 \u0623\u0642\u0635\u0649 \u0625\u0646\u062A\u0627\u062C\u064A\u0629.",
  "services.landscaping":
    "\u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u062D\u062F\u0627\u0626\u0642 \u0648\u0627\u0644\u062A\u0635\u0645\u064A\u0645",
  "services.landscaping_desc":
    "\u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0645\u0633\u0627\u062D\u0627\u062A \u0627\u0644\u062E\u0627\u0631\u062C\u064A\u0629 \u0625\u0644\u0649 \u0628\u064A\u0626\u0627\u062A \u062E\u0636\u0631\u0627\u0621 \u0645\u0633\u062A\u062F\u0627\u0645\u0629 \u062A\u0632\u062F\u0647\u0631 \u0641\u064A \u0627\u0644\u0645\u0646\u0627\u062E \u0627\u0644\u0645\u062D\u0644\u064A.",
  "services.hydroponics":
    "\u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u0627\u0626\u064A\u0629",
  "services.hydroponics_desc":
    "\u0623\u0646\u0638\u0645\u0629 \u0632\u0631\u0627\u0639\u0629 \u0645\u0627\u0626\u064A\u0629 \u0645\u062A\u0642\u062F\u0645\u0629 \u0648\u0645\u0648\u0641\u0631\u0629 \u0644\u0644\u0645\u064A\u0627\u0647 \u0644\u0625\u0646\u062A\u0627\u062C \u0645\u062D\u0627\u0635\u064A\u0644 \u0628\u0643\u0641\u0627\u0621\u0629 \u0639\u0627\u0644\u064A\u0629 \u0628\u062F\u0648\u0646 \u062A\u0631\u0628\u0629.",
  "services.equipment":
    "\u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0627\u0644\u0632\u0631\u0627\u0639\u064A\u0629",
  "services.equipment_desc":
    "\u062A\u0648\u0641\u064A\u0631 \u0623\u062D\u062F\u062B \u0627\u0644\u0622\u0644\u0627\u062A \u0648\u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0627\u0644\u0632\u0631\u0627\u0639\u064A\u0629 \u0644\u062F\u0639\u0645 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0632\u0631\u0627\u0639\u064A\u0629 \u0627\u0644\u062D\u062F\u064A\u062B\u0629.",
  "footer.rights":
    "\u00A9 2026 \u0634\u0631\u0643\u0629 \u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 \u0627\u0644\u0632\u0631\u0627\u0639\u064A\u0629. \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629.",
  "contact.title":
    "\u0637\u0644\u0628 \u0639\u0631\u0636 \u0633\u0639\u0631",
  "contact.address":
    "\u0627\u0644\u0631\u064A\u0627\u0636\u060C \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
  "contact.phone": "",
  "contact.email": "admin@ibtikar-agri.sa",
  "contact.subtitle":
    "\u0647\u0644 \u0623\u0646\u062A \u0645\u0633\u062A\u0639\u062F \u0644\u062A\u062D\u0648\u064A\u0644 \u0645\u0634\u0627\u0631\u064A\u0639\u0643 \u0627\u0644\u0632\u0631\u0627\u0639\u064A\u0629\u061F \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0641\u0631\u064A\u0642 \u062E\u0628\u0631\u0627\u0626\u0646\u0627 \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u0627\u0633\u062A\u0634\u0627\u0631\u0629.",
  "contact.call":
    "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627",
  "contact.email_label": "\u0631\u0627\u0633\u0644\u0646\u0627",
  "contact.visit": "\u0632\u0631\u0646\u0627",
  "form.name": "\u0627\u0644\u0627\u0633\u0645",
  "form.phone":
    "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641",
  "form.email":
    "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
  "form.message": "\u0627\u0644\u0631\u0633\u0627\u0644\u0629",
  "form.send":
    "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629",
  "form.name_ph": "\u0627\u0633\u0645\u0643",
  "form.phone_ph":
    "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641\u0643",
  "form.email_ph":
    "\u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
  "form.message_ph":
    "\u0643\u064A\u0641 \u064A\u0645\u0643\u0646\u0646\u0627 \u0645\u0633\u0627\u0639\u062F\u062A\u0643\u061F",
};

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("ar");

  const { data: dbContent } = trpc.content.getAll.useQuery(undefined, {
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  const dynamicTranslations = useMemo(() => {
    if (!dbContent || dbContent.length === 0) return null;
    const en: Record<string, string> = {};
    const ar: Record<string, string> = {};
    dbContent.forEach(
      (item: { contentKey: string; valueEn: string; valueAr: string }) => {
        en[item.contentKey] = item.valueEn;
        ar[item.contentKey] = item.valueAr;
      },
    );
    return { en, ar };
  }, [dbContent]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (dynamicTranslations) {
      const map =
        language === "en"
          ? dynamicTranslations.en
          : dynamicTranslations.ar;
      if (map[key] !== undefined) return map[key];
    }
    const fallback = language === "en" ? FALLBACK_EN : FALLBACK_AR;
    return fallback[key] ?? key;
  };

  const isContentLoaded = !!dynamicTranslations;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir: language === "ar" ? "rtl" : "ltr",
        isContentLoaded,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider",
    );
  }
  return context;
}
