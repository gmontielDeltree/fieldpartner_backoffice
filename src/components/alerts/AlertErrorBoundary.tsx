/**
 * Error Boundary específico para el sistema de alertas
 * Captura errores que puedan ocurrir en AlertProvider o AlertContainer
 */

import React, { Component, ReactNode } from 'react';
import { Alert, Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AlertErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('AlertErrorBoundary: Error in alert system:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AlertErrorBoundary details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Mostrar una notificación simple sin depender del sistema de alertas
      return (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
            maxWidth: 400,
          }}
        >
          <Alert severity="error" onClose={() => this.setState({ hasError: false })}>
            Error en el sistema de notificaciones. Recarga la página si el problema persiste.
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}