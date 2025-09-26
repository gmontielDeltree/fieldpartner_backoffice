/**
 * Tipos principales para el módulo de licencias
 * Compatible con el backend NestJS en español
 */

import { TipoLicencia, TipoSistema, EstadoLicencia } from './enums';

// ===============================
// TIPOS PRINCIPALES DE LICENCIA
// ===============================

export interface LicenciaDto {
  id: string;
  codigoLicencia: string;
  descripcion: string;
  tipoLicencia: TipoLicencia;
  maximoUnidadesPermitidas: number;
  tipoSistema: TipoSistema;
  esLicenciaMultiPais: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface LicenciaPorClienteDto {
  id: string;
  clienteId: string;
  licenciaId: string;
  cantidadLicenciasPermitidas: number;
  codigoPais: string;
  fechaInicioLicencia: string;
  fechaFinLicencia: string;
  esActiva: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// ===============================
// TIPOS PARA FORMULARIOS
// ===============================

export interface CrearLicenciaDto {
  codigoLicencia: string;
  descripcion: string;
  tipoLicencia: TipoLicencia;
  maximoUnidadesPermitidas: number;
  tipoSistema: TipoSistema;
  esLicenciaMultiPais: boolean;
}

export interface ActualizarLicenciaDto {
  codigoLicencia?: string;
  descripcion?: string;
  tipoLicencia?: TipoLicencia;
  maximoUnidadesPermitidas?: number;
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

// ===============================
// TIPOS PARA FILTROS Y BÚSQUEDAS
// ===============================

export interface FiltrosLicenciasDto {
  descripcion?: string;
  tipoLicencia?: TipoLicencia;
  tipoSistema?: TipoSistema;
  esLicenciaMultiPais?: boolean;
}

export interface PaginacionLicenciasDto {
  pagina: number;
  limite: number;
  total: number;
}

export interface ResultadoBusquedaLicenciasDto {
  licencias: LicenciaDto[];
  paginacion: PaginacionLicenciasDto;
}

// ===============================
// TIPOS PARA ESTADOS DEL HOOK
// ===============================

export interface EstadoLicenciasHook {
  licencias: LicenciaDto[];
  licenciaActiva: LicenciaDto | null;
  licenciasPorCliente: LicenciaPorClienteDto[];
  isLoading: boolean;
  error: string | null;
  filtros: FiltrosLicenciasDto;
}

export interface AccionesLicenciasHook {
  cargarLicencias: () => Promise<void>;
  buscarLicenciaPorId: (id: string) => Promise<LicenciaDto | null>;
  buscarLicenciaPorCodigo: (codigo: string) => Promise<LicenciaDto | null>;
  crearLicencia: (datos: CrearLicenciaDto) => Promise<LicenciaDto>;
  actualizarLicencia: (id: string, datos: ActualizarLicenciaDto) => Promise<LicenciaDto>;
  asignarLicenciaACliente: (datos: AsignarLicenciaClienteDto) => Promise<LicenciaPorClienteDto>;
  obtenerLicenciasDeCliente: (clienteId: string) => Promise<LicenciaPorClienteDto[]>;
  obtenerClientesConLicencia: (licenciaId: string) => Promise<LicenciaPorClienteDto[]>;
  desactivarLicenciaDeCliente: (clienteId: string, licenciaId: string) => Promise<LicenciaPorClienteDto>;
  setLicenciaActiva: (licencia: LicenciaDto | null) => void;
  setFiltros: (filtros: FiltrosLicenciasDto) => void;
  limpiarErrores: () => void;
  irACrearLicencia: () => void;
  irAEditarLicencia: (licencia: LicenciaDto) => void;
  irAAsignarLicencia: (licencia: LicenciaDto) => void;
  buscarLicencias: (termino: string) => void;
}

// ===============================
// TIPOS PARA FORMULARIOS DE UI
// ===============================

export interface LicenciaFormData {
  codigoLicencia: string;
  descripcion: string;
  tipoLicencia: TipoLicencia;
  maximoUnidadesPermitidas: number;
  tipoSistema: TipoSistema;
  esLicenciaMultiPais: boolean;
}

export interface ValidacionLicenciaDto {
  codigoLicencia: {
    valido: boolean;
    mensaje?: string;
    disponible?: boolean;
  };
  descripcion: {
    valida: boolean;
    mensaje?: string;
  };
}

// ===============================
// ALIAS PARA RETROCOMPATIBILIDAD
// ===============================

export type Licencia = LicenciaDto;
export type LicenciaPorCliente = LicenciaPorClienteDto;