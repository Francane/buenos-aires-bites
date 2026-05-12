import { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useVenues } from '@/data/venues';
import { useLocale } from '@/i18n/LocaleProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { Venue } from '@/types/venue';

import BackgroundFX from '@/components/layout/BackgroundFX';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HeroSearch from '@/components/home/HeroSearch';
import StatsSection from '@/components/home/StatsSection';
import TrendingSection from '@/components/home/TrendingSection';
import CategoryPills from '@/components/home/CategoryPills';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import VenueGrid from '@/components/venues/VenueGrid';
import FavoritesSection from '@/components/favorites/FavoritesSection';
import SearchModal from '@/components/search/SearchModal';
import GeoBanner from '@/components/geo/GeoBanner';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import BottomNav from '@/components/layout/BottomNav';
import AiRecommendationsSection from '@/components/home/AiRecommendationsSection';
import type { AiMatch } from '@/hooks/useAiVenues';

function MapFallback() {
  return (
    <section id="explorar" className="py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl glass-strong flex items-center justify-center" style={{ height: '500px' }}>
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
  const navigate = useNavigate();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const geo = useGeolocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [focusVenueId] = useState<string | null>(null);

  const { data: allVenues = [] } = useVenues();

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
  }, [allVenues, searchQuery, searchNeighborhood, searchCuisine]);

  const handleSearch = useCallback((query: string, neighborhood: string, cuisine: string) => {
    setSearchQuery(query);
    setSearchNeighborhood(neighborhood);
    setSearchCuisine(cuisine);
  }, []);

  const handleSelectVenue = useCallback((venue: Venue) => {
    navigate(`/venue/${venue.id}`);
  }, [navigate]);

  const handleToggleFavorite = useCallback((id: string) => {
    const added = toggleFavorite(id);
    toast.success(added ? t.toast.favAdded : t.toast.favRemoved, {
      action: {
        label: added ? (t.detail.close === 'Cerrar' ? 'Deshacer' : 'Undo') : (t.detail.close === 'Cerrar' ? 'Reagregar' : 'Re-add'),
        onClick: () => toggleFavorite(id),
      },
    });
  }, [toggleFavorite, t]);

  const handleExplore = useCallback(() => {
    document.getElementById('explorar')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFavorites = useCallback(() => {
    document.getElementById('favoritos')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleAddPlace = useCallback(() => {
    navigate('/agregar-lugar');
  }, [navigate]);

  const handleCategorySelect = useCallback((cuisine: string) => {
    setSearchCuisine(cuisine);
    setSearchQuery('');
    setSearchNeighborhood('');
    document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen pb-[68px] md:pb-0">
      <BackgroundFX />
      <Navbar
        favCount={favorites.length}
        onSearchOpen={() => setSearchOpen(true)}
        onAddPlace={handleAddPlace}
      />

      <HeroSection onExplore={handleExplore} onFavorites={handleFavorites} />
      <HeroSearch onSearch={handleSearch} />
      <StatsSection />
      <TrendingSection venues={allVenues} onSelectVenue={handleSelectVenue} />
      <CategoryPills onSelectCuisine={handleCategorySelect} />

      <ErrorBoundary fallback={<MapFallback />}>
        <Suspense fallback={<div className="container mx-auto px-4 py-16"><SkeletonLoader count={1} /></div>}>
          <MapSection venues={allVenues} onSelectVenue={handleSelectVenue} focusVenueId={focusVenueId} />
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

      <TestimonialsSection />
      <NewsletterSection />

      <Footer />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        venues={allVenues}
        onSelectVenue={handleSelectVenue}
      />

      <ScrollToTop />
      <BottomNav favCount={favorites.length} onSearchOpen={() => setSearchOpen(true)} />

      {geo.showBanner && (
        <GeoBanner onAccept={geo.acceptConsent} onDismiss={geo.dismissConsent} />
      )}
    </div>
  );
}
