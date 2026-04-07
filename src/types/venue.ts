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
  isOpen: boolean;
  coordinates: { lat: number; lng: number };
  tags?: string[];
  reservationInfo?: string;
  reviews?: VenueReview[];
}
