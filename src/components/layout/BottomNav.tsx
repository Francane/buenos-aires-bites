import { Home, Compass, Heart, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '@/i18n/LocaleProvider';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  favCount: number;
  onSearchOpen: () => void;
  activeSection?: string;
}

export default function BottomNav({ favCount, onSearchOpen, activeSection = 'inicio' }: BottomNavProps) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const go = (id: string) => {
    if (!isHome) {
      navigate(id === 'inicio' ? '/' : `/#${id}`);
      requestAnimationFrame(() => setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60));
      return;
    }
    if (id === 'inicio') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const items = [
    { id: 'inicio', label: t.nav.home, icon: Home, onClick: () => go('inicio') },
    { id: 'explorar', label: t.nav.explore, icon: Compass, onClick: () => go('explorar') },
    { id: 'search', label: t.nav.search, icon: Search, onClick: onSearchOpen },
    { id: 'favoritos', label: t.nav.favorites, icon: Heart, onClick: () => go('favoritos'), badge: favCount },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 glass-strong border-t border-border/60"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Bottom navigation"
    >
      <ul className="flex items-stretch justify-around px-2 pt-1.5">
        {items.map(item => {
          const Icon = item.icon;
          const active = isHome && activeSection === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={item.onClick}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative w-full flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl min-h-[52px] transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="relative">
                  <Icon className={cn('h-5 w-5 transition-transform', active && 'scale-110')} />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  ) : null}
                </span>
                <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
