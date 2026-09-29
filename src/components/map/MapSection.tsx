import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

const markerTone = (cuisine: string) => {
  const c = cuisine.toLowerCase();
  if (c.includes('parrilla')) return 'grill';
  if (c.includes('pizza')) return 'pizza';
  if (c.includes('café') || c.includes('cafe') || c.includes('aire libre')) return 'sage';
  if (c.includes('sushi') || c.includes('nikkei')) return 'blue';
  return 'other';
};
function createIcon(cuisine: string) {
  return L.divIcon({
    className: 'bites-map-marker',
    html: `<span class="bites-map-pin bites-map-pin--${markerTone(cuisine)}"><svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 3v7a4 4 0 0 0 4 4h1v7M8 3v8M12 3v8M20 3v18M16 3v7a4 4 0 0 0 4 4"/></svg></span>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -17],
  });
}
function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, 15, { duration: 1 }); }, [center, map]);
  return null;
}
interface MapSectionProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
  focusVenueId?: string | null;
}
export default function MapSection({ venues, onSelectVenue, focusVenueId }: MapSectionProps) {
  const { t } = useLocale();
  const center = useMemo<[number, number]>(() => {
    const v = focusVenueId ? venues.find(v => v.id === focusVenueId) : undefined;
    return v ? [v.coordinates.lat, v.coordinates.lng] : [-34.6037, -58.3816];
  }, [focusVenueId, venues]);
  const focusCenter = useMemo<[number, number] | null>(() => {
    const v = focusVenueId ? venues.find(v => v.id === focusVenueId) : undefined;
    return v ? [v.coordinates.lat, v.coordinates.lng] : null;
  }, [focusVenueId, venues]);
  return (
    <section id="explorar" className="py-12 md:py-20 bg-card border-y border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="text-xs font-bold uppercase text-wine mb-2">Buenos Aires / Mapa</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mb-2">{t.map.title}</h2>
        <p className="text-muted-foreground mb-7">{t.map.subtitle}</p>
        <div className="rounded-md overflow-hidden border border-border h-[420px] md:h-[520px]">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater center={focusCenter} />
            {venues.map(venue => <Marker key={venue.id} position={[venue.coordinates.lat, venue.coordinates.lng]} icon={createIcon(venue.cuisine)}>
              <Popup>
                <div className="bites-map-preview">
                  <img src={venue.imageUrl} alt="" loading="lazy" />
                  <div><p className="bites-map-preview-meta">{venue.cuisine} / {venue.neighborhood}</p><strong>{venue.name}</strong><p>{venue.description}</p>
                    <Button variant="link" className="!p-0 !h-7" onClick={() => onSelectVenue(venue)}>{t.map.seeDetail} <ArrowUpRight className="h-3 w-3" /></Button>
                  </div>
                </div>
              </Popup>
            </Marker>)}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
