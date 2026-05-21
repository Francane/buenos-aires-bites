import { motion } from 'framer-motion';

interface BitesLogoProps {
  className?: string;
  showWordmark?: boolean;
  animated?: boolean;
}

/**
 * Bites wordmark with a "bite" notch chomped out of the B.
 * Pure SVG using currentColor so it inherits text color via Tailwind.
 */
export default function BitesLogo({ className = 'h-7', showWordmark = true, animated = true }: BitesLogoProps) {
  const Wrapper: any = animated ? motion.svg : 'svg';
  const wrapperProps = animated
    ? {
        whileHover: { scale: 1.03 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      viewBox={showWordmark ? '0 0 220 64' : '0 0 64 64'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bites"
      role="img"
    >
      <defs>
        {/* Mask carves a circular "bite" out of the B */}
        <mask id="bites-bite-mask">
          <rect width="100%" height="100%" fill="white" />
          {/* The bite — top-right of the B glyph */}
          <circle cx="46" cy="14" r="11" fill="black" />
          {/* Small tooth marks for extra character */}
          <circle cx="40" cy="6" r="2.2" fill="black" />
          <circle cx="52" cy="9" r="1.6" fill="black" />
        </mask>
      </defs>

      {/* Logomark: stylized B inside a soft squircle, with bite notch */}
      <g mask="url(#bites-bite-mask)">
        <rect x="2" y="2" width="60" height="60" rx="16" fill="currentColor" opacity="0.12" />
        <text
          x="32"
          y="48"
          textAnchor="middle"
          fontFamily="'Archivo Black', system-ui, sans-serif"
          fontSize="48"
          fontWeight="900"
          fill="currentColor"
          letterSpacing="-2"
        >
          B
        </text>
      </g>

      {showWordmark && (
        <text
          x="76"
          y="44"
          fontFamily="'Archivo Black', system-ui, sans-serif"
          fontSize="34"
          fontWeight="900"
          fill="currentColor"
          letterSpacing="-1.2"
        >
          ites
        </text>
      )}
    </Wrapper>
  );
}
