/**
 * Componente Stepper para el formulario de creación/edición de cuentas
 */

import React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  CrearCuentaDto,
  DatosUsuarioDto,
  CrearCompaniaDto,
  CategoriaCuenta,
  ValidacionCuentaDto,
  CategoriasCuentaLabels
} from '../types';

interface CuentaFormStepperProps {
  pasoActivo: number;
  formData: CrearCuentaDto;
  validaciones: ValidacionCuentaDto;
  erroresFormulario: Record<string, string>;
  isValidating: boolean;
  mostrarSeccionCompania: boolean;
  onInputChange: (field: keyof CrearCuentaDto, value: any) => void;
  onUsuarioChange: (field: keyof DatosUsuarioDto, value: any) => void;
  onCompaniaChange: (field: keyof CrearCompaniaDto, value: any) => void;
  onCategoriaChange: (categoria: CategoriaCuenta) => void;
  onAsociarUsuarioChange: (asociar: boolean) => void;
}

export const CuentaFormStepper: React.FC<CuentaFormStepperProps> = ({
  pasoActivo,
  formData,
  validaciones,
  erroresFormulario,
  isValidating,
  mostrarSeccionCompania,
  onInputChange,
  onUsuarioChange,
  onCompaniaChange,
  onCategoriaChange,
  onAsociarUsuarioChange,
}) => {

  /**
   * Paso 0: Información Básica
   */
  const renderPasoInformacionBasica = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Información Básica de la Cuenta
        </Typography>
      </Grid>

      {/* Referencia */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Referencia de Cuenta"
          value={formData.referenciaCuenta}
          onChange={(e) => onInputChange('referenciaCuenta', e.target.value)}
          error={!!erroresFormulario.referenciaCuenta || !validaciones.referenciaCuenta.valida}
          helperText={
            erroresFormulario.referenciaCuenta ||
            validaciones.referenciaCuenta.mensaje ||
            'Identificador único de la cuenta'
          }
          InputProps={{
            endAdornment: isValidating ? <LoadingButton loading size="small" /> : null
          }}
        />
      </Grid>

      {/* Denominación */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Denominación"
          value={formData.denominacion}
          onChange={(e) => onInputChange('denominacion', e.target.value)}
          error={!!erroresFormulario.denominacion}
          helperText={erroresFormulario.denominacion || 'Nombre descriptivo de la cuenta'}
        />
      </Grid>

      {/* Categoría */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={formData.categoria}
            label="Categoría"
            onChange={(e) => onCategoriaChange(e.target.value as CategoriaCuenta)}
          >
            {Object.values(CategoriaCuenta).map((categoria) => (
              <MenuItem key={categoria} value={categoria}>
                {CategoriasCuentaLabels[categoria]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {formData.categoria === CategoriaCuenta.A && 'Empresarial - Permite múltiples usuarios y compañías'}
          {formData.categoria === CategoriaCuenta.B && 'Profesional - Un usuario principal'}
          {formData.categoria === CategoriaCuenta.C && 'Individual - Uso personal'}
        </Typography>
      </Grid>

      {/* País */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="País"
          value={formData.paisId}
          onChange={(e) => onInputChange('paisId', e.target.value)}
          error={!!erroresFormulario.paisId}
          helperText={erroresFormulario.paisId || 'Seleccione el país de la cuenta'}
          placeholder="Ej: ARG, BRA, URY"
        />
      </Grid>
    </Grid>
  );

  /**
   * Paso 1: Datos del Usuario
   */
  const renderPasoDatosUsuario = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Datos del Usuario
        </Typography>
      </Grid>

      {/* Switch para asociar usuario existente */}
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.asociarUsuario}
              onChange={(e) => onAsociarUsuarioChange(e.target.checked)}
            />
          }
          label="Asociar usuario existente"
        />
      </Grid>

      {!formData.asociarUsuario ? (
        // Crear nuevo usuario
        <>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Nombre de Usuario"
              value={formData.usuario.nombreUsuario}
              onChange={(e) => onUsuarioChange('nombreUsuario', e.target.value)}
              error={!!erroresFormulario.nombreUsuario}
              helperText={erroresFormulario.nombreUsuario}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              value={formData.usuario.email}
              onChange={(e) => onUsuarioChange('email', e.target.value)}
              error={!!erroresFormulario.email || !validaciones.email.valido}
              helperText={
                erroresFormulario.email ||
                validaciones.email.mensaje ||
                'Email del usuario para acceso al sistema'
              }
              InputProps={{
                endAdornment: isValidating ? <LoadingButton loading size="small" /> : null
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="password"
              label="Contraseña"
              value={formData.usuario.password}
              onChange={(e) => onUsuarioChange('password', e.target.value)}
              error={!!erroresFormulario.password}
              helperText={erroresFormulario.password || 'Mínimo 6 caracteres'}
            />
          </Grid>
        </>
      ) : (
        // Asociar usuario existente
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="email"
            label="Email del Usuario Existente"
            value={formData.emailParaAsociar}
            onChange={(e) => onInputChange('emailParaAsociar', e.target.value)}
            error={!!erroresFormulario.emailParaAsociar}
            helperText={erroresFormulario.emailParaAsociar || 'Email del usuario a asociar'}
          />
        </Grid>
      )}
    </Grid>
  );

  /**
   * Paso 2: Configuración de Licencia
   */
  const renderPasoLicencia = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Configuración de Licencia
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="ID de Licencia"
          value={formData.licenciaId}
          onChange={(e) => onInputChange('licenciaId', e.target.value)}
          error={!!erroresFormulario.licenciaId}
          helperText={erroresFormulario.licenciaId || 'Identificador de la licencia a asignar'}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Cantidad de Licencias"
          value={formData.cantidadLicenciasPermitidas}
          onChange={(e) => onInputChange('cantidadLicenciasPermitidas', parseInt(e.target.value))}
          inputProps={{ min: 1 }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Fecha Inicio"
          value={formData.fechaInicioLicencia}
          onChange={(e) => onInputChange('fechaInicioLicencia', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Fecha Fin"
          value={formData.fechaFinLicencia}
          onChange={(e) => onInputChange('fechaFinLicencia', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.esLicenciaMultiPais}
              onChange={(e) => onInputChange('esLicenciaMultiPais', e.target.checked)}
            />
          }
          label="Licencia Multi-País"
        />
      </Grid>
    </Grid>
  );

  /**
   * Paso 3: Información de Compañía (solo categoría A)
   */
  const renderPasoCompania = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Información de la Compañía
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Las cuentas de categoría A requieren información de compañía
        </Alert>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Razón Social"
          value={formData.compania?.razonSocial || ''}
          onChange={(e) => onCompaniaChange('razonSocial', e.target.value)}
          error={!!erroresFormulario.razonSocial}
          helperText={erroresFormulario.razonSocial}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Nombre de Fantasía"
          value={formData.compania?.nombreFantasia || ''}
          onChange={(e) => onCompaniaChange('nombreFantasia', e.target.value)}
          error={!!erroresFormulario.nombreFantasia}
          helperText={erroresFormulario.nombreFantasia}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Código Tributario"
          value={formData.compania?.codigoTributario || ''}
          onChange={(e) => onCompaniaChange('codigoTributario', e.target.value)}
          error={!!erroresFormulario.codigoTributario}
          helperText={erroresFormulario.codigoTributario}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Teléfono"
          value={formData.compania?.telefono || ''}
          onChange={(e) => onCompaniaChange('telefono', e.target.value)}
          error={!!erroresFormulario.telefono}
          helperText={erroresFormulario.telefono}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          label="Dirección"
          value={formData.compania?.direccion || ''}
          onChange={(e) => onCompaniaChange('direccion', e.target.value)}
          error={!!erroresFormulario.direccion}
          helperText={erroresFormulario.direccion}
          multiline
          rows={2}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Localidad"
          value={formData.compania?.localidad || ''}
          onChange={(e) => onCompaniaChange('localidad', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Provincia"
          value={formData.compania?.provincia || ''}
          onChange={(e) => onCompaniaChange('provincia', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Código Postal"
          value={formData.compania?.codigoPostal || ''}
          onChange={(e) => onCompaniaChange('codigoPostal', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Sitio Web"
          value={formData.compania?.sitioWeb || ''}
          onChange={(e) => onCompaniaChange('sitioWeb', e.target.value)}
          placeholder="https://ejemplo.com"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Observaciones"
          value={formData.compania?.observacion || ''}
          onChange={(e) => onCompaniaChange('observacion', e.target.value)}
          multiline
          rows={3}
        />
      </Grid>
    </Grid>
  );

  /**
   * Paso 4: Confirmación
   */
  const renderPasoConfirmacion = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Confirmación de Datos
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Revise los datos antes de crear la cuenta
      </Typography>

      <Paper sx={{ p: 3, mt: 2, backgroundColor: 'grey.50' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Referencia:</Typography>
            <Typography>{formData.referenciaCuenta}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Denominación:</Typography>
            <Typography>{formData.denominacion}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Categoría:</Typography>
            <Chip
              label={CategoriasCuentaLabels[formData.categoria]}
              size="small"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">País:</Typography>
            <Typography>{formData.paisId}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Usuario:</Typography>
            <Typography>
              {formData.asociarUsuario ? formData.emailParaAsociar : formData.usuario.email}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Licencia:</Typography>
            <Typography>{formData.licenciaId}</Typography>
          </Grid>
        </Grid>

        {mostrarSeccionCompania && formData.compania && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Información de Compañía
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Razón Social:</Typography>
                <Typography>{formData.compania.razonSocial}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Nombre de Fantasía:</Typography>
                <Typography>{formData.compania.nombreFantasia}</Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    </Box>
  );

  // Renderizar el paso actual
  const renderPasoActual = () => {
    switch (pasoActivo) {
      case 0:
        return renderPasoInformacionBasica();
      case 1:
        return renderPasoDatosUsuario();
      case 2:
        return renderPasoLicencia();
      case 3:
        return mostrarSeccionCompania ? renderPasoCompania() : renderPasoConfirmacion();
      case 4:
        return renderPasoConfirmacion();
      default:
        return null;
    }
  };

  return <Box>{renderPasoActual()}</Box>;
};