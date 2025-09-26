/**
 * Formulario de Información Básica - Paso 1 del stepper
 * Contiene: referencia, denominación, país, categoría y estado de la cuenta
 */

import React from 'react';
import {
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Alert
} from '@mui/material';
import {
  Business as BusinessIcon,
  Public as PublicIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { CrearCuentaDto, CategoriaCuenta, EstadoCuenta, ValidacionCuentaDto } from '../types';
import type { PaisDto } from '../../paises/types';

interface InformacionBasicaFormProps {
  formData: CrearCuentaDto;
  validaciones: ValidacionCuentaDto;
  erroresFormulario: Record<string, string>;
  isValidating: boolean;
  handleInputChange: (field: keyof CrearCuentaDto, value: any) => void;
  handleCategoriaChange: (categoria: CategoriaCuenta) => void;
  paises: PaisDto[];
  loadingPaises?: boolean;
}

export const InformacionBasicaForm: React.FC<InformacionBasicaFormProps> = ({
  formData,
  validaciones,
  erroresFormulario,
  isValidating,
  handleInputChange,
  handleCategoriaChange,
  paises,
  loadingPaises = false
}) => {

  const categoriasOpciones = [
    { value: CategoriaCuenta.A, label: 'Categoría A - Empresarial', color: 'primary' },
    { value: CategoriaCuenta.B, label: 'Categoría B - Profesional', color: 'secondary' },
    { value: CategoriaCuenta.C, label: 'Categoría C - Individual', color: 'info' }
  ];

  const estadosOpciones = [
    { value: EstadoCuenta.ACTIVA, label: 'Activa' },
    { value: EstadoCuenta.INACTIVA, label: 'Inactiva' },
    { value: EstadoCuenta.SUSPENDIDA, label: 'Suspendida' }
  ];

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <BusinessIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
        <Box>
          <Typography variant="h5" component="h2" color="primary">
            Información Básica de la Cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete los datos básicos para identificar la cuenta en el sistema
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Referencia de la Cuenta */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Referencia de Cuenta"
            name="referenciaCuenta"
            value={formData.referenciaCuenta}
            onChange={(e) => handleInputChange('referenciaCuenta', e.target.value)}
            error={!!erroresFormulario.referenciaCuenta || !validaciones.referenciaCuenta.valida}
            helperText={
              erroresFormulario.referenciaCuenta ||
              validaciones.referenciaCuenta.mensaje ||
              "Identificador único de la cuenta"
            }
            disabled={isValidating}
            color={validaciones.referenciaCuenta.valida && validaciones.referenciaCuenta.disponible ? 'success' : 'primary'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          {validaciones.referenciaCuenta.valida && validaciones.referenciaCuenta.disponible && (
            <Box mt={1}>
              <Chip
                label="Disponible"
                size="small"
                color="success"
                variant="outlined"
              />
            </Box>
          )}
        </Grid>

        {/* Denominación */}
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Denominación"
            name="denominacion"
            value={formData.denominacion}
            onChange={(e) => handleInputChange('denominacion', e.target.value)}
            error={!!erroresFormulario.denominacion}
            helperText={erroresFormulario.denominacion || "Nombre oficial de la cuenta"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2" color="text.secondary">
                    Denom.
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* País */}
        <Grid item xs={12} sm={4}>
          <FormControl
            fullWidth
            error={!!erroresFormulario.paisId}
          >
            <InputLabel>País</InputLabel>
            <Select
              value={formData.paisId}
              label="País"
              onChange={(e) => handleInputChange('paisId', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <PublicIcon color="action" />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>Seleccione un país</em>
              </MenuItem>
              {loadingPaises ? (
                <MenuItem disabled>
                  <em>Cargando países...</em>
                </MenuItem>
              ) : (
                paises.map((pais) => (
                  <MenuItem key={pais._id} value={pais._id}>
                    {pais.descripcionES} ({pais.codigo})
                  </MenuItem>
                ))
              )}
            </Select>
            {erroresFormulario.paisId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {erroresFormulario.paisId}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Categoría */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.categoria}
              label="Categoría"
              onChange={(e) => handleCategoriaChange(e.target.value as CategoriaCuenta)}
              startAdornment={
                <InputAdornment position="start">
                  <CategoryIcon color="action" />
                </InputAdornment>
              }
            >
              {categoriasOpciones.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Typography sx={{ flexGrow: 1 }}>
                      {cat.label}
                    </Typography>
                    <Chip
                      label={cat.value}
                      size="small"
                      color={cat.color as any}
                      variant="outlined"
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Estado
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.estado || EstadoCuenta.ACTIVA}
              label="Estado"
              onChange={(e) => handleInputChange('estado', e.target.value)}
            >
              {estadosOpciones.map((estado) => (
                <MenuItem key={estado.value} value={estado.value}>
                  {estado.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
      </Grid>

      {/* Información sobre la categoría seleccionada */}
      <Box mt={3}>
        <Alert
          severity={formData.categoria === CategoriaCuenta.A ? "info" : "success"}
          variant="outlined"
        >
          <Typography variant="body2">
            <strong>Categoría {formData.categoria}:</strong>{' '}
            {formData.categoria === CategoriaCuenta.A &&
              "Requiere información de compañía y contrato societario en el siguiente paso."
            }
            {formData.categoria === CategoriaCuenta.B &&
              "Perfil profesional - Solo requiere información de usuario y licencia."
            }
            {formData.categoria === CategoriaCuenta.C &&
              "Perfil individual - Solo requiere información de usuario y licencia."
            }
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};