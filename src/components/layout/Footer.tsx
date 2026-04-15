import { MapPin, Heart } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="relative border-t border-border mt-20 overflow-hidden">
      {/* Gradient accent top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 py-14">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-2 font-display text-2xl font-bold">
            <div className="p-2 rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            WeEat
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed">{t.footer.tagline}</p>
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/ayuda" className="text-muted-foreground hover:text-primary transition-colors">{t.help.title}</Link>
            <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors">{t.contact.title}</Link>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} WeEat. {t.footer.rights}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-primary fill-primary" /> in Buenos Aires
          </p>
        </div>
      </div>
    </footer>
  );
}
