import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import {
  DisplaySettings as DisplaySettingsIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useLicencias } from "../../hooks/useLicencias";
import { useForm } from "../../hooks/useForm";
import { Loading } from "../../components";
import {
  TipoLicencia,
  TipoSistema,
  LicenciaFormData,
  CrearLicenciaDto,
  ActualizarLicenciaDto,
} from "../../types/licencias.types";

const datosFormularioInicial: LicenciaFormData = {
  codigoLicencia: "",
  descripcion: "",
  tipoLicencia: TipoLicencia.LICENCIA,
  maximoUnidadesPermitidas: 1,
  tipoSistema: TipoSistema.FIELD_PARTNER,
  esLicenciaMultiPais: false,
};

export const FormularioLicenciaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const esEdicion = Boolean(id);

  const {
    licenciaActiva,
    isLoading,
    error,
    crearNuevaLicencia,
    actualizarLicenciaExistente,
    cargarLicenciaPorId,
    volverALista,
    limpiarErrores,
  } = useLicencias();

  const [modoMultiPais, setModoMultiPais] = useState(false);

  const {
    formValues,
    setFormValues,
    handleInputChange,
    // reset,
  } = useForm<LicenciaFormData>(datosFormularioInicial);

  // Validaciones del formulario
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});

  const validarFormulario = (): boolean => {
    const errores: Record<string, string> = {};

    if (!formValues.codigoLicencia.trim()) {
      errores.codigoLicencia = "El código de licencia es obligatorio";
    } else if (formValues.codigoLicencia.length < 3) {
      errores.codigoLicencia = "El código debe tener al menos 3 caracteres";
    }

    if (!formValues.descripcion.trim()) {
      errores.descripcion = "La descripción es obligatoria";
    } else if (formValues.descripcion.length < 5) {
      errores.descripcion = "La descripción debe tener al menos 5 caracteres";
    }

    if (formValues.maximoUnidadesPermitidas <= 0) {
      errores.maximoUnidadesPermitidas = "Debe ser mayor a 0";
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  // Manejar cambios en el formulario
  const manejarCambioTipoLicencia = (event: SelectChangeEvent<TipoLicencia>) => {
    setFormValues(prev => ({
      ...prev,
      tipoLicencia: event.target.value as TipoLicencia
    }));
  };

  const manejarCambioTipoSistema = (event: SelectChangeEvent<TipoSistema>) => {
    setFormValues(prev => ({
      ...prev,
      tipoSistema: event.target.value as TipoSistema
    }));
  };

  const manejarCambioMultiPais = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.checked;
    setModoMultiPais(valor);
    setFormValues(prev => ({
      ...prev,
      esLicenciaMultiPais: valor
    }));
  };

  // Manejar envío del formulario
  const manejarGuardar = async () => {
    if (!validarFormulario()) return;

    try {
      if (esEdicion && id) {
        const datosActualizacion: ActualizarLicenciaDto = {
          codigoLicencia: formValues.codigoLicencia,
          descripcion: formValues.descripcion,
          tipoLicencia: formValues.tipoLicencia,
          maximoUnidadesPermitidas: formValues.maximoUnidadesPermitidas,
          tipoSistema: formValues.tipoSistema,
          esLicenciaMultiPais: formValues.esLicenciaMultiPais,
        };
        await actualizarLicenciaExistente(id, datosActualizacion);
      } else {
        const nuevaLicencia: CrearLicenciaDto = {
          codigoLicencia: formValues.codigoLicencia,
          descripcion: formValues.descripcion,
          tipoLicencia: formValues.tipoLicencia,
          maximoUnidadesPermitidas: formValues.maximoUnidadesPermitidas,
          tipoSistema: formValues.tipoSistema,
          esLicenciaMultiPais: formValues.esLicenciaMultiPais,
        };
        await crearNuevaLicencia(nuevaLicencia);
      }
    } catch (error) {
      console.error('Error al guardar licencia:', error);
    }
  };

  const manejarCancelar = () => {
    volverALista();
  };

  // Efectos
  useEffect(() => {
    if (esEdicion && id) {
      cargarLicenciaPorId(id);
    }
  }, [esEdicion, id, cargarLicenciaPorId]);

  useEffect(() => {
    if (licenciaActiva && esEdicion) {
      setFormValues({
        codigoLicencia: licenciaActiva.codigoLicencia,
        descripcion: licenciaActiva.descripcion,
        tipoLicencia: licenciaActiva.tipoLicencia,
        maximoUnidadesPermitidas: licenciaActiva.maximoUnidadesPermitidas,
        tipoSistema: licenciaActiva.tipoSistema,
        esLicenciaMultiPais: licenciaActiva.esLicenciaMultiPais,
      });
      setModoMultiPais(licenciaActiva.esLicenciaMultiPais);
    } else if (!esEdicion) {
      setFormValues(datosFormularioInicial);
      setModoMultiPais(false);
    }
  }, [licenciaActiva, esEdicion, setFormValues]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        limpiarErrores();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, limpiarErrores]);

  return (
    <>
      <Loading loading={isLoading} />

      <Container maxWidth="md" sx={{ mb: 4 }}>
        {/* Encabezado */}
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <DisplaySettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ ml: { sm: 1 } }}>
            Gestión de Licencias
          </Typography>
        </Box>

        {/* Mostrar error si existe */}
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" onClose={limpiarErrores}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Formulario */}
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 4 }, p: { xs: 2, md: 4 } }}
          elevation={2}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{ mb: 4 }}
            color="primary.main"
          >
            {esEdicion ? "Editar Licencia" : "Nueva Licencia"}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Código de Licencia */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código de Licencia *"
                variant="outlined"
                name="codigoLicencia"
                value={formValues.codigoLicencia}
                onChange={handleInputChange}
                error={!!erroresValidacion.codigoLicencia}
                helperText={erroresValidacion.codigoLicencia}
                fullWidth
                inputProps={{ maxLength: 50 }}
                placeholder="Ej: FP-BASE-001"
              />
            </Grid>

            {/* Tipo de Licencia */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="tipo-licencia-label">Tipo de Licencia *</InputLabel>
                <Select
                  labelId="tipo-licencia-label"
                  value={formValues.tipoLicencia}
                  onChange={manejarCambioTipoLicencia}
                  label="Tipo de Licencia *"
                >
                  {Object.values(TipoLicencia).map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                label="Descripción *"
                variant="outlined"
                name="descripcion"
                value={formValues.descripcion}
                onChange={handleInputChange}
                error={!!erroresValidacion.descripcion}
                helperText={erroresValidacion.descripcion}
                fullWidth
                multiline
                rows={3}
                inputProps={{ maxLength: 255 }}
                placeholder="Describe las características principales de esta licencia..."
              />
            </Grid>

            {/* Tipo de Sistema */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="tipo-sistema-label">Tipo de Sistema</InputLabel>
                <Select
                  labelId="tipo-sistema-label"
                  value={formValues.tipoSistema}
                  onChange={manejarCambioTipoSistema}
                  label="Tipo de Sistema"
                >
                  {Object.values(TipoSistema).map((sistema) => (
                    <MenuItem key={sistema} value={sistema}>
                      {sistema}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Máximo de Unidades */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Máximo Unidades Permitidas *"
                variant="outlined"
                type="number"
                name="maximoUnidadesPermitidas"
                value={formValues.maximoUnidadesPermitidas}
                onChange={handleInputChange}
                error={!!erroresValidacion.maximoUnidadesPermitidas}
                helperText={erroresValidacion.maximoUnidadesPermitidas}
                fullWidth
                inputProps={{ min: 1, max: 999999 }}
              />
            </Grid>

            {/* Switch Multi-País */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={modoMultiPais}
                    onChange={manejarCambioMultiPais}
                    color="primary"
                  />
                }
                label="¿Es una licencia multi-país?"
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                Las licencias multi-país pueden ser utilizadas en múltiples países sin restricciones geográficas.
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Botones de Acción */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={manejarCancelar}
                startIcon={<CancelIcon />}
                fullWidth
                size="large"
              >
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={manejarGuardar}
                startIcon={<SaveIcon />}
                fullWidth
                size="large"
                disabled={isLoading}
              >
                {esEdicion ? "Actualizar" : "Crear"} Licencia
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};