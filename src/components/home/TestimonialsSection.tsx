import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';

const testimonials = [
  {
    id: 1,
    author: 'Valentina R.',
    role: { es: 'Food blogger', en: 'Food blogger' },
    content: {
      es: 'WeEat cambió mi forma de descubrir lugares en Buenos Aires. Ya no me pierdo ningún bodegón escondido.',
      en: 'WeEat changed how I discover places in Buenos Aires. I never miss a hidden gem anymore.',
    },
    rating: 5,
    avatar: 'VR',
  },
  {
    id: 2,
    author: 'Martín C.',
    role: { es: 'Chef y restaurantero', en: 'Chef & restaurateur' },
    content: {
      es: 'La mejor guía gastronómica de la ciudad. Recomendaciones auténticas, sin filtro.',
      en: 'The best gastronomic guide in the city. Authentic recommendations, unfiltered.',
    },
    rating: 5,
    avatar: 'MC',
  },
  {
    id: 3,
    author: 'Sophie L.',
    role: { es: 'Turista (Francia)', en: 'Tourist (France)' },
    content: {
      es: 'Encontré los mejores restaurantes gracias a WeEat. El mapa interactivo es increíble.',
      en: 'I found the best restaurants thanks to WeEat. The interactive map is incredible.',
    },
    rating: 5,
    avatar: 'SL',
  },
  {
    id: 4,
    author: 'Diego M.',
    role: { es: 'Fotógrafo gastronómico', en: 'Food photographer' },
    content: {
      es: 'Lo uso todos los fines de semana para encontrar mi próxima aventura culinaria. Imprescindible.',
      en: 'I use it every weekend to find my next culinary adventure. Essential.',
    },
    rating: 5,
    avatar: 'DM',
  },
];

export default function TestimonialsSection() {
  const { locale } = useLocale();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-muted-foreground mb-4">
            <Quote className="h-4 w-4 text-primary" />
            <span>{locale === 'es' ? 'Testimonios' : 'Testimonials'}</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {locale === 'es' ? 'Lo que dicen nuestros foodies' : 'What our foodies say'}
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <div className="glass-strong rounded-3xl p-8 md:p-12 min-h-[280px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="text-center w-full"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-foreground leading-relaxed font-body italic">
                  "{testimonials[current].content[locale]}"
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {testimonials[current].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{testimonials[current].author}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[current].role[locale]}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 p-2.5 rounded-full glass hover:bg-primary/10 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 p-2.5 rounded-full glass hover:bg-primary/10 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-primary w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
