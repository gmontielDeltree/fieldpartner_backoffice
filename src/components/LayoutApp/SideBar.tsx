import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Popover, Tooltip, Typography } from '@mui/material';
import { HomeOutlined, SearchRounded } from '@mui/icons-material';
import { GlideMenu } from '../ui/GlideMenu';
import { Kbd } from '../ui/Pills';
import { easing, shell } from '../../themes/tokens';
import { NAV_GROUPS, NavGroup, NavItem, matchNav } from './navigation';
import { UserMenu } from './UserMenu';
import { User } from '../../types';

/* ─────────────────────────────────────────────────────────
 * BARRA LATERAL (la misma de FieldPartner: Beautiful UI SidebarNav)
 * Un solo árbol de 256px recortado por un contenedor que se
 * achica a 60px: al colapsar, los íconos quedan en el mismo
 * lugar y el texto se desvanece corriéndose 8px. Arriba, la
 * marca; después, accesos rápidos; las secciones del backoffice
 * plegables; abajo, el usuario. Colapsada, cada sección abre su
 * menú flotante.
 * ───────────────────────────────────────────────────────── */

const MOTION = { duration: 280, copy: 180, offset: 8, easing: easing.link };

export interface SideBarProps {
  collapsed: boolean;
  onToggle: () => void;
  onOpenSearch: () => void;
  pathname: string;
  search: string;
  user?: User | null;
  onLogout: () => void;
}

const SidebarToggleIcon: React.FC<{ flipped?: boolean }> = ({ flipped }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: flipped ? 'rotate(180deg)' : undefined }} aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 4v16M15.5 10l-2 2 2 2" />
  </svg>
);

const Chevron: React.FC<{ open?: boolean }> = ({ open }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: `transform 220ms ${easing.outStrong}`, transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
    aria-hidden
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

/* fila base: ícono 20px centrado en x=30 en ambos estados */
const rowSx = (active: boolean) => ({
  all: 'unset',
  boxSizing: 'border-box' as const,
  cursor: 'pointer',
  position: 'relative' as const,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  height: 34,
  mx: 1,
  pl: '12px',
  pr: '8px',
  borderRadius: '8px',
  textDecoration: 'none',
  color: active ? 'var(--accent-ink)' : 'var(--ink-2)',
  background: active ? 'var(--accent-tint)' : 'transparent',
  transition: `width ${MOTION.copy}ms ${MOTION.easing}, background-color 150ms ease, color 150ms ease, transform 150ms ${easing.outStrong}`,
  '&:hover': { color: active ? 'var(--accent-ink)' : 'var(--ink)', textDecoration: 'none' },
  '&:active': { transform: 'scale(0.98)' },
  '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: -2 },
  '& .row-icon': {
    display: 'flex',
    width: 20,
    height: 20,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    color: active ? 'var(--accent-ink)' : 'var(--ink-3)',
    transition: 'color 150ms ease',
    '& svg': { fontSize: 19 },
  },
  '&:hover .row-icon': { color: active ? 'var(--accent-ink)' : 'var(--ink-2)' },
});

interface RailRowProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  meta?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  to?: string;
  collapsed: boolean;
  tooltip?: string;
  ariaExpanded?: boolean;
}

const RailRow: React.FC<RailRowProps> = ({ icon, label, active = false, meta, onClick, to, collapsed, tooltip, ariaExpanded }) => {
  const row = (
    <Box
      data-row
      component={to ? RouterLink : 'button'}
      {...(to ? { to } : { type: 'button' })}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-expanded={ariaExpanded}
      className="sidebar-row"
      sx={rowSx(active)}
    >
      <span className="row-icon">{icon}</span>
      <Box component="span" className="sidebar-copy" sx={{ ml: '10px', minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>
        {label}
      </Box>
      {meta && (
        <Box component="span" className="sidebar-copy" sx={{ ml: 1, display: 'flex', alignItems: 'center', flexShrink: 0, color: 'var(--ink-3)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
          {meta}
        </Box>
      )}
    </Box>
  );
  if (collapsed && tooltip) {
    return (
      <Tooltip title={tooltip} placement="right" enterDelay={150}>
        {row}
      </Tooltip>
    );
  }
  return row;
};

export const SideBar: React.FC<SideBarProps> = ({ collapsed, onToggle, onOpenSearch, pathname, search, user, onLogout }) => {
  const navigate = useNavigate();
  const activeMatch = useMemo(() => matchNav(pathname, search), [pathname, search]);
  const activeKey = activeMatch?.item.key ?? '';
  const activeGroupKey = activeMatch?.group.key ?? '';

  // Secciones abiertas: la de la pantalla activa se abre sola al navegar.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (activeGroupKey) setOpenGroups(prev => (prev[activeGroupKey] ? prev : { ...prev, [activeGroupKey]: true }));
  }, [activeGroupKey]);

  // Colapsada: menú flotante por sección
  const [flyout, setFlyout] = useState<{ group: NavGroup; anchor: HTMLElement } | null>(null);
  useEffect(() => {
    if (!collapsed) setFlyout(null);
  }, [collapsed]);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  const renderLeaf = (item: NavItem) => {
    const active = item.key === activeKey;
    return (
      <Box
        key={item.key}
        data-row
        component={RouterLink}
        to={item.route}
        aria-current={active ? 'page' : undefined}
        sx={{
          ...rowSx(active),
          height: 30,
          pl: '41px',
          fontSize: 13,
          fontWeight: active ? 500 : 400,
          ...(active
            ? {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: '30px',
                  top: 8,
                  bottom: 8,
                  width: 2,
                  borderRadius: 2,
                  background: 'var(--accent)',
                },
              }
            : {}),
        }}
      >
        <Box component="span" sx={{ minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.006em' }}>
          {item.label}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      component="aside"
      aria-label="Navegación"
      data-sidebar-collapsed={collapsed}
      sx={{
        position: 'relative',
        display: { xs: 'none', sm: 'flex' },
        flexShrink: 0,
        height: '100vh',
        overflow: 'hidden',
        transition: `width ${MOTION.duration}ms ${MOTION.easing}`,
        '& .sidebar-copy': {
          opacity: 1,
          transform: 'translateX(0)',
          transition: `opacity ${MOTION.copy}ms ease-out, transform ${MOTION.copy}ms ${MOTION.easing}`,
        },
        '& .sidebar-row': { width: `${shell.sidebarExpanded - 16}px` },
        '&[data-sidebar-collapsed="true"] .sidebar-copy': {
          pointerEvents: 'none',
          opacity: 0,
          transform: `translateX(-${MOTION.offset}px)`,
        },
        '&[data-sidebar-collapsed="true"] .sidebar-row': { width: '44px' },
        '&[data-sidebar-collapsed="true"] .sidebar-hide': { opacity: 0, pointerEvents: 'none' },
      }}
      style={{ width: collapsed ? shell.sidebarCollapsed : shell.sidebarExpanded }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: shell.sidebarExpanded, minHeight: 0, flexShrink: 0 }}>
        {/* encabezado: marca + colapsar */}
        <Box sx={{ position: 'relative', height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', px: 1 }}>
          <Box sx={{ width: collapsed ? 44 : 196, transition: `width ${MOTION.duration}ms ${MOTION.easing}`, overflow: 'hidden' }}>
            <Box
              component={RouterLink}
              to="/home"
              aria-hidden={collapsed}
              tabIndex={collapsed ? -1 : 0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                height: 44,
                px: 1,
                borderRadius: '10px',
                textDecoration: 'none',
                transition: `background-color 120ms ease, transform 120ms ${easing.outStrong}`,
                '&:hover': { background: 'var(--hover-2)', textDecoration: 'none' },
                '&:active': { transform: 'scale(0.99)' },
                '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: -2 },
              }}
            >
              <Box
                component="img"
                src="/assets/fieldpartner-simbolo.png"
                alt=""
                sx={{ width: 26, height: 26, flexShrink: 0, objectFit: 'contain', ml: '-1px' }}
              />
              <Box className="sidebar-copy" sx={{ minWidth: 0, flex: 1, lineHeight: 1.2 }}>
                <Typography component="div" sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                  FieldPartner
                </Typography>
                <Typography component="div" sx={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
                  Backoffice
                </Typography>
              </Box>
            </Box>
          </Box>
          <Tooltip title={collapsed ? 'Expandir menú' : 'Colapsar menú'} placement="right">
            <Box
              component="button"
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
              sx={{
                all: 'unset',
                cursor: 'pointer',
                position: 'absolute',
                top: 14,
                right: collapsed ? 'auto' : 10,
                left: collapsed ? 14 : 'auto',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                color: 'var(--ink-3)',
                transition: 'background-color 150ms ease, color 150ms ease, opacity 150ms ease',
                // colapsada, el botón se muestra al pasar por encima del símbolo
                opacity: collapsed ? 0 : 1,
                background: collapsed ? 'var(--canvas)' : 'transparent',
                '&:hover': { background: 'var(--hover-2)', color: 'var(--ink)', opacity: 1 },
                '&:focus-visible': { opacity: 1, outline: '2px solid var(--accent)', outlineOffset: -2 },
              }}
            >
              <SidebarToggleIcon flipped={collapsed} />
            </Box>
          </Tooltip>
        </Box>

        {/* accesos rápidos */}
        <GlideMenu rowSelector="[data-row]" highlight="var(--hover-2)" sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <RailRow
            collapsed={collapsed}
            tooltip="Buscar"
            icon={<SearchRounded />}
            label="Buscar"
            meta={<Kbd>{isMac ? '⌘K' : 'Ctrl K'}</Kbd>}
            onClick={onOpenSearch}
          />
          <RailRow collapsed={collapsed} tooltip="Inicio" icon={<HomeOutlined />} label="Inicio" active={pathname === '/home'} to="/home" />
        </GlideMenu>
      </Box>

      {/* secciones */}
      <Box
        sx={{
          position: 'absolute',
          top: 60 + 2 * 35 + 12,
          bottom: 72,
          left: 0,
          width: shell.sidebarExpanded,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          maskImage: 'linear-gradient(to bottom, transparent 0, #000 10px, #000 calc(100% - 24px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 10px, #000 calc(100% - 24px), transparent 100%)',
          pt: 1,
          pb: 3,
        }}
      >
        <Box className="sidebar-copy" sx={{ mx: 1, px: '12px', mb: 0.5, height: 26, display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 500, color: 'var(--ink-3)' }}>
          Administración
        </Box>

        <GlideMenu rowSelector="[data-row]" highlight="var(--hover-2)" sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {NAV_GROUPS.map(group => {
            // una sección de una sola pantalla es un acceso directo
            if (group.items.length === 1) {
              const item = group.items[0];
              return (
                <RailRow key={group.key} collapsed={collapsed} tooltip={item.label} icon={item.icon} label={item.label} active={item.key === activeKey} to={item.route} />
              );
            }
            const containsActive = group.key === activeGroupKey;
            const isOpen = !!openGroups[group.key];
            return (
              <Box key={group.key}>
                <RailRow
                  collapsed={collapsed}
                  tooltip={collapsed ? group.label : undefined}
                  icon={group.icon}
                  label={group.label}
                  active={collapsed && containsActive}
                  ariaExpanded={collapsed ? flyout?.group.key === group.key : isOpen}
                  meta={<Chevron open={isOpen} />}
                  onClick={e => {
                    if (collapsed) setFlyout({ group, anchor: e.currentTarget });
                    else setOpenGroups(prev => ({ ...prev, [group.key]: !isOpen }));
                  }}
                />
                <Box className="sidebar-hide" sx={{ transition: 'opacity 150ms ease' }}>
                  <Collapsible open={isOpen && !collapsed}>
                    <Box
                      sx={{
                        position: 'relative',
                        pb: 0.5,
                        '&::before': { content: '""', position: 'absolute', left: 29, top: 2, bottom: 6, width: '1px', background: 'var(--line-strong)' },
                      }}
                    >
                      {group.items.map(renderLeaf)}
                    </Box>
                  </Collapsible>
                </Box>
              </Box>
            );
          })}
        </GlideMenu>
      </Box>

      {/* pie: usuario */}
      <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: shell.sidebarExpanded, px: 1, pb: 1, pt: 0.75 }}>
        <Box sx={{ width: collapsed ? 44 : 'auto', transition: `width ${MOTION.duration}ms ${MOTION.easing}`, overflow: 'hidden' }}>
          {user && <UserMenu user={user} onLogout={onLogout} collapsed={collapsed} />}
        </Box>
      </Box>

      {/* colapsada: menú flotante de la sección */}
      <Popover
        open={!!flyout}
        anchorEl={flyout?.anchor}
        onClose={() => setFlyout(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { ml: 1, width: 248, p: '6px', borderRadius: '14px', maxHeight: '70vh' } }}
      >
        {flyout && (
          <>
            <Typography sx={{ px: 1, pt: 0.5, pb: 0.75, fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{flyout.group.label}</Typography>
            <GlideMenu highlight="var(--hover-2)" sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {flyout.group.items.map(leaf => {
                const active = leaf.key === activeKey;
                return (
                  <Box
                    key={leaf.key}
                    data-menu-row
                    component="button"
                    type="button"
                    onClick={() => {
                      setFlyout(null);
                      navigate(leaf.route);
                    }}
                    sx={{
                      all: 'unset',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      height: 32,
                      px: 1,
                      borderRadius: '8px',
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--accent-ink)' : 'var(--ink)',
                      '& svg': { fontSize: 17, color: active ? 'var(--accent-ink)' : 'var(--ink-3)' },
                    }}
                  >
                    {leaf.icon}
                    <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {leaf.label}
                    </Box>
                  </Box>
                );
              })}
            </GlideMenu>
          </>
        )}
      </Popover>
    </Box>
  );
};

/** Despliegue por grid-template-rows (sin medir alturas). */
export const Collapsible: React.FC<{ open: boolean; children: React.ReactNode }> = ({ open, children }) => (
  <Box
    sx={{ display: 'grid' }}
    style={{
      gridTemplateRows: open ? '1fr' : '0fr',
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      transition: `grid-template-rows 260ms ${easing.outStrong}, opacity 200ms ease, visibility 0s linear ${open ? '0s' : '260ms'}`,
    }}
    aria-hidden={!open}
  >
    <Box sx={{ overflow: 'hidden', minHeight: 0 }}>{children}</Box>
  </Box>
);

export default SideBar;
