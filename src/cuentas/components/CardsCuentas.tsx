/**
 * Componente de Cards para mostrar las cuentas
 * Vista alternativa a la tabla con diseño de tarjetas
 */

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Avatar,
  Skeleton
} from '@mui/material';
import {
  Edit as EditIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { CuentaDto, CategoriaCuenta, EstadoCuenta, CategoriasCuentaLabels, EstadosCuentaLabels, ColoresCategorias, ColoresEstados } from '../types';

interface CardsCuentasProps {
  cuentas: CuentaDto[];
  isLoading: boolean;
  onEditCuenta: (cuenta: CuentaDto) => void;
  onViewCuenta: (cuenta: CuentaDto) => void;
}

export const CardsCuentas: React.FC<CardsCuentasProps> = ({
  cuentas,
  isLoading,
  onEditCuenta,
  onViewCuenta
}) => {

  const obtenerInfoPais = (cuenta: CuentaDto) => {
    if (cuenta.paisId && typeof cuenta.paisId === 'object') {
      return `${cuenta.paisId.descripcionES} (${cuenta.paisId.codigo})`;
    }
    return cuenta.paisId || 'No especificado';
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(6)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box ml={2} width="100%">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="50%" />
                <Box mt={2}>
                  <Skeleton variant="rectangular" width="30%" height={24} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {cuentas.map((cuenta) => (
        <Grid item xs={12} sm={6} md={4} key={cuenta.cuentaId}>
          <Card
            sx={{
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
            onClick={() => onViewCuenta(cuenta)}
          >
            <CardContent>
              {/* Header con avatar y acciones */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3" noWrap>
                      {cuenta.referenciaCuenta}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {cuenta.denominacion}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCuenta(cuenta);
                  }}
                  sx={{ ml: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Información principal */}
              <Box mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {obtenerInfoPais(cuenta)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {cuenta.contadorUsuarios || 0} usuario(s)
                  </Typography>
                </Box>
              </Box>

              {/* Chips de categoría y estado */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Chip
                  label={CategoriasCuentaLabels[cuenta.categoria as CategoriaCuenta]}
                  color={ColoresCategorias[cuenta.categoria as CategoriaCuenta] as any}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={EstadosCuentaLabels[cuenta.estado as EstadoCuenta]}
                  color={ColoresEstados[cuenta.estado as EstadoCuenta] as any}
                  variant="filled"
                  size="small"
                />
              </Box>

              {/* Estadísticas */}
              <Box>
                <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                  <Grid item xs={4}>
                    <Typography variant="h6" color="primary">
                      {cuenta.contadorCampos || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Campos
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" color="primary">
                      {cuenta.contadorLicencias || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Licencias
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" color="primary">
                      {cuenta.contadorHectareas || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hectáreas
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Fecha de creación */}
              <Box mt={2} pt={2} borderTop="1px solid" borderColor="divider">
                <Typography variant="caption" color="text.secondary">
                  Creado: {new Date(cuenta.fechaCreacion).toLocaleDateString('es-ES')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};