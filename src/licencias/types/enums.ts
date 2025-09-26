/**
 * Enums para el módulo de licencias
 * Compatible con el backend NestJS en español
 */

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

// Labels para UI
export const TipoLicenciaLabels = {
  [TipoLicencia.CAMPO]: 'Campo',
  [TipoLicencia.LICENCIA]: 'Licencia',
  [TipoLicencia.HECTAREA]: 'Hectárea'
} as const;

export const TipoSistemaLabels = {
  [TipoSistema.FIELD_PARTNER]: 'Field Partner',
  [TipoSistema.AGRO_TOOLS]: 'Agro Tools',
  [TipoSistema.FARM_MANAGER]: 'Farm Manager'
} as const;

export const EstadoLicenciaLabels = {
  [EstadoLicencia.ACTIVA]: 'Activa',
  [EstadoLicencia.INACTIVA]: 'Inactiva'
} as const;

// Colores para UI
export const EstadoLicenciaColors = {
  [EstadoLicencia.ACTIVA]: 'success',
  [EstadoLicencia.INACTIVA]: 'error'
} as const;