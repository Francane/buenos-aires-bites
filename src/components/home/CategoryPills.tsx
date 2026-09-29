import { ArrowUpRight } from 'lucide-react';
import { getCuisines, useVenues } from '@/data/venues';
import { useLocale } from '@/i18n/LocaleProvider';
import { Button } from '@/components/ui/button';

interface CategoryPillsProps { onSelectCuisine: (cuisine: string) => void; }
export default function CategoryPills({ onSelectCuisine }: CategoryPillsProps) {
  const { locale } = useLocale();
  const { data: venues = [] } = useVenues();
  const cuisines = getCuisines(venues);
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="text-xs font-bold uppercase text-wine mb-2">{locale === 'es' ? 'Explorar / 02' : 'Explore / 02'}</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mb-7">{locale === 'es' ? 'Según el antojo' : 'Follow your craving'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-border">
          {cuisines.map(cuisine => <Button key={cuisine} variant="ghost" onClick={() => onSelectCuisine(cuisine)} className="rounded-none border-r border-b border-border h-20 md:h-24 px-4 md:px-6 !justify-between text-left whitespace-normal text-foreground hover:text-primary hover:bg-card font-display text-lg md:text-2xl">
            <span className="min-w-0 leading-tight">{cuisine}</span><ArrowUpRight className="h-4 w-4 shrink-0" />
          </Button>)}
        </div>
      </div>
    </section>
  );
}
