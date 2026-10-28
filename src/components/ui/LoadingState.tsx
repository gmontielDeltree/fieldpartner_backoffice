import React, { useEffect, useState } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

/* ─────────────────────────────────────────────────────────
 * LOADING STATE (Beautiful UI)
 * Loader de grilla de pixeles para trabajos largos:
 *   drive — celdas cuadradas, frente en chevron que avanza
 *   dots  — mismo frente, celdas redondas
 *   orbit — un cometa que da vueltas al perímetro
 * Va con un texto que brilla (Shimmer) y, opcional, el tiempo
 * transcurrido en cifras tabulares. Con movimiento reducido la
 * grilla queda quieta en su estado tenue.
 * ───────────────────────────────────────────────────────── */

const chevron = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3);
  const c = i % 3;
  return (c + Math.abs(r - 1)) * 90;
});

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];
const orbit = Array.from({ length: 9 }, (_, i) => {
  const k = ORBIT_ORDER.indexOf(i);
  return k === -1 ? null : k * 110;
});

const PATTERNS: Record<string, { delays: (number | null)[]; dur: number; round: boolean }> = {
  drive: { delays: chevron, dur: 650, round: false },
  dots: { delays: chevron, dur: 650, round: true },
  orbit: { delays: orbit, dur: 950, round: false },
};

export type PixelGridVariant = 'drive' | 'dots' | 'orbit';

export interface PixelGridProps {
  variant?: PixelGridVariant;
  /** lado de cada celda en px */
  cell?: number;
  color?: string;
}

export const PixelGrid: React.FC<PixelGridProps> = ({ variant = 'drive', cell = 4, color = 'var(--ink)' }) => {
  const { delays, dur, round } = PATTERNS[variant] ?? PATTERNS.drive;
  const gap = Math.max(1, cell * 0.375);
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: 'grid',
        flexShrink: 0,
        gridTemplateColumns: `repeat(3, ${cell}px)`,
        gap: `${gap}px`,
      }}
    >
      {delays.map((delay, index) => (
        <Box
          key={index}
          component="span"
          sx={{
            width: cell,
            height: cell,
            background: color,
            borderRadius: round ? '50%' : `${Math.max(1, cell / 4)}px`,
          }}
          style={{
            opacity: delay === null ? 0.07 : 0.15,
            animation: delay === null ? 'none' : `pixel-on ${dur}ms ease-in-out ${delay}ms infinite`,
          }}
        />
      ))}
    </Box>
  );
};

export interface ShimmerProps {
  children: React.ReactNode;
  speed?: number;
  sx?: SxProps<Theme>;
}

/** Texto que brilla: señal de que algo se está procesando. */
export const Shimmer: React.FC<ShimmerProps> = ({ children, speed = 1.6, sx }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      backgroundImage: 'linear-gradient(90deg, var(--ink-3) 35%, var(--ink) 50%, var(--ink-3) 65%)',
      backgroundSize: '200% 100%',
      animation: `shimmer-text ${speed}s linear infinite`,
      ...((sx as object) || {}),
    }}
  >
    {children}
  </Box>
);

function useElapsed(enabled: boolean) {
  const [ds, setDs] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setDs(d => d + 1), 100);
    return () => clearInterval(id);
  }, [enabled]);
  const total = ds / 10;
  if (total < 60) return `${total.toFixed(1)}s`;
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
}

export interface LoadingStateProps {
  label?: React.ReactNode;
  variant?: PixelGridVariant;
  showElapsed?: boolean;
  cell?: number;
  sx?: SxProps<Theme>;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Cargando',
  variant = 'drive',
  showElapsed = false,
  cell = 4,
  sx,
}) => {
  const elapsed = useElapsed(showElapsed);
  return (
    <Box role="status" aria-live="polite" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, ...((sx as object) || {}) }}>
      <PixelGrid variant={variant} cell={cell} />
      {label && (
        <Shimmer speed={1.4} sx={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>
          {label}
        </Shimmer>
      )}
      {showElapsed && (
        <Box
          component="span"
          sx={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}
        >
          {elapsed}
        </Box>
      )}
    </Box>
  );
};

export default LoadingState;
