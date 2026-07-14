import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props { venueId: string }

interface CheckInRow {
  id: string;
  user_id: string;
  comment: string | null;
  visited_at: string;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d} d`;
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

export default function CheckInsFeed({ venueId }: Props) {
  const { data } = useQuery({
    queryKey: ['venue-checkins', venueId],
    queryFn: async () => {
      const { data: checkIns } = await supabase
        .from('check_ins')
        .select('id, user_id, comment, visited_at')
        .eq('venue_id', venueId)
        .order('visited_at', { ascending: false })
        .limit(8);
      const ids = [...new Set((checkIns ?? []).map(c => c.user_id))];
      let profiles: Record<string, { name: string; avatar: string | null }> = {};
      if (ids.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .in('user_id', ids);
        profiles = Object.fromEntries((profs ?? []).map(p => [p.user_id, { name: p.display_name ?? 'Usuario', avatar: p.avatar_url }]));
      }
      return { checkIns: (checkIns ?? []) as CheckInRow[], profiles };
    },
    staleTime: 30_000,
  });

  const list = data?.checkIns ?? [];
  if (!list.length) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" /> Visitas recientes
        <span className="text-sm font-medium text-muted-foreground">({list.length})</span>
      </h2>
      <ul className="space-y-3">
        {list.map((c, i) => {
          const prof = data?.profiles[c.user_id];
          const initials = (prof?.name ?? 'U').slice(0, 2).toUpperCase();
          return (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/60"
            >
              {prof?.avatar ? (
                <img src={prof.avatar} alt="" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm inline-flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground">{prof?.name ?? 'Usuario'}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> estuvo acá · {relativeTime(c.visited_at)}
                  </span>
                </div>
                {c.comment && <p className="text-sm text-foreground/80 mt-1">{c.comment}</p>}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
