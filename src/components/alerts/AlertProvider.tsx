/**
 * AlertProvider - Sistema de alertas reutilizable para toda la aplicación
 * Utiliza Material-UI Snackbar y Alert para consistencia visual
 * Soporta múltiples alertas simultáneas con queue
 */

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

export interface AlertMessage {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: React.ReactNode;
  persistent?: boolean;
}

interface AlertContextType {
  alerts: AlertMessage[];
  showAlert: (alert: Omit<AlertMessage, 'id'>) => string;
  hideAlert: (id: string) => void;
  hideAllAlerts: () => void;
  showSuccess: (message: string, title?: string, duration?: number) => string;
  showError: (message: string, title?: string, duration?: number) => string;
  showWarning: (message: string, title?: string, duration?: number) => string;
  showInfo: (message: string, title?: string, duration?: number) => string;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
  maxAlerts?: number;
  defaultDuration?: number;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({
  children,
  maxAlerts = 3,
  defaultDuration = 5000,
}) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // Generar ID único - sin useCallback para evitar dependencias circulares
  const generateId = (): string => {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Ocultar alerta específica
  const hideAlert = (id: string): void => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  // Mostrar alerta
  const showAlert = (alertData: Omit<AlertMessage, 'id'>): string => {
    const id = generateId();
    const newAlert: AlertMessage = {
      ...alertData,
      id,
      duration: alertData.duration ?? defaultDuration,
    };

    setAlerts(prevAlerts => {
      const updatedAlerts = [newAlert, ...prevAlerts];
      // Limitar número de alertas
      return updatedAlerts.slice(0, maxAlerts);
    });

    // Auto-hide si no es persistente
    if (!newAlert.persistent && newAlert.duration && newAlert.duration > 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }, newAlert.duration);
    }

    return id;
  };

  // Limpiar todas las alertas
  const hideAllAlerts = (): void => {
    setAlerts([]);
  };

  // Métodos de conveniencia para diferentes tipos de alertas
  const showSuccess = (message: string, title?: string, duration?: number): string => {
    return showAlert({ title, message, type: 'success', duration });
  };

  const showError = (message: string, title?: string, duration?: number): string => {
    return showAlert({ title, message, type: 'error', duration: duration || 8000 });
  };

  const showWarning = (message: string, title?: string, duration?: number): string => {
    return showAlert({ title, message, type: 'warning', duration: duration || 6000 });
  };

  const showInfo = (message: string, title?: string, duration?: number): string => {
    return showAlert({ title, message, type: 'info', duration });
  };

  // Valor del contexto sin useMemo para evitar dependencias circulares
  const contextValue: AlertContextType = {
    alerts,
    showAlert,
    hideAlert,
    hideAllAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};