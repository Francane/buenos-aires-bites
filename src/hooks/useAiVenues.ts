import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Venue } from '@/types/venue';

export type AiMatch = { id: string; reason: string };
export type AiSummary = { summary: string; pros: string[]; cons: string[]; vibe: string };
export type AiRecommendation = { id: string; reason: string };

async function invoke<T>(action: string, payload: unknown): Promise<T> {
  const { data, error } = await supabase.functions.invoke('ai-venues', {
    body: { action, payload },
  });
  if (error) throw error;
  if ((data as any)?.error === 'rate_limited') throw new Error('Demasiadas búsquedas, esperá un momento.');
  if ((data as any)?.error === 'credits_exhausted') throw new Error('Créditos de IA agotados. Agregá más en Settings.');
  return data as T;
}

export function useAiSemanticSearch() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<AiMatch[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, venues: Venue[]) => {
    if (!query.trim()) {
      setMatches(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await invoke<{ matches: AiMatch[] }>('semantic-search', { query, venues });
      setMatches(data.matches ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Error en la búsqueda IA');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setMatches(null); setError(null); }, []);

  return { search, matches, loading, error, reset };
}

export function useAiReviewSummary(venueName: string, reviews: { author: string; content: string; rating: number }[] | undefined, enabled: boolean) {
  const [data, setData] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!reviews || reviews.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<AiSummary>('summarize-reviews', { venueName, reviews });
      setData(result);
    } catch (e: any) {
      setError(e.message ?? 'No se pudo generar el resumen');
    } finally {
      setLoading(false);
    }
  }, [venueName, reviews]);

  return { data, loading, error, generate, canGenerate: enabled && !!reviews?.length };
}

export function useAiRecommendations() {
  const [recs, setRecs] = useState<AiRecommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecs = useCallback(async (favorites: Venue[], candidates: Venue[]) => {
    if (!favorites.length || !candidates.length) {
      setRecs([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await invoke<{ recommendations: AiRecommendation[] }>('recommend', { favorites, candidates });
      setRecs(data.recommendations ?? []);
    } catch (e: any) {
      setError(e.message ?? 'No se pudieron generar recomendaciones');
      setRecs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { recs, loading, error, fetchRecs };
}
