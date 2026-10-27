/* ──────────────────────────────────────────────────────────
 * FieldPartner — design tokens
 *
 * Base: el sistema de Beautiful UI (beautifului.dev, MIT): lienzo neutro
 * frío, superficies blancas, bordes de un pixel, sombras en capas de
 * opacidad baja y color semántico usado con moderación.
 * Acento: el verde de la marca (logo nuevo) en lugar del azul original.
 *
 * Los valores van en hex/rgba (no oklch) porque los helpers de MUI
 * (alpha, darken) no entienden oklch. Las mismas variables viven como
 * CSS custom properties en foundation.css para el código que no usa el
 * theme (CSS plano, web components, mapbox, toastify, sweetalert2).
 * ────────────────────────────────────────────────────────── */

export type ColorMode = 'light' | 'dark';

const lightTokens = {
  // superficies
  page: '#f4f6f5',
  canvas: '#eef1ef',
  surface: '#ffffff',
  inset: '#f7f8f9',
  hover: '#f4f5f6',
  hover2: '#e7e9eb',
  field: '#f2f2f3',

  // tinta
  ink: '#1f2124',
  ink2: '#62656b',
  ink3: '#9a9da3',
  /** texto sobre fondos de tinta (paginación activa, día elegido, avatar) */
  inkInverse: '#ffffff',

  // bordes
  line: '#ecedef',
  lineStrong: '#e0e2e5',
  lineSoft: '#f3f4f5',
  gridLine: 'rgba(236, 237, 239, 0.78)',

  // controles (casillas, radios, interruptores, hover de inputs)
  control: '#c7cdd3',
  controlHover: '#aeb4bb',
  inputHover: '#c9ccd1',
  switchTrack: '#d7dade',

  // encabezado de tabla: banda apenas teñida de verde, rótulos más oscuros que el cuerpo
  tableHead: '#edf4ef',
  tableHeadInk: '#3e4943',
  tableHeadLine: '#d8e1db',

  // acento de marca (verde FieldPartner)
  accent: '#05a14f',
  accentInk: '#087f3e',
  accentTint: '#e7f5ec',
  accentTintHover: '#dcf0e3',
  accentRing: 'rgba(5, 161, 79, 0.28)',
  brand: '#00b050',
  leaf: '#8dc63f',
  sun: '#f2c40f',

  // semánticos (+ tinta de texto sobre su tinte, para Alert)
  blue: '#0285ff',
  blueInk: '#0070dd',
  blueTint: '#e9f3ff',
  green: '#199a4d',
  greenInk: '#126e37',
  greenTint: '#e8f5ed',
  orange: '#ef720d',
  orangeInk: '#a64d05',
  orangeTint: '#fdf1e5',
  red: '#e3474c',
  redInk: '#b3282d',
  redTint: '#fcecec',

  // estados tipo "pill" (FilterTable)
  todo: '#f09a2e',
  progress: '#16a6c7',
  done: '#26a878',

  // overlays oscuros (tooltips, gráficos)
  tooltipBg: '#25272b',
  tooltipFg: '#f4f5f6',
  tooltipMuted: '#a5a8ad',
  tooltipBorder: '#3a3c40',

  // base de las sombras
  shadowRgb: '16, 24, 40',
};

export type Tokens = typeof lightTokens;

/* Modo oscuro: grafito con un dejo verde (no negro puro), superficies que
 * suben de tono en vez de llevar sombra, y el verde de marca un punto más
 * claro para que el texto de acento se lea sobre fondo oscuro. */
const darkTokens: Tokens = {
  page: '#151817',
  canvas: '#0f1211',
  surface: '#1c1f1e',
  inset: '#181b1a',
  hover: '#232726',
  hover2: '#2b302e',
  field: '#212524',

  ink: '#e6e9e7',
  ink2: '#a5aba8',
  ink3: '#737a77',
  inkInverse: '#141615',

  line: '#2a2f2d',
  lineStrong: '#363c3a',
  lineSoft: '#222725',
  gridLine: 'rgba(42, 47, 45, 0.9)',

  control: '#4a514e',
  controlHover: '#5f6763',
  inputHover: '#4a514e',
  switchTrack: '#3a403d',

  tableHead: '#212a25',
  tableHeadInk: '#bcc7c0',
  tableHeadLine: '#33403a',

  accent: '#16a457',
  accentInk: '#4fcf88',
  accentTint: '#1a3226',
  accentTintHover: '#20402f',
  accentRing: 'rgba(31, 174, 95, 0.35)',
  brand: '#00b050',
  leaf: '#8dc63f',
  sun: '#f2c40f',

  blue: '#3b9bff',
  blueInk: '#7cb9ff',
  blueTint: '#172a40',
  green: '#2bb362',
  greenInk: '#6fd59a',
  greenTint: '#183324',
  orange: '#f08a3a',
  orangeInk: '#f4b072',
  orangeTint: '#36261a',
  red: '#ef6266',
  redInk: '#f3999c',
  redTint: '#3b2022',

  todo: '#f09a2e',
  progress: '#16a6c7',
  done: '#26a878',

  tooltipBg: '#2e3331',
  tooltipFg: '#eef0ef',
  tooltipMuted: '#a5a8ad',
  tooltipBorder: '#404643',

  shadowRgb: '0, 0, 0',
};

/** Tokens del modo claro (el de siempre). Para el modo activo usar `tokensFor(mode)`. */
export const tokens: Tokens = lightTokens;

export const tokensFor = (mode: ColorMode): Tokens => (mode === 'dark' ? darkTokens : lightTokens);

/* Sombras: anillo de un pixel + pilas suaves (smooth-shadow). En oscuro el
 * anillo hace casi todo el trabajo y las pilas se oscurecen un poco más. */
export const shadowsFor = (mode: ColorMode) => {
  const t = tokensFor(mode);
  const k = mode === 'dark' ? 3 : 1;
  const c = (a: number) => `rgba(${t.shadowRgb}, ${Math.min(a * k, 0.6).toFixed(3)})`;
  const ring = `0 0 0 1px ${t.line}`;
  const ringStrong = `0 0 0 1px ${t.lineStrong}`;
  return {
    xs: `0 1px 2px ${c(0.05)}`,
    sm: `0 1px 2px ${c(0.04)}, 0 2px 4px ${c(0.035)}`,
    md: `0 1px 2px ${c(0.04)}, 0 4px 8px -2px ${c(0.06)}, 0 8px 16px -4px ${c(0.06)}`,
    lg: `0 2px 4px ${c(0.04)}, 0 8px 16px -4px ${c(0.08)}, 0 24px 48px -12px ${c(0.16)}`,
    hairline: ring,
    btn: `${ringStrong}, 0 1px 2px ${c(0.05)}`,
    card: `${ring}, 0 1px 2px ${c(0.04)}, 0 2px 4px ${c(0.035)}`,
    raised: `${ring}, 0 1px 2px ${c(0.04)}, 0 4px 8px -2px ${c(0.06)}, 0 8px 16px -4px ${c(0.06)}`,
    overlay: `${ring}, 0 2px 4px ${c(0.04)}, 0 8px 16px -4px ${c(0.08)}, 0 24px 48px -12px ${c(0.16)}`,
    insetField: `inset 0 1px 2px rgba(0, 0, 0, ${mode === 'dark' ? 0.25 : 0.06})`,
    filled: 'inset 0 1px 0 rgba(255, 255, 255, 0.14)',
  };
};

export type Shadows = ReturnType<typeof shadowsFor>;

/** Sombras del modo claro. Para el modo activo usar `shadowsFor(mode)`. */
export const shadows: Shadows = shadowsFor('light');

/* Encabezado de tabla, el mismo en todas las implementaciones (MUI Table,
 * DataGrid, DataTable, tablas de los informes): banda apenas teñida de la
 * marca y rótulos en 12/600, un punto más chicos y más firmes que el cuerpo
 * (13/400). Va con variables CSS para que siga al modo claro/oscuro. */
export const tableHeadCell = {
  backgroundColor: 'var(--table-head)',
  color: 'var(--table-head-ink)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.004em',
} as const;

/* Radios: chips 6, controles 8, cards 10, ventanas 14, pills 999. */
export const radii = {
  chip: 6,
  control: 8,
  card: 10,
  window: 14,
  pill: 999,
} as const;

/* Curvas fuertes: las que trae el navegador se quedan cortas. */
export const easing = {
  outStrong: 'cubic-bezier(0.23, 1, 0.32, 1)',
  inOutStrong: 'cubic-bezier(0.77, 0, 0.175, 1)',
  link: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const fonts = {
  sans: '"Inter", "Inter var", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace',
} as const;

/* Dimensiones del shell (barra lateral + barra superior). */
export const shell = {
  sidebarExpanded: 256,
  sidebarCollapsed: 60,
  topbar: 56,
  gutter: 8,
} as const;
