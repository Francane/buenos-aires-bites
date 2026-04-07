import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Search, Heart, MapPin, Plus } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  favCount: number;
  onSearchOpen: () => void;
  onAddPlace: () => void;
}

const sections = ['inicio', 'explorar', 'categorias', 'favoritos'] as const;

export default function Navbar({ favCount, onSearchOpen, onAddPlace }: NavbarProps) {
  const { t, locale, setLocale } = useLocale();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('inicio');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLabels: Record<string, string> = {
    inicio: t.nav.home,
    explorar: t.nav.explore,
    categorias: t.nav.categories,
    favoritos: t.nav.favorites,
  };

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);

      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <button onClick={() => scrollTo('inicio')} className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          WeEat
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {sections.map(s => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === s ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {navLabels[s]}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={onSearchOpen} className="p-2 rounded-md text-muted-foreground hover:text-foreground" aria-label={t.nav.search}>
            <Search className="h-5 w-5" />
          </button>
          <button onClick={() => scrollTo('favoritos')} className="relative p-2 rounded-md text-muted-foreground hover:text-foreground" aria-label={t.nav.favorites}>
            <Heart className="h-5 w-5" />
            {favCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold">{favCount}</span>
            )}
          </button>
          <Button size="sm" onClick={onAddPlace} className="hidden sm:flex gap-1">
            <Plus className="h-4 w-4" /> {t.nav.addPlace}
          </Button>
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="px-2 py-1 text-xs font-bold border border-border rounded-md text-muted-foreground hover:text-foreground"
          >
            {t.nav.language}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground" aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <nav className="flex flex-col p-4 gap-1">
            {sections.map(s => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`px-3 py-2 text-sm font-medium rounded-md text-left ${activeSection === s ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              >
                {navLabels[s]}
              </button>
            ))}
            <Button size="sm" onClick={() => { onAddPlace(); setMobileOpen(false); }} className="mt-2 gap-1">
              <Plus className="h-4 w-4" /> {t.nav.addPlace}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
