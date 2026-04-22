import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { language, setLanguage, t, dir } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = [
    { key: 'nav.home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { key: 'nav.about', action: () => scrollToSection('contact-section') },
    { key: 'nav.services', action: () => scrollToSection('services-section') },
    { key: 'nav.projects', action: () => scrollToSection('services-section') },
    { key: 'nav.contact', action: () => scrollToSection('contact-section') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-28 md:h-32 items-center justify-between">
        {/* Logo Area */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
           <img 
             src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663134351876/TLSMiCtqyvuYWIyi.png" 
             alt="Alibtikar Logo" 
             className="h-32 md:h-40 w-auto object-contain transition-transform hover:scale-105"
           />
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={item.action}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
            >
              {t(item.key)}
            </button>
          ))}
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle Language</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={item.action}
                className="block text-base font-medium hover:text-primary cursor-pointer py-2 text-left"
              >
                {t(item.key)}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
