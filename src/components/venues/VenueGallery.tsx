import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VenueGalleryProps {
  images: string[];
  venueName: string;
}

export default function VenueGallery({ images, venueName }: VenueGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex(i => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setActiveIndex(i => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex, close, next, prev]);

  if (!images.length) return null;

  // Asymmetric layout: first image large, rest in a 2-col grid
  const [hero, ...rest] = images;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 auto-rows-[180px] sm:auto-rows-[200px]">
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className={cn(
            'group relative overflow-hidden rounded-2xl bg-muted col-span-1 sm:col-span-2 row-span-2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
          aria-label={`Ver foto 1 de ${venueName}`}
        >
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            src={hero}
            alt={`${venueName} foto principal`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/15 transition-colors" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background/85 backdrop-blur text-xs font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="h-3.5 w-3.5" />
            Expandir
          </span>
        </button>

        {rest.slice(0, 4).map((img, i) => {
          const realIndex = i + 1;
          const isLast = i === 3 && rest.length > 4;
          return (
            <button
              key={realIndex}
              type="button"
              onClick={() => setActiveIndex(realIndex)}
              className={cn(
                'group relative overflow-hidden rounded-2xl bg-muted',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
              aria-label={`Ver foto ${realIndex + 1} de ${venueName}`}
            >
              <motion.img
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                src={img}
                alt={`${venueName} foto ${realIndex + 1}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/15 transition-colors" />
              {isLast && (
                <div className="absolute inset-0 bg-foreground/55 flex items-center justify-center">
                  <span className="text-background font-display font-bold text-xl">
                    +{rest.length - 4}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-foreground/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ${activeIndex + 1} de ${images.length}`}
          >
            <button
              type="button"
              onClick={e => { e.stopPropagation(); close(); }}
              className="absolute top-4 right-4 h-11 w-11 inline-flex items-center justify-center rounded-full bg-background/15 hover:bg-background/25 text-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-2 sm:left-6 h-12 w-12 inline-flex items-center justify-center rounded-full bg-background/15 hover:bg-background/25 text-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              src={images[activeIndex]}
              alt={`${venueName} foto ${activeIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />

            <button
              type="button"
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-2 sm:right-6 h-12 w-12 inline-flex items-center justify-center rounded-full bg-background/15 hover:bg-background/25 text-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-background/15 backdrop-blur text-background text-xs font-semibold">
              {activeIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
