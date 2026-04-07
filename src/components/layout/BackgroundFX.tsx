import { useEffect, useRef } from 'react';

export default function BackgroundFX() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && ref.current) {
      ref.current.style.animation = 'none';
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        ref={ref}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, hsl(var(--wine) / 0.08) 0%, transparent 50%)',
          animation: 'bg-drift 25s ease-in-out infinite',
        }}
      />
    </div>
  );
}
