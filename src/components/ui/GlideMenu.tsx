import React, { useRef, useState } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { easing } from '../../themes/tokens';

/* ─────────────────────────────────────────────────────────
 * GLIDE MENU (Beautiful UI)
 * Una sola capa de hover que se desliza entre las filas del
 * menú en lugar de prender y apagar el fondo de cada una.
 * Las filas se marcan con `data-menu-row` (o el selector que
 * se pase); deben tener `position: relative` y `z-index: 1`.
 * ───────────────────────────────────────────────────────── */

export interface GlideMenuProps {
  children: React.ReactNode;
  rowSelector?: string;
  /** color de la capa (por defecto, --hover-2) */
  highlight?: string;
  radius?: number;
  inset?: { left?: number; right?: number };
  sx?: SxProps<Theme>;
  component?: React.ElementType;
}

export const GlideMenu: React.FC<GlideMenuProps> = ({
  children,
  rowSelector = '[data-menu-row]',
  highlight = 'var(--hover-2)',
  radius = 8,
  inset,
  sx,
  component = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; height: number; left: number; width: number } | null>(null);
  const [visible, setVisible] = useState(false);

  const moveTo = (target: EventTarget | null) => {
    const container = ref.current;
    if (!(target instanceof Element) || !container) return;
    const row = target.closest(rowSelector);
    if (!(row instanceof HTMLElement) || !container.contains(row)) return;
    if (row.getAttribute('aria-disabled') === 'true') return;
    const c = container.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    setBox({ top: r.top - c.top, height: r.height, left: r.left - c.left, width: r.width });
    setVisible(true);
  };

  return (
    <Box
      ref={ref}
      component={component}
      onMouseOver={(e: React.MouseEvent) => moveTo(e.target)}
      onMouseLeave={() => setVisible(false)}
      onFocusCapture={(e: React.FocusEvent) => moveTo(e.target)}
      onBlurCapture={(e: React.FocusEvent) => {
        if (!ref.current?.contains(e.relatedTarget as Node | null)) setVisible(false);
      }}
      sx={{ position: 'relative', ...((sx as object) || {}) }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: 0,
          borderRadius: `${radius}px`,
          background: highlight,
        }}
        style={{
          top: box?.top ?? 0,
          height: box?.height ?? 0,
          left: inset?.left ?? box?.left ?? 0,
          width: inset ? undefined : box?.width ?? 0,
          right: inset?.right,
          opacity: box && visible ? 1 : 0,
          transition: `top 220ms ${easing.outStrong}, height 220ms ${easing.outStrong}, left 220ms ${easing.outStrong}, width 220ms ${easing.outStrong}, opacity 150ms ease`,
        }}
      />
      {children}
    </Box>
  );
};

export default GlideMenu;
