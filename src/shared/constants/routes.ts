/**
 * Constantes centralizadas de rutas para toda la aplicación
 * Arquitectura moderna con organización por módulos
 */

// ============================
// RUTAS PRINCIPALES
// ============================

/**
 * Rutas base de la aplicación
 */
export const RUTAS_BASE = {
  HOME: '/home',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SETTINGS: '/settings'
} as const;

// ============================
// RUTAS DE USUARIOS Y AUTENTICACIÓN
// ============================

/**
 * Rutas del módulo de usuarios backoffice
 */
export const RUTAS_USUARIOS = {
  LISTA: '/list-user',
  NUEVO: '/user/new',
  DETALLE: '/user/:id',
  EDITAR: '/user/:id'
} as const;

// ============================
// RUTAS DE CUENTAS (MÓDULO PRINCIPAL)
// ============================

/**
 * Rutas del módulo de cuentas
 */
export const RUTAS_CUENTAS = {
  LISTA: '/cuentas',
  CREAR: '/cuentas/crear',
  NUEVO: '/cuentas/nuevo',
  DETALLE: '/cuentas/:cuentaId',
  EDITAR: '/cuentas/editar/:id',
  ASIGNAR_USUARIO: '/cuentas/:id/agregar-usuario',
  DESACTIVAR: '/cuentas/:id/desactivar',
  CATEGORIA_A: '/cuentas/categoria/A',
  CATEGORIA_B: '/cuentas/categoria/B',
  CATEGORIA_C: '/cuentas/categoria/C',
  REPORTES: '/cuentas/reportes',
  ESTADISTICAS: '/cuentas/estadisticas',
  BUSCAR: '/cuentas/buscar',
  FILTRAR: '/cuentas/filtrar'
} as const;

// ============================
// RUTAS DE PAÍSES (NUEVO MÓDULO)
// ============================

/**
 * Rutas del módulo de países
 */
export const RUTAS_PAISES = {
  LISTA: '/paises',
  LISTA_SIMPLE: '/paises/lista',
  TEST: '/paises/test',
  CREAR: '/paises/crear',
  NUEVO: '/paises/nuevo',
  DETALLE: '/paises/:id',
  EDITAR: '/paises/editar/:id',
  ACTIVAR: '/paises/:id/activar',
  DESACTIVAR: '/paises/:id/desactivar',
  ACTIVOS: '/paises/activos',
  INACTIVOS: '/paises/inactivos',
  POR_IDIOMA: '/paises/idioma/:idioma',
  REPORTES: '/paises/reportes',
  ESTADISTICAS: '/paises/estadisticas',
  BUSCAR: '/paises/buscar',
  FILTRAR: '/paises/filtrar'
} as const;

// ============================
// RUTAS DE LICENCIAS (MÓDULO MODERNO)
// ============================

/**
 * Rutas del módulo de licencias
 */
export const RUTAS_LICENCIAS = {
  LISTA: '/licencias',
  NUEVA: '/licencias/nueva',
  DETALLE: '/licencias/:id',
  EDITAR: '/licencias/editar/:id',
  ASIGNAR: '/licencias/asignar/:id',
  MIGRACION: '/licencias/migracion'
} as const;

// ============================
// RUTAS DE DATOS MAESTROS
// ============================

/**
 * Rutas del módulo de categorías
 */
export const RUTAS_CATEGORIAS = {
  LISTA: '/categories',
  NUEVA: '/category/new',
  DETALLE: '/category/:id',
  EDITAR: '/category/:id'
} as const;

/**
 * Rutas del módulo de tipos de movimientos
 */
export const RUTAS_TIPOS_MOVIMIENTOS = {
  LISTA: '/type-movement',
  NUEVO: '/type-movement/new',
  DETALLE: '/type-movement/:id',
  EDITAR: '/type-movement/:id'
} as const;

/**
 * Rutas del módulo de tipos de insumos
 */
export const RUTAS_TIPOS_INSUMOS = {
  LISTA: '/type-supplies',
  NUEVO: '/type-supplies/new',
  DETALLE: '/type-supplies/:id',
  EDITAR: '/type-supplies/:id'
} as const;

/**
 * Rutas del módulo de cultivos
 */
export const RUTAS_CULTIVOS = {
  LISTA: '/crops',
  NUEVO: '/crops/new',
  DETALLE: '/crops/:id',
  EDITAR: '/crops/:id'
} as const;

/**
 * Rutas del módulo de sistemas
 */
export const RUTAS_SISTEMAS = {
  LISTA: '/system',
  NUEVO: '/system/new',
  DETALLE: '/system/:id',
  EDITAR: '/system/:id'
} as const;

/**
 * Rutas del módulo de tipos de dispositivos
 */
export const RUTAS_TIPOS_DISPOSITIVOS = {
  LISTA: '/type-of-devices',
  NUEVO: '/type-of-devices/new',
  DETALLE: '/type-of-devices/:id',
  EDITAR: '/type-of-devices/:id'
} as const;

/**
 * Rutas del módulo de menús y módulos
 */
export const RUTAS_MENUS_MODULOS = {
  LISTA: '/menus-modules',
  NUEVO: '/menus-modules/new',
  DETALLE: '/menus-modules/:id',
  EDITAR: '/menus-modules/:id'
} as const;

// ============================
// RUTAS DE CLIENTES (LEGACY COMPATIBILITY)
// ============================

/**
 * Rutas de compatibilidad hacia atrás para clientes
 * @deprecated Usar RUTAS_CUENTAS en su lugar - redirige internamente
 */
export const RUTAS_CLIENTES = {
  LISTA: '/clientes',
  CREAR: '/clientes/crear',
  NUEVO: '/clientes/nuevo',
  DETALLE: '/clientes/:id',
  EDITAR: '/clientes/editar/:id',
  ASIGNAR_USUARIO: '/clientes/:id/agregar-usuario',
  DESACTIVAR: '/clientes/:id/desactivar',
  CATEGORIA_A: '/clientes/categoria/A',
  CATEGORIA_B: '/clientes/categoria/B',
  CATEGORIA_C: '/clientes/categoria/C',
  REPORTES: '/clientes/reportes',
  ESTADISTICAS: '/clientes/estadisticas',
  BUSCAR: '/clientes/buscar',
  FILTRAR: '/clientes/filtrar'
} as const;

// ============================
// RUTAS LEGACY (DEPRECADAS)
// ============================

/**
 * Rutas legacy que deben redirigir a los nuevos módulos
 * @deprecated Usar RUTAS_CUENTAS en su lugar
 */
export const RUTAS_LEGACY_ACCOUNTS = {
  LISTA: '/accounts',
  NUEVO: '/accounts/new',
  DETALLE: '/accounts/:id'
} as const;

/**
 * Rutas legacy de países
 * @deprecated Usar RUTAS_PAISES en su lugar
 */
export const RUTAS_LEGACY_COUNTRY = {
  LISTA: '/country',
  NUEVO: '/country/new',
  DETALLE: '/country/:id'
} as const;

/**
 * Rutas legacy de licencias
 * @deprecated Usar RUTAS_LICENCIAS en su lugar
 */
export const RUTAS_LEGACY_LICENCES = {
  LISTA: '/licences',
  NUEVO: '/licences/new',
  DETALLE: '/licences/:id'
} as const;

// ============================
// FUNCIONES UTILITARIAS
// ============================

/**
 * Construir ruta con parámetros
 */
export const construirRuta = (plantilla: string, parametros: Record<string, string | number>): string => {
  let ruta = plantilla;

  Object.entries(parametros).forEach(([clave, valor]) => {
    ruta = ruta.replace(`:${clave}`, String(valor));
  });

  return ruta;
};

// ============================
// FUNCIONES HELPER PARA RUTAS DINÁMICAS
// ============================

/**
 * Helpers para rutas de cuentas
 */
export const generarRutasCuentas = {
  detalle: (cuentaId: string): string => construirRuta(RUTAS_CUENTAS.DETALLE, { id: cuentaId }),
  editar: (cuentaId: string): string => construirRuta(RUTAS_CUENTAS.EDITAR, { id: cuentaId }),
  agregarUsuario: (cuentaId: string): string => construirRuta(RUTAS_CUENTAS.ASIGNAR_USUARIO, { id: cuentaId }),
  desactivar: (cuentaId: string): string => construirRuta(RUTAS_CUENTAS.DESACTIVAR, { id: cuentaId }),
  conFiltros: (filtros: Record<string, string>): string => {
    const params = new URLSearchParams(filtros);
    return `${RUTAS_CUENTAS.LISTA}?${params.toString()}`;
  },
  porCategoria: (categoria: 'A' | 'B' | 'C'): string => {
    return `${RUTAS_CUENTAS.LISTA}?categoria=${categoria}`;
  }
};

/**
 * Helpers para rutas de clientes (compatibilidad)
 * @deprecated Usar generarRutasCuentas en su lugar
 */
export const generarRutasClientes = {
  detalle: (clienteId: string): string => construirRuta(RUTAS_CLIENTES.DETALLE, { id: clienteId }),
  editar: (clienteId: string): string => construirRuta(RUTAS_CLIENTES.EDITAR, { id: clienteId }),
  agregarUsuario: (clienteId: string): string => construirRuta(RUTAS_CLIENTES.ASIGNAR_USUARIO, { id: clienteId }),
  desactivar: (clienteId: string): string => construirRuta(RUTAS_CLIENTES.DESACTIVAR, { id: clienteId }),
  conFiltros: (filtros: Record<string, string>): string => {
    const params = new URLSearchParams(filtros);
    return `${RUTAS_CLIENTES.LISTA}?${params.toString()}`;
  },
  porCategoria: (categoria: 'A' | 'B' | 'C'): string => {
    return `${RUTAS_CLIENTES.LISTA}?categoria=${categoria}`;
  }
};

/**
 * Helpers para rutas de países
 */
export const generarRutasPaises = {
  detalle: (paisId: string): string => construirRuta(RUTAS_PAISES.DETALLE, { id: paisId }),
  editar: (paisId: string): string => construirRuta(RUTAS_PAISES.EDITAR, { id: paisId }),
  activar: (paisId: string): string => construirRuta(RUTAS_PAISES.ACTIVAR, { id: paisId }),
  desactivar: (paisId: string): string => construirRuta(RUTAS_PAISES.DESACTIVAR, { id: paisId }),
  porIdioma: (idioma: string): string => construirRuta(RUTAS_PAISES.POR_IDIOMA, { idioma }),
  conFiltros: (filtros: Record<string, string>): string => {
    const params = new URLSearchParams(filtros);
    return `${RUTAS_PAISES.LISTA}?${params.toString()}`;
  },
  porEstado: (estado: 'activos' | 'inactivos'): string => {
    return estado === 'activos' ? RUTAS_PAISES.ACTIVOS : RUTAS_PAISES.INACTIVOS;
  }
};

/**
 * Helpers para rutas de licencias
 */
export const generarRutasLicencias = {
  detalle: (licenciaId: string): string => construirRuta(RUTAS_LICENCIAS.DETALLE, { id: licenciaId }),
  editar: (licenciaId: string): string => construirRuta(RUTAS_LICENCIAS.EDITAR, { id: licenciaId }),
  asignar: (licenciaId: string): string => construirRuta(RUTAS_LICENCIAS.ASIGNAR, { id: licenciaId })
};

/**
 * Verificar si una ruta es legacy
 */
export const esRutaLegacy = (ruta: string): boolean => {
  const rutasLegacy = [
    ...Object.values(RUTAS_LEGACY_ACCOUNTS),
    ...Object.values(RUTAS_LEGACY_COUNTRY),
    ...Object.values(RUTAS_LEGACY_LICENCES)
  ];

  return rutasLegacy.some(rutaLegacy => ruta.startsWith(rutaLegacy.replace('/:id', '')));
};

/**
 * Obtener ruta moderna desde legacy
 */
export const obtenerRutaModerna = (rutaLegacy: string): string => {
  // Mapeo de rutas legacy a modernas
  const mapeoRutas: Record<string, string> = {
    // Legacy accounts -> Cuentas
    '/accounts': RUTAS_CUENTAS.LISTA,
    '/accounts/new': RUTAS_CUENTAS.CREAR,

    // Legacy clientes -> Cuentas
    '/clientes': RUTAS_CUENTAS.LISTA,
    '/clientes/crear': RUTAS_CUENTAS.CREAR,

    // Country -> Países
    '/country': RUTAS_PAISES.LISTA,
    '/country/new': RUTAS_PAISES.CREAR,

    // Licences -> Licencias
    '/licences': RUTAS_LICENCIAS.LISTA,
    '/licences/new': RUTAS_LICENCIAS.NUEVA
  };

  return mapeoRutas[rutaLegacy] || rutaLegacy;
};

/**
 * Mapeo completo de rutas legacy para redirecciones
 */
export const MAPEO_RUTAS_LEGACY = {
  // Legacy accounts a Cuentas
  [RUTAS_LEGACY_ACCOUNTS.LISTA]: RUTAS_CUENTAS.LISTA,
  [RUTAS_LEGACY_ACCOUNTS.NUEVO]: RUTAS_CUENTAS.CREAR,
  [RUTAS_LEGACY_ACCOUNTS.DETALLE]: RUTAS_CUENTAS.DETALLE,

  // Legacy clientes a Cuentas
  [RUTAS_CLIENTES.LISTA]: RUTAS_CUENTAS.LISTA,
  [RUTAS_CLIENTES.CREAR]: RUTAS_CUENTAS.CREAR,
  [RUTAS_CLIENTES.DETALLE]: RUTAS_CUENTAS.DETALLE,

  // Country a Países
  [RUTAS_LEGACY_COUNTRY.LISTA]: RUTAS_PAISES.LISTA,
  [RUTAS_LEGACY_COUNTRY.NUEVO]: RUTAS_PAISES.CREAR,
  [RUTAS_LEGACY_COUNTRY.DETALLE]: RUTAS_PAISES.DETALLE,

  // Licences a Licencias
  [RUTAS_LEGACY_LICENCES.LISTA]: RUTAS_LICENCIAS.LISTA,
  [RUTAS_LEGACY_LICENCES.NUEVO]: RUTAS_LICENCIAS.NUEVA,
  [RUTAS_LEGACY_LICENCES.DETALLE]: RUTAS_LICENCIAS.DETALLE
} as const;

// ============================
// CONFIGURACIÓN DE NAVEGACIÓN PARA SIDEBAR
// ============================

/**
 * Configuración de elementos del menú lateral
 */
export interface ElementoMenu {
  id: string;
  etiqueta: string;
  ruta: string;
  icono: string;
  orden: number;
  activo: boolean;
  modulo: string;
}

/**
 * Elementos del menú organizados por módulos
 */
export const ELEMENTOS_MENU: ElementoMenu[] = [
  // Módulo de Usuarios
  {
    id: 'usuarios-backoffice',
    etiqueta: 'Usuarios Backoffice',
    ruta: RUTAS_USUARIOS.LISTA,
    icono: 'PersonIcon',
    orden: 1,
    activo: true,
    modulo: 'usuarios'
  },

  // Módulo de Cuentas (Principal)
  {
    id: 'cuentas',
    etiqueta: 'Cliente', // Mantenemos la etiqueta de usuario como "Cliente"
    ruta: RUTAS_CUENTAS.LISTA,
    icono: 'BusinessIcon',
    orden: 2,
    activo: true,
    modulo: 'cuentas'
  },

  // Módulo de Países (Nuevo)
  {
    id: 'paises',
    etiqueta: 'Países',
    ruta: RUTAS_PAISES.LISTA,
    icono: 'PublicIcon',
    orden: 3,
    activo: true,
    modulo: 'paises'
  },

  // Módulo de Licencias
  {
    id: 'licencias',
    etiqueta: 'Licencias',
    ruta: RUTAS_LICENCIAS.LISTA,
    icono: 'DisplaySettingsIcon',
    orden: 4,
    activo: true,
    modulo: 'licencias'
  },

  // Datos Maestros
  {
    id: 'categorias',
    etiqueta: 'Categorías',
    ruta: RUTAS_CATEGORIAS.LISTA,
    icono: 'CategoryIcon',
    orden: 5,
    activo: true,
    modulo: 'datos-maestros'
  },

  {
    id: 'tipos-dispositivos',
    etiqueta: 'Tipo de Dispositivos',
    ruta: RUTAS_TIPOS_DISPOSITIVOS.LISTA,
    icono: 'SettingsInputAntennaIcon',
    orden: 6,
    activo: true,
    modulo: 'datos-maestros'
  },

  {
    id: 'tipos-movimientos',
    etiqueta: 'Tipos Movimientos',
    ruta: RUTAS_TIPOS_MOVIMIENTOS.LISTA,
    icono: 'SyncAltIcon',
    orden: 7,
    activo: true,
    modulo: 'datos-maestros'
  },

  {
    id: 'tipos-insumos',
    etiqueta: 'Tipos Insumos',
    ruta: RUTAS_TIPOS_INSUMOS.LISTA,
    icono: 'InventoryIcon',
    orden: 8,
    activo: true,
    modulo: 'datos-maestros'
  },

  {
    id: 'cultivos',
    etiqueta: 'Cultivos',
    ruta: RUTAS_CULTIVOS.LISTA,
    icono: 'YardIcon',
    orden: 9,
    activo: true,
    modulo: 'datos-maestros'
  },

  {
    id: 'sistemas',
    etiqueta: 'Sistemas',
    ruta: RUTAS_SISTEMAS.LISTA,
    icono: 'ComputerIcon',
    orden: 10,
    activo: true,
    modulo: 'datos-maestros'
  },

  {
    id: 'menus-modulos',
    etiqueta: 'Menús y Módulos',
    ruta: RUTAS_MENUS_MODULOS.LISTA,
    icono: 'ListIcon',
    orden: 11,
    activo: true,
    modulo: 'configuracion'
  },

  // Configuración
  {
    id: 'configuracion',
    etiqueta: 'Configuración',
    ruta: RUTAS_BASE.SETTINGS,
    icono: 'SettingsIcon',
    orden: 12,
    activo: true,
    modulo: 'configuracion'
  }
];

/**
 * Obtener elementos del menú activos ordenados
 */
export const obtenerElementosMenuActivos = (): ElementoMenu[] => {
  return ELEMENTOS_MENU
    .filter(elemento => elemento.activo)
    .sort((a, b) => a.orden - b.orden);
};

/**
 * Obtener elementos del menú por módulo
 */
export const obtenerElementosPorModulo = (modulo: string): ElementoMenu[] => {
  return ELEMENTOS_MENU
    .filter(elemento => elemento.modulo === modulo && elemento.activo)
    .sort((a, b) => a.orden - b.orden);
};