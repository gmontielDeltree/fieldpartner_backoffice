import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, Dialog, Typography } from '@mui/material';
import { AddRounded, HomeOutlined, NorthEastRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../ui/PageHeader';
import { Kbd } from '../ui/Pills';
import { easing } from '../../themes/tokens';
import { NAV_FLAT } from './navigation';

/* ─────────────────────────────────────────────────────────
 * BUSCADOR ⌘K (el de FieldPartner: Beautiful UI Search)
 * Filtra en vivo las pantallas del backoffice y sus altas. Con el
 * teclado: ↑ ↓ mueven la selección (una sola capa que se
 * desliza, como GlideMenu), ⏎ abre y Esc cierra.
 * ───────────────────────────────────────────────────────── */

interface Result {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Pantallas que tienen alta propia (/…/new)
const NEW_ROUTES: Record<string, string> = {
  users: '/user/new',
  accounts: '/accounts/new',
  system: '/system/new',
  licences: '/licences/new',
  menus: '/menus-modules/new',
  categories: '/category/new',
  crops: '/crops/new',
  country: '/country/new',
  'type-supplies': '/type-supplies/new',
  'type-movement': '/type-movement/new',
  'type-of-devices': '/type-of-devices/new',
};

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const [hl, setHl] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  const all = useMemo<Result[]>(() => {
    const screens: Result[] = [
      { id: 'screen:home', group: 'Pantallas', label: 'Inicio', icon: <HomeOutlined />, run: () => navigate('/home') },
      ...NAV_FLAT.map(({ group, item }) => ({
        id: `screen:${item.key}`,
        group: 'Pantallas',
        label: item.label,
        hint: group.label !== item.label ? group.label : undefined,
        icon: item.icon,
        run: () => navigate(item.route),
      })),
    ];
    const creates: Result[] = NAV_FLAT.filter(({ item }) => NEW_ROUTES[item.key]).map(({ item }) => ({
      id: `new:${item.key}`,
      group: 'Crear',
      label: `Nuevo: ${item.label}`,
      icon: <AddRounded />,
      run: () => navigate(NEW_ROUTES[item.key]),
    }));
    return [...screens, ...creates];
  }, [navigate]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    // sin consulta: solo las pantallas
    if (!q) return all.filter(r => r.group === 'Pantallas');
    const terms = q.split(/\s+/);
    return all
      .map(r => {
        const hay = normalize(`${r.label} ${r.hint ?? ''}`);
        if (!terms.every(term => hay.includes(term))) return null;
        const label = normalize(r.label);
        const score = label.startsWith(terms[0]) ? 0 : label.includes(terms[0]) ? 1 : 2;
        return { r, score };
      })
      .filter(Boolean)
      .sort((a, b) => a!.score - b!.score)
      .slice(0, 40)
      .map(x => x!.r);
  }, [all, query]);

  useEffect(() => setActive(0), [query]);

  // capa que se desliza hasta la fila activa
  useLayoutEffect(() => {
    const row = rowRefs.current[active];
    const list = listRef.current;
    if (!row || !list) {
      setHl(null);
      return;
    }
    setHl({ top: row.offsetTop, height: row.offsetHeight });
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop + 8) list.scrollTop = top - 8;
    else if (bottom > list.scrollTop + list.clientHeight - 8) list.scrollTop = bottom - list.clientHeight + 8;
  }, [active, results]);

  const runAt = (i: number) => {
    const r = results[i];
    if (!r) return;
    onClose();
    // dejar cerrar el diálogo antes de navegar
    setTimeout(r.run, 0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(active);
    }
  };

  let lastGroup = '';
  rowRefs.current = [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      TransitionProps={{ timeout: 160 }}
      PaperProps={{
        sx: {
          width: 'min(600px, calc(100vw - 32px))',
          mt: '12vh',
          alignSelf: 'flex-start',
          borderRadius: '14px',
          overflow: 'hidden',
          animation: `pop-in 180ms ${easing.outStrong} both`,
        },
      }}
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(17,19,22,0.24) !important', backdropFilter: 'blur(1.5px)' } } }}
    >
      <Box onKeyDown={onKeyDown}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, height: 52, px: 2, borderBottom: '1px solid var(--line)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <Box
            component="input"
            autoFocus
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Buscar pantallas o crear un registro…"
            aria-label="Buscar"
            sx={{
              all: 'unset',
              flex: 1,
              minWidth: 0,
              fontSize: 15,
              color: 'var(--ink)',
              letterSpacing: '-0.012em',
              '&::placeholder': { color: 'var(--ink-3)' },
            }}
          />
          {query && (
            <Box
              component="button"
              type="button"
              aria-label="Limpiar"
              onClick={() => setQuery('')}
              sx={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                color: 'var(--ink-3)',
                animation: 'fade-in 150ms ease-out both',
                '&:hover': { background: 'var(--hover-2)', color: 'var(--ink)' },
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Box>
          )}
          <Kbd>Esc</Kbd>
        </Box>

        {results.length === 0 ? (
          <EmptyState title="Sin resultados" hint="Probá con otro nombre de pantalla" />
        ) : (
          <Box ref={listRef} sx={{ position: 'relative', maxHeight: 'min(440px, 56vh)', overflowY: 'auto', p: '6px' }}>
            <Box
              aria-hidden
              sx={{ position: 'absolute', left: 6, right: 6, borderRadius: '8px', background: 'var(--hover-2)', pointerEvents: 'none' }}
              style={{
                top: hl?.top ?? 0,
                height: hl?.height ?? 0,
                opacity: hl ? 1 : 0,
                transition: `top 200ms ${easing.outStrong}, height 200ms ${easing.outStrong}, opacity 120ms ease`,
              }}
            />
            {results.map((r, i) => {
              const header = r.group !== lastGroup ? r.group : null;
              lastGroup = r.group;
              return (
                <React.Fragment key={r.id}>
                  {header && (
                    <Typography sx={{ position: 'relative', px: 1.25, pt: i === 0 ? 0.5 : 1.25, pb: 0.5, fontSize: 11.5, fontWeight: 500, color: 'var(--ink-3)' }}>
                      {header}
                    </Typography>
                  )}
                  <Box
                    ref={(el: HTMLElement | null) => (rowRefs.current[i] = el)}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => i !== active && setActive(i)}
                    onClick={() => runAt(i)}
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      height: 38,
                      px: 1.25,
                      borderRadius: '8px',
                      animation: 'fade-in 180ms ease-out both',
                    }}
                  >
                    <Box sx={{ display: 'flex', color: i === active ? 'var(--ink)' : 'var(--ink-3)', '& svg': { fontSize: 17 } }}>{r.icon}</Box>
                    <Box sx={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography component="span" sx={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.label}
                      </Typography>
                      {r.hint && (
                        <Typography component="span" sx={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.hint}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', color: 'var(--ink-3)', opacity: i === active ? 1 : 0, transition: 'opacity 120ms ease' }}>
                      <NorthEastRounded sx={{ fontSize: 15 }} />
                    </Box>
                  </Box>
                </React.Fragment>
              );
            })}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 38, px: 2, borderTop: '1px solid var(--line)', background: 'var(--inset)', fontSize: 11.5, color: 'var(--ink-3)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navegar
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Kbd>Enter</Kbd>
            abrir
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box component="img" src="/assets/fieldpartner-simbolo.png" alt="" sx={{ width: 14, height: 14 }} />
            FieldPartner Backoffice
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CommandPalette;
