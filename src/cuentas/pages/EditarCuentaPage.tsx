/**
 * Página para editar una cuenta existente
 * Reutiliza el formulario de creación con datos pre-cargados
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
  Fade,
  Skeleton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useCuentaForm } from '../hooks/useCuentaForm';
import { useCuentas } from '../hooks/useCuentas';
import { cuentasService } from '../services/cuentasService';
import { RUTAS_CUENTAS } from '../../shared/constants/routes';
import { CuentaFormStepper } from '../components/CuentaFormStepper';
import { CuentaDto, CategoriaCuenta } from '../types';

const pasos = [
  'Información Básica',
  'Datos del Usuario',
  'Configuración de Licencia',
  'Información de Compañía',
  'Confirmación'
];

export const EditarCuentaPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { cuentaActiva, setCuentaActiva } = useCuentas();

  // Estados locales
  const [pasoActivo, setPasoActivo] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!cuentaActiva);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cuentaOriginal, setCuentaOriginal] = useState<CuentaDto | null>(cuentaActiva);

  const {
    formData,
    validaciones,
    erroresFormulario,
    isValidating,
    handleInputChange,
    handleUsuarioChange,
    handleCompaniaChange,
    handleCategoriaChange,
    handleAsociarUsuarioChange,
    validarFormularioCompleto,
    resetForm,
    mostrarSeccionCompania,
    formularioValido,
    cargarDatosParaEdicion
  } = useCuentaForm();

  /**
   * Cargar datos de la cuenta a editar
   */
  useEffect(() => {
    const cargarCuenta = async () => {
      if (!id) {
        setError('ID de cuenta no válido');
        return;
      }

      setIsLoadingData(true);
      setError(null);

      try {
        let cuenta = cuentaActiva;

        // Si no tenemos la cuenta activa, cargarla
        if (!cuenta || cuenta.cuentaId !== id) {
          cuenta = await cuentasService.obtenerCuentaPorCuentaId(id);
          setCuentaActiva(cuenta);
        }

        setCuentaOriginal(cuenta);

        // Cargar datos adicionales para edición (usuarios, compañías, etc.)
        const datosCompletos = await Promise.allSettled([
          cuentasService.obtenerUsuariosDeCuenta(id),
          cuentasService.obtenerCompaniasDeCuenta(id)
        ]);

        // Cargar datos en el formulario
        if (cargarDatosParaEdicion) {
          cargarDatosParaEdicion(cuenta, {
            usuarios: datosCompletos[0].status === 'fulfilled' ? datosCompletos[0].value : [],
            companias: datosCompletos[1].status === 'fulfilled' ? datosCompletos[1].value : []
          });
        }

      } catch (error: any) {
        setError(error.message || 'Error al cargar la cuenta');
      } finally {
        setIsLoadingData(false);
      }
    };

    cargarCuenta();
  }, [id, cuentaActiva, setCuentaActiva, cargarDatosParaEdicion]);

  /**
   * Avanzar al siguiente paso
   */
  const handleSiguiente = () => {
    if (validarPasoActual()) {
      setPasoActivo((prevPaso) => prevPaso + 1);
    }
  };

  /**
   * Retroceder al paso anterior
   */
  const handleAnterior = () => {
    setPasoActivo((prevPaso) => prevPaso - 1);
  };

  /**
   * Validar el paso actual
   */
  const validarPasoActual = (): boolean => {
    switch (pasoActivo) {
      case 0: // Información básica
        return !!(formData.referenciaCuenta && formData.denominacion && formData.paisId && validaciones.referenciaCuenta.valida);

      case 1: // Datos del usuario
        if (formData.asociarUsuario) {
          return !!(formData.emailParaAsociar && validaciones.email.valido);
        } else {
          return !!(formData.usuario.nombreUsuario && formData.usuario.email && validaciones.email.valido);
        }

      case 2: // Licencia
        return !!(formData.licenciaId && formData.fechaInicioLicencia && formData.fechaFinLicencia);

      case 3: // Compañía (solo para categoría A)
        if (!mostrarSeccionCompania) return true;
        return !!(formData.compania?.razonSocial && formData.compania?.nombreFantasia && formData.compania?.codigoTributario);

      default:
        return true;
    }
  };

  /**
   * Guardar cambios
   */
  const handleGuardar = async () => {
    if (!cuentaOriginal) return;

    setError(null);
    setSuccessMessage(null);

    if (!validarFormularioCompleto()) {
      setError('Por favor, complete todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const datosActualizados = {
        ...formData,
        cuentaId: cuentaOriginal.cuentaId
      };

      const resultado = await cuentasService.actualizarCuenta(cuentaOriginal.cuentaId, datosActualizados);

      setSuccessMessage(`Cuenta "${formData.referenciaCuenta}" actualizada exitosamente`);

      // Actualizar la cuenta activa
      setCuentaActiva(resultado);

      // Esperar un poco para mostrar el mensaje y luego navegar
      setTimeout(() => {
        navigate(RUTAS_CUENTAS.DETALLE.replace(':id', cuentaOriginal.cuentaId));
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Error al actualizar la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cancelar y volver
   */
  const handleCancelar = () => {
    if (window.confirm('¿Está seguro de cancelar? Se perderán todos los cambios no guardados.')) {
      if (cuentaOriginal) {
        navigate(RUTAS_CUENTAS.DETALLE.replace(':id', cuentaOriginal.cuentaId));
      } else {
        navigate(RUTAS_CUENTAS.LISTA);
      }
    }
  };

  /**
   * Determinar si se puede continuar al siguiente paso
   */
  const puedeAvanzar = (): boolean => {
    return validarPasoActual() && !isValidating;
  };

  /**
   * Determinar si está en el último paso
   */
  const esUltimoPaso = (): boolean => {
    // Si es categoría A, usar todos los pasos
    if (mostrarSeccionCompania) {
      return pasoActivo === pasos.length - 1;
    }
    // Si es categoría B/C, saltar el paso de compañía
    return pasoActivo === pasos.length - 2;
  };

  // Loading state
  if (isLoadingData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  // Error state
  if (error && !cuentaOriginal) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" action={
          <Button onClick={() => navigate(RUTAS_CUENTAS.LISTA)}>
            Volver a la Lista
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancelar}
          sx={{ mr: 3 }}
        >
          Volver
        </Button>
        <Box display="flex" alignItems="center" gap={2}>
          <BusinessIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h4" component="h1" color="primary">
              Editar Cuenta
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {cuentaOriginal?.referenciaCuenta} - {cuentaOriginal?.denominacion}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={pasoActivo} alternativeLabel>
          {pasos.map((label, index) => {
            // Ocultar paso de compañía si no es categoría A
            if (index === 3 && !mostrarSeccionCompania) {
              return null;
            }

            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Paper>

      {/* Mensajes de estado */}
      <Fade in={!!error}>
        <Box mb={error ? 2 : 0}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      <Fade in={!!successMessage}>
        <Box mb={successMessage ? 2 : 0}>
          {successMessage && (
            <Alert severity="success">
              {successMessage}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Contenido del formulario */}
      <Paper sx={{ p: 4 }}>
        <CuentaFormStepper
          pasoActivo={pasoActivo}
          formData={formData}
          validaciones={validaciones}
          erroresFormulario={erroresFormulario}
          isValidating={isValidating}
          mostrarSeccionCompania={mostrarSeccionCompania}
          onInputChange={handleInputChange}
          onUsuarioChange={handleUsuarioChange}
          onCompaniaChange={handleCompaniaChange}
          onCategoriaChange={handleCategoriaChange}
          onAsociarUsuarioChange={handleAsociarUsuarioChange}
        />
      </Paper>

      {/* Botones de navegación */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          onClick={handleAnterior}
          disabled={pasoActivo === 0 || isSubmitting}
          size="large"
        >
          Anterior
        </Button>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={handleCancelar}
            disabled={isSubmitting}
            size="large"
          >
            Cancelar
          </Button>

          {esUltimoPaso() ? (
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={!formularioValido || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
              size="large"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSiguiente}
              disabled={!puedeAvanzar()}
              size="large"
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Box>

      {/* Indicador de progreso */}
      {isSubmitting && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Guardando cambios, por favor espere...
          </Typography>
        </Box>
      )}
    </Container>
  );
};