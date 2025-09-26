/**
 * Estandarización de colores de botones para el sistema
 * Mantener consistencia visual en toda la aplicación
 */

// ============================
// COLORES ESTÁNDAR DE BOTONES
// ============================

/**
 * Colores estándar para botones según su función
 */
export const BUTTON_COLORS = {
  // Acciones principales
  PRIMARY: 'primary',         // Azul - Acciones principales (Siguiente, Buscar, etc.)

  // Acciones de confirmación/éxito
  SUCCESS: 'success',         // Verde - Crear, Guardar, Confirmar

  // Acciones destructivas
  ERROR: 'error',            // Rojo - Eliminar, Desactivar

  // Acciones de advertencia
  WARNING: 'warning',        // Naranja - Advertencias, Cambios importantes

  // Acciones neutrales/secundarias
  INHERIT: 'inherit',        // Gris - Cancelar, Anterior, Limpiar

  // Información
  INFO: 'info',             // Celeste - Información, Detalles, Ver más

  // Acciones secundarias
  SECONDARY: 'secondary'     // Morado - Acciones secundarias
} as const;

// ============================
// VARIANTES DE BOTONES
// ============================

/**
 * Variantes estándar de botones
 */
export const BUTTON_VARIANTS = {
  CONTAINED: 'contained',    // Botón sólido - Para acciones principales
  OUTLINED: 'outlined',      // Botón con borde - Para acciones secundarias
  TEXT: 'text'              // Botón de texto - Para acciones mínimas
} as const;

// ============================
// TAMAÑOS DE BOTONES
// ============================

/**
 * Tamaños estándar de botones
 */
export const BUTTON_SIZES = {
  SMALL: 'small',           // Botones pequeños - Acciones en tablas
  MEDIUM: 'medium',         // Botones medianos - Tamaño por defecto
  LARGE: 'large'            // Botones grandes - CTAs importantes
} as const;

// ============================
// CONFIGURACIONES PREDEFINIDAS
// ============================

/**
 * Configuraciones predefinidas para casos comunes
 */
export const BUTTON_CONFIGS = {
  // Botones de navegación
  NEXT: {
    variant: BUTTON_VARIANTS.CONTAINED,
    color: BUTTON_COLORS.PRIMARY,
    size: BUTTON_SIZES.LARGE
  },

  PREVIOUS: {
    variant: BUTTON_VARIANTS.OUTLINED,
    color: BUTTON_COLORS.INHERIT,
    size: BUTTON_SIZES.LARGE
  },

  // Botones de acciones principales
  CREATE: {
    variant: BUTTON_VARIANTS.CONTAINED,
    color: BUTTON_COLORS.SUCCESS,
    size: BUTTON_SIZES.LARGE
  },

  SAVE: {
    variant: BUTTON_VARIANTS.CONTAINED,
    color: BUTTON_COLORS.SUCCESS,
    size: BUTTON_SIZES.LARGE
  },

  UPDATE: {
    variant: BUTTON_VARIANTS.CONTAINED,
    color: BUTTON_COLORS.PRIMARY,
    size: BUTTON_SIZES.LARGE
  },

  // Botones de acciones destructivas
  DELETE: {
    variant: BUTTON_VARIANTS.CONTAINED,
    color: BUTTON_COLORS.ERROR,
    size: BUTTON_SIZES.MEDIUM
  },

  DEACTIVATE: {
    variant: BUTTON_VARIANTS.OUTLINED,
    color: BUTTON_COLORS.ERROR,
    size: BUTTON_SIZES.MEDIUM
  },

  // Botones de cancelación
  CANCEL: {
    variant: BUTTON_VARIANTS.OUTLINED,
    color: BUTTON_COLORS.INHERIT,
    size: BUTTON_SIZES.MEDIUM
  },

  // Botones de búsqueda
  SEARCH: {
    variant: BUTTON_VARIANTS.CONTAINED,
    color: BUTTON_COLORS.PRIMARY,
    size: BUTTON_SIZES.MEDIUM
  },

  CLEAR_FILTERS: {
    variant: BUTTON_VARIANTS.OUTLINED,
    color: BUTTON_COLORS.INHERIT,
    size: BUTTON_SIZES.SMALL
  },

  // Botones de información
  VIEW_DETAILS: {
    variant: BUTTON_VARIANTS.OUTLINED,
    color: BUTTON_COLORS.INFO,
    size: BUTTON_SIZES.SMALL
  },

  EDIT: {
    variant: BUTTON_VARIANTS.OUTLINED,
    color: BUTTON_COLORS.PRIMARY,
    size: BUTTON_SIZES.SMALL
  },

  // Botones de formulario
  SUBMIT: {
    variant: BUTTON_VARIANTS.CONTAINED,
    color: BUTTON_COLORS.SUCCESS,
    size: BUTTON_SIZES.LARGE
  },

  RESET: {
    variant: BUTTON_VARIANTS.OUTLINED,
    color: BUTTON_COLORS.WARNING,
    size: BUTTON_SIZES.MEDIUM
  }
} as const;

// ============================
// FUNCIONES HELPER
// ============================

/**
 * Obtener configuración de botón por tipo
 */
export const getButtonConfig = (type: keyof typeof BUTTON_CONFIGS) => {
  return BUTTON_CONFIGS[type];
};

/**
 * Crear configuración personalizada de botón
 */
export const createButtonConfig = (
  variant: keyof typeof BUTTON_VARIANTS,
  color: keyof typeof BUTTON_COLORS,
  size: keyof typeof BUTTON_SIZES = 'MEDIUM'
) => ({
  variant: BUTTON_VARIANTS[variant],
  color: BUTTON_COLORS[color],
  size: BUTTON_SIZES[size]
});

// ============================
// GUÍA DE USO
// ============================

/**
 * GUÍA DE USO DE COLORES:
 *
 * 🔵 PRIMARY (primary) - Azul
 * - Navegación: Siguiente, Continuar
 * - Búsqueda: Buscar, Filtrar
 * - Edición: Editar, Actualizar
 *
 * 🟢 SUCCESS (success) - Verde
 * - Creación: Crear, Guardar, Nuevo
 * - Confirmación: Confirmar, Aceptar
 * - Finalización: Completar, Enviar
 *
 * 🔴 ERROR (error) - Rojo
 * - Eliminación: Eliminar, Borrar
 * - Desactivación: Desactivar, Suspender
 * - Acciones críticas: Cancelar suscripción
 *
 * 🟠 WARNING (warning) - Naranja
 * - Advertencias: Resetear, Limpiar datos
 * - Cambios importantes: Cambiar plan
 *
 * 🔘 INHERIT (inherit) - Gris
 * - Cancelación: Cancelar, Cerrar
 * - Navegación hacia atrás: Anterior, Volver
 * - Limpiar: Limpiar filtros, Reset
 *
 * 🔵 INFO (info) - Celeste
 * - Información: Ver detalles, Más información
 * - Exportar: Descargar, Exportar
 *
 * 🟣 SECONDARY (secondary) - Morado
 * - Acciones secundarias: Duplicar, Copiar
 * - Funciones adicionales: Configurar, Personalizar
 */

/**
 * EJEMPLOS DE USO:
 *
 * // Usar configuración predefinida
 * const createConfig = getButtonConfig('CREATE');
 * <Button {...createConfig}>Crear Cliente</Button>
 *
 * // Crear configuración personalizada
 * const customConfig = createButtonConfig('OUTLINED', 'WARNING', 'SMALL');
 * <Button {...customConfig}>Resetear</Button>
 *
 * // Uso directo con constantes
 * <Button
 *   variant={BUTTON_VARIANTS.CONTAINED}
 *   color={BUTTON_COLORS.SUCCESS}
 *   size={BUTTON_SIZES.LARGE}
 * >
 *   Guardar
 * </Button>
 */