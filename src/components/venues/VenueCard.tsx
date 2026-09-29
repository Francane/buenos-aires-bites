import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VenueCardProps {
  venue: Venue;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (venue: Venue) => void;
  layout?: 'grid' | 'list';
}

export default function VenueCard({ venue, isFavorite, onToggleFavorite, layout = 'grid' }: VenueCardProps) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const list = layout === 'list';
  return (
    <motion.article initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25 }} className="group relative w-full h-full">
      <Button
        variant="ghost"
        onClick={() => navigate(`/venue/${venue.id}`)}
        aria-label={`${venue.name}, ${venue.cuisine} en ${venue.neighborhood}, ${venue.rating.toFixed(1)} estrellas`}
        className={cn('!whitespace-normal text-left w-full h-full !p-0 overflow-hidden bg-card border border-border/70 rounded-md hover:bg-card hover:border-primary/40 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 flex', list ? 'flex-row items-stretch' : 'flex-col items-stretch')}
      >
        <div className={cn('relative overflow-hidden bg-muted shrink-0', list ? 'w-28 sm:w-40 min-h-36' : 'w-full aspect-[4/3]')}>
          <span className="absolute inset-0 flex items-center justify-center text-center p-6 font-display text-2xl text-muted-foreground/70">{venue.name}</span>
          <img src={venue.imageUrl} alt="" loading="lazy" decoding="async" onError={e => { e.currentTarget.hidden = true; }} className="relative h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
        </div>
        <div className={cn('flex flex-col min-w-0 w-full', list ? 'p-4 pr-12' : 'p-5')}>
          <p className="text-[11px] font-semibold uppercase text-wine leading-relaxed">{venue.cuisine} <span className="text-muted-foreground mx-1">/</span> {venue.neighborhood}</p>
          <h3 className="font-display text-[25px] leading-[1.1] text-foreground mt-2 line-clamp-2">{venue.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-2">{venue.description}</p>
          {venue.tags && venue.tags.length > 0 && (
            <p className="text-xs text-wine mt-3 line-clamp-1">{venue.tags.slice(0, 2).join(' · ')}</p>
          )}
          <div className="flex items-center gap-2 mt-auto pt-4 text-xs text-muted-foreground flex-wrap">
            <Star className="h-3.5 w-3.5 fill-accent text-accent-foreground" aria-hidden="true" />
            <strong className="text-foreground">{venue.rating.toFixed(1)}</strong>
            <span>({venue.reviewCount})</span>
            {venue.priceRange && <><span aria-hidden="true">·</span><span aria-label={`Precio nivel ${venue.priceRange} de 4`}>{'$'.repeat(venue.priceRange)}</span></>}
          </div>
        </div>
      </Button>
      <Button
        variant="outline" size="icon" type="button"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(venue.id); }}
        aria-label={t.detail.favorite} aria-pressed={isFavorite}
        className="absolute top-3 right-3 z-10 h-11 w-11 rounded-full bg-card border-border hover:bg-card hover:text-primary"
      >
        <Heart className={cn('h-5 w-5', isFavorite ? 'fill-primary text-primary' : 'text-foreground')} />
      </Button>
    </motion.article>
  );
}
