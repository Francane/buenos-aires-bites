import { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { toast } from 'sonner';
import { venues as allVenues } from '@/data/venues';
import { useLocale } from '@/i18n/LocaleProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useShare } from '@/hooks/useShare';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { Venue } from '@/types/venue';

import BackgroundFX from '@/components/layout/BackgroundFX';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HeroSearch from '@/components/home/HeroSearch';
import VenueGrid from '@/components/venues/VenueGrid';
import VenueDetail from '@/components/venues/VenueDetail';
import FavoritesSection from '@/components/favorites/FavoritesSection';
import SearchModal from '@/components/search/SearchModal';
import GeoBanner from '@/components/geo/GeoBanner';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import ErrorBoundary from '@/components/error/ErrorBoundary';

const MapSection = lazy(() => import('@/components/map/MapSection'));

function MapFallback() {
  return (
    <section id="explorar" className="py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-xl border border-border bg-muted/50 flex items-center justify-center" style={{ height: '500px' }}>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">Mapa no disponible</p>
            <p className="text-sm text-muted-foreground">No se pudo cargar el mapa. El resto de la página sigue funcionando.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  const { t } = useLocale();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { share } = useShare();
  const geo = useGeolocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [focusVenueId, setFocusVenueId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchNeighborhood, setSearchNeighborhood] = useState('');
  const [searchCuisine, setSearchCuisine] = useState('');

  const filteredVenues = useMemo(() => {
    let result = allVenues;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.cuisine.toLowerCase().includes(q) ||
        v.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (searchNeighborhood) result = result.filter(v => v.neighborhood === searchNeighborhood);
    if (searchCuisine) result = result.filter(v => v.cuisine === searchCuisine);
    return result;
  }, [searchQuery, searchNeighborhood, searchCuisine]);

  const handleSearch = useCallback((query: string, neighborhood: string, cuisine: string) => {
    setSearchQuery(query);
    setSearchNeighborhood(neighborhood);
    setSearchCuisine(cuisine);
  }, []);

  const handleSelectVenue = useCallback((venue: Venue) => {
    setSelectedVenue(venue);
    setDetailOpen(true);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    const added = toggleFavorite(id);
    toast.success(added ? t.toast.favAdded : t.toast.favRemoved);
  }, [toggleFavorite, t]);

  const handleExplore = useCallback(() => {
    document.getElementById('explorar')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFavorites = useCallback(() => {
    document.getElementById('favoritos')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleAddPlace = useCallback(() => {
    window.location.href = '/agregar-lugar';
  }, []);

  const handleMapSelect = useCallback((venue: Venue) => {
    setSelectedVenue(venue);
    setDetailOpen(true);
  }, []);

  return (
    <div className="min-h-screen">
      <BackgroundFX />
      <Navbar
        favCount={favorites.length}
        onSearchOpen={() => setSearchOpen(true)}
        onAddPlace={handleAddPlace}
      />

      <HeroSection onExplore={handleExplore} onFavorites={handleFavorites} />
      <HeroSearch onSearch={handleSearch} />

      <ErrorBoundary fallback={<MapFallback />}>
        <Suspense fallback={<div className="container mx-auto px-4 py-16"><SkeletonLoader count={1} /></div>}>
          <MapSection venues={allVenues} onSelectVenue={handleMapSelect} focusVenueId={focusVenueId} />
        </Suspense>
      </ErrorBoundary>

      <VenueGrid
        venues={filteredVenues}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onSelectVenue={handleSelectVenue}
      />

      <FavoritesSection
        venues={allVenues}
        favoriteIds={favorites}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onSelectVenue={handleSelectVenue}
      />

      <Footer />

      <VenueDetail
        venue={selectedVenue}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        isFavorite={selectedVenue ? isFavorite(selectedVenue.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onShare={share}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        venues={allVenues}
        onSelectVenue={handleSelectVenue}
      />

      {geo.showBanner && (
        <GeoBanner onAccept={geo.acceptConsent} onDismiss={geo.dismissConsent} />
      )}
    </div>
  );
}
