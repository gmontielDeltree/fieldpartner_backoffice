import { useCallback, useEffect, useState } from 'react';
import { Box, Drawer } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { NavBar } from './NavBar';
import { SideBar } from './SideBar';
import { CommandPalette } from './CommandPalette';
import { useAppSelector, useAuthStore } from '../../hooks';
import { shell } from '../../themes/tokens';

/* ─────────────────────────────────────────────────────────
 * SHELL (el mismo de FieldPartner)
 * Barra lateral sobre el lienzo y, a la derecha, una "ventana"
 * de contenido con esquinas de 14px y anillo de un pixel
 * (Beautiful UI: Agent Screen). La barra superior vive adentro
 * de la ventana; las páginas se montan debajo.
 * ───────────────────────────────────────────────────────── */

const SIDEBAR_KEY = 'fp_bo_sidebar_expanded';

const readSidebarExpanded = () => {
  let expanded = true;
  try {
    expanded = localStorage.getItem(SIDEBAR_KEY) !== '0';
  } catch {
    /* sin storage: queda expandida */
  }
  return expanded && (typeof window === 'undefined' || window.innerWidth >= 900);
};

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { pathname, search } = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { startLogout } = useAuthStore();

  const [expanded, setExpanded] = useState<boolean>(readSidebarExpanded);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0');
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  // ⌘K / Ctrl+K abre el buscador desde cualquier pantalla
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const sidebarProps = {
    onToggle: toggleSidebar,
    onOpenSearch: () => setSearchOpen(true),
    pathname,
    search,
    user,
    onLogout: () => startLogout(),
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--canvas)' }}>
      <SideBar collapsed={!expanded} {...sidebarProps} />

      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          my: `${shell.gutter}px`,
          mr: `${shell.gutter}px`,
          ml: { xs: `${shell.gutter}px`, sm: 0 },
          borderRadius: '14px',
          overflow: 'hidden',
          backgroundColor: 'var(--page)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <NavBar pathname={pathname} search={search} onOpenSearch={() => setSearchOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <Box
          component="main"
          id="app_layout_router_outlet"
          sx={{ position: 'relative', flex: 1, minHeight: 0, width: '100%', overflow: 'auto' }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
        </Box>
      </Box>

      {/* Navegación en pantallas chicas */}
      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        PaperProps={{ sx: { background: 'var(--canvas)', border: 0, '& > aside': { display: 'flex !important' } } }}
        sx={{ display: { sm: 'none' } }}
      >
        <SideBar collapsed={false} {...sidebarProps} onToggle={() => setMobileNavOpen(false)} />
      </Drawer>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
};
