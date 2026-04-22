import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function Hero() {
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Using the portrait tomato greenhouse image as a placeholder for high-quality hero, 
            but ideally we'd use a landscape one. We'll use a placeholder color/gradient for now 
            that represents the 'Organic Modernism' style until we upload the actual images. 
            In a real scenario, we'd use: src="/path/to/hero-image.jpg" */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10" />
        <img 
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663134351876/nmSLHDAP2m6sCVEbGXG6ig/hero-edited-no-billboard_b6478ab7.png" 
          alt="Modern Agriculture in Saudi Arabia" 
          className="h-full w-full object-cover animate-in fade-in zoom-in-105 duration-[2000ms]"
        />
      </div>

      {/* Content */}
      <div className="container relative z-20">
        <div className="max-w-2xl text-white space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight whitespace-pre-line animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            {t('hero.subtitle')}
          </p>
          <div className="flex gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            <Button 
              size="lg" 
              className="bg-chart-1 hover:bg-chart-1/90 text-primary font-bold text-lg px-8 h-14 rounded-full transition-transform hover:scale-105"
            >
              {t('hero.cta')}
              <Arrow className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
