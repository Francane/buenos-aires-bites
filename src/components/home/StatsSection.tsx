import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Utensils, Star, Heart } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useVenues } from '@/hooks/useVenues';

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

export default function StatsSection() {
  const { locale } = useLocale();
  const { data: venues = [], isLoading } = useVenues();
  const neighborhoods = [...new Set(venues.map(v => v.neighborhood))].length;
  const totalReviews = venues.reduce((acc, v) => acc + v.reviewCount, 0);
  const avgRating = venues.length ? +(venues.reduce((acc, v) => acc + v.rating, 0) / venues.length).toFixed(1) : 0;

  const stats = [
    { icon: Utensils, value: venues.length, label: locale === 'es' ? 'Lugares' : 'Venues', suffix: '+' },
    { icon: MapPin, value: neighborhoods, label: locale === 'es' ? 'Barrios' : 'Neighborhoods', suffix: '' },
    { icon: Star, value: avgRating, label: locale === 'es' ? 'Rating promedio' : 'Avg rating', suffix: '', isDecimal: true },
    { icon: Heart, value: totalReviews, label: locale === 'es' ? 'Reseñas' : 'Reviews', suffix: '+' },
  ];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={i * 0.1} loading={isLoading} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, delay, loading }: { stat: { icon: typeof MapPin; value: number; label: string; suffix: string; isDecimal?: boolean }; delay: number; loading: boolean }) {
  const { count, ref } = useCountUp(stat.isDecimal ? Math.floor(stat.value * 10) : stat.value);
  const display = loading ? '—' : stat.isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group relative glass-strong rounded-2xl p-6 text-center cursor-default sheen-on-hover overflow-hidden"
    >
      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.12), transparent 60%)' }}
      />
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 mb-4 ring-1 ring-primary/10"
      >
        <stat.icon className="h-6 w-6 text-primary" />
      </motion.div>
      <p className="relative text-3xl md:text-4xl font-display font-bold text-foreground tabular-nums">
        {display}{stat.suffix}
      </p>
      <p className="relative text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
    </motion.div>
  );
}
