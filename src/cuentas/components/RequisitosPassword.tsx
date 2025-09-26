/**
 * Componente para mostrar los requisitos de contraseña con indicadores visuales
 * Muestra el progreso y estado de cumplimiento de cada requisito
 */

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Paper,
  Collapse,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Security as SecurityIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { RequisitosPassword } from '../hooks/useValidacionPassword';

interface RequisitosPasswordProps {
  requisitos: RequisitosPassword;
  password: string;
  mostrar: boolean;
  errores?: string[];
  porcentajeFortaleza?: number;
}

export const RequisitosPasswordComponent: React.FC<RequisitosPasswordProps> = ({
  requisitos,
  password,
  mostrar,
  errores = [],
  porcentajeFortaleza = 0
}) => {

  const obtenerColorFortaleza = (): 'error' | 'warning' | 'info' | 'success' => {
    if (porcentajeFortaleza < 40) return 'error';
    if (porcentajeFortaleza < 70) return 'warning';
    if (porcentajeFortaleza < 100) return 'info';
    return 'success';
  };

  const obtenerTextoFortaleza = (): string => {
    if (porcentajeFortaleza < 40) return 'Débil';
    if (porcentajeFortaleza < 70) return 'Moderada';
    if (porcentajeFortaleza < 100) return 'Fuerte';
    return 'Muy fuerte';
  };

  const requisitosLista = [
    {
      key: 'longitudMinima',
      texto: 'Mínimo 8 caracteres',
      cumplido: requisitos.longitudMinima
    },
    {
      key: 'tieneMayuscula',
      texto: 'Una letra mayúscula (A-Z)',
      cumplido: requisitos.tieneMayuscula
    },
    {
      key: 'tieneMinuscula',
      texto: 'Una letra minúscula (a-z)',
      cumplido: requisitos.tieneMinuscula
    },
    {
      key: 'tieneNumero',
      texto: 'Un número (0-9)',
      cumplido: requisitos.tieneNumero
    },
    {
      key: 'tieneEspecial',
      texto: 'Un carácter especial (!@#$%^&*)',
      cumplido: requisitos.tieneEspecial
    }
  ];

  if (!mostrar || password.length === 0) {
    return null;
  }

  return (
    <Collapse in={mostrar} timeout="auto" unmountOnExit>
      <Box mt={2}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            backgroundColor: 'background.default',
            borderColor: requisitos.cumpleTodos ? 'success.main' : 'divider'
          }}
        >
          {/* Header con fortaleza */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <SecurityIcon
                color={requisitos.cumpleTodos ? 'success' : 'action'}
                sx={{ mr: 1 }}
              />
              <Typography variant="subtitle2" fontWeight="medium">
                Fortaleza de la contraseña
              </Typography>
            </Box>
            <Chip
              label={obtenerTextoFortaleza()}
              color={obtenerColorFortaleza()}
              size="small"
              variant={requisitos.cumpleTodos ? 'filled' : 'outlined'}
            />
          </Box>

          {/* Barra de progreso */}
          <Box mb={2}>
            <LinearProgress
              variant="determinate"
              value={porcentajeFortaleza}
              color={obtenerColorFortaleza()}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box display="flex" justifyContent="space-between" mt={0.5}>
              <Typography variant="caption" color="text.secondary">
                {Math.round(porcentajeFortaleza)}% completado
              </Typography>
            </Box>
          </Box>

          {/* Lista de requisitos */}
          <List dense sx={{ py: 0 }}>
            {requisitosLista.map((requisito) => (
              <ListItem key={requisito.key} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {requisito.cumplido ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon color="action" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={requisito.texto}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: requisito.cumplido ? 'text.primary' : 'text.secondary',
                    fontWeight: requisito.cumplido ? 'medium' : 'normal'
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Errores */}
          {errores.length > 0 && (
            <Box mt={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <WarningIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="caption" color="error" fontWeight="medium">
                  Problemas encontrados:
                </Typography>
              </Box>
              <List dense sx={{ py: 0 }}>
                {errores.map((error, index) => (
                  <ListItem key={index} sx={{ py: 0, pl: 3 }}>
                    <Typography variant="caption" color="error">
                      • {error}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Mensaje de éxito */}
          {requisitos.cumpleTodos && errores.length === 0 && (
            <Box
              mt={2}
              p={1}
              borderRadius={1}
              bgcolor="success.light"
              display="flex"
              alignItems="center"
            >
              <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="caption" color="success.dark" fontWeight="medium">
                ¡Contraseña segura! Cumple con todos los requisitos.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Collapse>
  );
};