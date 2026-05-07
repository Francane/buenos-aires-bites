import { useState, useMemo } from 'react';
import { LayoutGrid, List, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';
import { getCuisines, getAllTags } from '@/data/venues';
import VenueCard from './VenueCard';
import EmptyState from '@/components/ui/EmptyState';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VenueGridProps {
  venues: Venue[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectVenue: (venue: Venue) => void;
  loading?: boolean;
}

const PAGE_SIZE = 12;

export default function VenueGrid({ venues, isFavorite, onToggleFavorite, onSelectVenue, loading }: VenueGridProps) {
  const { t } = useLocale();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const cuisines = getCuisines();
  const tags = getAllTags();

  const filtered = useMemo(() => {
    let result = venues;
    if (cuisineFilter) result = result.filter(v => v.cuisine === cuisineFilter);
    if (tagFilter) result = result.filter(v => v.tags?.includes(tagFilter));
    return result;
  }, [venues, cuisineFilter, tagFilter]);

  const visible = filtered.slice(0, visibleCount);

  if (loading) {
    return (
      <section id="categorias" className="py-16">
        <div className="container mx-auto px-4">
          <SkeletonLoader count={6} />
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{t.venues.title}</h2>
            <p className="text-muted-foreground mt-1">{t.venues.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl glass">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`} aria-label={t.venues.grid}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`} aria-label={t.venues.list}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {t.venues.filterByCuisine.split(' ')[0]}
          </div>

          <Select value={cuisineFilter || 'all'} onValueChange={v => { setCuisineFilter(v === 'all' ? '' : v); setVisibleCount(PAGE_SIZE); }}>
            <SelectTrigger className="w-auto min-w-[160px] h-9 rounded-xl glass border-border/60 text-sm">
              <SelectValue placeholder={t.venues.filterByCuisine} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">{t.venues.filterByCuisine}: {t.venues.all}</SelectItem>
              {cuisines.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={tagFilter || 'all'} onValueChange={v => { setTagFilter(v === 'all' ? '' : v); setVisibleCount(PAGE_SIZE); }}>
            <SelectTrigger className="w-auto min-w-[160px] h-9 rounded-xl glass border-border/60 text-sm">
              <SelectValue placeholder={t.venues.filterByTag} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">{t.venues.filterByTag}: {t.venues.all}</SelectItem>
              {tags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
            </SelectContent>
          </Select>

          <AnimatePresence>
            {(cuisineFilter || tagFilter) && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex items-center gap-1.5 flex-wrap"
              >
                {cuisineFilter && (
                  <button
                    onClick={() => { setCuisineFilter(''); setVisibleCount(PAGE_SIZE); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors"
                  >
                    {cuisineFilter} <X className="h-3 w-3" />
                  </button>
                )}
                {tagFilter && (
                  <button
                    onClick={() => { setTagFilter(''); setVisibleCount(PAGE_SIZE); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-semibold hover:bg-accent/25 transition-colors"
                  >
                    {tagFilter} <X className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={() => { setCuisineFilter(''); setTagFilter(''); setVisibleCount(PAGE_SIZE); }}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1"
                >
                  {t.venues.all === 'Todos' ? 'Limpiar' : 'Clear'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="text-sm text-muted-foreground self-center ml-auto tabular-nums">
            <span className="font-semibold text-foreground">{visible.length}</span> {t.venues.of} {filtered.length} {t.search.results}
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title={t.venues.noVenues} description={t.venues.noVenuesDesc} />
        ) : (
          <>
            <div className={view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }>
              {visible.map(v => (
                <VenueCard
                  key={v.id}
                  venue={v}
                  isFavorite={isFavorite(v.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectVenue}
                  layout={view}
                />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                  className="px-8 py-3 rounded-xl glass-strong text-primary font-semibold hover:bg-primary/5 transition-colors"
                >
                  {t.venues.loadMore}
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
