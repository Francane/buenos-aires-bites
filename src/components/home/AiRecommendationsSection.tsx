import { useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAiRecommendations } from '@/hooks/useAiVenues';
import type { Venue } from '@/types/venue';

interface Props {
  venues: Venue[];
  favoriteIds: string[];
  onSelectVenue: (v: Venue) => void;
}

export default function AiRecommendationsSection({ venues, favoriteIds, onSelectVenue }: Props) {
  const { user } = useAuth();
  const { recs, loading, error, fetchRecs } = useAiRecommendations();

  const favorites = venues.filter(v => favoriteIds.includes(v.id));
  const candidates = venues.filter(v => !favoriteIds.includes(v.id));

  useEffect(() => {
    if (user && favorites.length >= 1 && candidates.length > 0 && recs === null && !loading) {
      fetchRecs(favorites, candidates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, favorites.length, candidates.length]);

  if (!user || favorites.length < 1) return null;
  if (recs && recs.length === 0 && !loading) return null;

  const recVenues = (recs ?? []).map(r => ({ venue: venues.find(v => v.id === r.id), reason: r.reason })).filter(x => x.venue);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="h-9 w-9 rounded-xl bg-primary/15 inline-flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Para vos</h2>
            <p className="text-xs text-muted-foreground">Recomendaciones IA según tus favoritos</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Pensando…
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recVenues.map(({ venue, reason }, i) => venue && (
            <motion.button
              key={venue.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectVenue(venue)}
              className="text-left rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-bold text-foreground">{venue.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{venue.neighborhood} · {venue.cuisine}</p>
                <p className="text-sm text-foreground/85 mt-2 italic flex items-start gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                  {reason}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
