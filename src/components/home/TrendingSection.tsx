import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import VenueCard from '@/components/venues/VenueCard';
import type { Venue } from '@/types/venue';

interface TrendingSectionProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
}

export default function TrendingSection({ venues, onSelectVenue }: TrendingSectionProps) {
  const { locale, t } = useLocale();
  const { isFavorite, toggleFavorite } = useFavorites();
  const scrollRef = useRef<HTMLDivElement>(null);
  const trending = [...venues].sort((a, b) => b.rating - a.rating).slice(0, 8);
  if (!trending.length) return null;
  const handleToggleFavorite = (id: string) => {
    const added = toggleFavorite(id);
    toast.success(added ? t.toast.favAdded : t.toast.favRemoved);
  };
  return (
    <section className="py-12 md:py-20 border-b border-border overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div><p className="text-xs font-bold uppercase text-wine mb-2">{locale === 'es' ? 'Selección Bites / 01' : 'Bites selection / 01'}</p><h2 className="font-display text-4xl md:text-5xl text-foreground">{locale === 'es' ? 'Mesa elegida' : 'The chosen table'}</h2></div>
          <div className="hidden sm:flex gap-1">
            <Button variant="outline" size="icon" onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })} aria-label="Anterior"><ChevronLeft /></Button>
            <Button variant="outline" size="icon" onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })} aria-label="Siguiente"><ChevronRight /></Button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-3 -mx-4 px-4">
          {trending.map((venue, index) => <div key={venue.id} className={index === 0 ? 'flex-none w-[min(82vw,430px)] snap-start' : 'flex-none w-[min(76vw,310px)] snap-start'}><VenueCard venue={venue} isFavorite={isFavorite(venue.id)} onToggleFavorite={handleToggleFavorite} onSelect={onSelectVenue} /></div>)}
        </div>
      </div>
    </section>
  );
}
