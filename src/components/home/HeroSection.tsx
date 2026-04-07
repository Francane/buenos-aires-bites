import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/i18n/LocaleProvider';

interface HeroSectionProps {
  onExplore: () => void;
  onFavorites: () => void;
}

export default function HeroSection({ onExplore, onFavorites }: HeroSectionProps) {
  const { t } = useLocale();
  const [wordIdx, setWordIdx] = useState(0);
  const words = t.hero.words;

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx(prev => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section id="inicio" className="relative pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
          {t.hero.title}{' '}
          <span className="relative inline-block min-w-[200px] md:min-w-[300px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-primary inline-block"
              >
                {words[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={onExplore}
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            {t.hero.cta}
          </button>
          <button
            onClick={onFavorites}
            className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold text-lg hover:bg-primary/5 transition-colors"
          >
            {t.hero.ctaFav}
          </button>
        </div>
      </div>
    </section>
  );
}
