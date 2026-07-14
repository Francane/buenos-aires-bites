import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CUISINE_OPTIONS = ['Parrilla', 'Pizzería', 'Café', 'Bodegón', 'Sushi', 'Vegano', 'Bar', 'Heladería', 'Brunch', 'Pastas', 'Ramen', 'Panadería'];
const VIBE_OPTIONS = ['Romántico', 'Con amigos', 'Familiar', 'Trabajo', 'Rápido', 'Fiesta'];
const NEIGHBORHOODS = ['Palermo', 'Recoleta', 'San Telmo', 'Villa Crespo', 'Chacarita', 'Belgrano', 'Colegiales', 'Almagro'];

export default function OnboardingModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [vibes, setVibes] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!cancel && data && !data.onboarding_completed) {
        // small delay so it doesn't jump-scare on login redirects
        setTimeout(() => setOpen(true), 600);
      }
    })();
    return () => { cancel = true; };
  }, [user]);

  const toggle = (list: string[], set: (v: string[]) => void, val: string) =>
    set(list.includes(val) ? list.filter(v => v !== val) : [...list, val]);

  const save = async (skipped: boolean) => {
    if (!user) return;
    setSaving(true);
    await supabase
      .from('profiles')
      .update({
        preferences: { cuisines, vibes, neighborhoods, skipped },
        onboarding_completed: true,
      })
      .eq('user_id', user.id);
    setSaving(false);
    setOpen(false);
    if (!skipped) toast.success('¡Listo! Personalizamos tus recomendaciones.');
  };

  const steps = [
    {
      title: '¿Qué te gusta comer?',
      subtitle: 'Elegí una o varias cocinas favoritas.',
      options: CUISINE_OPTIONS, list: cuisines, set: setCuisines,
    },
    {
      title: '¿Qué buscás cuando salís?',
      subtitle: 'Vibes que más te representan.',
      options: VIBE_OPTIONS, list: vibes, set: setVibes,
    },
    {
      title: '¿Por qué barrios te movés?',
      subtitle: 'Los tendremos en cuenta para sugerirte lugares cerca.',
      options: NEIGHBORHOODS, list: neighborhoods, set: setNeighborhoods,
    },
  ] as const;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-border/60 gap-0">
        <div className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-6 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Personalizá tu experiencia
          </div>
          <div className="flex items-center gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= step ? 'bg-primary' : 'bg-muted')} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground">{current.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{current.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 pt-4">
          <div className="flex flex-wrap gap-2 min-h-[120px]">
            {current.options.map(opt => {
              const active = current.list.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(current.list, current.set, opt)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all',
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-foreground border-border hover:border-primary/50',
                  )}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 pt-6">
            <Button variant="ghost" size="sm" onClick={() => save(true)} disabled={saving}>
              Saltar
            </Button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={() => setStep(step - 1)} disabled={saving}>
                  Volver
                </Button>
              )}
              {!isLast ? (
                <Button size="sm" onClick={() => setStep(step + 1)}>Continuar</Button>
              ) : (
                <Button size="sm" onClick={() => save(false)} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Finalizar
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
