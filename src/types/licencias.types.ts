// Tipos y interfaces para el módulo de Licencias
// Compatible con el backend NestJS

export enum TipoLicencia {
  CAMPO = 'Campo',
  LICENCIA = 'Licencia',
  HECTAREA = 'Hectarea'
}

export enum TipoSistema {
  FIELD_PARTNER = 'FieldPartner',
  AGRO_TOOLS = 'AgroTools',
  FARM_MANAGER = 'FarmManager'
}

export enum EstadoLicencia {
  ACTIVA = 'Activa',
  INACTIVA = 'Inactiva'
}

// Interfaz principal de Licencia (compatible con backend)
export interface Licencia {
  id: string;
  codigoLicencia: string;
  descripcion: string;
  tipoLicencia: TipoLicencia;
  maximoUnidadesPermitidas: number;
  tipoSistema: TipoSistema;
  esLicenciaMultiPais: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Interfaz para LicenciaPorCliente
export interface LicenciaPorCliente {
  id: string;
  clienteId: string;
  licenciaId: string;
  cantidadLicenciasPermitidas: number;
  codigoPais: string;
  fechaInicioLicencia: Date;
  fechaFinLicencia: Date;
  estado: EstadoLicencia;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// DTOs para requests
export interface CrearLicenciaDto {
  codigoLicencia: string;
  descripcion: string;
  tipoLicencia: TipoLicencia;
  maximoUnidadesPermitidas: number;
  tipoSistema?: TipoSistema;
  esLicenciaMultiPais?: boolean;
}

export interface AsignarLicenciaClienteDto {
  clienteId: string;
  licenciaId: string;
  cantidadLicenciasPermitidas: number;
  codigoPais: string;
  fechaInicioLicencia: string;
  fechaFinLicencia: string;
}

export interface ActualizarLicenciaDto {
  codigoLicencia?: string;
  descripcion?: string;
  tipoLicencia?: TipoLicencia;
  maximoUnidadesPermitidas?: number;
  tipoSistema?: TipoSistema;
  esLicenciaMultiPais?: boolean;
}

// Estados para Redux
export interface LicenciasState {
  licencias: Licencia[];
  licenciaActiva: Licencia | null;
  licenciasPorCliente: LicenciaPorCliente[];
  isLoading: boolean;
  error: string | null;
}

// Props para componentes
export interface LicenciaFormData {
  codigoLicencia: string;
  descripcion: string;
  tipoLicencia: TipoLicencia;
  maximoUnidadesPermitidas: number;
  tipoSistema: TipoSistema;
  esLicenciaMultiPais: boolean;
}

// Respuestas de la API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ListaLicenciasResponse {
  licencias: Licencia[];
  total: number;
}