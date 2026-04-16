import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Navigation, Star, Clock, MapPin, Tag, MessageCircle, DollarSign, Award } from 'lucide-react';
import { venues } from '@/data/venues';
import { useLocale } from '@/i18n/LocaleProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useShare } from '@/hooks/useShare';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackgroundFX from '@/components/layout/BackgroundFX';
import VenueCard from '@/components/venues/VenueCard';

const platformIcons: Record<string, string> = {
  tiktok: '🎵',
  google: '🔍',
  web: '🌐',
};

function PriceRange({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <DollarSign key={i} className={`h-3.5 w-3.5 ${i < level ? 'text-primary' : 'text-muted-foreground/30'}`} />
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

  const handleToggleFav = () => {
    const added = toggleFavorite(venue.id);
    toast.success(added ? t.toast.favAdded : t.toast.favRemoved);
  };

  const allImages = venue.images?.length ? venue.images : [venue.imageUrl];

  return (
    <div className="min-h-screen">
      <BackgroundFX />
      <Navbar
        favCount={favorites.length}
        onSearchOpen={() => {}}
        onAddPlace={() => navigate('/agregar-lugar')}
      />

      {/* Parallax hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-24 left-4 md:left-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-foreground text-sm font-medium hover:bg-background/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.detail.close}
          </button>
        </motion.div>

        {/* Featured badge */}
        {venue.featured && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 right-4 md:right-8"
          >
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/90 text-gold-foreground text-xs font-bold">
              <Award className="h-3.5 w-3.5" />
              Featured
            </span>
          </motion.div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold glass ${venue.isOpen ? 'text-sage' : 'text-destructive'}`}>
                  {venue.isOpen ? t.venues.open : t.venues.closed}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold glass text-foreground">
                  {venue.cuisine}
                </span>
                {venue.priceRange && (
                  <span className="px-3 py-1 rounded-full glass">
                    <PriceRange level={venue.priceRange} />
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
                {venue.name}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <span className="font-bold text-foreground">{venue.rating}</span>
                  <span className="text-sm text-muted-foreground">({venue.reviewCount})</span>
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {venue.neighborhood}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Action buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleToggleFav}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isFavorite(venue.id) ? 'bg-primary/10 border border-primary/30 text-primary' : 'glass text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorite(venue.id) ? 'fill-primary' : ''}`} />
                {t.detail.favorite}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => share(venue)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl glass text-muted-foreground hover:text-foreground font-medium text-sm"
              >
                <Share2 className="h-4 w-4" />
                {t.detail.share}
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shine"
              >
                <Navigation className="h-4 w-4" />
                {t.detail.directions}
              </motion.a>
            </div>

            {/* Description */}
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t.detail.description}</h2>
              <p className="text-foreground leading-relaxed">{venue.description}</p>
            </div>

            {/* Image gallery */}
            {allImages.length > 1 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Galería</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allImages.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="aspect-[4/3] rounded-xl overflow-hidden"
                    >
                      <img src={img} alt={`${venue.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {venue.reviews && venue.reviews.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  {t.detail.reviews}
                </h2>
                <div className="space-y-3">
                  {venue.reviews.map(r => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="glass-strong rounded-xl p-5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{platformIcons[r.platform]} {r.author}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 text-gold fill-gold" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{r.content}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="glass-strong rounded-2xl p-5 space-y-4 sticky top-24">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.detail.address}</p>
                  <p className="text-sm text-foreground">{venue.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.detail.hours}</p>
                  <p className="text-sm text-foreground">{venue.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                <Tag className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.detail.cuisine}</p>
                  <p className="text-sm text-foreground">{venue.cuisine}</p>
                </div>
              </div>
              {venue.priceRange && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                  <DollarSign className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Precio</p>
                    <PriceRange level={venue.priceRange} />
                  </div>
                </div>
              )}
              {venue.reservationInfo && (
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm text-accent-foreground">
                  <span className="font-medium">{t.detail.reservation}:</span> {venue.reservationInfo}
                </div>
              )}
              {venue.tags && venue.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t.detail.tags}</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </div>

        {/* Similar venues */}
        {similar.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
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
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
