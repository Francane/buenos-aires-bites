import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Globe, Lock, Trash2 } from 'lucide-react';
import { useList, useRemoveListItem } from '@/hooks/useLists';
import { useVenues } from '@/hooks/useVenues';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import VenueCard from '@/components/venues/VenueCard';
import BackgroundFX from '@/components/layout/BackgroundFX';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

export default function ListaDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useList(id);
  const { data: venues = [] } = useVenues();
  const removeItem = useRemoveListItem();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!data?.list) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <p className="text-2xl font-display font-bold">Lista no encontrada</p>
        <button onClick={() => navigate('/listas')} className="text-primary hover:underline">← Volver a mis listas</button>
      </div>
    );
  }

  const { list, items } = data;
  const isOwner = user?.id === list.user_id;
  const venuesById = new Map(venues.map(v => [v.id, v]));
  const listVenues = items.map(it => ({ item: it, venue: venuesById.get(it.venue_id) })).filter(x => x.venue);

  const handleRemove = async (venueId: string) => {
    try {
      await removeItem.mutateAsync({ list_id: list.id, venue_id: venueId });
      toast.success('Lugar quitado');
    } catch {
      toast.error('No se pudo quitar');
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      <BackgroundFX />
      <Navbar favCount={0} onSearchOpen={() => {}} onAddPlace={() => navigate('/agregar-lugar')} />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <button onClick={() => navigate('/listas')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Mis listas
        </button>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{list.cover_emoji ?? '📋'}</span>
          <div>
            <h1 className="font-display text-4xl font-bold">{list.name}</h1>
            {list.description && <p className="text-muted-foreground mt-1">{list.description}</p>}
            <p className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1.5">
              {list.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {list.is_public ? 'Lista pública' : 'Lista privada'} · {items.length} lugares
            </p>
          </div>
        </div>

        {listVenues.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground">Esta lista está vacía. Agregá lugares desde su página.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listVenues.map(({ item, venue }) => (
              <div key={item.id} className="relative">
                <VenueCard venue={venue!} />
                {isOwner && (
                  <button
                    onClick={() => handleRemove(venue!.id)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Quitar de la lista"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
