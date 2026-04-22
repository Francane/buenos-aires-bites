import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'weeat-favorites';

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  // Returns true when the venue was added, false when it was removed.
  const toggleFavorite = useCallback((id: string) => {
    let added = false;
    setFavorites(prev => {
      if (prev.includes(id)) {
        added = false;
        return prev.filter(f => f !== id);
      }
      added = true;
      return [...prev, id];
    });
    return added;
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
