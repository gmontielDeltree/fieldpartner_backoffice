/**
 * Página para crear una nueva cuenta - Interfaz UX mejorada con stepper progresivo
 * Implementa 3 pasos: Información Básica, Usuario y Licencia, Compañía
 * Lógica unificada: TODAS las categorías (A, B, C) → cuenta + usuario + licencia
 * SOLO categoría A adiciona → compañía + contrato (paso 3)
 */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import 'semantic-ui-css/semantic.min.css';
import { Icon } from "semantic-ui-react";
import {
  InformacionBasicaForm,
  CuentaFormLicencia,
  CuentaFormCompania
} from '../components';
import { CategoriaCuenta } from '../types';
import { Loading } from '../../components/Loading';
import { cuentasService } from '../services/cuentasService';
import { RUTAS_CUENTAS } from '../../shared/constants/routes';
import { useCuentaForm } from '../hooks/useCuentaForm';
import { uploadFile } from "../../helpers/fileUpload";
import { obtenerPaises } from '../../paises/services/paisesService';
import { licenciasService } from '../../licencias/services/licenciasService';
import { useAlert } from '../../components/alerts';
import type { PaisDto } from '../../paises/types';
import type { LicenciaDto } from '../../licencias/types';

// Pasos base del stepper
const PASOS_BASE = ["Información Básica", "Usuario y Licencia"];
const PASO_COMPANIA = "Compañía";

export const CrearCuentaPage: React.FC = () => {
  const navigate = useNavigate();
  const [indexStep, setIndexStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [paises, setPaises] = useState<PaisDto[]>([]);
  const [licencias, setLicencias] = useState<LicenciaDto[]>([]);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [loadingLicencias, setLoadingLicencias] = useState(true);
  const alert = useAlert();
  const {
    formData,
    validaciones,
    erroresFormulario,
    isValidating,
    setFormData,
    handleInputChange,
    handleCategoriaChange,
    handleUsuarioChange,
    handleCompaniaChange,
    handleAsociarUsuarioChange,
    resetForm,
    validarFormularioCompleto,
    // mostrarSeccionCompania
  } = useCuentaForm();

  /**
   * Obtener pasos dinámicos según la categoría seleccionada
   */
  const pasos = useMemo(() => {
    const pasosBase = [...PASOS_BASE];
    if (formData.categoria === CategoriaCuenta.A) {
      pasosBase.push(PASO_COMPANIA);
    }
    return pasosBase;
  }, [formData.categoria]);

  const totalPasos = pasos.length;

  /**
   * Cargar datos iniciales (países y licencias)
   */
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        // Cargar países
        setLoadingPaises(true);
        const paisesData = await obtenerPaises();
        setPaises(paisesData);

        // Cargar licencias
        setLoadingLicencias(true);
        const licenciasData = await licenciasService.obtenerLicencias();
        setLicencias(licenciasData);

      } catch (error: any) {
        alert.showLoadingError('datos iniciales', 'cargar', error.message, 'Error de Carga');
      } finally {
        setLoadingPaises(false);
        setLoadingLicencias(false);
      }
    };

    cargarDatosIniciales();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Renderizar contenido del paso actual
   */
  const obtenerContenidoPaso = (paso: number) => {
    switch (paso) {
      case 0:
        return (
          <InformacionBasicaForm
            key="informacion-basica"
            formData={formData}
            validaciones={validaciones}
            erroresFormulario={erroresFormulario}
            isValidating={isValidating}
            handleInputChange={handleInputChange}
            handleCategoriaChange={handleCategoriaChange}
            paises={paises}
            loadingPaises={loadingPaises}
          />
        );
      case 1:
        return (
          <CuentaFormLicencia
            key="usuario-licencia"
            formData={formData}
            validaciones={validaciones}
            erroresFormulario={erroresFormulario}
            isValidating={isValidating}
            handleUsuarioChange={handleUsuarioChange}
            handleInputChange={handleInputChange}
            handleAsociarUsuarioChange={handleAsociarUsuarioChange}
            paises={paises}
            licencias={licencias}
            loadingPaises={loadingPaises}
            loadingLicencias={loadingLicencias}
          />
        );
      case 2:
        return (
          <CuentaFormCompania
            key="compania"
            formData={formData}
            setFormData={setFormData}
            setLogoFile={(logo) => setLogoFile(logo)}
            handleCompaniaChange={handleCompaniaChange}
          />
        );
      default:
        throw new Error(`Paso desconocido: ${paso}`);
    }
  };

  /**
   * Validar si el paso actual está completo
   */
  const validarPasoActual = useCallback((): boolean => {
    switch (indexStep) {
      case 0: // Información Básica
        return !!(formData.referenciaCuenta &&
          formData.denominacion &&
          formData.paisId &&
          validaciones.referenciaCuenta.valida);
      case 1: // Usuario y Licencia
        if (formData.asociarUsuario) {
          return !!(formData.emailParaAsociar && formData.licenciaId);
        } else {
          return !!(formData.usuario.nombreUsuario &&
            formData.usuario.email &&
            formData.usuario.password &&
            formData.licenciaId &&
            validaciones.email.valido);
        }
      case 2: // Compañía
        return !!(formData.compania?.razonSocial &&
          formData.compania?.nombreFantasia &&
          formData.compania?.codigoTributario);
      default:
        return false;
    }
  }, [indexStep, formData, validaciones]);

  /**
   * Avanzar al siguiente paso
   */
  const handleNext = () => {
    if (validarPasoActual()) {
      setIndexStep(Math.min(indexStep + 1, totalPasos - 1));
    } else {
      alert.showValidationError('Por favor complete todos los campos obligatorios antes de continuar', 'Campos Requeridos');
    }
  };

  /**
   * Retroceder al paso anterior
   */
  const handleBack = () => {
    setIndexStep(Math.max(indexStep - 1, 0));
  };

  const initAddAccount = async () => {
    if (!validarFormularioCompleto()) {
      alert.showValidationError('Por favor complete todos los campos obligatorios', 'Formulario Incompleto');
      return;
    }

    setIsLoading(true);
    try {
      if (logoFile) {
        await uploadFile(logoFile);
      }
      await cuentasService.crearCuenta(formData);
      alert.showLoadingSuccess(`Cuenta "${formData.referenciaCuenta}"`, 'crear', 'Cuenta Creada');
      navigate(RUTAS_CUENTAS.LISTA);
      resetForm();
    } catch (error: any) {
      alert.showLoadingError('cuenta', 'crear', error.message, 'Error al Crear');
    } finally {
      setIsLoading(false);
    }
  };

  const onClickAdd = () => initAddAccount();

  const onClickCancel = () => {
    navigate(RUTAS_CUENTAS.LISTA);
  };

  /**
   * Efecto para ajustar el paso actual cuando cambia la categoría
   */
  useEffect(() => {
    // Si estamos en el paso 3 (Compañía) y cambiamos a categoría B o C
    if (indexStep >= 2 && formData.categoria !== CategoriaCuenta.A) {
      setIndexStep(1); // Regresar al paso 2 (Usuario y Licencia)
    }
  }, [formData.categoria, indexStep]);

  return (
    <>
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Loading key="loading-new-customer" loading={isLoading} />
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <Icon name="id card" size="huge" />
          <Typography variant="h4" sx={{ ml: { sm: 2 } }}>
            Cuentas
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 } }}
        >
          <Box
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundImage: "url(/assets/new-customer.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
              margin: "auto",
            }}
          />
          <Typography component="h1" variant="h4" align="center" sx={{ my: 2 }}>
            Nueva Cuenta Cliente
          </Typography>

          <Stepper activeStep={indexStep} sx={{
            pt: 3,
            pb: 3,
            mb: 2,
            width: "80%",
            margin: "auto"
          }}>
            {pasos.map((label, i) => {
              // Determinar si el paso está completado o disponible
              const esCompletado = i < indexStep;
              const esActivo = i === indexStep;
              const esDisponible = i <= indexStep || (i === indexStep + 1 && validarPasoActual());

              return (
                <Step key={label} completed={esCompletado} active={esActivo}>
                  <StepLabel
                    error={!esDisponible && i === indexStep + 1}
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: esCompletado ? 'success.main' :
                          esActivo ? 'primary.main' :
                            'text.secondary'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {/* Renderizar contenido del paso actual */}
          {obtenerContenidoPaso(indexStep)}

          {/* Información del progreso */}
          <Box textAlign="center" mt={2} mb={3}>
            <Typography variant="body2" color="text.secondary">
              Paso {indexStep + 1} de {totalPasos}
              {formData.categoria !== CategoriaCuenta.A && (
                <Typography component="span" variant="body2" color="info.main" sx={{ ml: 1 }}>
                  (Categoría {formData.categoria} - Sin información de compañía requerida)
                </Typography>
              )}
            </Typography>
          </Box>

          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-around"
            sx={{ mt: { sm: 5 } }}
          >
            <Grid item xs={12} sm={3} key="grid-back">
              <Button onClick={indexStep !== 0 ? handleBack : onClickCancel}>
                {indexStep !== 0 ? "Volver" : "Cancelar"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={3} key="grid-next">
              {indexStep < totalPasos - 1 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  disabled={!validarPasoActual() || isLoading}
                >
                  Siguiente
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="success"
                onClick={onClickAdd}
                // disabled={!validarFormularioCompleto() || isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cuenta'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};