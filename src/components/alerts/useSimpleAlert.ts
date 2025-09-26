/**
 * Hook simplificado para usar el sistema de alertas
 * Versión sin optimizaciones para evitar bucles de render
 */

import { useSimpleAlertContext } from './SimpleAlertProvider';

export interface UseSimpleAlertReturn {
  // Métodos básicos
  showAlert: (alert: { message: string; type: 'success' | 'error' | 'warning' | 'info'; duration?: number }) => string;
  hideAlert: (id: string) => void;
  hideAllAlerts: () => void;
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;

  // Métodos especializados
  showLoadingSuccess: (entity: string, action: string) => string;
  showLoadingError: (entity: string, action: string, error?: string) => string;
  showValidationError: (message: string) => string;
  showNetworkError: () => string;

  // Estado
  alerts: any[];
  hasAlerts: boolean;
  alertCount: number;
}

export const useSimpleAlert = (): UseSimpleAlertReturn => {
  const context = useSimpleAlertContext();

  const showLoadingSuccess = (entity: string, action: string): string => {
    const messages = {
      crear: `${entity} creado exitosamente`,
      actualizar: `${entity} actualizado exitosamente`,
      eliminar: `${entity} eliminado exitosamente`,
      guardar: `${entity} guardado exitosamente`,
    };

    const message = messages[action as keyof typeof messages] ||
                   `${entity} ${action} exitosamente`;

    return context.showSuccess(message);
  };

  const showLoadingError = (entity: string, action: string, error?: string): string => {
    const messages = {
      crear: `Error al crear ${entity.toLowerCase()}`,
      actualizar: `Error al actualizar ${entity.toLowerCase()}`,
      eliminar: `Error al eliminar ${entity.toLowerCase()}`,
      guardar: `Error al guardar ${entity.toLowerCase()}`,
      cargar: `Error al cargar ${entity.toLowerCase()}`,
    };

    let message = messages[action as keyof typeof messages] ||
                  `Error al ${action} ${entity.toLowerCase()}`;

    if (error) {
      message += `: ${error}`;
    }

    return context.showError(message, 8000);
  };

  const showValidationError = (message: string): string => {
    return context.showWarning(`Validación: ${message}`, 6000);
  };

  const showNetworkError = (): string => {
    return context.showError(
      'Error de conexión. Verifique su conexión a internet e intente nuevamente.',
      10000
    );
  };

  return {
    // Métodos básicos del contexto
    showAlert: context.showAlert,
    hideAlert: context.hideAlert,
    hideAllAlerts: context.hideAllAlerts,
    showSuccess: context.showSuccess,
    showError: context.showError,
    showWarning: context.showWarning,
    showInfo: context.showInfo,

    // Métodos especializados
    showLoadingSuccess,
    showLoadingError,
    showValidationError,
    showNetworkError,

    // Estado
    alerts: context.alerts,
    hasAlerts: context.alerts.length > 0,
    alertCount: context.alerts.length,
  };
};