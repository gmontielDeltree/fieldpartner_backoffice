/**
 * Hook para validación de contraseñas con requisitos de seguridad
 * Maneja validación de fortaleza y confirmación de contraseñas
 */

import { useState, useCallback } from 'react';

export interface RequisitosPassword {
  longitudMinima: boolean;
  tieneMayuscula: boolean;
  tieneMinuscula: boolean;
  tieneNumero: boolean;
  tieneEspecial: boolean;
  cumpleTodos: boolean;
}

export interface EstadoValidacionPassword {
  password: string;
  confirmarPassword: string;
  requisitos: RequisitosPassword;
  passwordsCoinciden: boolean;
  esValida: boolean;
  errores: string[];
}

const REQUISITOS_PASSWORD = {
  LONGITUD_MINIMA: 8,
  REGEX_MAYUSCULA: /[A-Z]/,
  REGEX_MINUSCULA: /[a-z]/,
  REGEX_NUMERO: /[0-9]/,
  REGEX_ESPECIAL: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/
};

export const useValidacionPassword = () => {
  const [estadoPassword, setEstadoPassword] = useState<EstadoValidacionPassword>({
    password: '',
    confirmarPassword: '',
    requisitos: {
      longitudMinima: false,
      tieneMayuscula: false,
      tieneMinuscula: false,
      tieneNumero: false,
      tieneEspecial: false,
      cumpleTodos: false
    },
    passwordsCoinciden: false,
    esValida: false,
    errores: []
  });

  /**
   * Valida los requisitos de una contraseña
   */
  const validarRequisitos = useCallback((password: string): RequisitosPassword => {
    const requisitos = {
      longitudMinima: password.length >= REQUISITOS_PASSWORD.LONGITUD_MINIMA,
      tieneMayuscula: REQUISITOS_PASSWORD.REGEX_MAYUSCULA.test(password),
      tieneMinuscula: REQUISITOS_PASSWORD.REGEX_MINUSCULA.test(password),
      tieneNumero: REQUISITOS_PASSWORD.REGEX_NUMERO.test(password),
      tieneEspecial: REQUISITOS_PASSWORD.REGEX_ESPECIAL.test(password),
      cumpleTodos: false
    };

    requisitos.cumpleTodos = Object.entries(requisitos)
      .filter(([key]) => key !== 'cumpleTodos')
      .every(([, value]) => value === true);

    return requisitos;
  }, []);

  /**
   * Valida si las contraseñas coinciden
   */
  const validarCoincidencia = useCallback((password: string, confirmar: string): boolean => {
    return password === confirmar && password.length > 0;
  }, []);

  /**
   * Genera errores basados en el estado actual
   */
  const generarErrores = useCallback((
    requisitos: RequisitosPassword,
    coinciden: boolean,
    password: string,
    confirmar: string
  ): string[] => {
    const errores: string[] = [];

    if (password.length > 0) {
      if (!requisitos.longitudMinima) {
        errores.push(`La contraseña debe tener al menos ${REQUISITOS_PASSWORD.LONGITUD_MINIMA} caracteres`);
      }
      if (!requisitos.tieneMayuscula) {
        errores.push('Debe contener al menos una letra mayúscula');
      }
      if (!requisitos.tieneMinuscula) {
        errores.push('Debe contener al menos una letra minúscula');
      }
      if (!requisitos.tieneNumero) {
        errores.push('Debe contener al menos un número');
      }
      if (!requisitos.tieneEspecial) {
        errores.push('Debe contener al menos un carácter especial');
      }
    }

    if (confirmar.length > 0 && !coinciden) {
      errores.push('Las contraseñas no coinciden');
    }

    return errores;
  }, []);

  /**
   * Actualizar la contraseña principal
   */
  const actualizarPassword = useCallback((nuevaPassword: string) => {
    setEstadoPassword(previo => {
      const requisitos = validarRequisitos(nuevaPassword);
      const coinciden = validarCoincidencia(nuevaPassword, previo.confirmarPassword);
      const errores = generarErrores(requisitos, coinciden, nuevaPassword, previo.confirmarPassword);

      return {
        ...previo,
        password: nuevaPassword,
        requisitos,
        passwordsCoinciden: coinciden,
        esValida: requisitos.cumpleTodos && (coinciden || previo.confirmarPassword === ''),
        errores
      };
    });
  }, [validarRequisitos, validarCoincidencia, generarErrores]);

  /**
   * Actualizar la confirmación de contraseña
   */
  const actualizarConfirmarPassword = useCallback((confirmar: string) => {
    setEstadoPassword(previo => {
      const coinciden = validarCoincidencia(previo.password, confirmar);
      const errores = generarErrores(previo.requisitos, coinciden, previo.password, confirmar);

      return {
        ...previo,
        confirmarPassword: confirmar,
        passwordsCoinciden: coinciden,
        esValida: previo.requisitos.cumpleTodos && coinciden,
        errores
      };
    });
  }, [validarCoincidencia, generarErrores]);

  /**
   * Reiniciar el estado de validación
   */
  const reiniciarValidacion = useCallback(() => {
    setEstadoPassword({
      password: '',
      confirmarPassword: '',
      requisitos: {
        longitudMinima: false,
        tieneMayuscula: false,
        tieneMinuscula: false,
        tieneNumero: false,
        tieneEspecial: false,
        cumpleTodos: false
      },
      passwordsCoinciden: false,
      esValida: false,
      errores: []
    });
  }, []);

  /**
   * Obtener el color para el input de contraseña
   */
  const obtenerColorPassword = useCallback((): 'primary' | 'error' | 'warning' | 'success' => {
    if (estadoPassword.password.length === 0) return 'primary';
    if (estadoPassword.requisitos.cumpleTodos) return 'success';
    if (estadoPassword.errores.length > 0) return 'error';
    return 'warning';
  }, [estadoPassword]);

  /**
   * Obtener el color para el input de confirmación
   */
  const obtenerColorConfirmacion = useCallback((): 'primary' | 'error' | 'success' => {
    if (estadoPassword.confirmarPassword.length === 0) return 'primary';
    if (estadoPassword.passwordsCoinciden) return 'success';
    return 'error';
  }, [estadoPassword]);

  /**
   * Obtener el porcentaje de fortaleza de la contraseña
   */
  const obtenerPorcentajeFortaleza = useCallback((): number => {
    const requisitosArray = [
      estadoPassword.requisitos.longitudMinima,
      estadoPassword.requisitos.tieneMayuscula,
      estadoPassword.requisitos.tieneMinuscula,
      estadoPassword.requisitos.tieneNumero,
      estadoPassword.requisitos.tieneEspecial
    ];

    const cumplidos = requisitosArray.filter(Boolean).length;
    return (cumplidos / requisitosArray.length) * 100;
  }, [estadoPassword.requisitos]);

  return {
    // Estado
    estadoPassword,

    // Métodos de actualización
    actualizarPassword,
    actualizarConfirmarPassword,
    reiniciarValidacion,

    // Métodos de utilidad
    obtenerColorPassword,
    obtenerColorConfirmacion,
    obtenerPorcentajeFortaleza,

    // Validaciones específicas
    validarRequisitos,
    validarCoincidencia,

    // Datos derivados
    esPasswordValida: estadoPassword.esValida,
    tieneErrores: estadoPassword.errores.length > 0,
    fortalezaPassword: obtenerPorcentajeFortaleza()
  };
};