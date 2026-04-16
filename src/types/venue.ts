export interface VenueReview {
  id: string;
  author: string;
  content: string;
  platform: 'tiktok' | 'google' | 'web';
  rating: number;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  hours: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  images?: string[];
  isOpen: boolean;
  coordinates: { lat: number; lng: number };
  tags?: string[];
  reservationInfo?: string;
  reviews?: VenueReview[];
  priceRange?: 1 | 2 | 3 | 4;
  featured?: boolean;
}
