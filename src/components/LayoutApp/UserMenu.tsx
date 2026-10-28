import React, { MouseEvent, useState } from 'react';
import { Avatar, Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Switch, Typography } from '@mui/material';
import { DarkModeOutlined, LogoutRounded } from '@mui/icons-material';
import { easing } from '../../themes/tokens';
import { useColorMode } from '../../themes/ColorMode';
import { User } from '../../types';

/* ─────────────────────────────────────────────────────────
 * USUARIO (pie de la barra lateral, igual que en FieldPartner)
 * Fila con avatar, nombre y correo; el menú trae el modo
 * oscuro y el cierre de sesión.
 * ───────────────────────────────────────────────────────── */

const getInitials = (name: string): string => {
  const clean = (name || '').split('@')[0].replace(/[._-]+/g, ' ').trim();
  if (!clean) return 'U';
  return clean
    .split(/\s+/)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const displayName = (user: User) => {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.username || '';
};

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  collapsed?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, collapsed = false }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { mode, toggle } = useColorMode();
  const name = displayName(user);
  const detail = user.username && user.username !== name ? user.username : user.isAdmin ? 'Administrador' : '';

  const handleMenuOpen = (event: MouseEvent<HTMLElement>): void => setAnchorEl(event.currentTarget);
  const handleMenuClose = (): void => setAnchorEl(null);

  const avatar = (size: number) => (
    <Avatar sx={{ width: size, height: size, fontSize: size * 0.4, bgcolor: 'var(--ink)', color: 'var(--ink-inverse)', boxShadow: '0 0 0 2px var(--surface)' }}>
      {getInitials(name)}
    </Avatar>
  );

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={handleMenuOpen}
        aria-haspopup="menu"
        aria-expanded={open}
        title={collapsed ? name : undefined}
        sx={{
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          height: 46,
          px: '6px',
          borderRadius: '10px',
          transition: `background-color 120ms ease, transform 120ms ${easing.outStrong}`,
          '&:hover': { background: 'var(--hover-2)' },
          '&:active': { transform: 'scale(0.99)' },
          '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: -2 },
        }}
      >
        {avatar(30)}
        <Box className="sidebar-copy" sx={{ minWidth: 0, flex: 1, lineHeight: 1.25 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </Typography>
          {detail && (
            <Typography sx={{ fontSize: 11.5, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {detail}
            </Typography>
          )}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { mt: -0.75, minWidth: 236 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1, py: 0.75, mb: 0.5 }}>
          {avatar(34)}
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Typography>
            {detail && (
              <Typography sx={{ fontSize: 12, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detail}</Typography>
            )}
          </Box>
        </Box>
        <Divider sx={{ my: '4px !important' }} />
        {/* modo claro/oscuro: el menú queda abierto para ver el cambio */}
        <MenuItem onClick={toggle} role="menuitemcheckbox" aria-checked={mode === 'dark'}>
          <ListItemIcon>
            <DarkModeOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modo oscuro</ListItemText>
          <Switch size="small" checked={mode === 'dark'} tabIndex={-1} inputProps={{ 'aria-hidden': true }} sx={{ ml: 1.5, mr: -0.75, pointerEvents: 'none' }} />
        </MenuItem>
        <Divider sx={{ my: '4px !important' }} />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onLogout();
          }}
          sx={{ color: 'var(--red)', '& .MuiListItemIcon-root': { color: 'var(--red)' } }}
        >
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cerrar sesión</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
