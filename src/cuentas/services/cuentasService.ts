/**
 * Servicio para gestión de cuentas
 * Comunicación con endpoints de /cuentas del backend
 */

import axios from 'axios';
import {
  CrearCuentaDto,
  ActualizarCuentaDto,
  RespuestaCrearCuenta,
  UsuarioCuentaDto,
  CompaniaDto,
  AgregarUsuarioACuentaDto,
  FiltrosCuentasDto,
  CuentaDto,
  CuentaCompletaDto
} from '../types/cuenta.types';

import { CategoriaCuenta } from '../types/enums';

import {
  CuentaBackendRaw,
  ApiRespuestaCrearCuenta,
  ApiRespuestaListaCuentas,
  // ApiRespuestaObtenerCuenta,
  ApiRespuestaBuscarCuentaPorReferencia,
  ApiRespuestaUsuariosCuenta,
  ApiRespuestaUsuarioAdminCuenta,
  ApiRespuestaCompaniasCuenta,
  ApiRespuestaAgregarUsuario,
  ApiRespuestaActualizarCuenta,
  ApiRespuestaDesactivarCuenta,
  CodigosErrorCuentas,
  MensajesErrorCuentas,
} from '../types/api-responses.types';


// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_AUTH_API || 'http://localhost:4000';
const CUENTAS_ENDPOINT = `${API_BASE_URL}/cuentas`;
const USUARIOS_ENDPOINT = `${API_BASE_URL}/usuarios`;
const COMPANIAS_ENDPOINT = `${API_BASE_URL}/companias`;

/**
 * Clase de error personalizada para el módulo de cuentas
 */
export class CuentasServiceError extends Error {
  constructor(
    public code: CodigosErrorCuentas,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'CuentasServiceError';
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
 * Mapear datos de cuenta del backend al formato del frontend
 */
const mapearCuentaBackendAFrontend = (cuenta: CuentaBackendRaw): CuentaDto => ({
  _id: cuenta._id,
  cuentaId: cuenta.cuentaId,
  referenciaCuenta: cuenta.referenciaCuenta,
  denominacion: cuenta.denominacion,
  paisId: typeof cuenta.paisId === 'object' ? cuenta.paisId : cuenta.paisId,
  categoria: cuenta.categoria,
  estado: cuenta.estado,
  contadorCampos: cuenta.contadorCampos,
  contadorLicencias: cuenta.contadorLicencias,
  contadorHectareas: cuenta.contadorHectareas,
  fechaCreacion: cuenta.fechaCreacion,
  fechaActualizacion: cuenta.fechaActualizacion,
  createdAt: cuenta.createdAt,
  updatedAt: cuenta.updatedAt,
});

/**
 * Manejo centralizado de errores para cuentas
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleCuentasApiError = (error: any): never => {
  if (error.response?.data) {
    const { code, message, details } = error.response.data.error || {};
    const errorCode = code || CodigosErrorCuentas.ERROR_CREACION_CUENTA;
    const errorMessage = message || MensajesErrorCuentas[errorCode as keyof typeof MensajesErrorCuentas] || 'Error desconocido';
    throw new CuentasServiceError(errorCode, errorMessage, details);
  }

  throw new CuentasServiceError(
    CodigosErrorCuentas.ERROR_CREACION_CUENTA,
    error.message || 'Error de conexión'
  );
};

/**
 * Servicio principal para gestión de cuentas
 */
export const cuentasService = {

  /**
   * Crear una nueva cuenta (todas las categorías A, B, C)
   */
  async crearCuenta(datos: CrearCuentaDto): Promise<RespuestaCrearCuenta> {
    try {
      const response = await axios.post<RespuestaCrearCuenta>(
        CUENTAS_ENDPOINT,
        datos,
        { headers: getAuthHeaders() }
      );

      if (response.statusText !== "Created" || !response.data) {
        throw new Error('Error al crear cuenta');
      }
      return response.data;
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Obtener lista de cuentas con filtros opcionales
   */
  async obtenerCuentas(filtros?: FiltrosCuentasDto): Promise<CuentaDto[]> {
    try {
      const params = new URLSearchParams();

      if (filtros?.categoria) {
        params.append('categoria', filtros.categoria);
      }
      if (filtros?.estado) {
        params.append('estado', filtros.estado);
      }
      if (filtros?.paisId) {
        params.append('paisId', filtros.paisId);
      }

      const url = `${CUENTAS_ENDPOINT}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await axios.get<CuentaDto[]>(
        url,
        { headers: getAuthHeaders() }
      );

      // Fallback para respuesta directa (sin wrapper success)
      // const cuentasRaw: CuentaBackendRaw[] = Array.isArray(response.data) ? response.data : [];
      // return cuentasRaw.map(mapearCuentaBackendAFrontend);
      return response.data;
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Obtener cuenta por ID
   */
  async obtenerCuentaPorCuentaId(cuentaId: string): Promise<CuentaDto> {
    try {
      // Corregir: AxiosResponse<T> estructura correcta
      const response = await axios.get<CuentaBackendRaw>(
        `${CUENTAS_ENDPOINT}/${cuentaId}`,
        { headers: getAuthHeaders() }
      );

      // AxiosResponse.status es number, usar response.status === 200
      if (response.status === 200 && response.data) {
        return mapearCuentaBackendAFrontend(response.data);
      }

      throw new Error('Cuenta no encontrada');
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  async obtenerCuentaCompleta(cuentaId: string): Promise<CuentaCompletaDto | null> {
    try {
      const response = await axios.get<CuentaCompletaDto>(
        `${CUENTAS_ENDPOINT}/${cuentaId}/completa`,
        { headers: getAuthHeaders() }
      );
      
      if (response.data && response.statusText === "OK") {
        return response.data;
      }
      return null;
      // return mapearCuentaBackendAFrontend(cuenta);
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Buscar cuenta por referencia
   */
  async buscarCuentaPorReferencia(referencia: string): Promise<CuentaDto | null> {
    try {
      const response = await axios.get<ApiRespuestaBuscarCuentaPorReferencia>(
        `${CUENTAS_ENDPOINT}/referencia/${referencia}`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success && response.data.data) {
        return mapearCuentaBackendAFrontend(response.data.data as CuentaBackendRaw);
      }

      // Fallback para respuesta directa
      const cuenta: CuentaBackendRaw = response.data as any;
      if (!cuenta) {
        return null;
      }

      return mapearCuentaBackendAFrontend(cuenta);
    } catch (error) {
      // Para búsquedas, retornamos null si no se encuentra
      if (error.response?.status === 404) {
        return null;
      }
      return handleCuentasApiError(error);
    }
  },

  /**
   * Obtener usuarios de una cuenta (categoría A)
   */
  async obtenerUsuariosDeCuenta(cuentaId: string): Promise<UsuarioCuentaDto[]> {
    try {
      const response = await axios.get<UsuarioCuentaDto[]>(
        `${USUARIOS_ENDPOINT}/cuenta/${cuentaId}`,
        { headers: getAuthHeaders() }
      );

      if (response.statusText !== "OK") {
        throw new Error("Error obteniendo usuarios de la cuenta");
      }

      return response.data;
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Obtener usuario admin de una cuenta (categorías B/C)
   */
  async obtenerUsuarioAdminDeCuenta(cuentaId: string): Promise<UsuarioCuentaDto> {
    try {
      const response = await axios.get<ApiRespuestaUsuarioAdminCuenta>(
        `${USUARIOS_ENDPOINT}/admin-cuenta/${cuentaId}`,
        { headers: getAuthHeaders() }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Obtener compañías de una cuenta
   */
  async obtenerCompaniasDeCuenta(cuentaId: string): Promise<CompaniaDto[]> {
    try {
      const response = await axios.get<CompaniaDto[]>(
        `${COMPANIAS_ENDPOINT}/cuenta/${cuentaId}`,
        { headers: getAuthHeaders() }
      );

      if (response.statusText !== "OK") {
        throw new Error("Error obteniendo compañías de la cuenta");
      }

      return response.data;
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Agregar usuario existente a cuenta (solo categoría A)
   */
  async agregarUsuarioACuenta(
    cuentaId: string,
    datos: AgregarUsuarioACuentaDto
  ): Promise<UsuarioCuentaDto> {
    try {
      const response = await axios.post<ApiRespuestaAgregarUsuario>(
        `${USUARIOS_ENDPOINT}`,
        {
          usuarioEmail: datos.usuarioEmail,
          licenciaId: datos.licenciaId,
          cuentaId: cuentaId
        },
        { headers: getAuthHeaders() }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Actualizar cuenta
   */
  async actualizarCuenta(
    cuentaId: string,
    datos: ActualizarCuentaDto
  ): Promise<CuentaDto> {
    try {
      const response = await axios.put<ApiRespuestaActualizarCuenta>(
        `${CUENTAS_ENDPOINT}/${cuentaId}`,
        datos,
        { headers: getAuthHeaders() }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return mapearCuentaBackendAFrontend(response.data.data as CuentaBackendRaw);
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Desactivar cuenta
   */
  async desactivarCuenta(cuentaId: string): Promise<CuentaDto> {
    try {
      const response = await axios.delete<ApiRespuestaDesactivarCuenta>(
        `${CUENTAS_ENDPOINT}/${cuentaId}`,
        { headers: getAuthHeaders() }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return mapearCuentaBackendAFrontend(response.data.data as CuentaBackendRaw);
    } catch (error) {
      return handleCuentasApiError(error);
    }
  },

  /**
   * Validar si una referencia de cuenta está disponible
   */
  async validarReferenciaCuentaDisponible(referencia: string): Promise<boolean> {
    try {
      const cuenta = await this.buscarCuentaPorReferencia(referencia);
      return cuenta === null; // Si no encuentra cuenta, la referencia está disponible
    } catch (error) {
      // En caso de error, asumimos que no está disponible por seguridad
      return false;
    }
  },

  /**
   * Validar si un email de usuario está disponible o existe
   */
  async validarEmailUsuario(email: string): Promise<{ disponible: boolean; existe: boolean }> {
    try {
      // Aquí podrías implementar un endpoint específico para validar emails
      // Por ahora, usamos una validación básica

      // Esto sería ideal tener un endpoint como: GET /usuarios/validar-email/:email
      // const response = await axios.get(`${API_BASE_URL}/usuarios/validar-email/${email}`);

      // Por ahora retornamos true (disponible) para emails nuevos
      // Este método se puede mejorar cuando se implemente el endpoint específico
      return {
        disponible: !!email,
        existe: false
      };
    } catch (error) {
      return {
        disponible: false,
        existe: true
      };
    }
  },

  /**
   * Obtener cuentas por categoría específica
   */
  async obtenerCuentasPorCategoria(categoria: CategoriaCuenta): Promise<CuentaDto[]> {
    return this.obtenerCuentas({ categoria });
  },

  /**
   * Búsqueda avanzada de cuentas
   */
  async buscarCuentas(termino: string, filtros?: FiltrosCuentasDto): Promise<CuentaDto[]> {
    try {
      const todasLasCuentas = await this.obtenerCuentas(filtros);

      // Filtrar por término de búsqueda (referencia o denominación)
      const terminoNormalizado = termino.toLowerCase().trim();

      return todasLasCuentas.filter(cuenta =>
        cuenta.referenciaCuenta.toLowerCase().includes(terminoNormalizado) ||
        cuenta.denominacion.toLowerCase().includes(terminoNormalizado)
      );
    } catch (error) {
      return handleCuentasApiError(error);
    }
  }
};