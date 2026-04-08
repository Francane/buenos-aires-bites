import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';

function createIcon(isOpen: boolean) {
  const color = isOpen ? '#4a8c6f' : '#c44f4f';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1 });
  }, [center, map]);
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
    if (focusVenueId) {
      const v = venues.find(v => v.id === focusVenueId);
      if (v) return [v.coordinates.lat, v.coordinates.lng];
    }
    return [-34.6037, -58.3816];
  }, [focusVenueId, venues]);

  const focusCenter = useMemo<[number, number] | null>(() => {
    if (!focusVenueId) return null;
    const v = venues.find(v => v.id === focusVenueId);
    return v ? [v.coordinates.lat, v.coordinates.lng] : null;
  }, [focusVenueId, venues]);

  return (
    <section id="explorar" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">{t.map.title}</h2>
        <p className="text-muted-foreground mb-6">{t.map.subtitle}</p>

        <div className="rounded-xl overflow-hidden border border-border shadow-lg" style={{ height: '500px' }}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={focusCenter} />
            {venues.map(venue => (
              <Marker
                key={venue.id}
                position={[venue.coordinates.lat, venue.coordinates.lng]}
                icon={createIcon(venue.isOpen)}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <p className="font-bold text-sm">{venue.name}</p>
                    <p className="text-xs text-gray-500">{venue.cuisine} · {venue.neighborhood}</p>
                    <button
                      onClick={() => onSelectVenue(venue)}
                      className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                    >
                      {t.map.seeDetail} →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="font-medium">{t.map.legend}:</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-sage" /> {t.map.open}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-destructive" /> {t.map.closed}
          </span>
        </div>
      </div>
    </section>
  );
}
