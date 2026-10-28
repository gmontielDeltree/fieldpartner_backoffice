import React, { useState } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { easing } from '../../themes/tokens';

/* ─────────────────────────────────────────────────────────
 * TASK ROWS (Beautiful UI)
 * Filas-cápsula con un indicador de estado a la izquierda
 * (check verde, anillo girando, cruz roja o un número), el
 * texto, un monto y una pill. Al tocarlas se despliega el
 * detalle con la misma gramática que "Chain of Thought".
 *   capsules — cada fila es una cápsula flotante
 *   list     — una sola card con filas separadas por líneas
 * ───────────────────────────────────────────────────────── */

export type TaskBadge = 'done' | 'running' | 'pending' | 'failed';

export interface TaskDetail {
  label: React.ReactNode;
  meta?: React.ReactNode;
}

export interface TaskRowItem {
  key: string;
  label: React.ReactNode;
  badge?: TaskBadge | React.ReactNode;
  /** número o letra dentro del anillo (running / pending) */
  step?: React.ReactNode;
  amount?: React.ReactNode;
  pill?: React.ReactNode;
  details?: TaskDetail[] | React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

const CheckIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const XIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const SpinnerRing: React.FC<{ active?: boolean; children?: React.ReactNode; size?: number }> = ({ active, children, size = 24 }) => {
  const stroke = 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <Box component="span" sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0, animation: active ? 'spin 1.1s linear infinite' : undefined }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-strong)" strokeWidth={stroke} />
        {active && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * 0.28} ${c * 0.72}`}
          />
        )}
      </svg>
      <Box component="span" sx={{ position: 'relative', fontSize: 10.5, fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
        {children}
      </Box>
    </Box>
  );
};

export const BadgeDot: React.FC<{ tone: 'green' | 'red'; children: React.ReactNode }> = ({ tone, children }) => (
  <Box
    component="span"
    sx={{
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      borderRadius: '50%',
      color: '#fff',
      background: tone === 'red' ? 'var(--red)' : 'var(--green)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
      animation: `pop-in 300ms ${easing.outStrong} both`,
    }}
  >
    {children}
  </Box>
);

function renderBadge(badge: TaskRowItem['badge'], step: React.ReactNode) {
  if (badge === 'done') return <BadgeDot tone="green">{CheckIcon}</BadgeDot>;
  if (badge === 'failed') return <BadgeDot tone="red">{XIcon}</BadgeDot>;
  if (badge === 'running') return <SpinnerRing active>{step}</SpinnerRing>;
  if (badge === 'pending' || badge === undefined) return <SpinnerRing>{step}</SpinnerRing>;
  return badge;
}

export interface TaskRowsProps {
  rows: TaskRowItem[];
  variant?: 'capsules' | 'list';
  defaultOpen?: string | null;
  sx?: SxProps<Theme>;
}

export const TaskRows: React.FC<TaskRowsProps> = ({ rows, variant = 'capsules', defaultOpen = null, sx }) => {
  const [open, setOpen] = useState<Record<string, boolean>>(defaultOpen ? { [defaultOpen]: true } : {});
  const list = variant === 'list';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: list ? 0 : 1,
        ...(list ? { overflow: 'hidden', borderRadius: '10px', background: 'var(--surface)', boxShadow: 'var(--shadow-card)' } : {}),
        ...((sx as object) || {}),
      }}
    >
      {rows.map((row, i) => {
        const isOpen = !!open[row.key];
        const hasDetails = Array.isArray(row.details) ? row.details.length > 0 : !!row.details;
        return (
          <Box
            key={row.key}
            sx={{
              overflow: 'hidden',
              transition: 'border-radius 300ms ease, background-color 300ms ease',
              '&:hover': { background: 'var(--inset)' },
              ...(list
                ? { borderBottom: '1px solid var(--line)', '&:last-of-type': { borderBottom: 0 } }
                : { background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }),
            }}
            style={{
              borderRadius: list ? 0 : isOpen ? 14 : 22,
              animation: `fade-up 450ms ${easing.outStrong} ${Math.min(i, 8) * 60}ms both`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="button"
                type="button"
                aria-expanded={hasDetails ? isOpen : undefined}
                onClick={() => {
                  if (hasDetails) setOpen(prev => ({ ...prev, [row.key]: !isOpen }));
                  row.onClick?.();
                }}
                sx={{
                  all: 'unset',
                  cursor: hasDetails || row.onClick ? 'pointer' : 'default',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flex: 1,
                  minWidth: 0,
                  alignItems: 'center',
                  gap: 1.25,
                  height: 44,
                  px: 1.25,
                  '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: -2, borderRadius: 'inherit' },
                }}
              >
                <Box component="span" sx={{ display: 'flex', width: 24, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
                  {renderBadge(row.badge, row.step)}
                </Box>
                <Box component="span" sx={{ minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                  {row.label}
                </Box>
                {row.amount != null && (
                  <Box component="span" sx={{ flexShrink: 0, fontSize: 12.5, color: 'var(--ink-2)', fontVariantNumeric: 'tabular-nums' }}>
                    {row.amount}
                  </Box>
                )}
                {row.pill}
                {hasDetails && (
                  <Box component="span" aria-hidden sx={{ ml: -0.5, display: 'flex', width: 24, height: 24, flexShrink: 0, alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: 'transform 300ms ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </Box>
                )}
              </Box>
              {row.actions && <Box sx={{ display: 'flex', alignItems: 'center', pr: 0.75 }}>{row.actions}</Box>}
            </Box>

            {hasDetails && (
              <Box
                sx={{ display: 'grid', transition: `grid-template-rows 300ms ${easing.outStrong}, opacity 300ms ${easing.outStrong}` }}
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
              >
                <Box sx={{ overflow: 'hidden' }}>
                  {Array.isArray(row.details) ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 1.25, px: 1.25, mb: 1.25 }}>
                      <Box component="span" aria-hidden sx={{ mx: 'auto', height: '100%', width: '1px', background: 'var(--line)' }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, py: 0.25 }}>
                        {(row.details as TaskDetail[]).map((d, k) => (
                          <Box key={k} sx={{ display: 'flex', alignItems: 'baseline', gap: 1, fontSize: 12.5 }}>
                            <Box component="span" sx={{ flex: 1, minWidth: 0, color: 'var(--ink-2)' }}>{d.label}</Box>
                            {d.meta != null && (
                              <Box component="span" sx={{ flexShrink: 0, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>{d.meta}</Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ px: 1.25, pb: 1.25 }}>{row.details}</Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default TaskRows;
