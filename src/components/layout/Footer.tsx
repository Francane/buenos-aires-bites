import { MapPin } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <MapPin className="h-5 w-5 text-primary" /> WeEat
          </div>
          <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/ayuda" className="hover:text-foreground transition-colors">{t.help.title}</Link>
            <Link to="/contacto" className="hover:text-foreground transition-colors">{t.contact.title}</Link>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© {new Date().getFullYear()} WeEat. {t.footer.rights}</p>
      </div>
    </footer>
  );
}
