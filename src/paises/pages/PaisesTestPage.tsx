/**
 * Página temporal de prueba para países
 * Solo para verificar que la navegación funciona
 */

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import { Public as PublicIcon } from '@mui/icons-material';

export const PaisesTestPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ ml: 0 }}>
      {/* Encabezado */}
      <Box display="flex" alignItems="center" sx={{ ml: { sm: 2 }, pt: 2, mb: 3 }}>
        <PublicIcon sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
        <Box flexGrow={1}>
          <Typography component="h1" variant="h4">
            Gestión de Países
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Página de prueba - Navegación funcionando correctamente
          </Typography>
        </Box>
      </Box>

      {/* Contenido de prueba */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ La navegación a /paises está funcionando correctamente
        </Alert>

        <Typography variant="h6" gutterBottom>
          Módulo de Países - Página de Prueba
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={2}>
          Esta es una página temporal para verificar que la ruta funciona.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          El problema previo podría estar en la carga de datos del componente principal.
        </Typography>
      </Paper>
    </Container>
  );
};