import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const { t, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Get the phone number from dynamic content, fallback to default
  const phoneNumber = t("contact.phone").replace(/[^0-9+]/g, "") || "+966501234567";
  // Remove the + for WhatsApp URL format
  const waNumber = phoneNumber.replace("+", "");

  const message = language === "ar"
    ? "مرحباً، أرغب في الاستفسار عن خدماتكم"
    : "Hello, I would like to inquire about your services";

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  const tooltip = language === "ar" ? "تواصل معنا عبر واتساب" : "Chat with us on WhatsApp";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      <div
        className={`bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow-lg transition-all duration-300 whitespace-nowrap ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        {tooltip}
      </div>

      {/* WhatsApp FAB */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        aria-label={tooltip}
      >
        <MessageCircle className="h-7 w-7 fill-white stroke-[#25D366] group-hover:scale-110 transition-transform" />
      </a>
    </div>
  );
}
