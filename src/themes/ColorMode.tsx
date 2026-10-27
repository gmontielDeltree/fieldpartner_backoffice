import React, { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { tokensFor, type ColorMode } from './tokens';

/* ──────────────────────────────────────────────────────────
 * Modo claro / oscuro.
 * Por defecto claro. La elección queda en localStorage (`fp_color_mode`)
 * y se refleja en <html data-theme="…">: foundation.css cambia las
 * variables CSS y AppTheme arma el theme de MUI del mismo modo.
 * index.html lee la misma clave antes de cargar la app para no mostrar
 * un destello blanco al abrir en oscuro.
 * ────────────────────────────────────────────────────────── */

export const COLOR_MODE_KEY = 'fp_color_mode';

export const readStoredColorMode = (): ColorMode => {
  try {
    return localStorage.getItem(COLOR_MODE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const storeColorMode = (mode: ColorMode) => {
  try {
    localStorage.setItem(COLOR_MODE_KEY, mode);
  } catch {
    /* sin storage: vale para esta sesión */
  }
};

const applyToDocument = (mode: ColorMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.style.colorScheme = mode;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tokensFor(mode).canvas);
};

interface ColorModeValue {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggle: () => void;
}

const ColorModeContext = createContext<ColorModeValue>({
  mode: 'light',
  setMode: () => undefined,
  toggle: () => undefined,
});

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ColorMode>(readStoredColorMode);

  // antes de pintar: las variables CSS y el theme de MUI cambian en el mismo cuadro
  useLayoutEffect(() => {
    applyToDocument(mode);
  }, [mode]);

  const setMode = useCallback((next: ColorMode) => {
    storeColorMode(next);
    setModeState(next);
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next: ColorMode = prev === 'dark' ? 'light' : 'dark';
      storeColorMode(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode, setMode, toggle]);
  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

export const useColorMode = () => useContext(ColorModeContext);

/** Tokens del modo activo, para el código que necesita valores (gráficos, canvas). */
export const useTokens = () => tokensFor(useColorMode().mode);
