import React from "react";
import { Box, IconButton, Step, StepLabel, Stepper, SxProps, Theme, Typography } from "@mui/material";
import { AddRounded } from "@mui/icons-material";

/* ─────────────────────────────────────────────────────────
 * KIT DE FORMULARIO (stock y comercial)
 * Piezas de presentación para las altas: contenedor de página,
 * stepper compacto a la izquierda, secciones en card con título
 * chico, barra de acciones abajo a la derecha (pegajosa si hace
 * falta) y título de diálogo con ícono en ficha tenue.
 * No tienen lógica: solo envuelven lo que ya hacía cada página.
 * ───────────────────────────────────────────────────────── */

const fadeUp = (delay = 0) => `fade-up 420ms var(--ease-out-strong) ${delay}ms both`;

/** Contenedor de una pantalla de alta (ancho máximo + padding + entrada). */
export const FormPage: React.FC<{ children: React.ReactNode; maxWidth?: number | string; sx?: SxProps<Theme> }> = ({
  children,
  maxWidth = 1180,
  sx,
}) => (
  <Box
    sx={{
      width: "100%",
      maxWidth,
      mx: "auto",
      px: { xs: 0.5, md: 1 },
      py: { xs: 1, md: 1.5 },
      ...((sx as object) || {}),
    }}
  >
    {children}
  </Box>
);

/** Stepper compacto, alineado a la izquierda, arriba del formulario. */
type StepDef = string | { text: string; error?: boolean; optional?: React.ReactNode };

export const FormStepper: React.FC<{ steps: StepDef[]; activeStep: number; sx?: SxProps<Theme> }> = ({ steps, activeStep, sx }) => (
  <Box
    data-tour="form-steps"
    sx={{
      mb: 2,
      px: 2,
      py: 1.5,
      borderRadius: "12px",
      background: "var(--surface)",
      boxShadow: "var(--shadow-card)",
      animation: fadeUp(40),
      ...((sx as object) || {}),
    }}
  >
    <Stepper
      activeStep={activeStep}
      sx={{
        maxWidth: Math.max(320, steps.length * 190),
        "& .MuiStepLabel-label": { fontSize: 13 },
        "& .MuiStepConnector-root": { minWidth: 16 },
      }}
    >
      {steps.map(step => {
        const { text, ...labelProps } = typeof step === "string" ? { text: step } : step;
        return (
          <Step key={text}>
            <StepLabel {...labelProps}>{text}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  </Box>
);

export interface FormCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  /** algo chico a la derecha del título (un total, un estado) */
  aside?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  /** sin padding interno (para tablas que llenan la card) */
  flush?: boolean;
  sx?: SxProps<Theme>;
}

/** Sección de formulario en card con título chico. */
export const FormCard: React.FC<FormCardProps> = ({ title, subtitle, icon, aside, children, delay = 60, flush, sx }) => (
  <Box
    component="section"
    data-tour="form-section"
    sx={{
      mb: 2,
      borderRadius: "12px",
      background: "var(--surface)",
      boxShadow: "var(--shadow-card)",
      animation: fadeUp(delay),
      overflow: flush ? "hidden" : undefined,
      ...((sx as object) || {}),
    }}
  >
    {(title || aside) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2,
          pt: 1.75,
          pb: flush ? 1.5 : 0.5,
          borderBottom: flush ? "1px solid var(--line)" : undefined,
        }}
      >
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              flexShrink: 0,
              borderRadius: "8px",
              background: "var(--inset)",
              boxShadow: "var(--shadow-hairline)",
              color: "var(--ink-2)",
              "& svg": { fontSize: 16 },
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {title && (
            <Typography component="h2" sx={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.012em", color: "var(--ink)", lineHeight: 1.3 }}>
              {title}
            </Typography>
          )}
          {subtitle && <Typography sx={{ fontSize: 12.5, color: "var(--ink-3)", mt: 0.25 }}>{subtitle}</Typography>}
        </Box>
        {aside && <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>{aside}</Box>}
      </Box>
    )}
    <Box sx={{ p: flush ? 0 : 2, pt: flush ? 0 : title ? 1.5 : 2 }}>{children}</Box>
  </Box>
);

/** Barra de acciones abajo a la derecha (Cancelar outlined, Guardar contained). */
export const FormActions: React.FC<{ children: React.ReactNode; sticky?: boolean; start?: React.ReactNode; sx?: SxProps<Theme> }> = ({
  children,
  sticky,
  start,
  sx,
}) => (
  <Box
    data-tour="form-actions"
    sx={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 1,
      mt: 1,
      py: 1.5,
      ...(sticky
        ? {
            position: "sticky",
            bottom: 0,
            zIndex: 5,
            mx: { xs: -0.5, md: -1 },
            px: { xs: 0.5, md: 1 },
            // vidrio: deja ver el mapa de fondo sin perder legibilidad
            background: "var(--glass-bar)",
            backdropFilter: "blur(12px) saturate(1.3)",
            WebkitBackdropFilter: "blur(12px) saturate(1.3)",
            borderTop: "1px solid var(--line)",
          }
        : {}),
      ...((sx as object) || {}),
    }}
  >
    {start && <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: "auto" }}>{start}</Box>}
    {children}
  </Box>
);

type Tone = "accent" | "blue" | "orange" | "red" | "neutral";
const TONE_BG: Record<Tone, [string, string]> = {
  accent: ["var(--accent-tint)", "var(--accent-ink)"],
  blue: ["var(--blue-tint)", "var(--blue)"],
  orange: ["var(--orange-tint)", "var(--orange)"],
  red: ["var(--red-tint)", "var(--red)"],
  neutral: ["var(--inset)", "var(--ink-2)"],
};

/** Contenido del título de un diálogo: ícono en ficha tenue + texto (+ algo chico al lado). */
export const DialogHeading: React.FC<{ icon: React.ReactNode; tone?: Tone; children: React.ReactNode; meta?: React.ReactNode; subtitle?: React.ReactNode }> = ({
  icon,
  tone = "accent",
  children,
  meta,
  subtitle,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: 34,
        height: 34,
        borderRadius: "10px",
        background: TONE_BG[tone][0],
        color: TONE_BG[tone][1],
        "& svg": { fontSize: 19 },
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Box component="span" sx={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.016em", color: "var(--ink)" }}>
          {children}
        </Box>
        {meta}
      </Box>
      {subtitle && <Box sx={{ fontSize: 12.5, fontWeight: 400, color: "var(--ink-3)", mt: 0.25 }}>{subtitle}</Box>}
    </Box>
  </Box>
);

/** Botón redondo de "agregar fila" para las filas de carga de las tablas. */
export const AddRowButton: React.FC<{ onClick: () => void; disabled?: boolean; label?: string }> = ({ onClick, disabled, label = "add" }) => (
  <IconButton
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    size="small"
    sx={{
      width: 32,
      height: 32,
      color: "common.white",
      background: "var(--accent)",
      boxShadow: "0 1px 2px rgba(16, 24, 40, 0.12)",
      transition: "background-color 140ms ease, transform 140ms var(--ease-out-strong)",
      "&:hover": { background: "var(--accent-ink)" },
      "&:active": { transform: "scale(0.97)" },
      "&.Mui-disabled": { background: "var(--hover-2)", color: "var(--ink-3)" },
    }}
  >
    <AddRounded sx={{ fontSize: 18 }} />
  </IconButton>
);

/** Fila vacía de una tabla de carga: ícono tenue + pista. */
export const EmptyRowHint: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, py: 2.5, color: "var(--ink-3)", fontSize: 13 }}>
    {icon && <Box sx={{ display: "flex", "& svg": { fontSize: 18 } }}>{icon}</Box>}
    {children}
  </Box>
);

/** Título de sección dentro de una card (para los pasos que ya traen su propio título). */
export const FormSectionTitle: React.FC<{ icon?: React.ReactNode; children: React.ReactNode; aside?: React.ReactNode; sx?: SxProps<Theme> }> = ({
  icon,
  children,
  aside,
  sx,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, ...((sx as object) || {}) }}>
    {icon && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          flexShrink: 0,
          borderRadius: "8px",
          background: "var(--inset)",
          boxShadow: "var(--shadow-hairline)",
          color: "var(--ink-2)",
          "& svg": { fontSize: 16 },
        }}
      >
        {icon}
      </Box>
    )}
    <Typography component="h2" sx={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.012em", color: "var(--ink)", lineHeight: 1.3 }}>
      {children}
    </Typography>
    {aside && <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>{aside}</Box>}
  </Box>
);

/** Valor calculado / de solo lectura con la altura de un input (reemplaza las cajas grises de ListItemText). */
export const StaticField: React.FC<{ label: React.ReactNode; children: React.ReactNode; sx?: SxProps<Theme> }> = ({ label, children, sx }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 1,
      minHeight: 40,
      px: 1.5,
      borderRadius: "8px",
      background: "var(--inset)",
      boxShadow: "var(--shadow-hairline)",
      ...((sx as object) || {}),
    }}
  >
    <Typography component="span" sx={{ fontSize: 12.5, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
      {label}
    </Typography>
    <Box component="span" sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums", textAlign: "right", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
      {children}
    </Box>
  </Box>
);

/** Par etiqueta / valor para resúmenes de solo lectura. */
export const InfoItem: React.FC<{ label: React.ReactNode; children: React.ReactNode; sx?: SxProps<Theme> }> = ({ label, children, sx }) => (
  <Box sx={{ minWidth: 0, ...((sx as object) || {}) }}>
    <Typography component="div" sx={{ fontSize: 12, color: "var(--ink-3)", mb: 0.25 }}>
      {label}
    </Typography>
    <Box sx={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>{children}</Box>
  </Box>
);
