import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'sonner';
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

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleToggleFavorite = (id: string) => {
    const added = toggleFavorite(id);
    toast.success(added ? t.toast.favAdded : t.toast.favRemoved);
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="p-1.5 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 ring-1 ring-primary/10"
              >
                <TrendingUp className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {locale === 'es' ? 'Trending' : 'Trending'}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {locale === 'es' ? 'Los más destacados' : 'Top rated'}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl glass hover:bg-primary/10 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl glass hover:bg-primary/10 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trending.map(venue => (
            <div
              key={venue.id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start flex"
            >
              <VenueCard
                venue={venue}
                isFavorite={isFavorite(venue.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelect={onSelectVenue}
                layout="grid"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
