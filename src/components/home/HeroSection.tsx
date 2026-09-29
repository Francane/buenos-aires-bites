import { ArrowDownRight } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onExplore: () => void;
  onFavorites: () => void;
}

export default function HeroSection({ onExplore, onFavorites }: HeroSectionProps) {
  const { locale, t } = useLocale();
  return (
    <section id="inicio" className="pt-14 pb-4 md:pt-24 md:pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="text-xs font-bold uppercase text-wine mb-5">BITES / BUENOS AIRES</p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-8xl leading-[1.02] max-w-4xl text-foreground">
          {locale === 'es' ? '¿Dónde comemos hoy?' : 'Where are we eating today?'}
        </h1>
        <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground">{t.hero.subtitle}</p>
        <div className="flex items-center gap-5 mt-7">
          <Button onClick={onExplore} variant="link" className="p-0 font-semibold text-foreground hover:text-primary">
            {t.hero.cta} <ArrowDownRight className="h-4 w-4" />
          </Button>
          <Button onClick={onFavorites} variant="link" className="p-0 font-semibold text-muted-foreground hover:text-primary">{t.hero.ctaFav}</Button>
        </div>
      </div>
    </section>
  );
}