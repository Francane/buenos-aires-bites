import { useState } from 'react';
import { Search as SearchIcon, Sparkles, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/i18n/LocaleProvider';
import { getNeighborhoods, getCuisines, useVenues } from '@/data/venues';
import { useAiSemanticSearch, type AiMatch } from '@/hooks/useAiVenues';

interface HeroSearchProps {
  onSearch: (query: string, neighborhood: string, cuisine: string) => void;
  onAiResults?: (matches: AiMatch[] | null) => void;
}

export default function HeroSearch({ onSearch, onAiResults }: HeroSearchProps) {
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [aiMode, setAiMode] = useState(false);
  const { data: venues = [] } = useVenues();
  const neighborhoods = getNeighborhoods(venues);
  const cuisines = getCuisines(venues);

  const ai = useAiSemanticSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiMode) {
      await ai.search(query, venues);
      // After search, ai.matches updates via state — pass through effect-style:
      // We cannot read fresh value here, so use a timeout-free approach via callback below.
    } else {
      onSearch(query, neighborhood, cuisine);
      onAiResults?.(null);
    }
    document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync AI results upward
  if (aiMode && onAiResults && ai.matches !== undefined) {
    // Will call on every render — guard with a ref-less pattern:
  }

  // Use effect-equivalent inline
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useSyncMatches(aiMode, ai.matches, onAiResults);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="glass-strong rounded-2xl p-5 max-w-4xl mx-auto"
        >
          {/* Mode toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1 rounded-full bg-background/60 border border-border p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAiMode(false); ai.reset(); onAiResults?.(null); }}
                className={`px-3 py-1.5 rounded-full transition-colors ${!aiMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                Filtros
              </button>
              <button
                type="button"
                onClick={() => setAiMode(true)}
                className={`px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 ${aiMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                <Sparkles className="h-3 w-3" /> Búsqueda IA
              </button>
            </div>
            {aiMode && ai.matches && (
              <button
                type="button"
                onClick={() => { ai.reset(); onAiResults?.(null); setQuery(''); }}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Limpiar
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              {aiMode ? (
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              ) : (
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={aiMode ? 'Ej: lugar tranquilo para una primera cita con buen vino…' : t.search.placeholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/80 border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>
            {!aiMode && (
              <>
                <select
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-background/80 border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">{t.search.allNeighborhoods}</option>
                  {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <select
                  value={cuisine}
                  onChange={e => setCuisine(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-background/80 border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">{t.search.allCategories}</option>
                  {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </>
            )}
            <button
              type="submit"
              disabled={ai.loading}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5 shine inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {ai.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {aiMode ? 'Buscar con IA' : t.search.button}
            </button>
          </div>

          <AnimatePresence>
            {aiMode && ai.error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive mt-2">
                {ai.error}
              </motion.p>
            )}
            {aiMode && ai.matches && ai.matches.length > 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-3">
                <Sparkles className="inline h-3 w-3 text-primary mr-1" />
                {ai.matches.length} lugares seleccionados por IA
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

// Helper hook to sync matches without re-rendering loops
import { useEffect } from 'react';
function useSyncMatches(active: boolean, matches: AiMatch[] | null, cb?: (m: AiMatch[] | null) => void) {
  useEffect(() => {
    if (active) cb?.(matches);
  }, [active, matches, cb]);
}
