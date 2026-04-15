import Hero from "@/components/Hero";
import { useLanguage } from "@/contexts/LanguageContext";
import ContactSection from "@/components/ContactSection";
import FadeIn from "@/components/FadeIn";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  const { t } = useLanguage();

  const services = [
    {
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663134351876/nmSLHDAP2m6sCVEbGXG6ig/download_a78daabe.png",
      title: t("services.greenhouses"),
      description: t("services.greenhouses_desc"),
    },
    {
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663134351876/nmSLHDAP2m6sCVEbGXG6ig/download(3)_c38c3aa4.png",
      title: t("services.landscaping"),
      description: t("services.landscaping_desc"),
    },
    {
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663134351876/nmSLHDAP2m6sCVEbGXG6ig/download(1)_84f83ed8.png",
      title: t("services.hydroponics"),
      description: t("services.hydroponics_desc"),
    },
    {
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663134351876/nmSLHDAP2m6sCVEbGXG6ig/download(2)_f5326fe3.png",
      title: t("services.equipment"),
      description: t("services.equipment_desc"),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />

      {/* Services Section */}
      <section id="services-section" className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {t("services.title")}
            </h2>
            <div className="h-1 w-20 bg-chart-1 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <FadeIn key={index} delay={index * 100}>
                <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:-translate-y-1 h-full overflow-hidden flex flex-col">
                  <div className="relative h-48 w-full overflow-hidden bg-secondary">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-primary mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div id="contact-section">
        <FadeIn>
          <ContactSection />
        </FadeIn>
      </div>

      {/* Footer */}
      <footer className="bg-secondary text-primary py-16 mt-auto border-t border-border/50">
        <div className="container flex flex-col items-center gap-8">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663134351876/TLSMiCtqyvuYWIyi.png"
            alt="Alibtikar Icon"
            className="h-40 md:h-48 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
          <div className="h-px w-full max-w-xs bg-primary/20" />
          <p className="opacity-80 text-sm md:text-base font-light tracking-wide">
            {t("footer.rights")}
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
