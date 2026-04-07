import { X, Heart, Share2, Navigation, Star, Clock, MapPin, Tag, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';

interface VenueDetailProps {
  venue: Venue | null;
  open: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShare: (venue: Venue) => void;
}

const platformIcons: Record<string, string> = {
  tiktok: '🎵',
  google: '🔍',
  web: '🌐',
};

export default function VenueDetail({ venue, open, onClose, isFavorite, onToggleFavorite, onShare }: VenueDetailProps) {
  const { t } = useLocale();

  if (!venue) return null;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card z-50 overflow-y-auto shadow-2xl"
          >
            <div className="relative">
              <img src={venue.imageUrl} alt={venue.name} className="w-full h-56 object-cover" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm"
                aria-label={t.detail.close}
              >
                <X className="h-5 w-5" />
              </button>
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${venue.isOpen ? 'bg-sage/20 text-sage' : 'bg-destructive/20 text-destructive'}`}>
                {venue.isOpen ? t.venues.open : t.venues.closed}
              </span>
            </div>

            <div className="p-6">
              <h2 className="font-display text-2xl font-bold text-foreground">{venue.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-4 w-4 text-gold fill-gold" />
                <span className="font-bold text-foreground">{venue.rating}</span>
                <span className="text-sm text-muted-foreground">({venue.reviewCount} {t.venues.reviews})</span>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => onToggleFavorite(venue.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border font-medium text-sm transition-colors ${
                    isFavorite ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary' : ''}`} />
                  {t.detail.favorite}
                </button>
                <button
                  onClick={() => onShare(venue)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground font-medium text-sm"
                >
                  <Share2 className="h-4 w-4" />
                  {t.detail.share}
                </button>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
                >
                  <Navigation className="h-4 w-4" />
                  {t.detail.directions}
                </a>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.detail.address}</p>
                    <p className="text-sm text-foreground">{venue.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.detail.hours}</p>
                    <p className="text-sm text-foreground">{venue.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.detail.cuisine}</p>
                    <p className="text-sm text-foreground">{venue.cuisine}</p>
                  </div>
                </div>
                {venue.reservationInfo && (
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent-foreground">
                    <span className="font-medium">{t.detail.reservation}:</span> {venue.reservationInfo}
                  </div>
                )}
              </div>

              {venue.tags && venue.tags.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t.detail.tags}</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t.detail.description}</p>
                <p className="text-sm text-foreground leading-relaxed">{venue.description}</p>
              </div>

              {venue.reviews && venue.reviews.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {t.detail.reviews}
                  </p>
                  <div className="space-y-3">
                    {venue.reviews.map(r => (
                      <div key={r.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{platformIcons[r.platform]} {r.author}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-gold fill-gold" />
                            <span className="text-xs font-bold text-foreground">{r.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{r.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
