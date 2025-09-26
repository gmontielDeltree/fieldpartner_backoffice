/**
 * useAlert - Hook personalizado para usar el sistema de alertas
 * Proporciona una interfaz simple y limpia para mostrar alertas en componentes
 */

import { useAlertContext, AlertMessage } from './AlertProvider';

export interface UseAlertReturn {
  // Métodos básicos
  showAlert: (alert: Omit<AlertMessage, 'id'>) => string;
  hideAlert: (id: string) => void;
  hideAllAlerts: () => void;

  // Métodos de conveniencia
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;

  // Métodos especializados para casos comunes
  showLoadingSuccess: (entity: string, action: string, title?: string) => string;
  showLoadingError: (entity: string, action: string, error?: string, title?: string) => string;
  showValidationError: (message: string, title?: string) => string;
  showNetworkError: (title?: string) => string;

  // Estado
  alerts: AlertMessage[];
  hasAlerts: boolean;
  alertCount: number;
}

export const useAlert = (): UseAlertReturn => {
  const context = useAlertContext();

  // Métodos especializados para casos comunes en la aplicación
  const showLoadingSuccess = (entity: string, action: string, title?: string): string => {
    const messages = {
      crear: `${entity} creado exitosamente`,
      actualizar: `${entity} actualizado exitosamente`,
      eliminar: `${entity} eliminado exitosamente`,
      guardar: `${entity} guardado exitosamente`,
      desactivar: `${entity} desactivado exitosamente`,
    };

    const message = messages[action as keyof typeof messages] ||
                   `${entity} ${action} exitosamente`;

    const alertTitle = title || '¡Éxito!';

    return context.showSuccess(message, alertTitle);
  };

  const showLoadingError = (entity: string, action: string, error?: string, title?: string): string => {
    const messages = {
      crear: `Error al crear ${entity.toLowerCase()}`,
      actualizar: `Error al actualizar ${entity.toLowerCase()}`,
      eliminar: `Error al eliminar ${entity.toLowerCase()}`,
      guardar: `Error al guardar ${entity.toLowerCase()}`,
      cargar: `Error al cargar ${entity.toLowerCase()}`,
      desactivar: `Error al desactivar ${entity.toLowerCase()}`,
    };

    let message = messages[action as keyof typeof messages] ||
                  `Error al ${action} ${entity.toLowerCase()}`;

    if (error) {
      message += `: ${error}`;
    }

    const alertTitle = title || 'Error';

    return context.showError(message, alertTitle, 8000); // Errores duran más tiempo
  };

  const showValidationError = (message: string, title?: string): string => {
    const alertTitle = title || 'Validación';
    return context.showWarning(message, alertTitle, 6000);
  };

  const showNetworkError = (title?: string): string => {
    const alertTitle = title || 'Error de Conexión';
    return context.showError(
      'Verifique su conexión a internet e intente nuevamente.',
      alertTitle,
      10000
    );
  };

  // Retornar el objeto sin memoización excesiva
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