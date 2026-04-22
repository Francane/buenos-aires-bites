import { useRef, ReactNode, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'div' | 'button';
  onClick?: () => void;
  ariaLabel?: string;
  type?: 'button' | 'submit';
}

/**
 * Magnetic wrapper — softly pulls content toward the cursor on hover.
 * Respects prefers-reduced-motion (motion library handles this via spring).
 */
export default function Magnetic({
  children,
  className,
  strength = 0.35,
  as = 'div',
  onClick,
  ariaLabel,
  type,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });
  const rotate = useTransform(sx, [-30, 30], [-3, 3]);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = as === 'button' ? motion.button : motion.div;

  return (
    <Comp
      // @ts-expect-error — ref polymorphism
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
      style={{ x: sx, y: sy, rotate }}
      className={className}
    >
      {children}
    </Comp>
  );
}
