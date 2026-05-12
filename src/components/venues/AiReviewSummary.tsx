import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AiSummary } from '@/hooks/useAiVenues';

interface Props {
  data: AiSummary | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
  hasReviews: boolean;
}

export default function AiReviewSummary({ data, loading, error, onGenerate, hasReviews }: Props) {
  if (!hasReviews) return null;

  return (
    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-8 w-8 rounded-lg bg-primary/15 inline-flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </span>
        <h3 className="font-display text-lg font-bold text-foreground">Resumen IA</h3>
      </div>

      {!data && !loading && (
        <button
          onClick={onGenerate}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all"
        >
          Generar resumen inteligente
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Analizando reseñas…
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {data && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-sm text-foreground/90 leading-relaxed">{data.summary}</p>
          {data.vibe && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/20 text-xs font-semibold text-foreground">
              Vibe: {data.vibe}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {data.pros?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider font-semibold text-sage mb-1.5">A favor</h4>
                <ul className="space-y-1">
                  {data.pros.map((p, i) => (
                    <li key={i} className="text-xs text-foreground/85 flex items-start gap-1.5">
                      <span className="text-sage mt-0.5">+</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.cons?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider font-semibold text-destructive mb-1.5">A tener en cuenta</h4>
                <ul className="space-y-1">
                  {data.cons.map((c, i) => (
                    <li key={i} className="text-xs text-foreground/85 flex items-start gap-1.5">
                      <span className="text-destructive mt-0.5">−</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}
