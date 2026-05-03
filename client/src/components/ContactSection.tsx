import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  const { t, dir } = useLanguage();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/20 -skew-x-12 translate-x-20" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {t('contact.title')}
              </h2>
              <div className="h-1 w-20 bg-chart-1 rounded-full" />
            </div>
            
            <p className="text-lg text-muted-foreground">
              {t('contact.subtitle')}
            </p>

            <div className="space-y-6">
  <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
    <div className="bg-white p-3 rounded-full shadow-sm text-chart-1">
      <Phone className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{t('contact.call')}</p>
      <div className="flex gap-6 flex-wrap">
        <a href={`tel:${t('contact.phone')}`} className="text-lg font-bold text-primary hover:text-primary/80 transition-colors">
          {t('contact.phone')}
        </a>
        <a href={`tel:${t('contact.phone2')}`} className="text-lg font-bold text-primary hover:text-primary/80 transition-colors">
          {t('contact.phone2')}
        </a>
      </div>
    </div>
  </div>

              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                <div className="bg-white p-3 rounded-full shadow-sm text-chart-1">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{t('contact.email_label')}</p>
                  <p className="text-lg font-bold text-primary">{t('contact.email')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                <div className="bg-white p-3 rounded-full shadow-sm text-chart-1">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{t('contact.visit')}</p>
                  <p className="text-lg font-bold text-primary">{t('contact.address')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-border/50">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">{t('form.name')}</label>
                  <Input placeholder={t('form.name_ph')} className="bg-secondary/20 border-border/50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">{t('form.phone')}</label>
                  <Input placeholder={t('form.phone_ph')} className="bg-secondary/20 border-border/50 focus:bg-white transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">{t('form.email')}</label>
                <Input type="email" placeholder={t('form.email_ph')} className="bg-secondary/20 border-border/50 focus:bg-white transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">{t('form.message')}</label>
                <Textarea placeholder={t('form.message_ph')} className="min-h-[150px] bg-secondary/20 border-border/50 focus:bg-white transition-colors resize-none" />
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                {t('form.send')}
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
