import { alpha, createTheme, Shadows, Theme } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/lab/themeAugmentation';
import { easing, fonts, radii, shadowsFor, tableHeadCell, tokensFor, type ColorMode } from './tokens';

/* ──────────────────────────────────────────────────────────
 * Theme de FieldPartner sobre MUI 5.
 * Lleva el lenguaje de Beautiful UI (bordes de un pixel, sombras en
 * capas, botones píldora, tipografía Inter apretada, curvas fuertes) a
 * todos los componentes de MUI, así cada pantalla existente lo hereda
 * sin tocar su código.
 * `createFieldpartnerTheme(mode)` arma la versión clara u oscura con los
 * mismos overrides: sólo cambian los tokens (ver tokens.ts).
 * ────────────────────────────────────────────────────────── */

/* Elevaciones de MUI → las cuatro alturas del sistema. */
const elevationFor = (shadows: ReturnType<typeof shadowsFor>): Shadows => [
  'none',
  shadows.card,
  shadows.card,
  shadows.card,
  shadows.raised,
  shadows.raised,
  shadows.raised,
  shadows.raised,
  shadows.raised,
  shadows.raised,
  shadows.raised,
  shadows.raised,
  shadows.raised,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
  shadows.overlay,
];

/* Casilla de verificación al estilo del grid de registros. */
const CheckboxBox = ({ checked, indeterminate }: { checked?: boolean; indeterminate?: boolean }) => (
  <span
    className="fp-checkbox-box"
    data-checked={checked || indeterminate ? 'true' : 'false'}
    aria-hidden
  >
    {checked && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    )}
    {indeterminate && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        <path d="M6 12h12" />
      </svg>
    )}
  </span>
);

export const createFieldpartnerTheme = (mode: ColorMode = 'light'): Theme => {
  const t = tokensFor(mode);
  const shadows = shadowsFor(mode);
  const elevation = elevationFor(shadows);
  const isDark = mode === 'dark';
  const focusRing = `0 0 0 3px ${alpha(t.accent, isDark ? 0.3 : 0.18)}`;

  /* `dark` es el hover de los botones llenos; `light`, el tono de texto sobre
   * tinte en modo oscuro (chips). En claro quedan los valores de siempre. */
  return createTheme({
  palette: {
    mode,
    primary: isDark
      ? { main: t.accent, dark: '#118a48', light: t.accentInk, contrastText: '#ffffff' }
      : { main: t.accent, dark: t.accentInk, light: '#3dbb74', contrastText: '#ffffff' },
    secondary: { main: t.ink, dark: isDark ? '#ffffff' : '#000000', light: t.ink2, contrastText: t.inkInverse },
    success: isDark
      ? { main: t.green, dark: '#1f9450', light: t.greenInk, contrastText: '#ffffff' }
      : { main: t.green, dark: '#13803f', light: '#4cc07a', contrastText: '#ffffff' },
    info: isDark
      ? { main: t.blue, dark: '#1f7fe0', light: t.blueInk, contrastText: '#ffffff' }
      : { main: t.blue, dark: t.blueInk, light: '#4fa8ff', contrastText: '#ffffff' },
    warning: isDark
      ? { main: t.orange, dark: '#d06f22', light: t.orangeInk, contrastText: '#ffffff' }
      : { main: t.orange, dark: '#c95c06', light: '#f6a35c', contrastText: '#ffffff' },
    error: isDark
      ? { main: t.red, dark: '#d0484c', light: t.redInk, contrastText: '#ffffff' }
      : { main: t.red, dark: '#c2363b', light: '#ee7b7f', contrastText: '#ffffff' },
    text: { primary: t.ink, secondary: t.ink2, disabled: t.ink3 },
    divider: t.line,
    background: { default: t.canvas, paper: t.surface },
    grey: {
      50: t.page,
      100: t.inset,
      200: t.hover,
      300: t.hover2,
      400: t.lineStrong,
      500: t.ink3,
      600: isDark ? '#8f9592' : '#7d8086',
      700: t.ink2,
      800: isDark ? '#c9cdcb' : '#3a3c40',
      900: t.ink,
      A100: t.hover,
      A200: t.hover2,
      A400: t.ink3,
      A700: t.ink2,
    },
    action: {
      active: t.ink2,
      hover: alpha(t.ink, mode === 'dark' ? 0.06 : 0.045),
      hoverOpacity: mode === 'dark' ? 0.06 : 0.045,
      selected: alpha(t.ink, mode === 'dark' ? 0.1 : 0.07),
      selectedOpacity: mode === 'dark' ? 0.1 : 0.07,
      disabled: t.ink3,
      disabledBackground: t.hover2,
      focus: alpha(t.ink, 0.1),
    },
  },
  shape: { borderRadius: 5 },
  shadows: elevation,
  typography: {
    fontFamily: fonts.sans,
    fontSize: 14,
    htmlFontSize: 14,
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 },
    h2: { fontSize: 32, fontWeight: 600, letterSpacing: '-0.028em', lineHeight: 1.15 },
    h3: { fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.2 },
    h4: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.022em', lineHeight: 1.25 },
    h5: { fontSize: 18, fontWeight: 600, letterSpacing: '-0.018em', lineHeight: 1.3 },
    h6: { fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.014em', lineHeight: 1.35 },
    subtitle1: { fontSize: 15, fontWeight: 500, letterSpacing: '-0.012em', lineHeight: 1.45 },
    subtitle2: { fontSize: 13, fontWeight: 600, letterSpacing: '-0.006em', lineHeight: 1.45 },
    body1: { fontSize: 14, letterSpacing: '-0.01em', lineHeight: 1.55 },
    body2: { fontSize: 13, letterSpacing: '-0.006em', lineHeight: 1.5 },
    caption: { fontSize: 12, letterSpacing: '-0.002em', lineHeight: 1.45 },
    overline: { fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', lineHeight: 1.6 },
    button: { fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em', textTransform: 'none' },
  },
  transitions: {
    easing: {
      easeInOut: easing.inOutStrong,
      easeOut: easing.outStrong,
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: easing.outStrong,
    },
    duration: {
      shortest: 120,
      shorter: 160,
      short: 200,
      standard: 240,
      complex: 300,
      enteringScreen: 220,
      leavingScreen: 180,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          backgroundColor: t.canvas,
          color: t.ink,
          fontFamily: fonts.sans,
          fontSize: 14,
          letterSpacing: '-0.01em',
        },
        '.fp-checkbox-box': {
          display: 'inline-flex',
          width: 18,
          height: 18,
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${t.control}`,
          borderRadius: 5,
          background: t.surface,
          color: '#ffffff',
          transition: `border-color 140ms ease-out, background-color 140ms ease-out, transform 140ms ${easing.outStrong}`,
        },
        '.fp-checkbox-box[data-checked="true"]': {
          borderColor: t.accent,
          background: t.accent,
          boxShadow: shadows.filled,
        },
        '.Mui-disabled .fp-checkbox-box': { opacity: 0.5 },
      },
    },

    /* ── botones ─────────────────────────────────────────── */
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': { outline: `2px solid ${t.accent}`, outlineOffset: 2 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: () => ({
          borderRadius: radii.pill,
          fontWeight: 500,
          textTransform: 'none',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          boxShadow: 'none',
          transition: `transform 150ms ${easing.outStrong}, background-color 150ms ease, box-shadow 150ms ease, color 150ms ease, opacity 150ms ease`,
          '&:active': { transform: 'scale(0.97)' },
          '&.Mui-disabled': { opacity: 0.5 },
        }),
        sizeSmall: { padding: '6px 12px', fontSize: 13, minHeight: 30 },
        sizeMedium: { padding: '8px 16px', fontSize: 13.5, minHeight: 36 },
        sizeLarge: { padding: '10px 20px', fontSize: 14, minHeight: 42 },
        startIcon: { marginRight: 6, '& > *:nth-of-type(1)': { fontSize: 18 } },
        endIcon: { marginLeft: 6, '& > *:nth-of-type(1)': { fontSize: 18 } },
        contained: ({ ownerState, theme }) => {
          const c = ownerState.color && ownerState.color !== 'inherit' ? theme.palette[ownerState.color] : null;
          if (!c) {
            return {
              backgroundColor: t.surface,
              color: t.ink,
              boxShadow: shadows.btn,
              '&:hover': { backgroundColor: t.inset, boxShadow: shadows.btn },
              '&.Mui-disabled': { backgroundColor: t.surface, color: t.ink3, boxShadow: shadows.btn },
            };
          }
          return {
            boxShadow: shadows.filled,
            '&:hover': { backgroundColor: c.dark, boxShadow: shadows.filled },
            '&.Mui-disabled': { backgroundColor: c.main, color: c.contrastText, boxShadow: 'none' },
          };
        },
        outlined: ({ ownerState, theme }) => {
          const tone =
            ownerState.color && !['primary', 'secondary', 'inherit'].includes(ownerState.color)
              ? theme.palette[ownerState.color as 'error'].main
              : t.ink;
          return {
            border: 'none',
            backgroundColor: t.surface,
            color: tone,
            boxShadow: `0 0 0 1px ${tone === t.ink ? t.lineStrong : alpha(tone, 0.35)}, ${shadows.xs}`,
            '&:hover': {
              border: 'none',
              backgroundColor: tone === t.ink ? t.inset : alpha(tone, 0.06),
            },
            '&.Mui-disabled': { border: 'none', color: t.ink3 },
          };
        },
        text: ({ ownerState, theme }) => {
          const tone =
            !ownerState.color || ownerState.color === 'inherit'
              ? 'inherit'
              : ownerState.color === 'primary'
                ? t.accentInk
                : ownerState.color === 'secondary'
                  ? t.ink
                  : theme.palette[ownerState.color].main;
          return {
            color: tone,
            '&:hover': { backgroundColor: t.hover },
          };
        },
      },
    },
    MuiLoadingButton: {
      styleOverrides: {
        loadingIndicator: { color: 'inherit' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: radii.control,
          color: ownerState.color && ownerState.color !== 'default' && ownerState.color !== 'inherit'
            ? theme.palette[ownerState.color].main
            : t.ink2,
          transition: `background-color 140ms ease, color 140ms ease, transform 140ms ${easing.outStrong}`,
          '&:hover': { backgroundColor: t.hover2, color: ownerState.color === 'default' || !ownerState.color ? t.ink : undefined },
          '&:active': { transform: 'scale(0.94)' },
        }),
        sizeSmall: { padding: 5 },
        sizeMedium: { padding: 7 },
        sizeLarge: { padding: 10 },
      },
    },
    MuiFab: {
      defaultProps: { color: 'primary' },
      styleOverrides: {
        root: {
          boxShadow: shadows.raised,
          textTransform: 'none',
          '&:active': { boxShadow: shadows.card, transform: 'scale(0.96)' },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 2,
          padding: 2,
          borderRadius: radii.pill,
          backgroundColor: t.field,
          boxShadow: shadows.hairline,
        },
        grouped: {
          border: 'none !important',
          borderRadius: `${radii.pill}px !important`,
          margin: '0 !important',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: radii.pill,
          padding: '5px 12px',
          color: t.ink2,
          fontWeight: 500,
          fontSize: 13,
          textTransform: 'none',
          transition: 'background-color 160ms ease, color 160ms ease, box-shadow 160ms ease',
          '&:hover': { backgroundColor: 'transparent', color: t.ink },
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: t.surface,
            color: t.ink,
            boxShadow: shadows.btn,
          },
        },
        sizeSmall: { padding: '3px 10px', fontSize: 12 },
      },
    },

    /* ── superficies ─────────────────────────────────────── */
    MuiPaper: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: radii.card },
        outlined: { border: `1px solid ${t.line}`, boxShadow: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: radii.card, overflow: 'hidden' },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { padding: '14px 16px' },
        title: { fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.014em' },
        subheader: { fontSize: 13, color: t.ink2 },
        avatar: { marginRight: 12 },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 16, '&:last-child': { paddingBottom: 16 } },
      },
    },
    MuiCardActions: {
      styleOverrides: { root: { padding: '10px 16px', gap: 8 } },
    },
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: radii.card,
          boxShadow: shadows.card,
          '&:before': { display: 'none' },
          '&:not(:last-of-type)': { marginBottom: 8 },
          '&.Mui-expanded': { boxShadow: shadows.raised },
          '&:first-of-type': { borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card },
          '&:last-of-type': { borderBottomLeftRadius: radii.card, borderBottomRightRadius: radii.card },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { minHeight: 48, padding: '0 14px', '&.Mui-expanded': { minHeight: 48 } },
        content: { margin: '10px 0', '&.Mui-expanded': { margin: '10px 0' } },
        expandIconWrapper: { color: t.ink3 },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: { root: { padding: '4px 14px 14px', borderTop: `1px solid ${t.lineSoft}` } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: t.line } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { backgroundColor: t.surface, color: t.ink, boxShadow: `inset 0 -1px 0 ${t.line}` },
      },
    },

    /* ── capas flotantes ─────────────────────────────────── */
    MuiBackdrop: {
      styleOverrides: {
        root: {
          '&:not(.MuiBackdrop-invisible)': {
            backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.55)' : 'rgba(17, 19, 22, 0.32)',
            backdropFilter: 'blur(2px)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: radii.window, boxShadow: shadows.overlay },
        paperFullScreen: { borderRadius: 0 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { padding: '18px 22px 8px', fontSize: 17, fontWeight: 600, letterSpacing: '-0.016em' },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: '8px 22px' },
        dividers: { borderColor: t.line, padding: '16px 22px' },
      },
    },
    MuiDialogContentText: {
      styleOverrides: { root: { color: t.ink2, fontSize: 14 } },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: '12px 22px 18px', gap: 8, '& > :not(:first-of-type)': { marginLeft: 0 } },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderColor: t.line },
        paperAnchorLeft: { borderRight: `1px solid ${t.line}` },
        paperAnchorRight: { borderLeft: `1px solid ${t.line}` },
        modal: { '& .MuiDrawer-paper': { boxShadow: shadows.overlay } },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: { borderRadius: 12, boxShadow: shadows.overlay },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 12, boxShadow: shadows.overlay, minWidth: 180 },
        list: { padding: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 34,
          borderRadius: radii.control,
          padding: '6px 10px',
          fontSize: 13.5,
          gap: 2,
          '&:hover': { backgroundColor: t.hover },
          '&.Mui-selected': { backgroundColor: t.accentTint, color: t.accentInk, fontWeight: 500 },
          '&.Mui-selected:hover': { backgroundColor: t.accentTintHover },
          '&.Mui-focusVisible': { backgroundColor: t.hover, outline: 'none' },
          '& .MuiListItemIcon-root': { minWidth: 28, color: t.ink2 },
        },
        dense: { minHeight: 30 },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: false, enterDelay: 300 },
      styleOverrides: {
        tooltip: {
          backgroundColor: t.tooltipBg,
          color: t.tooltipFg,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '-0.005em',
          borderRadius: 7,
          padding: '5px 9px',
          boxShadow: shadows.lg,
        },
        arrow: { color: t.tooltipBg },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundColor: t.tooltipBg, boxShadow: shadows.overlay },
      },
    },

    /* ── listas y navegación ─────────────────────────────── */
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.control,
          transition: 'background-color 140ms ease, color 140ms ease',
          '&:hover': { backgroundColor: t.hover },
          '&.Mui-selected': { backgroundColor: t.hover2 },
          '&.Mui-selected:hover': { backgroundColor: t.hover2 },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 36, color: t.ink2 } },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontSize: 14, letterSpacing: '-0.01em' },
        secondary: { fontSize: 12.48, color: t.ink3 },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: { fontSize: 12, fontWeight: 500, color: t.ink3, lineHeight: '32px', backgroundColor: 'transparent' },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40 },
        indicator: { height: 2, borderRadius: 2, backgroundColor: t.accent },
        flexContainer: { gap: 4 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          minWidth: 0,
          padding: '8px 12px',
          fontSize: 13.5,
          fontWeight: 500,
          textTransform: 'none',
          letterSpacing: '-0.01em',
          color: t.ink2,
          borderRadius: radii.control,
          transition: 'color 140ms ease, background-color 140ms ease',
          '&:hover': { color: t.ink, backgroundColor: t.hover },
          '&.Mui-selected': { color: t.ink },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: { fontSize: 13, color: t.ink3 },
        separator: { color: t.ink3, marginLeft: 6, marginRight: 6 },
      },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: { root: { color: t.accentInk, fontWeight: 500 } },
    },
    MuiStepper: {
      styleOverrides: { root: { padding: 0 } },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: t.hover2,
          '& .MuiStepIcon-text': { fill: t.ink2, fontWeight: 600, fontSize: 12 },
          '&.Mui-active': { color: t.ink, '& .MuiStepIcon-text': { fill: t.inkInverse } },
          '&.Mui-completed': { color: t.accent },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: 13.5,
          fontWeight: 500,
          color: t.ink3,
          '&.Mui-active': { color: t.ink, fontWeight: 600 },
          '&.Mui-completed': { color: t.ink2, fontWeight: 500 },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: { line: { borderColor: t.lineStrong } },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: radii.control,
          '&.Mui-selected': { backgroundColor: t.ink, color: t.inkInverse, '&:hover': { backgroundColor: t.ink } },
        },
      },
    },

    /* ── campos de formulario ────────────────────────────── */
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: 14, letterSpacing: '-0.01em' },
        input: {
          '&::placeholder': { color: t.ink3, opacity: 1 },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.control,
          backgroundColor: t.surface,
          transition: 'box-shadow 160ms ease, background-color 160ms ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: t.lineStrong,
            transition: 'border-color 160ms ease',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.inputHover },
          '&.Mui-focused': { boxShadow: focusRing },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: t.accent, borderWidth: 1 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: t.red },
          '&.Mui-error.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(t.red, 0.16)}` },
          '&.Mui-disabled': { backgroundColor: t.inset },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: t.line },
        },
        input: { padding: '10px 12px' },
        inputSizeSmall: { padding: '7px 10px' },
        multiline: { padding: '10px 12px' },
      },
    },
    MuiFilledInput: {
      defaultProps: { disableUnderline: true },
      styleOverrides: {
        root: {
          borderRadius: radii.control,
          backgroundColor: t.field,
          boxShadow: shadows.hairline,
          '&:hover': { backgroundColor: t.hover },
          '&.Mui-focused': { backgroundColor: t.surface, boxShadow: `0 0 0 1px ${t.accent}, ${focusRing}` },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': { borderBottomColor: t.lineStrong },
          '&:hover:not(.Mui-disabled):before': { borderBottomColor: t.ink3 },
          '&:after': { borderBottomColor: t.accent },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: t.ink2,
          fontSize: 14,
          letterSpacing: '-0.01em',
          '&.Mui-focused': { color: t.accentInk },
          '&.Mui-error': { color: t.red },
        },
        outlined: {
          transform: 'translate(12px, 10px) scale(1)',
          '&.MuiInputLabel-sizeSmall': { transform: 'translate(10px, 7px) scale(1)' },
          '&.MuiInputLabel-shrink': { transform: 'translate(13px, -8px) scale(0.8)', fontWeight: 500 },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { color: t.ink2, fontSize: 13, fontWeight: 500, '&.Mui-focused': { color: t.accentInk } },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { marginLeft: 2, marginTop: 4, fontSize: 12, color: t.ink3 } },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: { fontSize: 14, letterSpacing: '-0.01em' },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: t.ink3 },
      },
    },
    MuiNativeSelect: {
      styleOverrides: { icon: { color: t.ink3 } },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { padding: '3px 9px' },
          '& .MuiOutlinedInput-root .MuiAutocomplete-input': { padding: '7px 4px 7px 3px' },
          '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': { padding: '2px 6px' },
          '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall .MuiAutocomplete-input': { padding: '4px 4px 4px 4px' },
        },
        paper: { borderRadius: radii.card, boxShadow: shadows.overlay, marginTop: 4 },
        listbox: {
          padding: 4,
          '& .MuiAutocomplete-option': {
            minHeight: 34,
            borderRadius: radii.chip,
            fontSize: 13.5,
            padding: '6px 10px',
            '&.Mui-focused': { backgroundColor: t.hover },
            '&[aria-selected="true"]': { backgroundColor: t.accentTint, color: t.accentInk },
            '&[aria-selected="true"].Mui-focused': { backgroundColor: t.accentTintHover },
          },
        },
        noOptions: { fontSize: 13, color: t.ink3 },
        loading: { fontSize: 13, color: t.ink3 },
        groupLabel: { fontSize: 11.52, fontWeight: 600, color: t.ink3, lineHeight: '28px' },
        tag: { margin: 2 },
        endAdornment: { '& .MuiSvgIcon-root': { color: t.ink3 } },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        icon: <CheckboxBox />,
        checkedIcon: <CheckboxBox checked />,
        indeterminateIcon: <CheckboxBox indeterminate />,
      },
      styleOverrides: {
        root: {
          padding: 7,
          borderRadius: radii.control,
          '&:hover .fp-checkbox-box': { borderColor: t.controlHover },
          '&:active .fp-checkbox-box': { transform: 'scale(0.92)' },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: { color: t.control, '&.Mui-checked': { color: t.accent } },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 46, height: 28, padding: 4 },
        switchBase: {
          padding: 6,
          '&.Mui-checked': {
            transform: 'translateX(18px)',
            color: '#ffffff',
            '& + .MuiSwitch-track': { backgroundColor: t.accent, opacity: 1 },
          },
          '&.Mui-disabled + .MuiSwitch-track': { opacity: 0.4 },
        },
        thumb: { width: 16, height: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.18), 0 1px 1px rgba(0,0,0,0.06)', color: '#ffffff' },
        track: { borderRadius: 999, backgroundColor: t.switchTrack, opacity: 1, transition: 'background-color 200ms ease' },
        sizeSmall: {
          width: 36,
          height: 22,
          padding: 3,
          '& .MuiSwitch-switchBase': { padding: 5, '&.Mui-checked': { transform: 'translateX(14px)' } },
          '& .MuiSwitch-thumb': { width: 12, height: 12 },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        rail: { backgroundColor: t.hover2, opacity: 1 },
        thumb: { boxShadow: shadows.btn, backgroundColor: t.surface, border: `2px solid ${t.accent}` },
      },
    },

    /* ── datos ───────────────────────────────────────────── */
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          const named = ownerState.color && ownerState.color !== 'default' ? theme.palette[ownerState.color] : null;
          const base = {
            height: 24,
            borderRadius: radii.pill,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '-0.005em',
          };
          if (ownerState.variant === 'outlined') {
            return {
              ...base,
              border: 'none',
              backgroundColor: t.surface,
              color: named ? named.main : t.ink2,
              boxShadow: `0 0 0 1px ${named ? alpha(named.main, 0.32) : t.lineStrong}`,
            };
          }
          return {
            ...base,
            backgroundColor: named ? alpha(named.main, isDark ? 0.18 : 0.11) : t.field,
            color: named ? (isDark ? named.light : named.dark) : t.ink2,
            boxShadow: `0 0 0 1px ${named ? alpha(named.main, 0.24) : t.line}`,
            '&.MuiChip-clickable:hover': { backgroundColor: named ? alpha(named.main, 0.17) : t.hover2 },
          };
        },
        sizeSmall: { height: 20, fontSize: 11 },
        label: { paddingLeft: 9, paddingRight: 9 },
        labelSmall: { paddingLeft: 7, paddingRight: 7 },
        icon: { fontSize: 15, marginLeft: 6, color: 'inherit' },
        deleteIcon: { fontSize: 15, color: 'inherit', opacity: 0.55, '&:hover': { color: 'inherit', opacity: 1 } },
        avatar: { width: 18, height: 18, fontSize: 10 },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { fontSize: 10.4, fontWeight: 600, height: 17, minWidth: 17, padding: '0 5px', boxShadow: `0 0 0 2px ${t.surface}` },
        dot: { height: 8, minWidth: 8, padding: 0 },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontSize: 13, fontWeight: 600, letterSpacing: 0 },
        colorDefault: { backgroundColor: t.hover2, color: t.ink2 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radii.card, fontSize: 13.5, alignItems: 'flex-start', padding: '8px 12px' },
        standardSuccess: { backgroundColor: t.greenTint, color: t.greenInk, boxShadow: `0 0 0 1px ${alpha(t.green, 0.24)}` },
        standardInfo: { backgroundColor: t.blueTint, color: t.blueInk, boxShadow: `0 0 0 1px ${alpha(t.blue, 0.22)}` },
        standardWarning: { backgroundColor: t.orangeTint, color: t.orangeInk, boxShadow: `0 0 0 1px ${alpha(t.orange, 0.24)}` },
        standardError: { backgroundColor: t.redTint, color: t.redInk, boxShadow: `0 0 0 1px ${alpha(t.red, 0.24)}` },
        outlined: { backgroundColor: t.surface },
        icon: { padding: '8px 0', marginRight: 10, opacity: 1 },
        message: { padding: '8px 0' },
      },
    },
    MuiAlertTitle: {
      styleOverrides: { root: { fontWeight: 600, fontSize: 14, marginBottom: 2 } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 4, borderRadius: 999, backgroundColor: t.hover2 },
        bar: { borderRadius: 999 },
      },
    },
    MuiCircularProgress: {
      defaultProps: { thickness: 4.2 },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: { root: { backgroundColor: t.hover2 }, rounded: { borderRadius: radii.control } },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          '&.MuiPaper-root': { borderRadius: radii.card, boxShadow: shadows.card },
        },
      },
    },
    MuiTable: {
      styleOverrides: { root: { borderCollapse: 'separate', borderSpacing: 0 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            ...tableHeadCell,
            borderBottom: '1px solid var(--table-head-line)',
            whiteSpace: 'nowrap',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${t.gridLine}`, padding: '10px 12px', fontSize: 13, letterSpacing: '-0.006em' },
        sizeSmall: { padding: '7px 10px' },
        stickyHeader: { backgroundColor: 'var(--table-head)' },
        footer: { color: t.ink2 },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 100ms ease',
          '&.MuiTableRow-hover:hover': { backgroundColor: t.hover },
          '&:last-of-type > .MuiTableCell-body': { borderBottom: 'none' },
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: alpha(t.accent, 0.06) },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { color: t.ink2, fontSize: 13 },
        selectLabel: { fontSize: 13 },
        displayedRows: { fontSize: 13, fontVariantNumeric: 'tabular-nums' },
      },
    },
    /* ── fechas ──────────────────────────────────────────── */
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontSize: 13,
          borderRadius: radii.control,
          '&.Mui-selected': { backgroundColor: t.ink, color: t.inkInverse, '&:hover, &:focus': { backgroundColor: t.ink } },
          '&.MuiPickersDay-today:not(.Mui-selected)': { border: `1px solid ${t.accent}`, color: t.accentInk },
        },
      },
    },
    MuiPickersPopper: {
      styleOverrides: { paper: { borderRadius: 14, boxShadow: shadows.overlay } },
    },
  },
});
};

/** Theme claro (compatibilidad: skyBlueTheme y quien lo importe directo). */
export const fieldpartnerTheme: Theme = createFieldpartnerTheme('light');
