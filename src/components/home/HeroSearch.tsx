import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/i18n/LocaleProvider';
import { getNeighborhoods, getCuisines } from '@/data/venues';

interface HeroSearchProps {
  onSearch: (query: string, neighborhood: string, cuisine: string) => void;
}

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [cuisine, setCuisine] = useState('');
  const neighborhoods = getNeighborhoods();
  const cuisines = getCuisines();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, neighborhood, cuisine);
    document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-3 glass-strong rounded-2xl p-5 max-w-4xl mx-auto"
        >
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/80 border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>
          <select
            value={neighborhood}
            onChange={e => setNeighborhood(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-background/80 border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">{t.search.allNeighborhoods}</option>
            {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select
            value={cuisine}
            onChange={e => setCuisine(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-background/80 border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">{t.search.allCategories}</option>
            {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5 shine"
          >
            {t.search.button}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
