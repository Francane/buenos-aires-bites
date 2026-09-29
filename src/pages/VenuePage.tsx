
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, Navigation, Star, Clock, MapPin, Tag,
  DollarSign, Calendar,
} from 'lucide-react';
import { useVenue, useVenues } from '@/data/venues';
import { useLocale } from '@/i18n/LocaleProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useShare } from '@/hooks/useShare';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackgroundFX from '@/components/layout/BackgroundFX';
import BottomNav from '@/components/layout/BottomNav';
import VenueCard from '@/components/venues/VenueCard';
import VenueGallery from '@/components/venues/VenueGallery';
import VenueReviews from '@/components/venues/VenueReviews';
import AiReviewSummary from '@/components/venues/AiReviewSummary';
import UserReviewForm from '@/components/venues/UserReviewForm';
import CheckInsFeed from '@/components/venues/CheckInsFeed';
import { useAiReviewSummary } from '@/hooks/useAiVenues';
import AddToListButton from '@/components/lists/AddToListButton';
import CheckInButton from '@/components/venues/CheckInButton';
import { slugify } from '@/lib/slug';
import { cn } from '@/lib/utils';

function PriceRange({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center" aria-label={`Precio nivel ${level} de 4`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <DollarSign
          key={i}
          className={cn('h-3.5 w-3.5', i < level ? 'text-foreground' : 'text-muted-foreground/30')}
        />
      ))}
    </span>
  );
}

export default function VenuePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { share } = useShare();

  const { data: venue, isLoading } = useVenue(id);
  const { data: venues = [] } = useVenues();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando…</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-display font-bold text-foreground">Venue not found</p>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const similar = venues
    .filter(v => v.id !== venue.id && (v.cuisine === venue.cuisine || v.neighborhood === venue.neighborhood))
    .slice(0, 3);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${venue.coordinates.lat},${venue.coordinates.lng}`;

  const handleToggleFav = () => {
    const added = toggleFavorite(venue.id);
    toast.success(added ? t.toast.favAdded : t.toast.favRemoved);
  };

  const allImages = venue.images?.length ? venue.images : [venue.imageUrl];
  const fav = isFavorite(venue.id);

  return (
    <div className="min-h-screen relative pb-[68px] md:pb-0">
      <BackgroundFX />
      <Navbar
        favCount={favorites.length}
        onSearchOpen={() => {}}
        onAddPlace={() => navigate('/agregar-lugar')}
      />

      {/* === CINEMATIC HERO === */}
      <section
        className="relative h-[42vh] min-h-[310px] max-h-[520px] md:h-[54vh] overflow-hidden bg-muted"
      >
        {/* Backdrop image with parallax */}
        <motion.div

          className="absolute inset-0 will-change-transform"
        >
          <span className="absolute inset-0 flex items-center justify-center font-display text-4xl text-muted-foreground/70">{venue.name}</span>
          <motion.img
            layoutId={`venue-image-${venue.id}`}
            src={venue.imageUrl}
            alt={venue.name}
            onError={e => { e.currentTarget.hidden = true; }}
            className="relative w-full h-full object-cover"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* Back + breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="absolute top-24 left-4 md:left-8 z-10 flex items-center gap-2"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-background border border-border text-foreground text-sm font-medium hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t.detail.close}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t.detail.close}</span>
          </button>
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-xs text-foreground/70 px-3 py-1.5 rounded-md bg-background border border-border/60">
            <Link to="/" className="hover:text-primary transition-colors">{t.nav.home}</Link>
            <span>/</span>
            <Link to={`/barrio/${slugify(venue.neighborhood)}`} className="text-foreground/90 hover:text-primary transition-colors">{venue.neighborhood}</Link>
            <span>/</span>
            <span className="font-semibold text-foreground truncate max-w-[180px]">{venue.name}</span>
          </nav>
        </motion.div>

        <div className="absolute top-4 right-4 md:right-8 z-10 flex gap-2">
          <button onClick={handleToggleFav} aria-pressed={fav} aria-label={t.detail.favorite} className="h-11 w-11 flex items-center justify-center rounded-md bg-card text-foreground border border-border"><Heart className={cn('h-5 w-5', fav && 'fill-primary text-primary')} /></button>
          <button onClick={() => share(venue)} aria-label={t.detail.share} className="h-11 w-11 flex items-center justify-center rounded-md bg-card text-foreground border border-border"><Share2 className="h-5 w-5" /></button>
        </div>
      </section>

      {/* === CONTENT === */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl">
        <div className="mb-9 border-b border-border pb-8">
          <p className="text-xs font-bold uppercase text-wine mb-3">{venue.cuisine} / <Link to={`/barrio/${slugify(venue.neighborhood)}`} className="hover:text-primary">{venue.neighborhood}</Link></p>
          <h1 className="font-display text-5xl md:text-7xl leading-none text-foreground">{venue.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground"><Star className="h-4 w-4 fill-accent text-accent-foreground" /> {venue.rating.toFixed(1)}</span>
            <span>({venue.reviewCount})</span>
            {venue.priceRange && <><span aria-hidden="true">·</span><PriceRange level={venue.priceRange} /></>}
            <span aria-hidden="true">·</span><span>{venue.hours}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-14">
          {/* Main column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-10"
          >
            {/* Description */}
            <section className="border-l-4 border-primary pl-5 py-1">
              <h2 className="font-body text-xs font-bold uppercase text-wine mb-3">
                {locale === 'es' ? 'Por qué ir' : 'Why go'}
              </h2>
              <p className="text-foreground/85 leading-relaxed text-[15px]">
                {venue.description}
              </p>
            </section>

            {venue.tags && venue.tags.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-3">{locale === 'es' ? 'Perfecto para' : 'Perfect for'}</h2>
                <p className="text-sm text-muted-foreground">{venue.tags.slice(0, 2).join(' · ')}</p>
              </section>
            )}

            {/* Gallery */}
            {allImages.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-5">
                  {locale === 'es' ? 'Galería' : 'Gallery'}
                </h2>
                <VenueGallery images={allImages} venueName={venue.name} />
              </section>
            )}

            {/* AI Summary + Reviews */}
            {venue.reviews && venue.reviews.length > 0 && (
              <>
                <AiSummaryBlock venueName={venue.name} reviews={venue.reviews} />
                <VenueReviews reviews={venue.reviews} title={t.detail.reviews} />
              </>
            )}

            {/* Community reviews & check-ins */}
            <UserReviewForm venueId={venue.id} />
            <CheckInsFeed venueId={venue.id} />
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="bg-card border border-border rounded-md overflow-hidden">
              {/* Primary CTA */}
              <div className="p-5 border-b border-border/60">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <span
                    className="hidden"
                    aria-hidden
                  />
                  <Navigation className="h-4 w-4 relative" />
                  <span className="relative">{t.detail.directions}</span>
                </a>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={handleToggleFav}
                    aria-pressed={fav}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      fav
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-background text-foreground border-border hover:bg-muted',
                    )}
                  >
                    <Heart className={cn('h-4 w-4', fav && 'fill-primary')} />
                    {t.detail.favorite}
                  </button>
                  <button
                    onClick={() => share(venue)}
                    className="inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-background border border-border text-foreground hover:bg-muted text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Share2 className="h-4 w-4" />
                    {t.detail.share}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <AddToListButton venueId={venue.id} />
                  <CheckInButton venueId={venue.id} venueName={venue.name} />
                </div>
              </div>

              {/* Info group */}
              <dl className="divide-y divide-border/60">
                <div className="p-5 flex items-start gap-3">
                  <span className="h-9 w-9 rounded-lg bg-primary/10 inline-flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <dt className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {t.detail.address}
                    </dt>
                    <dd className="text-sm text-foreground mt-0.5">{venue.address}</dd>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-1.5"
                    >
                      Ver en mapa →
                    </a>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-3">
                  <span className="h-9 w-9 rounded-lg bg-primary/10 inline-flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <dt className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {t.detail.hours}
                    </dt>
                    <dd className="text-sm text-foreground mt-0.5">{venue.hours}</dd>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 mt-1.5 text-xs font-semibold',
                        venue.isOpen ? 'text-sage' : 'text-destructive',
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          venue.isOpen ? 'bg-sage animate-pulse' : 'bg-destructive',
                        )}
                      />
                      {venue.isOpen ? t.venues.open : t.venues.closed}
                    </span>
                  </div>
                </div>

                {venue.priceRange && (
                  <div className="p-5 flex items-start gap-3">
                    <span className="h-9 w-9 rounded-lg bg-primary/10 inline-flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <dt className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {locale === 'es' ? 'Precio' : 'Price'}
                      </dt>
                      <dd className="mt-1"><PriceRange level={venue.priceRange} /></dd>
                    </div>
                  </div>
                )}

                {venue.reservationInfo && (
                  <div className="p-5 flex items-start gap-3">
                    <span className="h-9 w-9 rounded-lg bg-accent/15 inline-flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-accent-foreground" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <dt className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {t.detail.reservation}
                      </dt>
                      <dd className="text-sm text-foreground mt-0.5">{venue.reservationInfo}</dd>
                    </div>
                  </div>
                )}

                {venue.tags && venue.tags.length > 0 && (
                  <div className="p-5">
                    <dt className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Tag className="h-3 w-3" /> {t.detail.tags}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {venue.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-border/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </motion.aside>
        </div>

        {/* Similar venues */}
        {similar.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 tracking-tight">
              {locale === 'es' ? 'También te puede gustar' : 'You might also like'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(v => (
                <VenueCard
                  key={v.id}
                  venue={v}
                  isFavorite={isFavorite(v.id)}
                  onToggleFavorite={(id) => {
                    const added = toggleFavorite(id);
                    toast.success(added ? t.toast.favAdded : t.toast.favRemoved);
                  }}
                  onSelect={() => navigate(`/venue/${v.id}`)}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <Footer />

      {/* Mobile sticky action bar */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="md:hidden fixed bottom-[64px] inset-x-0 z-40 px-3 pb-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }}
      >
        <div className="flex items-center gap-2 p-2 rounded-md bg-card border border-border">
          <button
            onClick={handleToggleFav}
            aria-pressed={fav}
            aria-label={t.detail.favorite}
            className={cn(
              'h-11 w-11 inline-flex items-center justify-center rounded-xl border transition-colors flex-shrink-0',
              fav ? 'bg-primary/10 text-primary border-primary/30' : 'bg-background text-foreground border-border',
            )}
          >
            <Heart className={cn('h-5 w-5', fav && 'fill-primary')} />
          </button>
          <button
            onClick={() => share(venue)}
            aria-label={t.detail.share}
            className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-background text-foreground border border-border flex-shrink-0"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm"
          >
            <Navigation className="h-4 w-4" />
            {t.detail.directions}
          </a>
        </div>
      </motion.div>

      <BottomNav favCount={favorites.length} onSearchOpen={() => {}} />
    </div>
  );
}

function AiSummaryBlock({ venueName, reviews }: { venueName: string; reviews: { author: string; content: string; rating: number }[] }) {
  const { data, loading, error, generate, canGenerate } = useAiReviewSummary(venueName, reviews, true);
  return (
    <AiReviewSummary
      data={data}
      loading={loading}
      error={error}
      onGenerate={generate}
      hasReviews={canGenerate}
    />
  );
}
