/**
 * Error Boundary para capturar errores de renderizado en React
 * Proporciona una interfaz de usuario de fallback cuando ocurren errores
 */

import React, { Component, ReactNode } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle,
  Stack,
  Divider
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para mostrar la UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log del error para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Aquí podrías enviar el error a un servicio de logging
    // reportErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/home';
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Renderizar UI de fallback personalizada
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)'
                  : 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <ErrorIcon
                sx={{
                  fontSize: 80,
                  color: 'error.main',
                  mb: 2
                }}
              />
              <Typography variant="h3" gutterBottom color="error">
                Oops! Algo salió mal
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Se ha producido un error inesperado en la aplicación
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <AlertTitle>Información del Error</AlertTitle>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Error:</strong> {this.state.error?.message || 'Error desconocido'}
              </Typography>
              {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                <Box
                  component="pre"
                  sx={{
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    p: 1,
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: 200,
                    mt: 1
                  }}
                >
                  {this.state.error.stack}
                </Box>
              )}
            </Alert>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Puedes intentar las siguientes opciones para resolver el problema:
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                size="large"
              >
                Intentar de Nuevo
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
                size="large"
              >
                Recargar Página
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
                size="large"
              >
                Ir al Inicio
              </Button>
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Si el problema persiste, contacta al equipo de soporte técnico.
              </Typography>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}