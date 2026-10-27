import React from 'react';
import { Box, IconButton, SxProps, Theme, Tooltip, Typography } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';

/* ─────────────────────────────────────────────────────────
 * PAGE HEADER
 * Encabezado único para las pantallas: ícono en una ficha, el
 * grupo del menú como "eyebrow", título, conteo y descripción,
 * y las acciones a la derecha. Entra con un fade-up corto.
 * ───────────────────────────────────────────────────────── */

export interface PageHeaderProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** algo chico al lado del título: un conteo, un estado */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  dense?: boolean;
  sx?: SxProps<Theme>;
}

export const IconTile: React.FC<{ children: React.ReactNode; size?: number; tone?: 'neutral' | 'accent' }> = ({
  children,
  size = 40,
  tone = 'neutral',
}) => (
  <Box
    sx={{
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: '10px',
      background: tone === 'accent' ? 'var(--accent-tint)' : 'var(--surface)',
      boxShadow: tone === 'accent' ? '0 0 0 1px rgba(5,161,79,0.22)' : 'var(--shadow-card)',
      color: tone === 'accent' ? 'var(--accent-ink)' : 'var(--ink-2)',
      '& img': { width: size * 0.6, height: size * 0.6, objectFit: 'contain' },
      '& svg': { fontSize: size * 0.5 },
    }}
  >
    {children}
  </Box>
);

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  eyebrow,
  description,
  meta,
  actions,
  onBack,
  backLabel = 'Volver',
  dense,
  sx,
}) => (
  <Box
    data-tour="page-header"
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 2,
      mb: dense ? 2 : 3,
      animation: 'fade-up 420ms var(--ease-out-strong) both',
      ...((sx as object) || {}),
    }}
  >
    {onBack && (
      <Tooltip title={backLabel}>
        <IconButton onClick={onBack} aria-label={backLabel} sx={{ boxShadow: 'var(--shadow-btn)', bgcolor: 'var(--surface)', mr: -0.5 }}>
          <ArrowBackRounded fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
    {icon && <IconTile size={dense ? 36 : 42} tone="accent">{icon}</IconTile>}
    <Box sx={{ minWidth: 0, flex: '1 1 260px' }}>
      {eyebrow && (
        <Typography component="div" sx={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-3)', mb: 0.25, letterSpacing: '-0.005em' }}>
          {eyebrow}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: dense ? 18 : 22,
            fontWeight: 600,
            letterSpacing: '-0.022em',
            lineHeight: 1.2,
            color: 'var(--ink)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>
        {meta}
      </Box>
      {description && (
        <Typography sx={{ mt: 0.5, fontSize: 13, color: 'var(--ink-2)', maxWidth: 720 }}>{description}</Typography>
      )}
    </Box>
    {actions && <Box data-tour="page-actions" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', ml: 'auto' }}>{actions}</Box>}
  </Box>
);

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  hint?: React.ReactNode;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
}

/** Estado vacío (Beautiful UI: Search) — ícono en ficha, título y pista. */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, hint, action, sx }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0.5,
      px: 3,
      py: 6,
      textAlign: 'center',
      animation: 'fade-in 250ms ease-out both',
      ...((sx as object) || {}),
    }}
  >
    <Box
      sx={{
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '8px',
        background: 'var(--inset)',
        boxShadow: 'var(--shadow-hairline)',
        color: 'var(--ink-3)',
        '& svg': { fontSize: 18 },
      }}
    >
      {icon ?? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      )}
    </Box>
    <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{title}</Typography>
    {hint && <Typography sx={{ fontSize: 12.5, color: 'var(--ink-3)', maxWidth: 360 }}>{hint}</Typography>}
    {action && <Box sx={{ mt: 1.5 }}>{action}</Box>}
  </Box>
);

export default PageHeader;
