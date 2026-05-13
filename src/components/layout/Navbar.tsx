import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Search, Heart, MapPin, Plus, Moon, Sun, User as UserIcon, LogIn, BookmarkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '@/i18n/LocaleProvider';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  favCount: number;
  onSearchOpen: () => void;
  onAddPlace: () => void;
}

const sections = ['inicio', 'explorar', 'categorias', 'favoritos'] as const;

export default function Navbar({ favCount, onSearchOpen, onAddPlace }: NavbarProps) {
  const { t, locale, setLocale } = useLocale();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLabels: Record<string, string> = {
    inicio: t.nav.home,
    explorar: t.nav.explore,
    categorias: t.nav.categories,
    favoritos: t.nav.favorites,
  };

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (y / total) * 100 : 0);
      setScrolled(y > 20);

      // Hide on scroll down (after threshold), show on scroll up
      if (y > 120 && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4 || y < 120) setHidden(false);
      lastY = y;

      if (!isHome) return;
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const goToSection = useCallback((id: string) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate(id === 'inicio' ? '/' : `/#${id}`);
      // Defer scroll until home mounts
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      });
      return;
    }
    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isHome, navigate]);

  const goHome = useCallback(() => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setMobileOpen(false);
  }, [isHome, navigate]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[transform,background-color,box-shadow] duration-300 will-change-transform ${scrolled ? 'glass-strong shadow-sm' : 'bg-background/60 backdrop-blur-md'} border-b border-border/50 ${hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'}`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <button onClick={goHome} className="flex items-center gap-2.5 font-display text-xl font-bold text-foreground group" aria-label="WeEat — Home">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative p-1.5 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 group-hover:from-primary/25 group-hover:to-accent/25 transition-colors ring-1 ring-primary/10"
          >
            <span className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <MapPin className="relative h-4 w-4 text-primary" />
          </motion.div>
          <span className="group-hover:text-gradient-animated transition-colors">WeEat</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {sections.map(s => {
            const isActive = isHome && activeSection === s;
            return (
              <button
                key={s}
                onClick={() => goToSection(s)}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {navLabels[s]}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button onClick={onSearchOpen} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" aria-label={t.nav.search}>
            <Search className="h-5 w-5" />
          </button>
          <button onClick={() => goToSection('favoritos')} className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" aria-label={t.nav.favorites}>
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
          {user ? (
            <button
              onClick={() => navigate('/perfil')}
              className="p-0.5 rounded-full ring-1 ring-border hover:ring-primary/50 transition-all"
              aria-label="Mi perfil"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {(user.user_metadata?.display_name || user.email || '?').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Iniciar sesión"
            >
              <LogIn className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Toggle language"
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
              {sections.map(s => {
                const isActive = isHome && activeSection === s;
                return (
                  <button
                    key={s}
                    onClick={() => goToSection(s)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                  >
                    {navLabels[s]}
                  </button>
                );
              })}
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
