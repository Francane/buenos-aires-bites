import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
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
    <section id="inicio" className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [10, -15, 10], rotate: [0, -8, 4, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 right-[15%] w-12 h-12 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [-8, 12, -8], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-[20%] w-20 h-20 rounded-3xl bg-wine/5 border border-wine/10 backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [5, -10, 5], rotate: [0, 10, -5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 right-[10%] w-14 h-14 rounded-xl bg-sage/10 border border-sage/20 backdrop-blur-sm"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-muted-foreground mb-8"
        >
          <Sparkles className="h-4 w-4 text-accent" />
          <span>{t.hero.subtitle.split('.')[0]}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]"
        >
          {t.hero.title}{' '}
          <span className="relative inline-block min-w-[200px] md:min-w-[320px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                transition={{ duration: 0.5 }}
                className="gradient-text inline-block"
              >
                {words[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <button
            onClick={onExplore}
            className="group relative px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 shine overflow-hidden"
          >
            <span className="relative z-10">{t.hero.cta}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={onFavorites}
            className="px-8 py-3.5 rounded-xl glass font-semibold text-lg text-foreground hover:-translate-y-0.5 transition-all duration-300"
          >
            {t.hero.ctaFav}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <button
            onClick={onExplore}
            className="inline-flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Scroll down"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
