import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Props {
  venueId: string;
}

export default function UserReviewForm({ venueId }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="rounded-2xl glass border border-border/60 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground">¿Ya visitaste este lugar?</p>
          <p className="text-sm text-muted-foreground">Iniciá sesión para dejar tu reseña.</p>
        </div>
        <Button size="sm" onClick={() => navigate('/auth')} className="gap-1.5">
          <LogIn className="h-4 w-4" /> Ingresar
        </Button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) { toast.error('Elegí una calificación'); return; }
    if (content.trim().length < 10) { toast.error('Contanos un poco más (10+ caracteres)'); return; }
    setSubmitting(true);
    const { data: profile } = await supabase.from('profiles').select('display_name').eq('user_id', user.id).maybeSingle();
    const author = profile?.display_name || user.email?.split('@')[0] || 'Usuario';
    const { error } = await supabase.from('venue_reviews').insert({
      venue_id: venueId,
      user_id: user.id,
      author_name: author,
      content: content.trim(),
      rating,
      platform: 'web',
    });
    setSubmitting(false);
    if (error) {
      toast.error('No se pudo enviar tu reseña');
      return;
    }
    toast.success('¡Gracias por tu reseña!');
    setContent(''); setRating(0);
    qc.invalidateQueries({ queryKey: ['venues'] });
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-card border border-border/60 p-5 space-y-4"
    >
      <div>
        <p className="font-display font-bold text-foreground">Dejá tu reseña</p>
        <p className="text-xs text-muted-foreground">Tu opinión ayuda a otros a decidir.</p>
      </div>

      <div className="flex items-center gap-1" role="radiogroup" aria-label="Calificación">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className="p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <Star
              className={cn(
                'h-7 w-7 transition-colors',
                n <= (hover || rating) ? 'text-gold fill-gold' : 'text-muted-foreground/30',
              )}
            />
          </button>
        ))}
        {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>}
      </div>

      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={3}
        placeholder="¿Qué te pareció? Recomendaciones, platos, ambiente…"
        maxLength={800}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{content.length}/800</span>
        <Button type="submit" disabled={submitting} size="sm">
          {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Publicar reseña
        </Button>
      </div>
    </motion.form>
  );
}
