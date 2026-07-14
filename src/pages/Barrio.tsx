import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useVenues } from '@/data/venues';
import { useFavorites } from '@/hooks/useFavorites';
import { useLocale } from '@/i18n/LocaleProvider';
import { slugify } from '@/lib/slug';
import BackgroundFX from '@/components/layout/BackgroundFX';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import VenueCard from '@/components/venues/VenueCard';
import EmptyState from '@/components/ui/EmptyState';

export default function Barrio() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLocale();
  const { data: venues = [], isLoading } = useVenues();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const { neighborhood, list } = useMemo(() => {
    const list = venues.filter(v => slugify(v.neighborhood) === slug);
    return { neighborhood: list[0]?.neighborhood ?? slug?.replace(/-/g, ' '), list };
  }, [venues, slug]);

  const stats = useMemo(() => {
    const total = list.length;
    const avg = total ? (list.reduce((a, v) => a + v.rating, 0) / total).toFixed(1) : '—';
    const open = list.filter(v => v.isOpen).length;
    const cuisines = new Set(list.map(v => v.cuisine)).size;
    return { total, avg, open, cuisines };
  }, [list]);

  const handleToggle = (id: string) => {
    const added = toggleFavorite(id);
    toast.success(added ? t.toast.favAdded : t.toast.favRemoved);
  };

  const pageTitle = `Los mejores lugares para comer en ${neighborhood} | Bites`;
  if (typeof document !== 'undefined') document.title = pageTitle;

  return (
    <div className="min-h-screen relative pb-[68px] md:pb-0">
      <BackgroundFX />
      <Navbar favCount={favorites.length} onSearchOpen={() => {}} onAddPlace={() => navigate('/agregar-lugar')} />

      <div className="container mx-auto px-4 pt-24 pb-14 max-w-6xl">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-semibold text-muted-foreground mb-4">
            <MapPin className="h-3.5 w-3.5" /> Barrio de Buenos Aires
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground capitalize">
            {neighborhood}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
            {list.length > 0
              ? `Descubrí ${stats.total} lugares seleccionados en ${neighborhood}: parrillas, cafés, bodegones y más.`
              : `Todavía no hay lugares cargados en ${neighborhood}. Sumate y agregá el primero.`}
          </p>

          {list.length > 0 && (
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {[
                { label: 'Lugares', value: stats.total, icon: Sparkles },
                { label: 'Rating prom.', value: stats.avg, icon: Star },
                { label: 'Abiertos ahora', value: stats.open, icon: MapPin },
                { label: 'Cocinas', value: stats.cuisines, icon: Sparkles },
              ].map(s => (
                <div key={s.label} className="rounded-2xl glass p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <s.icon className="h-3 w-3" /> {s.label}
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-foreground tabular-nums">{s.value}</div>
                </div>
              ))}
            </dl>
          )}
        </motion.header>

        {isLoading ? (
          <div className="text-muted-foreground text-sm">Cargando…</div>
        ) : list.length === 0 ? (
          <EmptyState title="Sin lugares aún" description="¿Conocés uno? Sumalo desde Agregar lugar." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(v => (
              <VenueCard
                key={v.id}
                venue={v}
                isFavorite={isFavorite(v.id)}
                onToggleFavorite={handleToggle}
                onSelect={(vv) => navigate(`/venue/${vv.id}`)}
              />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/" className="text-sm text-primary hover:underline">← Explorar todos los barrios</Link>
        </div>
      </div>

      <Footer />
      <BottomNav favCount={favorites.length} onSearchOpen={() => {}} />
    </div>
  );
}
