/**
 * Servicio para gestión de países
 * Integrado con backend REST en puerto 4000
 * Siguiendo el patrón de clientes/licencias
 */

import axios from 'axios';
import {
  PaisDto,
  CrearPaisDto,
  ActualizarPaisDto,
  FiltrosPaisesDto
} from '../types';

// ============================
// CONFIGURACIÓN
// ============================

const API_BASE_URL = 'http://localhost:4000';
const PAISES_ENDPOINT = '/datos-maestros/paises';

/**
 * Obtener headers de autenticación
 */
const obtenerHeadersAutenticacion = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// ============================
// MAPEO DE DATOS
// ============================

/**
 * Mapear respuesta del backend a DTO del frontend
 * El backend devuelve los datos directamente en response.data
 */
const mapearPaisBackendAFrontend = (paisBackend: any): PaisDto => {
  return {
    _id: paisBackend._id,
    codigo: paisBackend.codigo,
    descripcionES: paisBackend.descripcionES,
    descripcionPT: paisBackend.descripcionPT,
    descripcionEN: paisBackend.descripcionEN,
    idioma: paisBackend.idioma,
    moneda: paisBackend.moneda,
    claveTributaria: paisBackend.claveTributaria,
    formatoClaveTributaria: paisBackend.formatoClaveTributaria,
    createdAt: paisBackend.createdAt ? new Date(paisBackend.createdAt) : undefined,
    updatedAt: paisBackend.updatedAt ? new Date(paisBackend.updatedAt) : undefined
  };
};

/**
 * Mapear DTO del frontend para envío al backend
 */
const mapearPaisFrontendABackend = (paisDto: CrearPaisDto | ActualizarPaisDto) => {
  return {
    codigo: paisDto.codigo,
    descripcionES: paisDto.descripcionES,
    descripcionPT: paisDto.descripcionPT,
    descripcionEN: paisDto.descripcionEN,
    idioma: paisDto.idioma,
    moneda: paisDto.moneda,
    claveTributaria: paisDto.claveTributaria,
    formatoClaveTributaria: paisDto.formatoClaveTributaria
  };
};

// ============================
// FUNCIONES DEL SERVICIO
// ============================

/**
 * Obtener todos los países
 */
export const obtenerPaises = async (): Promise<PaisDto[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${PAISES_ENDPOINT}`,
      { headers: obtenerHeadersAutenticacion() }
    );

    // El backend devuelve los datos directamente en response.data
    const paisesData = Array.isArray(response.data) ? response.data : [];

    return paisesData.map((pais: any) => mapearPaisBackendAFrontend(pais));
  } catch (error) {
    console.error('Error al obtener países:', error);
    throw new Error('No se pudieron cargar los países');
  }
};

/**
 * Obtener un país por ID
 */
export const obtenerPaisPorId = async (paisId: string): Promise<PaisDto> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${PAISES_ENDPOINT}/${paisId}`,
      { headers: obtenerHeadersAutenticacion() }
    );

    return mapearPaisBackendAFrontend(response.data);
  } catch (error) {
    console.error(`Error al obtener país ${paisId}:`, error);
    throw new Error('No se pudo cargar el país');
  }
};

/**
 * Obtener un país por código
 */
export const obtenerPaisPorCodigo = async (codigo: string): Promise<PaisDto> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${PAISES_ENDPOINT}/codigo/${codigo}`,
      { headers: obtenerHeadersAutenticacion() }
    );

    return mapearPaisBackendAFrontend(response.data);
  } catch (error) {
    console.error(`Error al obtener país con código ${codigo}:`, error);
    throw new Error('No se pudo cargar el país');
  }
};

/**
 * Crear un nuevo país
 */
export const crearPais = async (paisData: CrearPaisDto): Promise<PaisDto> => {
  try {
    const paisParaBackend = mapearPaisFrontendABackend(paisData);

    const response = await axios.post(
      `${API_BASE_URL}${PAISES_ENDPOINT}`,
      paisParaBackend,
      { headers: obtenerHeadersAutenticacion() }
    );

    return mapearPaisBackendAFrontend(response.data);
  } catch (error) {
    console.error('Error al crear país:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('Datos del país inválidos. Verifique los campos requeridos.');
      }
      if (error.response?.status === 409) {
        throw new Error('Ya existe un país con este código.');
      }
    }

    throw new Error('No se pudo crear el país');
  }
};

/**
 * Actualizar un país existente
 */
export const actualizarPais = async (paisId: string, paisData: ActualizarPaisDto): Promise<PaisDto> => {
  try {
    const paisParaBackend = mapearPaisFrontendABackend(paisData);

    const response = await axios.put(
      `${API_BASE_URL}${PAISES_ENDPOINT}/${paisId}`,
      paisParaBackend,
      { headers: obtenerHeadersAutenticacion() }
    );

    return mapearPaisBackendAFrontend(response.data);
  } catch (error) {
    console.error(`Error al actualizar país ${paisId}:`, error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('País no encontrado.');
      }
      if (error.response?.status === 400) {
        throw new Error('Datos del país inválidos.');
      }
    }

    throw new Error('No se pudo actualizar el país');
  }
};

/**
 * Eliminar un país
 */
export const eliminarPais = async (paisId: string): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}${PAISES_ENDPOINT}/${paisId}`,
      { headers: obtenerHeadersAutenticacion() }
    );
  } catch (error) {
    console.error(`Error al eliminar país ${paisId}:`, error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('País no encontrado.');
      }
      if (error.response?.status === 409) {
        throw new Error('No se puede eliminar el país porque está siendo utilizado.');
      }
    }

    throw new Error('No se pudo eliminar el país');
  }
};

/**
 * Buscar países con filtros
 */
export const buscarPaises = async (filtros: FiltrosPaisesDto): Promise<PaisDto[]> => {
  try {
    const params = new URLSearchParams();

    if (filtros.codigo) params.append('codigo', filtros.codigo);
    if (filtros.descripcion) params.append('descripcion', filtros.descripcion);
    if (filtros.idioma) params.append('idioma', filtros.idioma);
    if (filtros.moneda) params.append('moneda', filtros.moneda);

    const response = await axios.get(
      `${API_BASE_URL}${PAISES_ENDPOINT}?${params.toString()}`,
      { headers: obtenerHeadersAutenticacion() }
    );

    const paisesData = Array.isArray(response.data) ? response.data : [];
    return paisesData.map((pais: any) => mapearPaisBackendAFrontend(pais));
  } catch (error) {
    console.error('Error al buscar países:', error);
    throw new Error('No se pudieron buscar los países');
  }
};

// ============================
// FUNCIONES AUXILIARES
// ============================

/**
 * Validar código de país
 */
export const validarCodigoPais = (codigo: string): boolean => {
  return /^[A-Z]{2,3}$/.test(codigo);
};

/**
 * Obtener países para dropdown (solo código y descripción ES)
 */
export const obtenerPaisesParaDropdown = async (): Promise<Array<{value: string, label: string}>> => {
  try {
    const paises = await obtenerPaises();

    return paises.map(pais => ({
      value: pais.codigo,
      label: `${pais.descripcionES} (${pais.codigo})`
    })).sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error('Error al obtener países para dropdown:', error);
    return [];
  }
};