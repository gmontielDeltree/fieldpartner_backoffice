/**
 * Tipos para las respuestas de API del módulo cuentas
 * Basados en las respuestas del backend NestJS
 */

import { HttpStatusCode } from 'axios';
import {
  CuentaDto,
  RespuestaCrearCuenta,
  UsuarioCuentaDto,
  CompaniaDto,
  LicenciaPorCuentaDto,
} from './cuenta.types';

import { CategoriaCuenta, EstadoCuenta } from './enums';

// ===============================
// TIPOS RAW DEL BACKEND
// ===============================

// Estructura de cuenta RAW del backend (con paisId poblado)
export interface CuentaBackendRaw {
  _id: string;
  cuentaId: string;
  referenciaCuenta: string;
  denominacion: string;
  paisId: {
    _id: string;
    codigo: string;
    descripcionES: string;
    descripcionPT: string;
    descripcionEN: string;
    idioma: string;
    moneda: string;
    claveTributaria: string;
    formatoClaveTributaria: string;
  } | string;
  categoria: CategoriaCuenta;
  estado: EstadoCuenta;
  contadorCampos: number;
  contadorLicencias: number;
  contadorHectareas: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ===============================
// RESPUESTAS DE ENDPOINTS
// ===============================

// POST /cuentas - Crear cuenta
export interface ApiRespuestaCrearCuenta {
  success: boolean;
  data: RespuestaCrearCuenta;
  message: string;
}

// GET /cuentas - Obtener lista de cuentas
export interface ApiRespuestaListaCuentas {
  success: boolean;
  data: CuentaDto[];
  message: string;
}

// GET /cuentas/:id - Obtener cuenta por ID
export interface ApiRespuestaObtenerCuenta {
  status: HttpStatusCode.Ok; // HTTP status code,
  statusText: "OK",
  data: CuentaDto;
}

// GET /cuentas/:id/completa - Obtener cuenta completa
export interface ApiRespuestaCuentaCompleta {
  success: boolean;
  data: {
    cuenta: CuentaDto;
    usuarios: UsuarioCuentaDto[];
    companias: CompaniaDto[];
    licencias: LicenciaPorCuentaDto[];
  };
  message: string;
}

// GET /cuentas/referencia/:referencia - Buscar por referencia
export interface ApiRespuestaBuscarCuentaPorReferencia {
  success: boolean;
  data: CuentaDto | null;
  message: string;
}

// GET /usuarios/cuenta/:cuentaId - Usuarios de la cuenta
export interface ApiRespuestaUsuariosCuenta {
  success: boolean;
  data: UsuarioCuentaDto[];
  message: string;
}

// GET /usuarios/admin-cuenta/:cuentaId - Usuario admin de la cuenta
export interface ApiRespuestaUsuarioAdminCuenta {
  success: boolean;
  data: UsuarioCuentaDto;
  message: string;
}

// GET /companias/cuenta/:cuentaId - Compañías de la cuenta
export interface ApiRespuestaCompaniasCuenta {
  success: boolean;
  data: CompaniaDto[];
  message: string;
}

// POST /usuarios - Agregar usuario a cuenta (en creación)
export interface ApiRespuestaAgregarUsuario {
  success: boolean;
  data: UsuarioCuentaDto;
  message: string;
}

// PUT /cuentas/:id - Actualizar cuenta
export interface ApiRespuestaActualizarCuenta {
  success: boolean;
  data: CuentaDto;
  message: string;
}

// DELETE /cuentas/:id - Desactivar cuenta
export interface ApiRespuestaDesactivarCuenta {
  success: boolean;
  data: CuentaDto;
  message: string;
}

// ===============================
// RESPUESTAS DE ERROR
// ===============================

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
  };
  timestamp: string;
}

// Tipos específicos de errores del módulo cuentas
export enum CodigosErrorCuentas {
  CUENTA_NO_ENCONTRADA = 'CUENTA_NO_ENCONTRADA',
  REFERENCIA_DUPLICADA = 'REFERENCIA_DUPLICADA',
  EMAIL_YA_EXISTE = 'EMAIL_YA_EXISTE',
  USUARIO_NO_ENCONTRADO = 'USUARIO_NO_ENCONTRADO',
  LICENCIA_NO_VALIDA = 'LICENCIA_NO_VALIDA',
  PAIS_NO_VALIDO = 'PAIS_NO_VALIDO',
  CATEGORIA_NO_VALIDA = 'CATEGORIA_NO_VALIDA',
  SOLO_CATEGORIA_A_MULTIPLES_USUARIOS = 'SOLO_CATEGORIA_A_MULTIPLES_USUARIOS',
  ERROR_CREACION_CUENTA = 'ERROR_CREACION_CUENTA',
  ERROR_ACTUALIZACION_CUENTA = 'ERROR_ACTUALIZACION_CUENTA',
  ERROR_DESACTIVACION_CUENTA = 'ERROR_DESACTIVACION_CUENTA'
}

// Mensajes de error en español
export const MensajesErrorCuentas = {
  [CodigosErrorCuentas.CUENTA_NO_ENCONTRADA]: 'Cuenta no encontrada',
  [CodigosErrorCuentas.REFERENCIA_DUPLICADA]: 'La referencia de la cuenta ya existe',
  [CodigosErrorCuentas.EMAIL_YA_EXISTE]: 'El email ya está registrado',
  [CodigosErrorCuentas.USUARIO_NO_ENCONTRADO]: 'Usuario no encontrado',
  [CodigosErrorCuentas.LICENCIA_NO_VALIDA]: 'Licencia no válida',
  [CodigosErrorCuentas.PAIS_NO_VALIDO]: 'País no válido',
  [CodigosErrorCuentas.CATEGORIA_NO_VALIDA]: 'Categoría de cuenta no válida',
  [CodigosErrorCuentas.SOLO_CATEGORIA_A_MULTIPLES_USUARIOS]: 'Solo cuentas de categoría A pueden tener múltiples usuarios',
  [CodigosErrorCuentas.ERROR_CREACION_CUENTA]: 'Error al crear la cuenta',
  [CodigosErrorCuentas.ERROR_ACTUALIZACION_CUENTA]: 'Error al actualizar la cuenta',
  [CodigosErrorCuentas.ERROR_DESACTIVACION_CUENTA]: 'Error al desactivar la cuenta'
} as const;

// ===============================
// TIPOS PARA VALIDACIONES DE API
// ===============================

export interface ApiRespuestaValidarReferencia {
  success: boolean;
  data: {
    disponible: boolean;
    mensaje: string;
  };
}

export interface ApiRespuestaValidarEmail {
  success: boolean;
  data: {
    disponible: boolean;
    existe: boolean;
    mensaje: string;
  };
}

// ===============================
// TIPOS PARA RESPUESTAS COMPLEJAS
// ===============================

export interface ApiRespuestaDetalleCompleto {
  success: boolean;
  data: {
    cuenta: CuentaDto;
    usuarios: UsuarioCuentaDto[];
    usuarioAdmin?: UsuarioCuentaDto;
    companias: CompaniaDto[];
    licencias: LicenciaPorCuentaDto[];
    estadisticas: {
      totalUsuarios: number;
      totalCompanias: number;
      totalLicenciasActivas: number;
      ultimaActividad: string;
    };
  };
  message: string;
}