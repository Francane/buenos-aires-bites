import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, Star, MapPin } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { Venue } from '@/types/venue';

interface TrendingSectionProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
}

export default function TrendingSection({ venues, onSelectVenue }: TrendingSectionProps) {
  const { locale } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const trending = [...venues].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
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
              <div className="p-1.5 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
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
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trending.map((venue, i) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectVenue(venue)}
              className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl glass-strong hover-lift">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-xs font-bold text-primary-foreground">
                    <Star className="h-3 w-3 fill-gold text-gold" />
                    {venue.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display font-bold text-lg text-primary-foreground leading-tight drop-shadow-lg">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-primary-foreground/80 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {venue.neighborhood}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{venue.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {venue.cuisine}
                    </span>
                    <span className={`text-xs font-medium ${venue.isOpen ? 'text-sage' : 'text-destructive'}`}>
                      {venue.isOpen ? '● Open' : '● Closed'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
