/**
 * Constantes y Enums para el Sistema de Rutas
 * Centraliza todas las rutas de la aplicación para fácil mantenimiento
 */

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
export enum RutasPublicas {
  LOGIN = '/auth/login',
  REGISTRO = '/auth/register',
}

// ==========================================
// RUTAS PRIVADAS - PRINCIPALES
// ==========================================
export enum RutasPrincipales {
  HOME = '/home',
  CONFIGURACION = '/settings',
}

// ==========================================
// RUTAS DE USUARIOS
// ==========================================
export enum RutasUsuarios {
  LISTA = '/list-user',
  NUEVO = '/user/new',
  EDITAR = '/user/:id',
  // Métodos helper
}

// Helper para generar ruta de edición
export const generarRutaEditarUsuario = (id: string) => `/user/${id}`;

// ==========================================
// RUTAS DE CATEGORÍAS
// ==========================================
export enum RutasCategorias {
  LISTA = '/categories',
  NUEVA = '/category/new',
  EDITAR = '/category/:id',
}

export const generarRutaEditarCategoria = (id: string) => `/category/${id}`;

// ==========================================
// RUTAS DE MOVIMIENTOS
// ==========================================
export enum RutasMovimientos {
  LISTA = '/type-movement',
  NUEVO = '/type-movement/new',
  EDITAR = '/type-movement/:id',
}

export const generarRutaEditarMovimiento = (id: string) => `/type-movement/${id}`;

// ==========================================
// RUTAS DE INSUMOS/SUMINISTROS
// ==========================================
export enum RutasInsumos {
  LISTA = '/type-supplies',
  NUEVO = '/type-supplies/new',
  EDITAR = '/type-supplies/:id',
}

export const generarRutaEditarInsumo = (id: string) => `/type-supplies/${id}`;

// ==========================================
// RUTAS DE CULTIVOS
// ==========================================
export enum RutasCultivos {
  LISTA = '/crops',
  NUEVO = '/crops/new',
  EDITAR = '/crops/:id',
}

export const generarRutaEditarCultivo = (id: string) => `/crops/${id}`;

// ==========================================
// RUTAS DE PAÍSES
// ==========================================
export enum RutasPaises {
  LISTA = '/country',
  NUEVO = '/country/new',
  EDITAR = '/country/:id',
}

export const generarRutaEditarPais = (id: string) => `/country/${id}`;

// ==========================================
// RUTAS DE SISTEMAS
// ==========================================
export enum RutasSistemas {
  LISTA = '/system',
  NUEVO = '/system/new',
  EDITAR = '/system/:id',
}

export const generarRutaEditarSistema = (id: string) => `/system/${id}`;

// ==========================================
// RUTAS DE LICENCIAS (NUEVO MÓDULO)
// ==========================================
export enum RutasLicencias {
  // Rutas principales
  LISTA = '/licencias',
  NUEVA = '/licencias/nueva',
  EDITAR = '/licencias/editar/:id',
  ASIGNAR = '/licencias/asignar/:id',
  MIGRACION = '/licencias/migracion',

  // Rutas legacy (deprecadas)
  LISTA_LEGACY = '/licences',
  NUEVA_LEGACY = '/licences/new',
  EDITAR_LEGACY = '/licences/:id',
}

// Helpers para licencias
export const generarRutaEditarLicencia = (id: string) => `/licencias/editar/${id}`;
export const generarRutaAsignarLicencia = (id: string) => `/licencias/asignar/${id}`;

// ==========================================
// RUTAS DE MÓDULOS DE MENÚ
// ==========================================
export enum RutasMenuModulos {
  LISTA = '/menus-modules',
  NUEVO = '/menus-modules/new',
  EDITAR = '/menus-modules/:id',
}

export const generarRutaEditarMenuModulo = (id: string) => `/menus-modules/${id}`;

// ==========================================
// RUTAS DE CUENTAS/ACCOUNTS
// ==========================================
export enum RutasCuentas {
  LISTA = '/accounts',
  NUEVA = '/accounts/new',
  EDITAR = '/accounts/:id',
}

export const generarRutaEditarCuenta = (id: string) => `/accounts/${id}`;

// ==========================================
// RUTAS DE TIPOS DE DISPOSITIVOS
// ==========================================
export enum RutasDispositivos {
  LISTA = '/type-of-devices',
  NUEVO = '/type-of-devices/new',
  EDITAR = '/type-of-devices/:id',
}

export const generarRutaEditarDispositivo = (id: string) => `/type-of-devices/${id}`;

// ==========================================
// ENUM MAESTRO - TODAS LAS RUTAS
// ==========================================
export enum Rutas {
  // Públicas
  LOGIN = RutasPublicas.LOGIN,
  REGISTRO = RutasPublicas.REGISTRO,

  // Principales
  HOME = RutasPrincipales.HOME,
  CONFIGURACION = RutasPrincipales.CONFIGURACION,

  // Usuarios
  USUARIOS_LISTA = RutasUsuarios.LISTA,
  USUARIOS_NUEVO = RutasUsuarios.NUEVO,
  USUARIOS_EDITAR = RutasUsuarios.EDITAR,

  // Categorías
  CATEGORIAS_LISTA = RutasCategorias.LISTA,
  CATEGORIAS_NUEVA = RutasCategorias.NUEVA,
  CATEGORIAS_EDITAR = RutasCategorias.EDITAR,

  // Movimientos
  MOVIMIENTOS_LISTA = RutasMovimientos.LISTA,
  MOVIMIENTOS_NUEVO = RutasMovimientos.NUEVO,
  MOVIMIENTOS_EDITAR = RutasMovimientos.EDITAR,

  // Insumos
  INSUMOS_LISTA = RutasInsumos.LISTA,
  INSUMOS_NUEVO = RutasInsumos.NUEVO,
  INSUMOS_EDITAR = RutasInsumos.EDITAR,

  // Cultivos
  CULTIVOS_LISTA = RutasCultivos.LISTA,
  CULTIVOS_NUEVO = RutasCultivos.NUEVO,
  CULTIVOS_EDITAR = RutasCultivos.EDITAR,

  // Países
  PAISES_LISTA = RutasPaises.LISTA,
  PAISES_NUEVO = RutasPaises.NUEVO,
  PAISES_EDITAR = RutasPaises.EDITAR,

  // Sistemas
  SISTEMAS_LISTA = RutasSistemas.LISTA,
  SISTEMAS_NUEVO = RutasSistemas.NUEVO,
  SISTEMAS_EDITAR = RutasSistemas.EDITAR,

  // Licencias (NUEVO)
  LICENCIAS_LISTA = RutasLicencias.LISTA,
  LICENCIAS_NUEVA = RutasLicencias.NUEVA,
  LICENCIAS_EDITAR = RutasLicencias.EDITAR,
  LICENCIAS_ASIGNAR = RutasLicencias.ASIGNAR,
  LICENCIAS_MIGRACION = RutasLicencias.MIGRACION,

  // Módulos de Menú
  MENU_MODULOS_LISTA = RutasMenuModulos.LISTA,
  MENU_MODULOS_NUEVO = RutasMenuModulos.NUEVO,
  MENU_MODULOS_EDITAR = RutasMenuModulos.EDITAR,

  // Cuentas
  CUENTAS_LISTA = RutasCuentas.LISTA,
  CUENTAS_NUEVA = RutasCuentas.NUEVA,
  CUENTAS_EDITAR = RutasCuentas.EDITAR,

  // Dispositivos
  DISPOSITIVOS_LISTA = RutasDispositivos.LISTA,
  DISPOSITIVOS_NUEVO = RutasDispositivos.NUEVO,
  DISPOSITIVOS_EDITAR = RutasDispositivos.EDITAR,
}

// ==========================================
// UTILIDADES PARA NAVEGACIÓN
// ==========================================

/**
 * Clase helper para navegación programática
 */
export class NavegadorRutas {
  /**
   * Genera rutas dinámicas con parámetros
   */
  static generarRuta(ruta: string, parametros: Record<string, string>): string {
    let rutaGenerada = ruta;

    Object.entries(parametros).forEach(([clave, valor]) => {
      rutaGenerada = rutaGenerada.replace(`:${clave}`, valor);
    });

    return rutaGenerada;
  }

  /**
   * Verifica si una ruta requiere autenticación
   */
  static esRutaPrivada(ruta: string): boolean {
    return !Object.values(RutasPublicas).includes(ruta as RutasPublicas);
  }

  /**
   * Obtiene el breadcrumb para una ruta
   */
  static obtenerBreadcrumb(ruta: string): string[] {
    const mapaBreadcrumbs: Record<string, string[]> = {
      [Rutas.HOME]: ['Inicio'],
      [Rutas.USUARIOS_LISTA]: ['Usuarios'],
      [Rutas.USUARIOS_NUEVO]: ['Usuarios', 'Nuevo'],
      [Rutas.LICENCIAS_LISTA]: ['Licencias'],
      [Rutas.LICENCIAS_NUEVA]: ['Licencias', 'Nueva'],
      [Rutas.LICENCIAS_MIGRACION]: ['Licencias', 'Migración'],
      // Agregar más según sea necesario
    };

    return mapaBreadcrumbs[ruta] || ['Desconocido'];
  }
}

// ==========================================
// CONFIGURACIÓN DE RUTAS POR MÓDULO
// ==========================================
export const CONFIGURACION_MODULOS = {
  usuarios: {
    rutas: RutasUsuarios,
    titulo: 'Gestión de Usuarios',
    icono: 'people',
  },
  licencias: {
    rutas: RutasLicencias,
    titulo: 'Gestión de Licencias',
    icono: 'assignment',
  },
  categorias: {
    rutas: RutasCategorias,
    titulo: 'Categorías',
    icono: 'category',
  },
  // Agregar más módulos...
} as const;

// ==========================================
// TYPES PARA TYPESCRIPT
// ==========================================
export type RutaValida = keyof typeof Rutas;
export type ParametrosRuta = Record<string, string>;

// ==========================================
// HOOKS DE UTILIDAD
// ==========================================

/**
 * Hook para obtener información de la ruta actual
 */
export const useRutaActual = () => {
  // Este hook se implementaría usando useLocation de react-router-dom
  // y matchearía contra los enums definidos aquí
  return {
    ruta: '' as string,
    esPrivada: false,
    breadcrumb: [] as string[],
    modulo: '' as string,
  };
};

// ==========================================
// VALIDACIONES
// ==========================================

/**
 * Valida si una ruta es válida según nuestros enums
 */
export const validarRuta = (ruta: string): boolean => {
  const todasLasRutas = Object.values(Rutas);
  return todasLasRutas.includes(ruta as Rutas);
};

/**
 * Obtiene el módulo al que pertenece una ruta
 */
export const obtenerModuloDeRuta = (ruta: string): string | null => {
  if (ruta.startsWith('/user') || ruta.startsWith('/list-user')) return 'usuarios';
  if (ruta.startsWith('/licencias')) return 'licencias';
  if (ruta.startsWith('/categories') || ruta.startsWith('/category')) return 'categorias';
  if (ruta.startsWith('/type-movement')) return 'movimientos';
  if (ruta.startsWith('/type-supplies')) return 'insumos';
  if (ruta.startsWith('/crops')) return 'cultivos';
  if (ruta.startsWith('/country')) return 'paises';
  if (ruta.startsWith('/system')) return 'sistemas';
  if (ruta.startsWith('/menus-modules')) return 'menu-modulos';
  if (ruta.startsWith('/accounts')) return 'cuentas';
  if (ruta.startsWith('/type-of-devices')) return 'dispositivos';

  return null;
};