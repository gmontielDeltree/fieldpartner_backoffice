/**
 * Tipos para las respuestas de API del módulo licencias
 * Basados en las respuestas del backend español
 */

import {
  LicenciaDto,
  LicenciaPorClienteDto,
  CrearLicenciaDto,
  ActualizarLicenciaDto,
  AsignarLicenciaClienteDto
} from './licencia.types';

// ===============================
// TIPOS RAW DEL BACKEND
// ===============================

// Estructura de licencia RAW del backend
export interface LicenciaBackendRaw {
  _id: string;
  id: string;
  codigoLicencia: string;
  descripcion: string;
  tipoLicencia: string;
  maximoUnidadesPermitidas: number;
  tipoSistema: string;
  esLicenciaMultiPais: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ===============================
// RESPUESTAS DE ENDPOINTS
// ===============================

// POST /licencias - Crear licencia
export interface ApiRespuestaCrearLicencia {
  success: boolean;
  data: LicenciaDto;
  message: string;
}

// GET /licencias - Obtener lista de licencias
export interface ApiRespuestaListaLicencias {
  success: boolean;
  data: LicenciaDto[];
  message: string;
}

// GET /licencias/:id - Obtener licencia por ID
export interface ApiRespuestaObtenerLicencia {
  success: boolean;
  data: LicenciaDto;
  message: string;
}

// GET /licencias/codigo/:codigo - Buscar por código
export interface ApiRespuestaBuscarLicenciaPorCodigo {
  success: boolean;
  data: LicenciaDto | null;
  message: string;
}

// POST /licencias/asignar - Asignar licencia a cliente
export interface ApiRespuestaAsignarLicencia {
  success: boolean;
  data: LicenciaPorClienteDto;
  message: string;
}

// GET /licencias/cliente/:clienteId - Licencias de cliente
export interface ApiRespuestaLicenciasDeCliente {
  success: boolean;
  data: LicenciaPorClienteDto[];
  message: string;
}

// GET /licencias/cuentas-con/:licenciaId - Cuentas con licencia
export interface ApiRespuestaClientesConLicencia {
  success: boolean;
  data: LicenciaPorClienteDto[];
  message: string;
}

// PUT /licencias/:id - Actualizar licencia
export interface ApiRespuestaActualizarLicencia {
  success: boolean;
  data: LicenciaDto;
  message: string;
}

// PUT /licencias/desactivar/:clienteId/:licenciaId - Desactivar licencia
export interface ApiRespuestaDesactivarLicencia {
  success: boolean;
  data: LicenciaPorClienteDto;
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
    details?: any;
  };
  timestamp: string;
}

// Tipos específicos de errores del módulo licencias
export enum CodigosErrorLicencias {
  LICENCIA_NO_ENCONTRADA = 'LICENCIA_NO_ENCONTRADA',
  CODIGO_DUPLICADO = 'CODIGO_DUPLICADO',
  LICENCIA_YA_ASIGNADA = 'LICENCIA_YA_ASIGNADA',
  CLIENTE_NO_ENCONTRADO = 'CLIENTE_NO_ENCONTRADO',
  ASIGNACION_NO_ENCONTRADA = 'ASIGNACION_NO_ENCONTRADA',
  ERROR_CREACION_LICENCIA = 'ERROR_CREACION_LICENCIA',
  ERROR_ACTUALIZACION_LICENCIA = 'ERROR_ACTUALIZACION_LICENCIA',
  ERROR_ASIGNACION_LICENCIA = 'ERROR_ASIGNACION_LICENCIA'
}

// Mensajes de error en español
export const MensajesErrorLicencias = {
  [CodigosErrorLicencias.LICENCIA_NO_ENCONTRADA]: 'Licencia no encontrada',
  [CodigosErrorLicencias.CODIGO_DUPLICADO]: 'El código de licencia ya existe',
  [CodigosErrorLicencias.LICENCIA_YA_ASIGNADA]: 'La licencia ya está asignada a este cliente',
  [CodigosErrorLicencias.CLIENTE_NO_ENCONTRADO]: 'Cliente no encontrado',
  [CodigosErrorLicencias.ASIGNACION_NO_ENCONTRADA]: 'Asignación de licencia no encontrada',
  [CodigosErrorLicencias.ERROR_CREACION_LICENCIA]: 'Error al crear la licencia',
  [CodigosErrorLicencias.ERROR_ACTUALIZACION_LICENCIA]: 'Error al actualizar la licencia',
  [CodigosErrorLicencias.ERROR_ASIGNACION_LICENCIA]: 'Error al asignar la licencia'
} as const;

// ===============================
// TIPOS PARA VALIDACIONES DE API
// ===============================

export interface ApiRespuestaValidarCodigo {
  success: boolean;
  data: {
    disponible: boolean;
    mensaje: string;
  };
}

// ===============================
// TIPOS PARA RESPUESTAS COMPLEJAS
// ===============================

export interface ApiRespuestaDetalleCompletoLicencia {
  success: boolean;
  data: {
    licencia: LicenciaDto;
    asignaciones: LicenciaPorClienteDto[];
    estadisticas: {
      totalAsignaciones: number;
      cuentasActivas: number;
      ultimaAsignacion: string;
    };
  };
  message: string;
}