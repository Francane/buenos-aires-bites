import { motion } from 'framer-motion';
import { Flame, Coffee, Pizza, Wine, IceCream, UtensilsCrossed, Beef, Globe } from 'lucide-react';
import { getCuisines, useVenues } from '@/data/venues';
import { useLocale } from '@/i18n/LocaleProvider';

interface CategoryPillsProps {
  onSelectCuisine: (cuisine: string) => void;
}

const cuisineIcons: Record<string, typeof Flame> = {
  Parrilla: Beef,
  Pizzería: Pizza,
  Café: Coffee,
  Bar: Wine,
  Heladería: IceCream,
  Bodegón: UtensilsCrossed,
  'Fine dining': Flame,
  Contemporánea: Globe,
  Nikkei: Globe,
  'Asiática fusión': Globe,
  Armenia: Globe,
  Panadería: Coffee,
  Bistró: UtensilsCrossed,
};

export default function CategoryPills({ onSelectCuisine }: CategoryPillsProps) {
  const { locale } = useLocale();
  const { data: venues = [] } = useVenues();
  const cuisines = getCuisines(venues);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {locale === 'es' ? 'Explorá por categoría' : 'Browse by category'}
          </h2>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3">
          {cuisines.map((cuisine, i) => {
            const Icon = cuisineIcons[cuisine] || UtensilsCrossed;
            return (
              <motion.button
                key={cuisine}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => onSelectCuisine(cuisine)}
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong text-sm font-medium text-foreground hover:text-primary-foreground transition-colors overflow-hidden sheen-on-hover"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.span
                  className="relative z-10"
                  whileHover={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.span>
                <span className="relative z-10">{cuisine}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
