import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function SocialLinks() {
  const { t } = useLanguage();
  const { data: socialContent, isLoading } = trpc.content.getByCategory.useQuery({ category: 'social' });

  if (isLoading) {
    return null;
  }

  // Map content keys to icons and labels
  const socialPlatforms = [
    { key: 'social.facebook', icon: Facebook, label: 'Facebook' },
    { key: 'social.instagram', icon: Instagram, label: 'Instagram' },
    { key: 'social.twitter', icon: Twitter, label: 'Twitter' },
    { key: 'social.linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'social.youtube', icon: Youtube, label: 'YouTube' },
  ];

  // Build a map of content keys to URLs
  const socialLinks = new Map<string, string>();
  if (socialContent) {
    socialContent.forEach((item) => {
      socialLinks.set(item.contentKey, item.valueEn);
    });
  }

  // Filter platforms that have valid URLs (not placeholder URLs)
  const activePlatforms = socialPlatforms.filter((platform) => {
    const url = socialLinks.get(platform.key);
    return url && url !== 'https://facebook.com' && url !== 'https://instagram.com' && 
           url !== 'https://twitter.com' && url !== 'https://linkedin.com' && 
           url !== 'https://youtube.com';
  });

  // If no active platforms, don't render anything
  if (activePlatforms.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-6">
      {activePlatforms.map((platform) => {
        const Icon = platform.icon;
        const url = socialLinks.get(platform.key);
        
        return (
          <a
            key={platform.key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.label}
            className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
            title={platform.label}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
