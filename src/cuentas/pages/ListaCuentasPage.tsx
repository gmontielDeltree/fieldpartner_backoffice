/**
 * Página principal de lista de cuentas
 * Reemplaza la antigua ListaClientesPage con arquitectura moderna
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Business as BusinessIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
import { useCuentas } from '../hooks/useCuentas';
import { CuentasTable, CardsCuentas } from '../components';
import { CategoriaCuenta, EstadoCuenta } from '../types';
import { useAlert } from '../../components/alerts';
// import { RUTAS_CUENTAS } from '../../shared/constants/routes';

export const ListaCuentasPage: React.FC = () => {
  // const navigate = useNavigate();
  const alert = useAlert();
  const {
    cuentas,
    isLoading,
    error,
    filtros,
    cargarCuentas,
    setCuentaActiva,
    filtrarPorCategoria,
    filtrarPorEstado,
    // buscarCuentas,
    irACrearCuenta,
    irAEditarCuenta,
    irADetalleCuenta,
    desactivarCuenta
  } = useCuentas();

  // Estados locales para filtros y vista
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [vistaCards, setVistaCards] = useState(false);
  // const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Cargar cuentas al montar el componente
  useEffect(() => {
    const inicializar = async () => {
      try {
        await cargarCuentas();
      } catch (error: any) {
        alert.showLoadingError('cuentas', 'cargar', error.message, 'Error de Carga');
      }
    };

    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Manejar búsqueda con debounce
   */
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (terminoBusqueda.trim()) {
  //       buscarCuentas(terminoBusqueda);
  //     } else {
  //       cargarCuentas();
  //     }
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [terminoBusqueda, buscarCuentas, cargarCuentas]);

  /**
   * Manejar selección de cuenta para ver detalles
   */
  const handleVerDetalle = (cuenta: any) => {
    setCuentaActiva(cuenta);
    irADetalleCuenta(cuenta);
  };

  /**
   * Manejar edición de cuenta
   */
  const handleEditarCuenta = (cuenta: any) => {
    setCuentaActiva(cuenta);
    irAEditarCuenta(cuenta);
  };

  /**
   * Manejar desactivación de cuenta
   */
  const handleDesactivarCuenta = async (cuenta: any) => {
    try {
      await desactivarCuenta(cuenta.cuentaId);
      alert.showLoadingSuccess(`Cuenta "${cuenta.referenciaCuenta}"`, 'desactivar', 'Cuenta Desactivada');
    } catch (error: any) {
      alert.showLoadingError('cuenta', 'desactivar', error.message, 'Error al Desactivar');
    }
  };

  /**
   * Limpiar filtros
   */
  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    filtrarPorCategoria('' as any);
    filtrarPorEstado('' as any);
    cargarCuentas();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <BusinessIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h4" component="h1" color="primary">
              Cuenta
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gestión de cuentas del sistema
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          {/* Toggle de vista */}
          <Box display="flex" gap={1}>
            <Button
              variant={!vistaCards ? "contained" : "outlined"}
              size="small"
              onClick={() => setVistaCards(false)}
              startIcon={<ViewListIcon />}
            >
              Tabla
            </Button>
            <Button
              variant={vistaCards ? "contained" : "outlined"}
              size="small"
              onClick={() => setVistaCards(true)}
              startIcon={<ViewModuleIcon />}
            >
              Cards
            </Button>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={irACrearCuenta}
            size="large"
          >
            Nueva Cuenta
          </Button>
        </Box>
      </Box>

      {/* Barra de búsqueda y filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Campo de búsqueda */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por referencia o denominación..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Filtro por categoría */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filtros.categoria || ''}
                label="Categoría"
                onChange={(e) => filtrarPorCategoria(e.target.value as CategoriaCuenta)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value={CategoriaCuenta.A}>Categoría A</MenuItem>
                <MenuItem value={CategoriaCuenta.B}>Categoría B</MenuItem>
                <MenuItem value={CategoriaCuenta.C}>Categoría C</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Filtro por estado */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtros.estado || ''}
                label="Estado"
                onChange={(e) => filtrarPorEstado(e.target.value as EstadoCuenta)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={EstadoCuenta.ACTIVA}>Activa</MenuItem>
                <MenuItem value={EstadoCuenta.INACTIVA}>Inactiva</MenuItem>
                <MenuItem value={EstadoCuenta.SUSPENDIDA}>Suspendida</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Botón limpiar filtros */}
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={limpiarFiltros}
              startIcon={<FilterListIcon />}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>

        {/* Filtros activos */}
        {(filtros.categoria || filtros.estado || terminoBusqueda) && (
          <Box mt={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {filtros.categoria && (
                <Chip
                  label={`Categoría: ${filtros.categoria}`}
                  onDelete={() => filtrarPorCategoria('' as any)}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filtros.estado && (
                <Chip
                  label={`Estado: ${filtros.estado}`}
                  onDelete={() => filtrarPorEstado('' as any)}
                  color="secondary"
                  variant="outlined"
                />
              )}
              {terminoBusqueda && (
                <Chip
                  label={`Búsqueda: "${terminoBusqueda}"`}
                  onDelete={() => setTerminoBusqueda('')}
                  color="info"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Mensajes de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Vista de cuentas - tabla o cards */}
      <Paper sx={{ p: vistaCards ? 3 : 2 }}>
        {/* Vista de Cards */}
        {vistaCards ? (
          <CardsCuentas
            cuentas={cuentas}
            isLoading={isLoading}
            onEditCuenta={handleEditarCuenta}
            onViewCuenta={handleVerDetalle}
          />
        ) : (
          /* Vista de Tabla */
          <>
            {isLoading && cuentas.length === 0 ? (
              <Box p={3}>
                {Array.from(new Array(5)).map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
                ))}
              </Box>
            ) : (
              <CuentasTable
                cuentas={cuentas}
                isLoading={isLoading}
                onView={handleVerDetalle}
                onEdit={handleEditarCuenta}
                onDeactivate={handleDesactivarCuenta}
              />
            )}
          </>
        )}
      </Paper>

      {/* Estadísticas del pie */}
      {!isLoading && cuentas.length > 0 && (
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {`${cuentas.length} ${cuentas.length === 1 ? 'cuenta encontrada' : 'cuentas encontradas'}`}
          </Typography>
        </Box>
      )}
    </Container>
  );
};