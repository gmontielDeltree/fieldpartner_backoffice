/**
 * Página simplificada de gestión de países
 * Usando estructura real del backend
 */

import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';

import { Loading } from '../../components';
import { usePaises } from '../hooks/usePaises';
import { PaisDto } from '../types';
import { getButtonConfig } from '../../shared/constants';

export const ListaPaisesSimplePage: React.FC = () => {
  // ============================
  // HOOKS Y ESTADO
  // ============================
  const {
    paises,
    isLoading,
    error,
    cargarPaises,
    limpiarErrores
  } = usePaises();

  // ============================
  // EFECTOS
  // ============================

  /**
   * Cargar países al montar el componente
   */
  useEffect(() => {
    cargarPaises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================
  // MANEJADORES DE EVENTOS
  // ============================

  /**
   * Manejar visualización de país
   */
  const handleVerPais = (pais: PaisDto) => {
    Swal.fire({
      title: `Detalles de ${pais.descripcionES}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Código:</strong> ${pais.codigo}</p>
          <p><strong>Descripción ES:</strong> ${pais.descripcionES}</p>
          <p><strong>Descripción PT:</strong> ${pais.descripcionPT}</p>
          <p><strong>Descripción EN:</strong> ${pais.descripcionEN}</p>
          <p><strong>Idioma:</strong> ${pais.idioma}</p>
          <p><strong>Moneda:</strong> ${pais.moneda}</p>
          <p><strong>Clave Tributaria:</strong> ${pais.claveTributaria}</p>
          <p><strong>Formato:</strong> ${pais.formatoClaveTributaria}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  };

  // ============================
  // FUNCIONES AUXILIARES
  // ============================

  const getColorIdioma = (idioma: string) => {
    switch (idioma) {
      case 'es': return 'success';
      case 'pt': return 'warning';
      case 'en': return 'info';
      default: return 'default';
    }
  };

  // ============================
  // RENDERIZADO
  // ============================

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <Loading loading={isLoading} />

      <Container maxWidth="xl" sx={{ ml: 0 }}>
        {/* Encabezado */}
        <Box display="flex" alignItems="center" sx={{ ml: { sm: 2 }, pt: 2, mb: 3 }}>
          <PublicIcon sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
          <Box flexGrow={1}>
            <Typography component="h1" variant="h4">
              Gestión de Países
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {paises.length} países registrados
            </Typography>
          </Box>

          <Button
            startIcon={<AddIcon />}
            {...getButtonConfig('CREATE')}
            disabled
          >
            Nuevo País
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => limpiarErrores()} sx={{ mb: 3, mx: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabla de países */}
        <Paper sx={{ mb: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Código</strong></TableCell>
                  <TableCell><strong>Nombre (ES)</strong></TableCell>
                  <TableCell><strong>Idioma</strong></TableCell>
                  <TableCell><strong>Moneda</strong></TableCell>
                  <TableCell><strong>Clave Tributaria</strong></TableCell>
                  <TableCell align="center"><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paises.map((pais) => (
                  <TableRow
                    key={pais._id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {pais.codigo}
                      </Typography>
                    </TableCell>
                    <TableCell>{pais.descripcionES}</TableCell>
                    <TableCell>
                      <Chip
                        label={pais.idioma.toUpperCase()}
                        color={getColorIdioma(pais.idioma) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {pais.moneda}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pais.claveTributaria}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleVerPais(pais)}
                        variant="outlined"
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {paises.length === 0 && !isLoading && (
            <Box p={6} textAlign="center">
              <PublicIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay países registrados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Los países se cargan desde la base de datos
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};