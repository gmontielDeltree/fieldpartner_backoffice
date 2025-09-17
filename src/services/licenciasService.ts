// Servicio HTTP para el módulo de Licencias
// Conecta con las APIs del backend NestJS

import {
  Licencia,
  LicenciaPorCliente,
  CrearLicenciaDto,
  AsignarLicenciaClienteDto,
  ActualizarLicenciaDto,
  ApiResponse
} from '../types/licencias.types';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_URL } = getEnvVariables();
const API_BASE_URL = `${VITE_API_URL}/licencias`;

class LicenciasService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      // TODO: Agregar token de autenticación
      // 'Authorization': `Bearer ${getToken()}`
    };

    const config: RequestInit = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
          `Error HTTP: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error en LicenciasService:', error);
      throw error;
    }
  }

  // 📋 OBTENER TODAS LAS LICENCIAS
  async obtenerLicencias(): Promise<Licencia[]> {
    return this.request<Licencia[]>('');
  }

  // 🔍 OBTENER LICENCIA POR ID
  async obtenerLicenciaPorId(id: string): Promise<Licencia> {
    return this.request<Licencia>(`/${id}`);
  }

  // 🔍 OBTENER LICENCIA POR CÓDIGO
  async obtenerLicenciaPorCodigo(codigo: string): Promise<Licencia> {
    return this.request<Licencia>(`/codigo/${codigo}`);
  }

  // ➕ CREAR NUEVA LICENCIA
  async crearLicencia(licenciaData: CrearLicenciaDto): Promise<Licencia> {
    return this.request<Licencia>('', {
      method: 'POST',
      body: JSON.stringify(licenciaData),
    });
  }

  // ✏️ ACTUALIZAR LICENCIA
  async actualizarLicencia(
    id: string,
    licenciaData: ActualizarLicenciaDto
  ): Promise<Licencia> {
    return this.request<Licencia>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(licenciaData),
    });
  }

  // 🔗 ASIGNAR LICENCIA A CLIENTE
  async asignarLicenciaACliente(
    datos: AsignarLicenciaClienteDto
  ): Promise<LicenciaPorCliente> {
    return this.request<LicenciaPorCliente>('/asignar', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  }

  // 👥 OBTENER LICENCIAS DE UN CLIENTE
  async obtenerLicenciasDeCliente(clienteId: string): Promise<LicenciaPorCliente[]> {
    return this.request<LicenciaPorCliente[]>(`/cliente/${clienteId}`);
  }

  // 🏢 OBTENER CLIENTES CON LICENCIA
  async obtenerClientesConLicencia(licenciaId: string): Promise<LicenciaPorCliente[]> {
    return this.request<LicenciaPorCliente[]>(`/clientes-con/${licenciaId}`);
  }

  // ❌ DESACTIVAR LICENCIA DE CLIENTE
  async desactivarLicenciaDeCliente(
    clienteId: string,
    licenciaId: string
  ): Promise<LicenciaPorCliente> {
    return this.request<LicenciaPorCliente>(`/desactivar/${clienteId}/${licenciaId}`, {
      method: 'PUT',
    });
  }

  // 🔍 BUSCAR LICENCIAS (con filtros)
  async buscarLicencias(filtros: {
    descripcion?: string;
    tipoLicencia?: string;
    tipoSistema?: string;
  }): Promise<Licencia[]> {
    const queryParams = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<Licencia[]>(endpoint);
  }
}

// Exportar instancia singleton
export const licenciasService = new LicenciasService();
export default licenciasService;