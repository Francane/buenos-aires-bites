import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Venue, VenueReview } from '@/types/venue';

type VenueRow = {
  id: string;
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  hours: string;
  cuisine: string;
  rating: number | string;
  review_count: number;
  image_url: string;
  images: string[] | null;
  is_open: boolean;
  lat: number | string;
  lng: number | string;
  tags: string[] | null;
  reservation_info: string | null;
  price_range: number | null;
  featured: boolean;
};

type ReviewRow = {
  id: string;
  venue_id: string;
  author_name: string;
  content: string;
  platform: 'tiktok' | 'google' | 'web';
  rating: number;
};

function rowToVenue(row: VenueRow, reviews: VenueReview[] = []): Venue {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    address: row.address,
    neighborhood: row.neighborhood,
    hours: row.hours,
    cuisine: row.cuisine,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    imageUrl: row.image_url,
    images: row.images ?? [],
    isOpen: row.is_open,
    coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
    tags: row.tags ?? [],
    reservationInfo: row.reservation_info ?? undefined,
    priceRange: (row.price_range as Venue['priceRange']) ?? undefined,
    featured: row.featured,
    reviews,
  };
}

async function fetchVenues(): Promise<Venue[]> {
  const [{ data: venueRows, error: vErr }, { data: reviewRows, error: rErr }] = await Promise.all([
    supabase.from('venues').select('*').eq('status', 'approved').order('featured', { ascending: false }).order('rating', { ascending: false }),
    supabase.from('venue_reviews').select('id, venue_id, author_name, content, platform, rating'),
  ]);

  if (vErr) throw vErr;
  if (rErr) throw rErr;

  const reviewsByVenue = new Map<string, VenueReview[]>();
  for (const r of (reviewRows ?? []) as ReviewRow[]) {
    const arr = reviewsByVenue.get(r.venue_id) ?? [];
    arr.push({ id: r.id, author: r.author_name, content: r.content, platform: r.platform, rating: r.rating });
    reviewsByVenue.set(r.venue_id, arr);
  }

  return (venueRows ?? []).map((row) => rowToVenue(row as VenueRow, reviewsByVenue.get(row.id) ?? []));
}

export function useVenues() {
  return useQuery({ queryKey: ['venues'], queryFn: fetchVenues, staleTime: 1000 * 60 * 5 });
}

export function useVenue(id: string | undefined) {
  const { data: venues, ...rest } = useVenues();
  return { ...rest, data: id ? venues?.find((v) => v.id === id) : undefined };
}

export function getNeighborhoods(venues: Venue[]): string[] {
  return [...new Set(venues.map((v) => v.neighborhood))].filter(Boolean).sort();
}

export function getCuisines(venues: Venue[]): string[] {
  return [...new Set(venues.map((v) => v.cuisine))].filter(Boolean).sort();
}

export function getAllTags(venues: Venue[]): string[] {
  return [...new Set(venues.flatMap((v) => v.tags ?? []))].sort();
}
