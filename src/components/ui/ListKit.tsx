import React from 'react';
import { Box, IconButton, SxProps, Theme } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

/* ─────────────────────────────────────────────────────────
 * PIEZAS DE LISTA (las de GenericListPage de FieldPartner)
 * Contenedor de página, una sola superficie con barra de
 * herramientas arriba (buscador píldora + lo que haga falta a la
 * derecha) y la tabla debajo, sin marco propio.
 * ───────────────────────────────────────────────────────── */

const sxOf = (sx?: SxProps<Theme>) => (sx as object) || {};

/** Entrada escalonada de bloques (fade-up de foundation.css). */
export const enter = (step = 0) => ({
  animation: 'fade-up 460ms var(--ease-out-strong) both',
  animationDelay: `${step * 40}ms`,
});

/** Contenedor de toda pantalla: ancho máximo y aire alrededor. */
export const PageContainer: React.FC<{ children: React.ReactNode; maxWidth?: number | string; sx?: SxProps<Theme> }> = ({
  children,
  maxWidth = 1480,
  sx,
}) => (
  <Box sx={{ width: '100%', maxWidth, mx: 'auto', px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 }, ...sxOf(sx) }}>{children}</Box>
);

/** Superficie de la lista: card blanca con la barra y la tabla adentro. */
export const ListCard: React.FC<{ children: React.ReactNode; sx?: SxProps<Theme> }> = ({ children, sx }) => (
  <Box
    sx={{
      overflow: 'hidden',
      borderRadius: '12px',
      background: 'var(--surface)',
      boxShadow: 'var(--shadow-card)',
      ...enter(1),
      // la tabla adentro pierde su propio marco
      '& .MuiTableContainer-root.MuiPaper-root': {
        borderRadius: 0,
        boxShadow: 'none',
        maxHeight: 'clamp(360px, calc(100vh - 250px), 760px)',
      },
      ...sxOf(sx),
    }}
  >
    {children}
  </Box>
);

/** Barra de herramientas de la lista: buscador a la izquierda, el resto a la derecha. */
export const ListToolbar: React.FC<{ children?: React.ReactNode; aside?: React.ReactNode; sx?: SxProps<Theme> }> = ({ children, aside, sx }) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
      minHeight: 52,
      px: 1.25,
      py: 1,
      borderBottom: '1px solid var(--line)',
      ...sxOf(sx),
    }}
  >
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, minWidth: 0, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}>{children}</Box>
    {aside && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'var(--ink-3)', fontSize: 12.5, ml: 'auto' }}>{aside}</Box>}
  </Box>
);

export interface SearchFieldProps {
  value: string;
  /** recibe el evento del input, como los handleInputChange de los hooks de formulario */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** name del input (los hooks de formulario lo usan como clave) */
  name?: string;
  /** Enter en el buscador */
  onSubmit?: () => void;
  sx?: SxProps<Theme>;
}

/** Buscador píldora de las listas. */
export const SearchField: React.FC<SearchFieldProps> = ({ value, onChange, placeholder = 'Buscar…', name = 'filterText', onSubmit, sx }) => {
  const clear = () => onChange({ target: { name, value: '' } } as React.ChangeEvent<HTMLInputElement>);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: { xs: '100%', sm: 300 },
        height: 34,
        px: 1.25,
        borderRadius: '9px',
        background: 'var(--field)',
        boxShadow: 'var(--shadow-hairline)',
        color: 'var(--ink-3)',
        transition: 'box-shadow 160ms ease, background-color 160ms ease',
        '&:hover': { background: 'var(--hover)' },
        '&:focus-within': { background: 'var(--surface)', boxShadow: '0 0 0 1px var(--accent), 0 0 0 4px rgba(5,161,79,0.14)', color: 'var(--ink-2)' },
        ...sxOf(sx),
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <Box
        component="input"
        name={name}
        value={value}
        autoComplete="off"
        onChange={onChange}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        sx={{ all: 'unset', flex: 1, minWidth: 0, fontSize: 13, color: 'var(--ink)', '&::placeholder': { color: 'var(--ink-3)' } }}
      />
      {value && (
        <IconButton size="small" aria-label="Limpiar" onClick={clear} sx={{ p: '3px', mr: -0.5 }}>
          <CloseRounded sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  );
};

/** "12 / 40" cuando hay un filtro aplicado. */
export const FilteredCount: React.FC<{ shown: number; total: number }> = ({ shown, total }) => (
  <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', mr: 0.5 }}>
    {shown} / {total}
  </Box>
);
