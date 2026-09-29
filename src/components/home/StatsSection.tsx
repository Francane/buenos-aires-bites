import { useVenues } from '@/hooks/useVenues';
import { useLocale } from '@/i18n/LocaleProvider';

export default function StatsSection() {
  const { locale } = useLocale();
  const { data: venues = [], isLoading } = useVenues();
  const neighborhoods = new Set(venues.map(v => v.neighborhood)).size;
  return (
    <section className="py-7 border-y border-border" aria-label={locale === 'es' ? 'La guía en números' : 'The guide in numbers'}>
      <div className="container mx-auto px-4 max-w-6xl flex items-center gap-8 sm:gap-14 text-sm text-muted-foreground">
        <p><strong className="font-display text-2xl text-foreground mr-2">{isLoading ? '—' : venues.length}</strong>{locale === 'es' ? 'lugares' : 'venues'}</p>
        <p><strong className="font-display text-2xl text-foreground mr-2">{isLoading ? '—' : neighborhoods}</strong>{locale === 'es' ? 'barrios' : 'neighborhoods'}</p>
      </div>
    </section>
  );
}