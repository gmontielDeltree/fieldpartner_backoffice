import React, { useMemo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { MenuRounded } from '@mui/icons-material';
import { Kbd } from '../ui/Pills';
import { shell } from '../../themes/tokens';
import { matchNav } from './navigation';

/* ─────────────────────────────────────────────────────────
 * BARRA SUPERIOR (la de FieldPartner)
 * Vive dentro de la ventana de contenido: migas (sección ›
 * pantalla › alta/edición) y el buscador ⌘K. Línea de un pixel
 * abajo, sin sombra: el peso visual queda en el contenido.
 * ───────────────────────────────────────────────────────── */

export interface NavBarProps {
  pathname: string;
  search: string;
  onOpenSearch: () => void;
  onOpenMobileNav?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ pathname, search, onOpenSearch, onOpenMobileNav }) => {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  const crumbs = useMemo(() => {
    if (pathname === '/home') return ['Inicio'];
    const m = matchNav(pathname, search);
    if (!m) return [];
    const raw = [m.group.label, m.item.label, ...(m.detail === 'new' ? ['Nuevo'] : m.detail === 'edit' ? ['Editar'] : [])];
    // "Configuración / Configuración" -> "Configuración"
    return raw.filter((c, i) => c && c !== raw[i - 1]);
  }, [pathname, search]);

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        zIndex: 3,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        height: shell.topbar,
        px: { xs: 1.5, sm: 2 },
        borderBottom: '1px solid var(--line)',
        background: 'var(--surface)',
      }}
    >
      {onOpenMobileNav && (
        <IconButton onClick={onOpenMobileNav} sx={{ display: { xs: 'inline-flex', sm: 'none' }, ml: -0.5 }} aria-label="Menú">
          <MenuRounded />
        </IconButton>
      )}

      {/* migas */}
      <Box component="nav" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, flex: 1 }}>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <React.Fragment key={`${c}-${i}`}>
              {i > 0 && (
                <Box component="span" sx={{ color: 'var(--line-strong)', fontSize: 16, lineHeight: 1, userSelect: 'none' }} aria-hidden>
                  /
                </Box>
              )}
              <Typography
                component="span"
                sx={{
                  fontSize: 13.5,
                  fontWeight: last ? 600 : 500,
                  letterSpacing: '-0.012em',
                  color: last ? 'var(--ink)' : 'var(--ink-3)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: !last ? { xs: 'none', md: 'inline' } : 'inline',
                  animation: last ? 'fade-in 220ms ease-out both' : undefined,
                }}
              >
                {c}
              </Typography>
            </React.Fragment>
          );
        })}
      </Box>

      {/* buscador */}
      <Box
        component="button"
        type="button"
        onClick={onOpenSearch}
        sx={{
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1,
          width: { md: 220, lg: 280 },
          height: 34,
          pl: 1.25,
          pr: 0.75,
          borderRadius: '9px',
          background: 'var(--field)',
          boxShadow: 'var(--shadow-hairline)',
          color: 'var(--ink-3)',
          fontSize: 13,
          transition: 'background-color 140ms ease, box-shadow 140ms ease',
          '&:hover': { background: 'var(--hover)', boxShadow: '0 0 0 1px var(--line-strong)' },
          '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: 2 },
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <Box component="span" sx={{ flex: 1 }}>
          Buscar…
        </Box>
        <Kbd>{isMac ? '⌘K' : 'Ctrl K'}</Kbd>
      </Box>
    </Box>
  );
};

export default NavBar;
