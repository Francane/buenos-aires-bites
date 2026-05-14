import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const STORAGE_KEY = 'bites-favorites';

function loadLocal(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(loadLocal);
  const migratedRef = useRef(false);

  // When user signs in, load from DB and migrate any local-only favorites once.
  useEffect(() => {
    if (!user) {
      migratedRef.current = false;
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('favorites')
        .select('venue_id')
        .eq('user_id', user.id);
      if (cancelled) return;
      const remote = (data ?? []).map(r => r.venue_id);

      // One-time migration: push localStorage favs into DB
      if (!migratedRef.current) {
        migratedRef.current = true;
        const local = loadLocal();
        const toInsert = local.filter(id => !remote.includes(id));
        if (toInsert.length) {
          await supabase.from('favorites').insert(
            toInsert.map(venue_id => ({ user_id: user.id, venue_id }))
          );
          remote.push(...toInsert);
        }
      }
      setFavorites(remote);
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Persist locally too as cache / anonymous fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    let added = false;
    setFavorites(prev => {
      if (prev.includes(id)) {
        added = false;
        if (user) {
          supabase.from('favorites').delete().eq('user_id', user.id).eq('venue_id', id).then(() => {});
        }
        return prev.filter(f => f !== id);
      }
      added = true;
      if (user) {
        supabase.from('favorites').insert({ user_id: user.id, venue_id: id }).then(() => {});
      }
      return [...prev, id];
    });
    return added;
  }, [user]);

  return { favorites, isFavorite, toggleFavorite };
}
