import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Venue } from '@/types/venue';
import { useLocale } from '@/i18n/LocaleProvider';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
}

function matchVenue(v: Venue, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    v.name.toLowerCase().includes(lower) ||
    v.neighborhood.toLowerCase().includes(lower) ||
    v.cuisine.toLowerCase().includes(lower) ||
    v.description.toLowerCase().includes(lower) ||
    (v.tags?.some(t => t.toLowerCase().includes(lower)) ?? false)
  );
}

export default function SearchModal({ open, onClose, venues, onSelectVenue }: SearchModalProps) {
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setDebouncedQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return venues.filter(v => matchVenue(v, debouncedQuery.trim()));
  }, [venues, debouncedQuery]);

  const handleSelect = useCallback((v: Venue) => {
    onSelectVenue(v);
    onClose();
  }, [onSelectVenue, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-card rounded-xl shadow-2xl z-50 overflow-hidden border border-border"
          >
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="flex-1 bg-transparent text-foreground outline-none text-sm"
              />
              <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!debouncedQuery.trim() && (
                <p className="text-sm text-muted-foreground text-center py-8">{t.search.typeToSearch}</p>
              )}
              {debouncedQuery.trim() && results.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-foreground">{t.search.noResults}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.search.noResultsDesc}</p>
                </div>
              )}
              {results.map(v => (
                <button
                  key={v.id}
                  onClick={() => handleSelect(v)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 text-left transition-colors"
                >
                  <img src={v.imageUrl} alt={v.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.cuisine} · {v.neighborhood}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
