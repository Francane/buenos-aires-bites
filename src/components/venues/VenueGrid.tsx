import { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';
import { getCuisines, getAllTags } from '@/data/venues';
import VenueCard from './VenueCard';
import EmptyState from '@/components/ui/EmptyState';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">{t.venues.title}</h2>
            <p className="text-muted-foreground mt-1">{t.venues.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`} aria-label={t.venues.grid}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`} aria-label={t.venues.list}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={cuisineFilter}
            onChange={e => { setCuisineFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="px-3 py-1.5 rounded-lg bg-background border border-input text-sm text-foreground"
          >
            <option value="">{t.venues.filterByCuisine}: {t.venues.all}</option>
            {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={tagFilter}
            onChange={e => { setTagFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="px-3 py-1.5 rounded-lg bg-background border border-input text-sm text-foreground"
          >
            <option value="">{t.venues.filterByTag}: {t.venues.all}</option>
            {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          <span className="text-sm text-muted-foreground self-center ml-auto">
            {t.venues.showing} {visible.length} {t.venues.of} {filtered.length} {t.search.results}
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
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                  className="px-6 py-2.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
                >
                  {t.venues.loadMore}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
