/**
 * Hook especializado para el formulario de cuenta
 * Maneja validaciones específicas y estados del formulario
 */

import { useState, useCallback, useEffect } from 'react';
import {
  CrearCuentaDto,
  DatosUsuarioDto,
  CrearCompaniaDto,
  CategoriaCuenta,
  ValidacionCuentaDto,
} from '../types';
import { cuentasService } from '../services/cuentasService';
import { validarEmail } from '../../types';

// Datos iniciales del formulario
const datosIniciales: CrearCuentaDto = {
  referenciaCuenta: '',
  denominacion: '',
  paisId: '',
  categoria: CategoriaCuenta.C,
  usuario: {
    nombreUsuario: '',
    email: '',
    password: '',
    foto: undefined
  },
  licenciaId: '',
  cantidadLicenciasPermitidas: 1,
  fechaInicioLicencia: new Date().toISOString().split('T')[0],
  fechaFinLicencia: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  compania: undefined,
  asociarUsuario: false,
  emailParaAsociar: '',
  esLicenciaMultiPais: false
};

const datosCompaniaIniciales: CrearCompaniaDto = {
  direccion: '',
  logoCompania: undefined,
  nombreFantasia: '',
  localidad: '',
  observacion: '',
  telefono: '',
  provincia: '',
  razonSocial: '',
  codigoTributario: '',
  sitioWeb: '',
  codigoPostal: ''
};

export const useCuentaForm = () => {
  // Estados del formulario
  const [formData, setFormData] = useState<CrearCuentaDto>(datosIniciales);
  const [validaciones, setValidaciones] = useState<ValidacionCuentaDto>({
    referenciaCuenta: { valida: true },
    email: { valido: true },
    licencia: { valida: true }
  });
  const [erroresFormulario, setErroresFormulario] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  // ============================
  // FUNCIONES DE VALIDACIÓN
  // ============================

  /**
   * Validar referencia de la cuenta en tiempo real
   */
  const validarReferencia = useCallback(async (referencia: string) => {
    if (!referencia.trim()) {
      setValidaciones(prev => ({
        ...prev,
        referenciaCuenta: {
          valida: false,
          mensaje: 'La referencia es obligatoria',
          disponible: false
        }
      }));
      return false;
    }

    setIsValidating(true);
    try {
      const disponible = await cuentasService.validarReferenciaCuentaDisponible(referencia);
      setValidaciones(prev => ({
        ...prev,
        referenciaCuenta: {
          valida: disponible,
          mensaje: disponible ? 'Referencia disponible' : 'Esta referencia ya existe',
          disponible
        }
      }));
      return disponible;
    } catch (error) {
      setValidaciones(prev => ({
        ...prev,
        referenciaCuenta: {
          valida: false,
          mensaje: 'Error validando referencia',
          disponible: false
        }
      }));
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * Validar email del usuario
   */
  const validarEmailUsuario = useCallback(async (email: string) => {
    if (!email.trim()) {
      setValidaciones(prev => ({
        ...prev,
        email: {
          valido: false,
          mensaje: 'El email es obligatorio',
          existe: false
        }
      }));
      return false;
    }

    if (!validarEmail(email)) {
      setValidaciones(prev => ({
        ...prev,
        email: {
          valido: false,
          mensaje: 'Formato de email inválido',
          existe: false
        }
      }));
      return false;
    }

    setIsValidating(true);
    try {
      const resultado = await cuentasService.validarEmailUsuario(email);
      const valido = resultado.disponible || formData.asociarUsuario;

      setValidaciones(prev => ({
        ...prev,
        email: {
          valido: valido ?? false,
          mensaje: resultado.existe
            ? (formData.asociarUsuario ? 'Usuario encontrado para asociar' : 'Este email ya está registrado')
            : 'Email disponible',
          existe: resultado.existe
        }
      }));
      return valido;
    } catch (error) {
      setValidaciones(prev => ({
        ...prev,
        email: {
          valido: false,
          mensaje: 'Error validando email',
          existe: false
        }
      }));
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [formData.asociarUsuario]);

  /**
   * Validar formulario completo
   */
  const validarFormularioCompleto = useCallback((): boolean => {
    const errores: Record<string, string> = {};

    // Validaciones básicas
    if (!formData.referenciaCuenta.trim()) {
      errores.referenciaCuenta = 'La referencia es obligatoria';
    }

    if (!formData.denominacion.trim()) {
      errores.denominacion = 'La denominación es obligatoria';
    }

    if (!formData.paisId) {
      errores.paisId = 'El país es obligatorio';
    }

    if (!formData.licenciaId) {
      errores.licenciaId = 'La licencia es obligatoria';
    }

    // Validaciones del usuario
    if (!formData.asociarUsuario) {
      if (!formData.usuario.nombreUsuario.trim()) {
        errores.nombreUsuario = 'El nombre de usuario es obligatorio';
      }

      if (!formData.usuario.email.trim()) {
        errores.email = 'El email es obligatorio';
      } else if (!validarEmail(formData.usuario.email)) {
        errores.email = 'Formato de email inválido';
      }

      if (!formData.usuario.password.trim()) {
        errores.password = 'La contraseña es obligatoria';
      } else if (formData.usuario.password.length < 6) {
        errores.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    } else {
      if (!formData.emailParaAsociar?.trim()) {
        errores.emailParaAsociar = 'Email para asociar es obligatorio';
      }
    }

    // Validaciones específicas para categoría A (compañía)
    if (formData.categoria === CategoriaCuenta.A && formData.compania) {
      if (!formData.compania.razonSocial.trim()) {
        errores.razonSocial = 'La razón social es obligatoria';
      }

      if (!formData.compania.nombreFantasia.trim()) {
        errores.nombreFantasia = 'El nombre de fantasía es obligatorio';
      }

      if (!formData.compania.codigoTributario.trim()) {
        errores.codigoTributario = 'El código tributario es obligatorio';
      }

      if (!formData.compania.direccion.trim()) {
        errores.direccion = 'La dirección es obligatoria';
      }

      if (!formData.compania.telefono.trim()) {
        errores.telefono = 'El teléfono es obligatorio';
      }
    }

    // Validar estados de validación asíncronas
    if (!validaciones.referenciaCuenta.valida) {
      errores.referenciaCuenta = validaciones.referenciaCuenta.mensaje || 'Referencia no válida';
    }

    if (!validaciones.email.valido) {
      errores.email = validaciones.email.mensaje || 'Email no válido';
    }

    setErroresFormulario(errores);
    return Object.keys(errores).length === 0;
  }, [formData, validaciones]);

  // ============================
  // MANEJADORES DE CAMBIOS
  // ============================

  /**
   * Manejar cambios en campos principales
   */
  const handleInputChange = useCallback((field: keyof CrearCuentaDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error específico
    if (erroresFormulario[field]) {
      setErroresFormulario(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Validaciones en tiempo real
    // if (field === 'referenciaCuenta' && typeof value === 'string') {
    //   setTimeout(() => validarReferencia(value), 500);
    // }
  }, [erroresFormulario]);

  /**
   * Manejar cambios en datos del usuario
   */
  const handleUsuarioChange = useCallback((field: keyof DatosUsuarioDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      usuario: {
        ...prev.usuario,
        [field]: value
      }
    }));

    // Limpiar error específico
    if (erroresFormulario[field]) {
      setErroresFormulario(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Validar email en tiempo real
    if (field === 'email' && typeof value === 'string') {
      setTimeout(() => validarEmailUsuario(value), 500);
    }
  }, [erroresFormulario, validarEmailUsuario]);

  /**
   * Manejar cambios en datos de la compañía
   */
  const handleCompaniaChange = useCallback((field: keyof CrearCompaniaDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      compania: {
        ...prev.compania || datosCompaniaIniciales,
        [field]: value
      }
    }));

    // Limpiar error específico
    if (erroresFormulario[field]) {
      setErroresFormulario(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [erroresFormulario]);

  /**
   * Manejar cambio de categoría
   */
  const handleCategoriaChange = useCallback((categoria: CategoriaCuenta) => {
    setFormData(prev => ({
      ...prev,
      categoria,
      // Inicializar compañía solo para categoría A
      compania: categoria === CategoriaCuenta.A ? datosCompaniaIniciales : undefined
    }));
  }, []);

  /**
   * Manejar cambio de modo de asociación de usuario
   */
  const handleAsociarUsuarioChange = useCallback((asociar: boolean) => {
    setFormData(prev => ({
      ...prev,
      asociarUsuario: asociar,
      // Limpiar campos según el modo
      emailParaAsociar: asociar ? prev.emailParaAsociar : '',
      usuario: asociar ? {
        nombreUsuario: '',
        email: '',
        password: '',
        foto: undefined
      } : prev.usuario
    }));

    // Limpiar validaciones relacionadas
    setValidaciones(prev => ({
      ...prev,
      email: { valido: true }
    }));

    setErroresFormulario(prev => {
      const newErrors = { ...prev };
      delete newErrors.email;
      delete newErrors.emailParaAsociar;
      delete newErrors.nombreUsuario;
      delete newErrors.password;
      return newErrors;
    });
  }, []);

  /**
   * Resetear formulario
   */
  const resetForm = useCallback(() => {
    setFormData(datosIniciales);
    setValidaciones({
      referenciaCuenta: { valida: true },
      email: { valido: true },
      licencia: { valida: true }
    });
    setErroresFormulario({});
  }, []);

  // ============================
  // EFECTOS
  // ============================

  /**
   * Auto-completar denominación con razón social en categoría A
   */
  useEffect(() => {
    if (formData.categoria === CategoriaCuenta.A &&
        formData.compania?.razonSocial &&
        !formData.denominacion) {
      setFormData(prev => {
        // Solo actualizar si la denominación está vacía para evitar sobreescribir cambios del usuario
        if (!prev.denominacion && prev.compania?.razonSocial) {
          return {
            ...prev,
            denominacion: prev.compania.razonSocial
          };
        }
        return prev;
      });
    }
  }, [formData.categoria, formData.compania?.razonSocial, formData.denominacion]);

  // ============================
  // RETORNO DEL HOOK
  // ============================

  return {
    // Estados
    formData,
    validaciones,
    erroresFormulario,
    isValidating,

    // Manejadores
    handleInputChange,
    handleUsuarioChange,
    handleCompaniaChange,
    handleCategoriaChange,
    handleAsociarUsuarioChange,

    // Validaciones
    validarReferencia,
    validarEmailUsuario,
    validarFormularioCompleto,

    // Utilidades
    resetForm,
    setFormData,

    // Datos derivados - memoizados para evitar bucles infinitos
    mostrarSeccionCompania: formData.categoria === CategoriaCuenta.A,
  };
};