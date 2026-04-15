import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';
import VenueCard from '@/components/venues/VenueCard';
import EmptyState from '@/components/ui/EmptyState';

interface FavoritesSectionProps {
  venues: Venue[];
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectVenue: (venue: Venue) => void;
}

export default function FavoritesSection({ venues, favoriteIds, isFavorite, onToggleFavorite, onSelectVenue }: FavoritesSectionProps) {
  const { t } = useLocale();
  const favVenues = venues.filter(v => favoriteIds.includes(v.id));

  return (
    <section id="favoritos" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{t.favorites.title}</h2>
            {favVenues.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full"
              >
                {favVenues.length} {t.favorites.count}
              </motion.span>
            )}
          </div>
          <p className="text-muted-foreground mb-8">{t.favorites.subtitle}</p>
        </motion.div>

        {favVenues.length === 0 ? (
          <EmptyState
            title={t.favorites.empty}
            description={t.favorites.emptyDesc}
            icon={<Heart className="h-8 w-8 text-muted-foreground" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favVenues.map(v => (
              <VenueCard
                key={v.id}
                venue={v}
                isFavorite={isFavorite(v.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectVenue}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
