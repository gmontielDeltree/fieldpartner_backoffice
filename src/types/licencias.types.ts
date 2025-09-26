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

// Interfaz para LicenciaPorCuenta
export interface LicenciaPorCuenta {
  id: string;
  cuentaId: string;
  licenciaId: string;
  cantidadLicenciasPermitidas: number;
  codigoPais: string;
  fechaInicioLicencia: Date;
  fechaFinLicencia: Date;
  estado: EstadoLicencia;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Compatibilidad hacia atrás
export interface LicenciaPorCliente extends LicenciaPorCuenta {
  clienteId: string;
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

export interface AsignarLicenciaCuentaDto {
  cuentaId: string;
  licenciaId: string;
  cantidadLicenciasPermitidas: number;
  codigoPais: string;
  fechaInicioLicencia: string;
  fechaFinLicencia: string;
}

// Compatibilidad hacia atrás
export interface AsignarLicenciaClienteDto extends AsignarLicenciaCuentaDto {
  clienteId: string;
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
  licenciasPorCuenta: LicenciaPorCuenta[];
  licenciasPorCliente: LicenciaPorCliente[]; // Compatibilidad
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