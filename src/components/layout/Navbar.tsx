import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Search, Heart, MapPin, Plus, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/i18n/LocaleProvider';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  favCount: number;
  onSearchOpen: () => void;
  onAddPlace: () => void;
}

const sections = ['inicio', 'explorar', 'categorias', 'favoritos'] as const;

export default function Navbar({ favCount, onSearchOpen, onAddPlace }: NavbarProps) {
  const { t, locale, setLocale } = useLocale();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
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
      setScrolled(window.scrollY > 20);

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-sm' : 'bg-background/60 backdrop-blur-md'} border-b border-border/50`}>
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <button onClick={() => scrollTo('inicio')} className="flex items-center gap-2.5 font-display text-xl font-bold text-foreground group">
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          WeEat
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {sections.map(s => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === s ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {navLabels[s]}
              {activeSection === s && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button onClick={onSearchOpen} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" aria-label={t.nav.search}>
            <Search className="h-5 w-5" />
          </button>
          <button onClick={() => scrollTo('favoritos')} className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" aria-label={t.nav.favorites}>
            <Heart className="h-5 w-5" />
            <AnimatePresence>
              {favCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold"
                >
                  {favCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <motion.button
            whileTap={{ rotate: 180 }}
            onClick={toggleDark}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <Button size="sm" onClick={onAddPlace} className="hidden sm:flex gap-1 rounded-lg shine">
            <Plus className="h-4 w-4" /> {t.nav.addPlace}
          </Button>
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg glass text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.nav.language}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground" aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/50 overflow-hidden glass"
          >
            <nav className="flex flex-col p-4 gap-1">
              {sections.map(s => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${activeSection === s ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                >
                  {navLabels[s]}
                </button>
              ))}
              <Button size="sm" onClick={() => { onAddPlace(); setMobileOpen(false); }} className="mt-2 gap-1">
                <Plus className="h-4 w-4" /> {t.nav.addPlace}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
