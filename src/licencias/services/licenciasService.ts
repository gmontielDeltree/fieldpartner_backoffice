/**
 * Servicio para gestión de licencias
 * Sincronizado con endpoints del backend español
 */

import axios from 'axios';
import {
  LicenciaDto,
  CrearLicenciaDto,
  ActualizarLicenciaDto,
  AsignarLicenciaClienteDto,
  LicenciaPorClienteDto,
  FiltrosLicenciasDto,
  LicenciaBackendRaw,
  CodigosErrorLicencias,
  MensajesErrorLicencias
} from '../types';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_AUTH_API || 'http://localhost:4000';
const LICENCIAS_ENDPOINT = `${API_BASE_URL}/licencias`;

/**
 * Clase de error personalizada para el módulo de licencias
 */
export class LicenciasServiceError extends Error {
  constructor(
    public code: CodigosErrorLicencias,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'LicenciasServiceError';
  }
}

/**
 * Configurar token de autorización para requests
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('t_bo');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Mapear datos del backend al formato del frontend
 */
const mapearLicenciaBackendAFrontend = (licencia: LicenciaBackendRaw): LicenciaDto => ({
  id: licencia.id,
  codigoLicencia: licencia.codigoLicencia,
  descripcion: licencia.descripcion,
  tipoLicencia: licencia.tipoLicencia as any,
  maximoUnidadesPermitidas: licencia.maximoUnidadesPermitidas,
  tipoSistema: licencia.tipoSistema as any,
  esLicenciaMultiPais: licencia.esLicenciaMultiPais,
  fechaCreacion: licencia.fechaCreacion,
  fechaActualizacion: licencia.fechaActualizacion
});

/**
 * Manejo centralizado de errores
 */
const handleApiError = (error: any): never => {
  if (error.response?.data) {
    const { code, message, details } = error.response.data.error || {};
    const errorCode = code || CodigosErrorLicencias.ERROR_CREACION_LICENCIA;
    const errorMessage = message || MensajesErrorLicencias[errorCode] || 'Error desconocido';
    throw new LicenciasServiceError(errorCode, errorMessage, details);
  }

  throw new LicenciasServiceError(
    CodigosErrorLicencias.ERROR_CREACION_LICENCIA,
    error.message || 'Error de conexión'
  );
};

/**
 * Servicio principal para gestión de licencias
 */
export const licenciasService = {

  /**
   * Obtener todas las licencias
   */
  async obtenerLicencias(filtros?: FiltrosLicenciasDto): Promise<LicenciaDto[]> {
    try {
      const params = new URLSearchParams();

      if (filtros?.tipoLicencia) {
        params.append('tipoLicencia', filtros.tipoLicencia);
      }
      if (filtros?.tipoSistema) {
        params.append('tipoSistema', filtros.tipoSistema);
      }
      if (filtros?.descripcion) {
        params.append('descripcion', filtros.descripcion);
      }

      const url = `${LICENCIAS_ENDPOINT}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await axios.get(
        url,
        { headers: getAuthHeaders() }
      );

      // El backend devuelve los datos directamente en response.data
      const licenciasRaw: LicenciaBackendRaw[] = response.data;

      if (!Array.isArray(licenciasRaw)) {
        throw new Error('Formato de respuesta inesperado');
      }

      // Mapear los datos del backend al formato esperado por el frontend
      return licenciasRaw.map(mapearLicenciaBackendAFrontend);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener licencia por ID
   */
  async obtenerLicenciaPorId(licenciaId: string): Promise<LicenciaDto> {
    try {
      const response = await axios.get(
        `${LICENCIAS_ENDPOINT}/${licenciaId}`,
        { headers: getAuthHeaders() }
      );

      const licencia: LicenciaBackendRaw = response.data;

      if (!licencia) {
        throw new Error('Licencia no encontrada');
      }

      // Mapear los datos del backend al formato esperado
      return mapearLicenciaBackendAFrontend(licencia);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Buscar licencia por código
   */
  async buscarLicenciaPorCodigo(codigo: string): Promise<LicenciaDto | null> {
    try {
      const response = await axios.get(
        `${LICENCIAS_ENDPOINT}/codigo/${codigo}`,
        { headers: getAuthHeaders() }
      );

      const licencia: LicenciaBackendRaw = response.data;

      if (!licencia) {
        return null;
      }

      // Mapear los datos del backend al formato esperado
      return mapearLicenciaBackendAFrontend(licencia);
    } catch (error) {
      // Para búsquedas, retornamos null si no se encuentra
      if (error.response?.status === 404) {
        return null;
      }
      return handleApiError(error);
    }
  },

  /**
   * Crear una nueva licencia
   */
  async crearLicencia(datos: CrearLicenciaDto): Promise<LicenciaDto> {
    try {
      const response = await axios.post(
        LICENCIAS_ENDPOINT,
        datos,
        { headers: getAuthHeaders() }
      );

      const licencia: LicenciaBackendRaw = response.data;
      return mapearLicenciaBackendAFrontend(licencia);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Actualizar licencia
   */
  async actualizarLicencia(
    licenciaId: string,
    datos: ActualizarLicenciaDto
  ): Promise<LicenciaDto> {
    try {
      const response = await axios.put(
        `${LICENCIAS_ENDPOINT}/${licenciaId}`,
        datos,
        { headers: getAuthHeaders() }
      );

      const licencia: LicenciaBackendRaw = response.data;
      return mapearLicenciaBackendAFrontend(licencia);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Asignar licencia a cliente
   */
  async asignarLicenciaACliente(datos: AsignarLicenciaClienteDto): Promise<LicenciaPorClienteDto> {
    try {
      const response = await axios.post(
        `${LICENCIAS_ENDPOINT}/asignar`,
        datos,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener licencias de un cliente
   */
  async obtenerLicenciasDeCliente(clienteId: string): Promise<LicenciaPorClienteDto[]> {
    try {
      const response = await axios.get(
        `${LICENCIAS_ENDPOINT}/cliente/${clienteId}`,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener cuentas con una licencia específica
   */
  async obtenerClientesConLicencia(licenciaId: string): Promise<LicenciaPorClienteDto[]> {
    try {
      const response = await axios.get(
        `${LICENCIAS_ENDPOINT}/cuentas-con/${licenciaId}`,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Desactivar licencia de un cliente
   */
  async desactivarLicenciaDeCliente(
    clienteId: string,
    licenciaId: string
  ): Promise<LicenciaPorClienteDto> {
    try {
      const response = await axios.put(
        `${LICENCIAS_ENDPOINT}/desactivar/${clienteId}/${licenciaId}`,
        {},
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Validar si un código de licencia está disponible
   */
  async validarCodigoDisponible(codigo: string): Promise<boolean> {
    try {
      const licencia = await this.buscarLicenciaPorCodigo(codigo);
      return licencia === null; // Si no encuentra licencia, el código está disponible
    } catch (error) {
      // En caso de error, asumimos que no está disponible por seguridad
      return false;
    }
  },

  /**
   * Búsqueda avanzada de licencias
   */
  async buscarLicencias(termino: string, filtros?: FiltrosLicenciasDto): Promise<LicenciaDto[]> {
    try {
      const todasLasLicencias = await this.obtenerLicencias(filtros);

      // Filtrar por término de búsqueda (código o descripción)
      const terminoNormalizado = termino.toLowerCase().trim();

      return todasLasLicencias.filter(licencia =>
        licencia.codigoLicencia.toLowerCase().includes(terminoNormalizado) ||
        licencia.descripcion.toLowerCase().includes(terminoNormalizado)
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
};