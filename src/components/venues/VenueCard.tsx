import { Heart, Star, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';

interface VenueCardProps {
  venue: Venue;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (venue: Venue) => void;
  layout?: 'grid' | 'list';
}

export default function VenueCard({ venue, isFavorite, onToggleFavorite, onSelect, layout = 'grid' }: VenueCardProps) {
  const { t } = useLocale();

  if (layout === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 p-4 bg-card border border-border rounded-xl cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onSelect(venue)}
        tabIndex={0}
        role="button"
        aria-label={venue.name}
        onKeyDown={e => e.key === 'Enter' && onSelect(venue)}
      >
        <img src={venue.imageUrl} alt={venue.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-foreground truncate">{venue.name}</h3>
            <button
              onClick={e => { e.stopPropagation(); onToggleFavorite(venue.id); }}
              className="flex-shrink-0 p-1"
              aria-label={t.detail.favorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{venue.cuisine} · {venue.neighborhood}</p>
          <div className="flex items-center gap-2 mt-1">
            <Star className="h-3 w-3 text-gold fill-gold" />
            <span className="text-xs font-medium text-foreground">{venue.rating}</span>
            <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
            <span className={`text-xs font-medium ml-auto ${venue.isOpen ? 'text-sage' : 'text-destructive'}`}>
              {venue.isOpen ? t.venues.open : t.venues.closed}
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      onClick={() => onSelect(venue)}
      tabIndex={0}
      role="button"
      aria-label={venue.name}
      onKeyDown={e => e.key === 'Enter' && onSelect(venue)}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(venue.id); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label={t.detail.favorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : 'text-foreground'}`} />
        </button>
        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium ${venue.isOpen ? 'bg-sage/20 text-sage' : 'bg-destructive/20 text-destructive'}`}>
          {venue.isOpen ? t.venues.open : t.venues.closed}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-foreground text-lg leading-tight">{venue.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-4 w-4 text-gold fill-gold" />
            <span className="text-sm font-bold text-foreground">{venue.rating}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {venue.neighborhood} · {venue.cuisine}
        </p>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{venue.description}</p>
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="truncate">{venue.hours}</span>
        </div>
      </div>
    </motion.article>
  );
}
