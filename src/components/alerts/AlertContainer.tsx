/**
 * AlertContainer - Componente visual para mostrar alertas
 * Utiliza Material-UI Alert y AlertTitle para consistencia con el diseño
 * Maneja múltiples alertas con animaciones suaves
 */

import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  SlideProps,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAlertContext } from './AlertProvider';
import type { AlertMessage } from './AlertProvider';

// Transición personalizada para las alertas
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

interface AlertItemProps {
  alert: AlertMessage;
  onClose: (id: string) => void;
  index: number;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onClose, index }) => {
  const handleClose = () => {
    onClose(alert.id);
  };

  const getSeverityIcon = (type: AlertMessage['type']) => {
    // Material-UI Alert ya tiene íconos por defecto, pero podemos personalizarlos si es necesario
    return undefined;
  };

  return (
    <Snackbar
      open={true}
      autoHideDuration={alert.persistent ? null : alert.duration}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        position: 'fixed',
        top: 80 + (index * 80), // Espaciado vertical entre alertas
        right: 24,
        zIndex: 9999,
        width: 'auto',
        maxWidth: '400px',
      }}
    >
      <Alert
        severity={alert.type}
        onClose={handleClose}
        icon={getSeverityIcon(alert.type)}
        variant="filled"
        sx={{
          minWidth: '300px',
          maxWidth: '400px',
          boxShadow: 3,
          '& .MuiAlert-message': {
            fontSize: '0.875rem',
            lineHeight: 1.4,
          },
          '& .MuiAlert-action': {
            paddingTop: 0,
          },
        }}
        action={
          alert.action ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {alert.action}
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ color: 'inherit' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : undefined
        }
      >
        {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export const AlertContainer: React.FC = () => {
  const { alerts, hideAlert } = useAlertContext();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: 'none', // Permite clicks a través del contenedor
      }}
    >
      {alerts.map((alert, index) => (
        <Box
          key={alert.id}
          sx={{ pointerEvents: 'auto' }} // Restaura eventos para alertas individuales
        >
          <AlertItem
            alert={alert}
            onClose={hideAlert}
            index={index}
          />
        </Box>
      ))}
    </Box>
  );
};

export default AlertContainer;