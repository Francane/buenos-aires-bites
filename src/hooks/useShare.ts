import { useCallback } from 'react';
import { toast } from 'sonner';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';

function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function createShareData(venue: Venue, title: string) {
  const slug = createSlug(venue.name);
  const url = `${window.location.origin}/?venue=${slug}`;
  return { title, text: `${venue.name} - ${venue.cuisine}, ${venue.neighborhood}`, url };
}

export function useShare() {
  const { t } = useLocale();

  const share = useCallback(async (venue: Venue) => {
    const data = createShareData(venue, t.share.title);
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(data.url);
      toast.success(t.share.copied);
    }
  }, [t]);

  return { share };
}
