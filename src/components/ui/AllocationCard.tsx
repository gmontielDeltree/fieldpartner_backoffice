import React, { useEffect, useMemo, useState } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { easing } from '../../themes/tokens';

/* ─────────────────────────────────────────────────────────
 * ALLOCATION CARD (Beautiful UI: InsightCards › Allocation)
 * Número protagonista + barra segmentada + leyenda. Elegir un
 * segmento (en la barra o en la leyenda) cambia el número y el
 * detalle sin mover la card. Lo usamos para repartir hectáreas
 * por cultivo, gastos por rubro, stock por depósito…
 * ───────────────────────────────────────────────────────── */

export interface AllocationSegment {
  key: string;
  label: string;
  value: number;
  color: string;
  /** texto del número cuando el segmento está elegido */
  display?: string;
  detail?: React.ReactNode;
}

export interface AllocationCardProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  segments: AllocationSegment[];
  /** texto del total cuando no hay segmento elegido */
  totalDisplay?: string;
  footer?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const AllocationCard: React.FC<AllocationCardProps> = ({ title, icon, segments, totalDisplay, footer, sx }) => {
  const total = useMemo(() => segments.reduce((acc, s) => acc + (s.value > 0 ? s.value : 0), 0), [segments]);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    if (selected && !segments.some(s => s.key === selected)) setSelected(null);
  }, [segments, selected]);
  const active = segments.find(s => s.key === selected) ?? null;
  const pct = (v: number) => (total > 0 ? (v / total) * 100 : 0);

  return (
    <Box sx={{ borderRadius: '10px', background: 'var(--surface)', boxShadow: 'var(--shadow-card)', p: 1.5, ...((sx as object) || {}) }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>
        {icon}
        {title}
      </Box>
      <Box sx={{ mt: 0.5, fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
        {active ? active.display ?? active.value.toLocaleString() : totalDisplay ?? total.toLocaleString()}
      </Box>

      <Box
        role="group"
        sx={{ mt: 1.5, display: 'flex', gap: '2px', height: 30, p: '2px', overflow: 'hidden', borderRadius: 999, background: 'var(--field)' }}
      >
        {segments.filter(s => s.value > 0).map(s => {
          const on = !active || active.key === s.key;
          return (
            <Box
              key={s.key}
              component="button"
              type="button"
              aria-pressed={active?.key === s.key}
              aria-label={`${s.label}: ${pct(s.value).toFixed(1)}%`}
              onClick={() => setSelected(prev => (prev === s.key ? null : s.key))}
              sx={{
                all: 'unset',
                cursor: 'pointer',
                position: 'relative',
                height: '100%',
                minWidth: 6,
                overflow: 'hidden',
                borderRadius: 999,
                background: s.color,
                transition: `opacity 300ms ${easing.link}, transform 150ms ${easing.outStrong}, width 500ms ${easing.link}`,
                '&:active': { transform: 'scale(0.98)' },
              }}
              style={{
                width: `${pct(s.value)}%`,
                opacity: on ? 1 : 0.5,
                boxShadow: active?.key === s.key ? 'inset 0 0 0 1px rgba(255,255,255,0.22)' : undefined,
              }}
            >
              <Box
                component="span"
                sx={{ position: 'absolute', top: 4, bottom: 4, left: 4, borderRadius: 999, background: 'rgba(255,255,255,0.22)' }}
                style={{
                  width: active?.key === s.key ? 'calc(100% - 8px)' : '0%',
                  opacity: active?.key === s.key ? 1 : 0,
                  transition: `width 500ms ${easing.link}, opacity 500ms ${easing.link}`,
                }}
              />
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
        {segments.map(s => {
          const on = active?.key === s.key;
          return (
            <Box
              key={s.key}
              component="button"
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(prev => (prev === s.key ? null : s.key))}
              sx={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                px: '7px',
                py: '2px',
                borderRadius: 999,
                fontSize: 11.5,
                color: on ? 'var(--ink)' : 'var(--ink-2)',
                background: on ? 'var(--field)' : 'transparent',
                transition: `background-color 150ms ease, color 150ms ease, transform 150ms ${easing.outStrong}`,
                '&:hover': { background: on ? 'var(--field)' : 'var(--hover)', color: 'var(--ink)' },
                '&:active': { transform: 'scale(0.96)' },
              }}
            >
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
              {s.label}
              <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', color: 'var(--ink-3)' }}>
                {pct(s.value).toFixed(pct(s.value) < 10 ? 1 : 0)}%
              </Box>
            </Box>
          );
        })}
      </Box>

      {(active?.detail || footer) && (
        <Box
          sx={{
            mt: 1.5,
            minHeight: 44,
            borderRadius: '8px',
            background: 'var(--inset)',
            boxShadow: 'var(--shadow-hairline)',
            px: 1.25,
            py: 1,
            fontSize: 11.5,
            color: 'var(--ink-3)',
            lineHeight: 1.6,
          }}
        >
          {active?.detail ?? footer}
        </Box>
      )}
    </Box>
  );
};

export default AllocationCard;
