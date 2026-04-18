import { motion } from 'framer-motion';
import { Star, MessageCircle } from 'lucide-react';
import type { VenueReview } from '@/types/venue';
import { cn } from '@/lib/utils';

interface VenueReviewsProps {
  reviews: VenueReview[];
  title: string;
}

const PLATFORM_STYLES: Record<VenueReview['platform'], { label: string; classes: string }> = {
  tiktok: { label: 'TikTok', classes: 'bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400' },
  google: { label: 'Google', classes: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400' },
  web: { label: 'Web', classes: 'bg-muted text-muted-foreground border-border' },
};

const AVATAR_PALETTE = [
  'bg-primary/15 text-primary',
  'bg-gold/20 text-gold-foreground dark:text-gold',
  'bg-sage/20 text-sage',
  'bg-accent/20 text-accent-foreground',
  'bg-foreground/10 text-foreground',
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < rating ? 'text-gold fill-gold' : 'text-muted-foreground/25',
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

export default function VenueReviews({ reviews, title }: VenueReviewsProps) {
  if (!reviews.length) return null;

  const avgRating =
    Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <section>
      <header className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/20">
          <Star className="h-4 w-4 text-gold fill-gold" aria-hidden />
          <span className="font-display font-bold text-foreground">{avgRating}</span>
          <span className="text-xs text-muted-foreground">promedio</span>
        </div>
      </header>

      <ul className="space-y-3">
        {reviews.map((r, i) => {
          const palette = AVATAR_PALETTE[hashString(r.author) % AVATAR_PALETTE.length];
          const platform = PLATFORM_STYLES[r.platform];
          return (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/60 hover:border-border transition-colors"
            >
              <div
                className={cn(
                  'h-11 w-11 flex-shrink-0 rounded-full inline-flex items-center justify-center font-display font-bold text-sm',
                  palette,
                )}
                aria-hidden
              >
                {getInitials(r.author)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">{r.author}</span>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border',
                        platform.classes,
                      )}
                    >
                      {platform.label}
                    </span>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mt-2">{r.content}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
