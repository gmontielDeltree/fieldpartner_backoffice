import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

/* ─────────────────────────────────────────────────────────
 * PILLS (Beautiful UI: ValuePill, StatusPill, EntityChip)
 *  ValuePill  — un valor suelto (fecha, nombre, cantidad) dentro
 *               de un texto o una celda. Sin punto, sin estado.
 *  StatusPill — estado de un registro con el color "eléctrico"
 *               del FilterTable (pendiente / en curso / hecho…).
 *  EntityChip — referencia a una entidad (contratista, campo,
 *               insumo) con monograma de color.
 * ───────────────────────────────────────────────────────── */

export type Tone = 'neutral' | 'green' | 'orange' | 'red' | 'accent' | 'blue';

const TONES: Record<Tone, { bg: string; fg: string; ring: string }> = {
  neutral: { bg: 'var(--field)', fg: 'var(--ink-2)', ring: 'var(--shadow-hairline)' },
  green: { bg: 'var(--green-tint)', fg: 'var(--green)', ring: '0 0 0 1px rgba(25, 154, 77, 0.28)' },
  orange: { bg: 'var(--orange-tint)', fg: 'var(--orange)', ring: '0 0 0 1px rgba(239, 114, 13, 0.28)' },
  red: { bg: 'var(--red-tint)', fg: 'var(--red)', ring: '0 0 0 1px rgba(227, 71, 76, 0.28)' },
  accent: { bg: 'var(--accent-tint)', fg: 'var(--accent-ink)', ring: '0 0 0 1px rgba(5, 161, 79, 0.28)' },
  blue: { bg: 'var(--blue-tint)', fg: '#0070dd', ring: '0 0 0 1px rgba(2, 133, 255, 0.24)' },
};

export interface ValuePillProps {
  children: React.ReactNode;
  tone?: Tone;
  mono?: boolean;
  sx?: SxProps<Theme>;
}

export const ValuePill: React.FC<ValuePillProps> = ({ children, tone = 'neutral', mono, sx }) => {
  const t = TONES[tone];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        height: 20,
        px: '7px',
        borderRadius: 999,
        verticalAlign: 'middle',
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
        fontFamily: mono ? 'var(--font-mono)' : undefined,
        background: t.bg,
        color: t.fg,
        boxShadow: t.ring,
        ...((sx as object) || {}),
      }}
    >
      {children}
    </Box>
  );
};

/* Colores base de los estados; fondo y borde salen de mezclas con la
 * superficie, igual que .filter-status-* en Beautiful UI. */
const STATUS_BASE = {
  todo: '#f09a2e',
  progress: '#16a6c7',
  done: '#26a878',
  error: '#e3474c',
  neutral: '#9a9da3',
  accent: '#05a14f',
} as const;

export type StatusKind = keyof typeof STATUS_BASE;

export interface StatusPillProps {
  status: StatusKind;
  children: React.ReactNode;
  dot?: boolean;
  size?: 'sm' | 'md';
  sx?: SxProps<Theme>;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, children, dot = false, size = 'md', sx }) => {
  const base = STATUS_BASE[status] ?? STATUS_BASE.neutral;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
        height: size === 'sm' ? 20 : 23,
        px: size === 'sm' ? '6px' : '7px',
        border: '1px solid',
        borderRadius: size === 'sm' ? '6px' : '8px',
        whiteSpace: 'nowrap',
        fontSize: size === 'sm' ? 11.5 : 12.5,
        fontWeight: 500,
        lineHeight: 1,
        color: `color-mix(in srgb, ${base} 78%, var(--ink))`,
        background: `color-mix(in srgb, ${base} 16%, var(--surface))`,
        borderColor: `color-mix(in srgb, ${base} 30%, var(--surface))`,
        ...((sx as object) || {}),
      }}
    >
      {dot && <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', background: base }} />}
      {children}
    </Box>
  );
};

/* Paleta de monogramas: tonos cálidos y de campo, legibles con texto blanco. */
const MONO_COLORS = ['#e08a3c', '#2f9e6b', '#3d8bd9', '#b5679a', '#c9a227', '#6c7ae0', '#d1605e', '#3aa5a5'];

export function monogramColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return MONO_COLORS[h % MONO_COLORS.length];
}

export interface MonogramProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  square?: boolean;
  sx?: SxProps<Theme>;
}

export const Monogram: React.FC<MonogramProps> = ({ children, color = '#e08a3c', size = 16, square, sx }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: square ? `${Math.round(size * 0.28)}px` : '50%',
      background: color,
      color: '#fff',
      fontSize: Math.max(9, Math.round(size * 0.55)),
      fontWeight: 600,
      lineHeight: 1,
      textTransform: 'uppercase',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
      ...((sx as object) || {}),
    }}
  >
    {children}
  </Box>
);

export interface EntityChipProps {
  name: string;
  color?: string;
  monogram?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const EntityChip: React.FC<EntityChipProps> = ({ name, color, monogram, sx }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      maxWidth: '100%',
      py: '1px',
      pl: '3px',
      pr: '7px',
      borderRadius: 999,
      verticalAlign: 'middle',
      background: 'var(--field)',
      boxShadow: 'var(--shadow-hairline)',
      ...((sx as object) || {}),
    }}
  >
    <Monogram color={color ?? monogramColor(name)}>{monogram ?? name.trim().charAt(0)}</Monogram>
    <Box component="span" sx={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {name}
    </Box>
  </Box>
);

/** Tecla — para atajos como ⌘K o ⏎ */
export const Kbd: React.FC<{ children: React.ReactNode; sx?: SxProps<Theme> }> = ({ children, sx }) => (
  <Box
    component="kbd"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 18,
      height: 18,
      px: '4px',
      borderRadius: '5px',
      background: 'var(--surface)',
      boxShadow: 'var(--shadow-btn)',
      color: 'var(--ink-3)',
      fontFamily: 'var(--font-sans)',
      fontSize: 10.5,
      fontWeight: 500,
      lineHeight: 1,
      ...((sx as object) || {}),
    }}
  >
    {children}
  </Box>
);
