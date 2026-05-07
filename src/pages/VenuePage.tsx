import { useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, Navigation, Star, Clock, MapPin, Tag,
  DollarSign, Award, Calendar, ChevronDown,
} from 'lucide-react';
import { venues } from '@/data/venues';
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
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const scrollHintOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  const venue = venues.find(v => v.id === id);

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
        ref={heroRef}
        className="relative h-[78vh] md:h-[88vh] overflow-hidden"
      >
        {/* Backdrop image with parallax */}
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 will-change-transform"
        >
          <motion.img
            layoutId={`venue-image-${venue.id}`}
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* Vignette + bottom gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.3) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-background via-background/85 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/60 to-transparent pointer-events-none" />

        {/* Back + breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="absolute top-24 left-4 md:left-8 z-10 flex items-center gap-2"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-background/70 backdrop-blur-md border border-border text-foreground text-sm font-medium hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t.detail.close}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t.detail.close}</span>
          </button>
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-xs text-foreground/70 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-border/60">
            <Link to="/" className="hover:text-primary transition-colors">{t.nav.home}</Link>
            <span>/</span>
            <span className="text-foreground/90">{venue.neighborhood}</span>
            <span>/</span>
            <span className="font-semibold text-foreground truncate max-w-[180px]">{venue.name}</span>
          </nav>
        </motion.div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-16 md:pb-20">
          <div className="container mx-auto max-w-5xl">
            {/* Badges row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 flex-wrap mb-5"
            >
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border',
                  venue.isOpen
                    ? 'bg-sage/20 text-sage border-sage/30'
                    : 'bg-destructive/20 text-destructive border-destructive/30',
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
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background/70 backdrop-blur-md border border-border text-foreground">
                {venue.cuisine}
              </span>
              {venue.priceRange && (
                <span className="px-3 py-1 rounded-full bg-background/70 backdrop-blur-md border border-border">
                  <PriceRange level={venue.priceRange} />
                </span>
              )}
              {venue.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gold text-gold-foreground shadow-md">
                  <Award className="h-3.5 w-3.5" />
                  Featured
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              layoutId={`venue-title-${venue.id}`}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.05] tracking-tight"
            >
              {venue.name}
            </motion.h1>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-5 mt-5 flex-wrap"
            >
              <motion.div
                layoutId={`venue-rating-${venue.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 border border-gold/25"
              >
                <Star className="h-4 w-4 text-gold fill-gold" />
                <span className="font-display font-bold text-foreground">{venue.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({venue.reviewCount})</span>
              </motion.div>
              <span className="text-sm text-foreground/80 inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {venue.neighborhood}
              </span>
              <span className="text-sm text-foreground/80 inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {venue.hours}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* === CONTENT === */}
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Main column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-12"
          >
            {/* Description */}
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                {t.detail.description}
              </h2>
              <p className="text-foreground/85 leading-relaxed text-[15px]">
                {venue.description}
              </p>
            </section>

            {/* Gallery */}
            {allImages.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-5">
                  {locale === 'es' ? 'Galería' : 'Gallery'}
                </h2>
                <VenueGallery images={allImages} venueName={venue.name} />
              </section>
            )}

            {/* Reviews */}
            {venue.reviews && venue.reviews.length > 0 && (
              <VenueReviews reviews={venue.reviews} title={t.detail.reviews} />
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="rounded-2xl bg-card/95 backdrop-blur-sm border border-border shadow-xl overflow-hidden">
              {/* Primary CTA */}
              <div className="p-5 border-b border-border/60">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background overflow-hidden"
                >
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
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
    </div>
  );
}
