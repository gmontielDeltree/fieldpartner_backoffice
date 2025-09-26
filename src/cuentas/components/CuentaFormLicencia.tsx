/**
 * Formulario de Usuario y Licencia - Paso 2 del stepper de creación de cuenta
 * Maneja información de usuario, licencia y asociación de usuarios existentes
 * Incluye validación avanzada de contraseñas
 */

import React, { useState, useEffect } from 'react';
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
  Paper,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Article as LicenseIcon,
  DateRange as DateRangeIcon,
//   Info as InfoIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { CrearCuentaDto, CategoriaCuenta, ValidacionCuentaDto, DatosUsuarioDto } from '../types';
import { useValidacionPassword } from '../hooks/useValidacionPassword';
import { RequisitosPasswordComponent } from './RequisitosPassword';
import type { PaisDto } from '../../paises/types';
import type { LicenciaDto } from '../../licencias/types';

interface CuentaFormLicenciaProps {
  formData: CrearCuentaDto;
  validaciones: ValidacionCuentaDto;
  erroresFormulario: Record<string, string>;
  isValidating: boolean;
  handleUsuarioChange: (field: keyof DatosUsuarioDto, value: any) => void;
  handleInputChange: (field: keyof CrearCuentaDto, value: any) => void;
  handleAsociarUsuarioChange: (asociar: boolean) => void;
  paises: PaisDto[];
  licencias: LicenciaDto[];
  loadingPaises?: boolean;
  loadingLicencias?: boolean;
}

export const CuentaFormLicencia: React.FC<CuentaFormLicenciaProps> = ({
  formData,
  validaciones,
  erroresFormulario,
//   isValidating,
  handleUsuarioChange,
  handleInputChange,
  handleAsociarUsuarioChange,
//   paises,
  licencias,
//   loadingPaises = false,
  loadingLicencias = false
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);

  // Hook para validación de contraseñas
  const {
    estadoPassword,
    actualizarPassword,
    actualizarConfirmarPassword,
    obtenerColorPassword,
    obtenerColorConfirmacion,
    fortalezaPassword,
    esPasswordValida
  } = useValidacionPassword();

  // Las licencias ahora vienen del servicio como prop

  // Sincronizar contraseñas con el estado del formulario
  useEffect(() => {
    if (formData.usuario.password !== estadoPassword.password) {
      actualizarPassword(formData.usuario.password);
    }
  }, [formData.usuario.password, estadoPassword.password, actualizarPassword]);

  // Manejar cambio de contraseña con validación
  const manejarCambioPassword = (password: string) => {
    actualizarPassword(password);
    handleUsuarioChange('password', password);
  };

  // Manejar cambio de confirmación de contraseña
  const manejarCambioConfirmarPassword = (confirmar: string) => {
    actualizarConfirmarPassword(confirmar);
  };

  // Validar email para asociar usuario (simular onBlur del AccountPage original)
  const manejarBlurEmailAsociar = async () => {
    if (formData.emailParaAsociar && formData.emailParaAsociar.includes('@')) {
      // Aquí iría la lógica de validación del email
      console.log('Validando email:', formData.emailParaAsociar);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <PersonIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
        <Box>
          <Typography variant="h5" component="h2" color="primary">
            Usuario y Licencia
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure el usuario administrador y los datos de licencia para la cuenta
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Sección de Licencia */}
        <Grid item xs={12}>
          <Box mb={2}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LicenseIcon sx={{ mr: 1 }} />
              Información de Licencia
            </Typography>
          </Box>
        </Grid>

        {/* Licencia */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!erroresFormulario.licenciaId}>
            <InputLabel>Licencia</InputLabel>
            <Select
              value={formData.licenciaId}
              label="Licencia"
              onChange={(e) => handleInputChange('licenciaId', e.target.value)}
            >
              <MenuItem value="">
                <em>Seleccione una licencia</em>
              </MenuItem>
              {loadingLicencias ? (
                <MenuItem disabled>
                  <em>Cargando licencias...</em>
                </MenuItem>
              ) : (
                licencias.map((lic) => (
                  <MenuItem key={lic.id} value={lic.id}>
                    {lic.descripcion} ({lic.tipoLicencia})
                  </MenuItem>
                ))
              )}
            </Select>
            {erroresFormulario.licenciaId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {erroresFormulario.licenciaId}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Cantidad de Licencias */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Cantidad Licencias"
            name="cantidadLicenciasPermitidas"
            type="number"
            value={formData.cantidadLicenciasPermitidas}
            onChange={(e) => handleInputChange('cantidadLicenciasPermitidas', parseInt(e.target.value) || 1)}
            error={!!erroresFormulario.cantidadLicenciasPermitidas}
            helperText={erroresFormulario.cantidadLicenciasPermitidas}
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </Grid>

        {/* Licencia Multi-País */}
        <Grid item xs={12} sm={3}>
          <FormControlLabel
            control={
              <Checkbox
                name="esLicenciaMultiPais"
                checked={formData.esLicenciaMultiPais || false}
                onChange={(e) => handleInputChange('esLicenciaMultiPais', e.target.checked)}
              />
            }
            label="Licencia Multipaís"
          />
        </Grid>

        {/* Fechas de Licencia */}
        <Grid item xs={12} sm={6}>
          <Box sx={{
            display: "flex",
            gap: 2,
            p: 2,
            alignItems: "center",
            borderRadius: 2,
            border: "1px solid",
            borderColor: 'divider'
          }}>
            <TextField
              fullWidth
              variant="outlined"
              type='date'
              label="Fecha Inicio"
              name="fechaInicioLicencia"
              value={formData.fechaInicioLicencia}
              onChange={(e) => handleInputChange('fechaInicioLicencia', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type='date'
              label="Fecha Fin"
              name="fechaFinLicencia"
              value={formData.fechaFinLicencia}
              onChange={(e) => handleInputChange('fechaFinLicencia', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Grid>

        {/* Sección Usuario */}
        <Grid item xs={12}>
          <Box mt={4} mb={2}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1 }} />
              Usuario Administrador
            </Typography>
          </Box>
        </Grid>

        {/* Checkbox Asociar Usuario */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  name="asociarUsuario"
                  checked={formData.asociarUsuario || false}
                  onChange={(e) => handleAsociarUsuarioChange(e.target.checked)}
                />
              }
              label={
                <Typography variant="h6" fontWeight="medium">
                  Asociar a un usuario existente
                </Typography>
              }
            />
          </Box>
        </Grid>

        {/* Email para asociar */}
        {formData.asociarUsuario && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <TextField
                sx={{ width: "50%", maxWidth: 400 }}
                label="Email a asociar"
                name="emailParaAsociar"
                type="email"
                value={formData.emailParaAsociar || ''}
                onChange={(e) => handleInputChange('emailParaAsociar', e.target.value)}
                onBlur={manejarBlurEmailAsociar}
                error={!!erroresFormulario.emailParaAsociar}
                helperText={erroresFormulario.emailParaAsociar}
                color={validaciones.email?.existe ? 'success' : 'primary'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      @
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Grid>
        )}

        {/* Formulario de nuevo usuario */}
        {!formData.asociarUsuario && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Paper
                variant="outlined"
                sx={{ width: "70%", maxWidth: 600, p: 3 }}
              >
                <Typography variant="h6" textAlign="center" sx={{ mb: 3 }}>
                  Nuevo Usuario Administrador
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre de Usuario"
                      name="nombreUsuario"
                      value={formData.usuario.nombreUsuario}
                      onChange={(e) => handleUsuarioChange('nombreUsuario', e.target.value)}
                      error={!!erroresFormulario.nombreUsuario}
                      helperText={erroresFormulario.nombreUsuario}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.usuario.email}
                      onChange={(e) => handleUsuarioChange('email', e.target.value)}
                      error={!!erroresFormulario.email}
                      helperText={erroresFormulario.email}
                      color={validaciones.email?.valido ? 'success' : 'primary'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            @
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      name="password"
                      type={mostrarPassword ? 'text' : 'password'}
                      value={formData.usuario.password}
                      onChange={(e) => manejarCambioPassword(e.target.value)}
                      onFocus={() => setMostrarRequisitos(true)}
                      error={!!erroresFormulario.password || (formData.usuario.password.length > 0 && !esPasswordValida)}
                      helperText={
                        erroresFormulario.password ||
                        (formData.usuario.password.length > 0 && !esPasswordValida ? "La contraseña no cumple los requisitos" : "")
                      }
                      color={obtenerColorPassword()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Mostrar requisitos de contraseña">
                              <IconButton
                                onClick={() => setMostrarRequisitos(!mostrarRequisitos)}
                                edge="start"
                                color={esPasswordValida ? 'success' : 'default'}
                              >
                                <SecurityIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Ver/Ocultar contraseña">
                              <IconButton
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                edge="end"
                              >
                                {mostrarPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Componente de requisitos de contraseña */}
                    <RequisitosPasswordComponent
                      requisitos={estadoPassword.requisitos}
                      password={formData.usuario.password}
                      mostrar={mostrarRequisitos}
                      errores={estadoPassword.errores}
                      porcentajeFortaleza={fortalezaPassword}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirmar Contraseña"
                      name="confirmarPassword"
                      type={mostrarConfirmarPassword ? 'text' : 'password'}
                      value={estadoPassword.confirmarPassword}
                      onChange={(e) => manejarCambioConfirmarPassword(e.target.value)}
                      error={estadoPassword.confirmarPassword.length > 0 && !estadoPassword.passwordsCoinciden}
                      helperText={
                        estadoPassword.confirmarPassword.length > 0 && !estadoPassword.passwordsCoinciden
                          ? "Las contraseñas no coinciden"
                          : estadoPassword.passwordsCoinciden && estadoPassword.confirmarPassword.length > 0
                          ? "Las contraseñas coinciden"
                          : "Repita la contraseña para confirmar"
                      }
                      color={obtenerColorConfirmacion()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SecurityIcon color={estadoPassword.passwordsCoinciden ? 'success' : 'action'} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Ver/Ocultar contraseña">
                              <IconButton
                                onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                                edge="end"
                              >
                                {mostrarConfirmarPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>
        )}

        {/* Información sobre el paso siguiente */}
        {formData.categoria === CategoriaCuenta.A && (
          <Grid item xs={12}>
            <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Siguiente paso:</strong> Como seleccionó Categoría A, deberá completar la información de compañía.
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};