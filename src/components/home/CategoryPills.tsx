import { motion } from 'framer-motion';
import { Flame, Coffee, Pizza, Wine, IceCream, UtensilsCrossed, Beef, Globe } from 'lucide-react';
import { getCuisines } from '@/data/venues';
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
  const cuisines = getCuisines();

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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCuisine(cuisine)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong text-sm font-medium text-foreground hover:text-primary hover:border-primary/30 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {cuisine}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
