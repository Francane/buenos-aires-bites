import { useLocale } from '@/i18n/LocaleProvider';
import { MapPin } from 'lucide-react';

interface GeoBannerProps {
  onAccept: () => void;
  onDismiss: () => void;
}

export default function GeoBanner({ onAccept, onDismiss }: GeoBannerProps) {
  const { t } = useLocale();
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-card border border-border rounded-xl shadow-2xl p-4 z-40">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{t.geo.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{t.geo.desc}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={onAccept} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg">
              {t.geo.accept}
            </button>
            <button onClick={onDismiss} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              {t.geo.dismiss}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
