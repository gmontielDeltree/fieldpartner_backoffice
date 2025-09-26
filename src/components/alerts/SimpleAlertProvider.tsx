/**
 * Versión simplificada del AlertProvider para evitar bucles de render
 * Minimiza las optimizaciones para máxima estabilidad
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AlertMessage {
  id: string;
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
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface SimpleAlertProviderProps {
  children: ReactNode;
  maxAlerts?: number;
  defaultDuration?: number;
}

export const SimpleAlertProvider: React.FC<SimpleAlertProviderProps> = ({
  children,
  maxAlerts = 3,
  defaultDuration = 5000,
}) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const generateId = (): string => {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const showAlert = (alertData: Omit<AlertMessage, 'id'>): string => {
    const id = generateId();
    const newAlert: AlertMessage = {
      ...alertData,
      id,
      duration: alertData.duration ?? defaultDuration,
    };

    setAlerts(prevAlerts => {
      const updatedAlerts = [newAlert, ...prevAlerts];
      return updatedAlerts.length > maxAlerts
        ? updatedAlerts.slice(0, maxAlerts)
        : updatedAlerts;
    });

    // Auto-hide - usar setAlerts directamente para evitar dependencias
    if (!newAlert.persistent && newAlert.duration && newAlert.duration > 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }, newAlert.duration);
    }

    return id;
  };

  const hideAlert = (id: string): void => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  const hideAllAlerts = (): void => {
    setAlerts([]);
  };

  const showSuccess = (message: string, duration?: number): string => {
    return showAlert({ message, type: 'success', duration });
  };

  const showError = (message: string, duration?: number): string => {
    return showAlert({ message, type: 'error', duration });
  };

  const showWarning = (message: string, duration?: number): string => {
    return showAlert({ message, type: 'warning', duration });
  };

  const showInfo = (message: string, duration?: number): string => {
    return showAlert({ message, type: 'info', duration });
  };

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

export const useSimpleAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useSimpleAlertContext must be used within a SimpleAlertProvider');
  }
  return context;
};