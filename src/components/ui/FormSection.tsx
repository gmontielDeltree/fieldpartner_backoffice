import React from "react";
import { Box, Button, IconButton, Step, StepLabel, Stepper, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import { AttachFileRounded, CloseRounded, FileUploadOutlined } from "@mui/icons-material";

/* ─────────────────────────────────────────────────────────
 * FORMULARIOS (maestros y usuarios)
 *  FormLayout  — contenedor de la pantalla de alta / edición.
 *  FormSteps   — stepper compacto, alineado a la izquierda.
 *  FormSection — sección en card con título chico e ícono quieto.
 *  FormFooter  — acciones abajo a la derecha, pegajosas al pie.
 *  FormFile    — adjunto: nombre del archivo, elegir y quitar.
 *  FormValue   — par etiqueta / valor para resúmenes de lectura.
 * Solo presentación: envuelven lo que ya hacía cada página.
 * ───────────────────────────────────────────────────────── */

const enter = (delay = 0) => `fade-up 420ms var(--ease-out-strong) ${delay}ms both`;

/** Contenedor de una pantalla de formulario (ancho máximo + aire). */
export const FormLayout: React.FC<{ children: React.ReactNode; maxWidth?: number | string; sx?: SxProps<Theme> }> = ({
  children,
  maxWidth = 1040,
  sx,
}) => (
  <Box
    sx={{
      flex: "1 1 auto",
      alignSelf: "flex-start",
      width: "100%",
      minWidth: 0,
      maxWidth,
      mx: "auto",
      px: { xs: 2, md: 3 },
      pt: { xs: 2, md: 3 },
      pb: 1,
      ...((sx as object) || {}),
    }}
  >
    {children}
  </Box>
);

/** Stepper compacto debajo del encabezado. */
export const FormSteps: React.FC<{ steps: string[]; activeStep: number; sx?: SxProps<Theme> }> = ({ steps, activeStep, sx }) => (
  <Box data-tour="form-steps" sx={{ mb: 2.5, animation: enter(40), ...((sx as object) || {}) }}>
    <Stepper
      activeStep={activeStep}
      sx={{
        maxWidth: Math.max(360, steps.length * 210),
        "& .MuiStepLabel-label": { fontSize: 13 },
        "& .MuiStepConnector-root": { minWidth: 12 },
      }}
    >
      {steps.map(label => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </Box>
);

export interface FormSectionProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  /** algo chico a la derecha del título (un total, un botón) */
  actions?: React.ReactNode;
  children: React.ReactNode;
  /** escalonado de la entrada, en ms */
  delay?: number;
  /** contenido sin padding (tablas que llenan la card) */
  flush?: boolean;
  sx?: SxProps<Theme>;
}

/** Sección de formulario: card con título chico e ícono en --ink-3. */
export const FormSection: React.FC<FormSectionProps> = ({ title, icon, description, actions, children, delay = 60, flush, sx }) => (
  <Box
    component="section"
    data-tour="form-section"
    sx={{
      mb: 2,
      borderRadius: "12px",
      background: "var(--surface)",
      boxShadow: "var(--shadow-card)",
      overflow: flush ? "hidden" : undefined,
      animation: enter(delay),
      ...((sx as object) || {}),
    }}
  >
    {(title || actions) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minHeight: 24,
          px: 2,
          pt: 1.75,
          pb: flush ? 1.5 : 0,
          borderBottom: flush ? "1px solid var(--line)" : undefined,
        }}
      >
        {icon && (
          <Box sx={{ display: "flex", flexShrink: 0, color: "var(--ink-3)", "& svg": { fontSize: 18 } }}>{icon}</Box>
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {title && (
            <Typography
              component="h2"
              sx={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.012em", color: "var(--ink)" }}
            >
              {title}
            </Typography>
          )}
          {description && <Typography sx={{ mt: 0.25, fontSize: 12.5, color: "var(--ink-3)" }}>{description}</Typography>}
        </Box>
        {actions && <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>{actions}</Box>}
      </Box>
    )}
    <Box sx={{ p: flush ? 0 : 2, pt: flush ? 0 : title ? 1.75 : 2 }}>{children}</Box>
  </Box>
);

/** Barra de acciones: Cancelar/Atrás `outlined`, Guardar `contained`.
 *  `inset`: padding inferior del contenedor que scrollea (en unidades del
 *  theme). Dentro de TemplateLayout es 2: la barra baja hasta el borde
 *  para que no se vea contenido pasando por debajo. */
export const FormFooter: React.FC<{ children: React.ReactNode; start?: React.ReactNode; sticky?: boolean; inset?: number; sx?: SxProps<Theme> }> = ({
  children,
  start,
  sticky = true,
  inset = 0,
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
      pt: 1.5,
      pb: 1.5,
      ...(sticky
        ? {
            position: "sticky" as const,
            bottom: (theme: Theme) => theme.spacing(-inset),
            zIndex: 5,
            mb: -inset,
            pb: 1.5 + inset,
            px: 1.25,
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
    {start && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: "auto", fontSize: 12.5, color: "var(--ink-3)" }}>{start}</Box>
    )}
    {children}
  </Box>
);

export interface FormFileProps {
  /** texto del botón para elegir el archivo */
  label: React.ReactNode;
  fileName?: string;
  emptyText?: React.ReactNode;
  accept?: string;
  icon?: React.ReactNode;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
  removeLabel?: string;
  sx?: SxProps<Theme>;
}

/** Adjunto de un formulario: ficha hundida con el nombre del archivo,
 *  botón para elegirlo y, si hay uno, la X para quitarlo. */
export const FormFile: React.FC<FormFileProps> = ({ label, fileName, emptyText, accept, icon, onChange, onRemove, removeLabel = "Quitar", sx }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      minHeight: 52,
      px: 1.25,
      py: 1,
      borderRadius: "10px",
      background: "var(--inset)",
      boxShadow: "var(--shadow-hairline)",
      ...((sx as object) || {}),
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: 32,
        height: 32,
        borderRadius: "8px",
        background: fileName ? "var(--accent-tint)" : "var(--surface)",
        boxShadow: fileName ? "none" : "var(--shadow-hairline)",
        color: fileName ? "var(--accent-ink)" : "var(--ink-3)",
        "& svg": { fontSize: 18 },
      }}
    >
      {icon ?? <AttachFileRounded />}
    </Box>
    <Box
      title={fileName || undefined}
      sx={{
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: 13,
        fontWeight: fileName ? 500 : 400,
        color: fileName ? "var(--ink)" : "var(--ink-3)",
      }}
    >
      {fileName || emptyText}
    </Box>
    {fileName && onRemove && (
      <Tooltip title={removeLabel}>
        <IconButton size="small" aria-label={removeLabel} onClick={onRemove} sx={{ "&:hover": { color: "var(--red)", backgroundColor: "var(--red-tint)" } }}>
          <CloseRounded sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    )}
    <Button component="label" variant="outlined" size="small" startIcon={<FileUploadOutlined />} sx={{ flexShrink: 0 }}>
      {label}
      <input type="file" hidden accept={accept} onChange={onChange} />
    </Button>
  </Box>
);

/** Par etiqueta / valor (resúmenes y fichas de solo lectura). */
export const FormValue: React.FC<{ label: React.ReactNode; children: React.ReactNode; sx?: SxProps<Theme> }> = ({ label, children, sx }) => (
  <Box sx={{ minWidth: 0, ...((sx as object) || {}) }}>
    <Typography component="div" sx={{ mb: 0.5, fontSize: 12, color: "var(--ink-3)" }}>
      {label}
    </Typography>
    <Box sx={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", overflowWrap: "anywhere" }}>{children}</Box>
  </Box>
);
