import { Heart, Star, MapPin, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';
import { cn } from '@/lib/utils';

interface VenueCardProps {
  venue: Venue;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (venue: Venue) => void;
  layout?: 'grid' | 'list';
}

/* ---------- Sub-components (visual system) ---------- */

function PriceIndicator({ level }: { level: number }) {
  return (
    <span
      className="inline-flex items-center font-semibold text-xs text-muted-foreground tracking-tight"
      aria-label={`Price level ${level} of 4`}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn('leading-none', i < level ? 'text-foreground' : 'text-muted-foreground/30')}
        >
          $
        </span>
      ))}
    </span>
  );
}

function StatusBadge({ isOpen, openLabel, closedLabel }: { isOpen: boolean; openLabel: string; closedLabel: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md',
        isOpen
          ? 'bg-sage/15 text-sage border border-sage/25'
          : 'bg-destructive/15 text-destructive border border-destructive/25',
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', isOpen ? 'bg-sage animate-pulse' : 'bg-destructive')}
        aria-hidden
      />
      {isOpen ? openLabel : closedLabel}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold text-gold-foreground shadow-sm">
      <Award className="h-3 w-3" aria-hidden />
      Featured
    </span>
  );
}

function RatingPill({ rating, reviewCount, layoutId }: { rating: number; reviewCount?: number; layoutId?: string }) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/5"
    >
      <Star className="h-3.5 w-3.5 text-gold fill-gold" aria-hidden />
      <span className="text-sm font-bold text-foreground leading-none">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-[11px] text-muted-foreground font-medium leading-none ml-0.5">
          ({reviewCount})
        </span>
      )}
    </motion.span>
  );
}

function FavoriteButton({
  isFavorite,
  onClick,
  label,
  size = 'md',
}: {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  const dimension = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }}
      onKeyDown={e => e.stopPropagation()}
      className={cn(
        dimension,
        'inline-flex items-center justify-center rounded-full',
        'bg-background/80 backdrop-blur-md border border-foreground/10',
        'shadow-sm hover:shadow-md',
        'transition-all duration-200 hover:scale-110 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
      aria-label={label}
      aria-pressed={isFavorite}
    >
      <Heart
        className={cn(
          iconSize,
          'transition-all duration-300',
          isFavorite ? 'fill-primary text-primary scale-110' : 'text-foreground/70',
        )}
      />
    </button>
  );
}

/* ---------- Main Card ---------- */

export default function VenueCard({
  venue,
  isFavorite,
  onToggleFavorite,
  onSelect,
  layout = 'grid',
}: VenueCardProps) {
  const { t } = useLocale();
  const navigate = useNavigate();

  const handleNavigate = () => navigate(`/venue/${venue.id}`);
  const handleFavorite = () => onToggleFavorite(venue.id);

  const ariaLabel = `${venue.name}, ${venue.cuisine} en ${venue.neighborhood}, ${venue.rating.toFixed(1)} estrellas, ${
    venue.isOpen ? t.venues.open : t.venues.closed
  }`;

  /* ----- LIST LAYOUT ----- */
  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="relative group"
      >
        <button
          type="button"
          onClick={handleNavigate}
          aria-label={ariaLabel}
          className={cn(
            'w-full text-left flex gap-4 p-3 rounded-2xl',
            'bg-card border border-border/60',
            'transition-all duration-300 ease-out',
            'hover:border-border hover:shadow-md hover:-translate-y-0.5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
        >
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl">
            <img
              src={venue.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
            {venue.featured && (
              <span className="absolute top-1.5 left-1.5 inline-flex items-center justify-center h-6 w-6 rounded-full bg-gold text-gold-foreground shadow-sm">
                <Award className="h-3 w-3" aria-hidden />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 py-1 pr-12">
            <div className="flex items-start gap-2">
              <h3 className="font-display font-semibold text-foreground text-base leading-tight truncate">
                {venue.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {venue.cuisine} · {venue.neighborhood}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <RatingPill rating={venue.rating} reviewCount={venue.reviewCount} />
              {venue.priceRange && <PriceIndicator level={venue.priceRange} />}
              <span className="ml-auto">
                <StatusBadge isOpen={venue.isOpen} openLabel={t.venues.open} closedLabel={t.venues.closed} />
              </span>
            </div>
          </div>
        </button>

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={handleFavorite}
            label={t.detail.favorite}
            size="sm"
          />
        </div>
      </motion.div>
    );
  }

  /* ----- GRID LAYOUT (primary) ----- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative group h-full"
    >
      <button
        type="button"
        onClick={handleNavigate}
        aria-label={ariaLabel}
        className={cn(
          'h-full w-full text-left flex flex-col overflow-hidden rounded-2xl',
          'bg-card border border-border/60',
          'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
          'transition-[transform,box-shadow,border-color] duration-300 ease-out',
          'hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_hsl(var(--foreground)/0.18)] hover:border-border',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'active:translate-y-0 active:shadow-sm',
        )}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <motion.img
            layoutId={`venue-image-${venue.id}`}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            src={venue.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />

          {/* Subtle gradient for badge legibility */}
          <div
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-foreground/30 to-transparent opacity-90 pointer-events-none"
            aria-hidden
          />

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap pr-16">
            <StatusBadge isOpen={venue.isOpen} openLabel={t.venues.open} closedLabel={t.venues.closed} />
            {venue.featured && <FeaturedBadge />}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2.5">
          <div className="flex items-start justify-between gap-3">
            <motion.h3
              layoutId={`venue-title-${venue.id}`}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold text-foreground text-[17px] sm:text-lg leading-snug tracking-tight line-clamp-1"
            >
              {venue.name}
            </motion.h3>
            <RatingPill
              rating={venue.rating}
              reviewCount={venue.reviewCount}
              layoutId={`venue-rating-${venue.id}`}
            />
          </div>

          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
            <span className="truncate">
              {venue.neighborhood} · <span className="text-foreground/70 font-medium">{venue.cuisine}</span>
            </span>
          </div>

          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.6em]">
            {venue.description}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
              <span className="truncate">{venue.hours}</span>
            </div>
            {venue.priceRange && <PriceIndicator level={venue.priceRange} />}
          </div>

          {/* Tags */}
          {venue.tags && venue.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {venue.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground border border-border/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>

      {/* Favorite — overlayed, isolated from main button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={handleFavorite}
          label={t.detail.favorite}
        />
      </div>
    </motion.div>
  );
}
