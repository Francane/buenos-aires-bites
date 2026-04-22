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
      {/* Soft animated mesh */}
      <div
        ref={ref}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-[0.28]"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, hsl(var(--primary) / 0.20) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, hsl(var(--wine) / 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 70%, hsl(var(--sage) / 0.10) 0%, transparent 40%)
          `,
          animation: 'bg-drift 25s ease-in-out infinite',
        }}
      />

      {/* Floating color orbs (blurred) */}
      <div
        className="absolute top-[10%] left-[8%] w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.55), transparent 70%)',
          animation: 'orb-float-1 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[40%] right-[5%] w-[380px] h-[380px] rounded-full blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.55), transparent 70%)',
          animation: 'orb-float-2 22s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[5%] left-[35%] w-[460px] h-[460px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--wine) / 0.55), transparent 70%)',
          animation: 'orb-float-3 26s ease-in-out infinite',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
    </div>
  );
}
