/**
 * Barrel export para el sistema de alertas con AlertTitle
 * Sistema optimizado sin bucles de render
 */

// Sistema principal con AlertTitle
export { AlertProvider, useAlertContext } from './AlertProvider';
export { useAlert } from './useAlert';
export { AlertContainer } from './AlertContainer';

// Componentes adicionales
export { AlertErrorBoundary } from './AlertErrorBoundary';

// Versión simplificada (mantenida por compatibilidad)
export { SimpleAlertProvider, useSimpleAlertContext } from './SimpleAlertProvider';
export { useSimpleAlert } from './useSimpleAlert';

// Tipos
export type { AlertMessage } from './AlertProvider';