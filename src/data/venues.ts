// Data now lives in the database. This file re-exports type-aware helpers
// so that consumers can keep using `getNeighborhoods` / `getCuisines` /
// `getAllTags` while passing in the live venues from `useVenues()`.
export { getNeighborhoods, getCuisines, getAllTags, useVenues, useVenue } from '@/hooks/useVenues';
