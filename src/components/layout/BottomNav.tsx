import { Home, Compass, Heart, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '@/i18n/LocaleProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
      requestAnimationFrame(() => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60));
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Navegación inferior">
      <ul className="flex items-stretch justify-around px-1 min-h-16">
        {items.map(item => {
          const Icon = item.icon;
          const active = isHome && activeSection === item.id;
          return <li key={item.id} className="flex-1">
            <Button variant="ghost" onClick={item.onClick} aria-label={item.label} aria-current={active ? 'page' : undefined} className={cn('relative w-full h-16 min-w-12 flex flex-col gap-1 rounded-none text-muted-foreground hover:text-foreground', active && 'text-foreground font-semibold')}>
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-7 bg-primary" aria-hidden="true" />}
              <span className="relative"><Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />{item.badge ? <span className="absolute -top-2 -right-3 text-[10px] font-bold text-primary">{item.badge > 9 ? '9+' : item.badge}</span> : null}</span>
              <span className="text-[10px] leading-none">{item.label}</span>
            </Button>
          </li>;
        })}
      </ul>
    </nav>
  );
}
