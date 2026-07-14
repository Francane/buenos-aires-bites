import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, X, SlidersHorizontal, Star } from 'lucide-react';
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

type SortKey = 'featured' | 'rating' | 'reviews' | 'name';
const PAGE_SIZE = 12;

export default function VenueGrid({ venues, isFavorite, onToggleFavorite, onSelectVenue, loading }: VenueGridProps) {
  const { t } = useLocale();
  const [params, setParams] = useSearchParams();

  const view = (params.get('view') as 'grid' | 'list') || 'grid';
  const cuisineFilter = params.get('cuisine') || '';
  const tagFilter = params.get('tag') || '';
  const price = params.get('price') || '';
  const minRating = Number(params.get('rating') || 0);
  const openNow = params.get('open') === '1';
  const sort = (params.get('sort') as SortKey) || 'featured';
  const visibleCount = Number(params.get('n') || PAGE_SIZE);

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '' || v === 'all') next.delete(k);
      else next.set(k, v);
    }
    if (!('n' in patch)) next.delete('n');
    setParams(next, { replace: true });
  };

  const cuisines = getCuisines(venues);
  const tags = getAllTags(venues);

  const filtered = useMemo(() => {
    let result = venues;
    if (cuisineFilter) result = result.filter(v => v.cuisine === cuisineFilter);
    if (tagFilter) result = result.filter(v => v.tags?.includes(tagFilter));
    if (price) result = result.filter(v => v.priceRange === Number(price));
    if (minRating) result = result.filter(v => v.rating >= minRating);
    if (openNow) result = result.filter(v => v.isOpen);

    const sorted = [...result];
    switch (sort) {
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'reviews': sorted.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: sorted.sort((a, b) => (Number(!!b.featured) - Number(!!a.featured)) || (b.rating - a.rating));
    }
    return sorted;
  }, [venues, cuisineFilter, tagFilter, price, minRating, openNow, sort]);

  const visible = filtered.slice(0, visibleCount);
  const activeCount = [cuisineFilter, tagFilter, price, minRating > 0 ? '1' : '', openNow ? '1' : ''].filter(Boolean).length;

  if (loading) {
    return (
      <section id="categorias" className="py-16">
        <div className="container mx-auto px-4"><SkeletonLoader count={6} /></div>
      </section>
    );
  }

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

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
            <button onClick={() => set({ view: 'grid' })} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`} aria-label={t.venues.grid}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => set({ view: 'list' })} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`} aria-label={t.venues.list}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filtros
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">{activeCount}</span>
            )}
          </div>

          <Select value={cuisineFilter || 'all'} onValueChange={v => set({ cuisine: v })}>
            <SelectTrigger className="w-auto min-w-[140px] h-9 rounded-xl glass border-border/60 text-sm">
              <SelectValue placeholder={t.venues.filterByCuisine} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Cocina: Todas</SelectItem>
              {cuisines.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={tagFilter || 'all'} onValueChange={v => set({ tag: v })}>
            <SelectTrigger className="w-auto min-w-[140px] h-9 rounded-xl glass border-border/60 text-sm">
              <SelectValue placeholder={t.venues.filterByTag} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tag: Todos</SelectItem>
              {tags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={price || 'all'} onValueChange={v => set({ price: v })}>
            <SelectTrigger className="w-auto min-w-[110px] h-9 rounded-xl glass border-border/60 text-sm">
              <SelectValue placeholder="Precio" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Precio: Todos</SelectItem>
              <SelectItem value="1">$ · Económico</SelectItem>
              <SelectItem value="2">$$ · Medio</SelectItem>
              <SelectItem value="3">$$$ · Alto</SelectItem>
              <SelectItem value="4">$$$$ · Premium</SelectItem>
            </SelectContent>
          </Select>

          <Select value={String(minRating || 'all')} onValueChange={v => set({ rating: v === 'all' ? null : v })}>
            <SelectTrigger className="w-auto min-w-[110px] h-9 rounded-xl glass border-border/60 text-sm">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Rating: Todos</SelectItem>
              <SelectItem value="4.5">4.5+ estrellas</SelectItem>
              <SelectItem value="4">4+ estrellas</SelectItem>
              <SelectItem value="3.5">3.5+ estrellas</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => set({ open: openNow ? null : '1' })}
            className={`h-9 px-3 rounded-xl border text-sm font-medium transition-all inline-flex items-center gap-1.5 ${openNow ? 'bg-sage/15 text-sage border-sage/30' : 'glass border-border/60 text-foreground'}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${openNow ? 'bg-sage animate-pulse' : 'bg-muted-foreground/50'}`} />
            Abierto ahora
          </button>

          <Select value={sort} onValueChange={v => set({ sort: v === 'featured' ? null : v })}>
            <SelectTrigger className="w-auto min-w-[140px] h-9 rounded-xl glass border-border/60 text-sm">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="featured">Destacados</SelectItem>
              <SelectItem value="rating">Mejor rating</SelectItem>
              <SelectItem value="reviews">Más reseñas</SelectItem>
              <SelectItem value="name">Alfabético</SelectItem>
            </SelectContent>
          </Select>

          <AnimatePresence>
            {activeCount > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 inline-flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Limpiar
              </motion.button>
            )}
          </AnimatePresence>

          <span className="text-sm text-muted-foreground ml-auto tabular-nums">
            <span className="font-semibold text-foreground">{visible.length}</span> {t.venues.of} {filtered.length} resultados
          </span>
        </div>

        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5 mb-6"
            >
              {cuisineFilter && <Chip label={cuisineFilter} onClear={() => set({ cuisine: null })} />}
              {tagFilter && <Chip label={`#${tagFilter}`} onClear={() => set({ tag: null })} />}
              {price && <Chip label={'$'.repeat(Number(price))} onClear={() => set({ price: null })} />}
              {minRating > 0 && <Chip label={<><Star className="h-3 w-3 fill-current" />{minRating}+</>} onClear={() => set({ rating: null })} />}
              {openNow && <Chip label="Abierto ahora" onClear={() => set({ open: null })} />}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <EmptyState title={t.venues.noVenues} description={t.venues.noVenuesDesc} />
        ) : (
          <>
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
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
                  onClick={() => set({ n: String(visibleCount + PAGE_SIZE) })}
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

function Chip({ label, onClear }: { label: React.ReactNode; onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors"
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}
