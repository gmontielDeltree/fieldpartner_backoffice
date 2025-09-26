/**
 * Enums para el módulo de cuentas (sincronizados con backend)
 */

// ===============================
// ENUMS PRINCIPALES (BACKEND SYNC)
// ===============================

export enum CategoriaCuenta {
  A = 'A',
  B = 'B',
  C = 'C'
}

export enum EstadoCuenta {
  ACTIVA = 'ACTIVA',
  INACTIVA = 'INACTIVA',
  SUSPENDIDA = 'SUSPENDIDA'
}

export enum RolUsuario {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// ===============================
// LABELS Y TEXTOS PARA LA UI
// ===============================

// Labels en español para las categorías
export const CategoriasCuentaLabels = {
  [CategoriaCuenta.A]: 'Categoría A - Empresarial',
  [CategoriaCuenta.B]: 'Categoría B - Profesional',
  [CategoriaCuenta.C]: 'Categoría C - Individual'
} as const;

// Labels para estados
export const EstadosCuentaLabels = {
  [EstadoCuenta.ACTIVA]: 'Cuenta Activa',
  [EstadoCuenta.INACTIVA]: 'Cuenta Inactiva',
  [EstadoCuenta.SUSPENDIDA]: 'Cuenta Suspendida'
} as const;

// ===============================
// CONFIGURACIÓN UI/UX
// ===============================

// Colores para chips de categorías
export const ColoresCategorias = {
  [CategoriaCuenta.A]: 'primary',
  [CategoriaCuenta.B]: 'secondary',
  [CategoriaCuenta.C]: 'info'
} as const;

// Colores para chips de estados
export const ColoresEstados = {
  [EstadoCuenta.ACTIVA]: 'success',
  [EstadoCuenta.INACTIVA]: 'error',
  [EstadoCuenta.SUSPENDIDA]: 'warning'
} as const;