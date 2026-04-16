import { Heart, Star, MapPin, Clock, DollarSign, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';

interface VenueCardProps {
  venue: Venue;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (venue: Venue) => void;
  layout?: 'grid' | 'list';
}

function PriceIndicator({ level }: { level: number }) {
  return (
    <span className="flex items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <DollarSign key={i} className={`h-3 w-3 ${i < level ? 'text-primary' : 'text-muted-foreground/20'}`} />
      ))}
    </span>
  );
}

export default function VenueCard({ venue, isFavorite, onToggleFavorite, onSelect, layout = 'grid' }: VenueCardProps) {
  const { t } = useLocale();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/venue/${venue.id}`);
  };

  if (layout === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex gap-4 p-4 glass-strong rounded-xl cursor-pointer hover-lift"
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label={venue.name}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
      >
        <div className="relative">
          <img src={venue.imageUrl} alt={venue.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" loading="lazy" />
          {venue.featured && (
            <span className="absolute -top-1.5 -left-1.5 p-1 rounded-full bg-gold text-gold-foreground">
              <Award className="h-3 w-3" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-foreground truncate">{venue.name}</h3>
            <button
              onClick={e => { e.stopPropagation(); onToggleFavorite(venue.id); }}
              className="flex-shrink-0 p-1"
              aria-label={t.detail.favorite}
            >
              <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-primary text-primary scale-110' : 'text-muted-foreground'}`} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{venue.cuisine} · {venue.neighborhood}</p>
          <div className="flex items-center gap-2 mt-1">
            <Star className="h-3 w-3 text-gold fill-gold" />
            <span className="text-xs font-medium text-foreground">{venue.rating}</span>
            <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
            {venue.priceRange && <PriceIndicator level={venue.priceRange} />}
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group glass-strong rounded-2xl overflow-hidden cursor-pointer"
      style={{ boxShadow: '0 4px 24px -4px hsl(var(--primary) / 0.08)' }}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={venue.name}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(venue.id); }}
          className="absolute top-3 right-3 p-2.5 rounded-full glass hover:scale-110 transition-all"
          aria-label={t.detail.favorite}
        >
          <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-primary text-primary' : 'text-foreground'}`} />
        </button>
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold glass ${venue.isOpen ? 'text-sage' : 'text-destructive'}`}>
            {venue.isOpen ? t.venues.open : t.venues.closed}
          </span>
          {venue.featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gold/90 text-gold-foreground">
              <Award className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-foreground text-lg leading-tight">{venue.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0 px-2 py-0.5 rounded-full bg-gold/10">
            <Star className="h-3.5 w-3.5 text-gold fill-gold" />
            <span className="text-sm font-bold text-foreground">{venue.rating}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {venue.neighborhood} · {venue.cuisine}
        </p>
        <p className="text-sm text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">{venue.description}</p>
        <div className="flex items-center justify-between mt-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="truncate">{venue.hours}</span>
          </div>
          {venue.priceRange && <PriceIndicator level={venue.priceRange} />}
        </div>
        {venue.tags && venue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {venue.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
