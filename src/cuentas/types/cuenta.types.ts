/**
 * Tipos principales para el módulo de cuentas
 * Sincronizados con el backend NestJS
 */

// import { Licencia } from '../../types/licencias.types';
import { CategoriaCuenta, EstadoCuenta, RolUsuario } from './enums';
import { PaisDto } from '../../paises/types';
import { LicenciaDto } from '../../licencias';

// ===============================
// TIPOS PRINCIPALES DE CUENTA
// ===============================

export interface CuentaDto {
  _id: string; // MongoDB ObjectId
  cuentaId: string; // Campo personalizado del backend
  referenciaCuenta: string;
  denominacion: string;
  paisId: PaisDto | string; // Puede estar poblado o solo el ID
  categoria: CategoriaCuenta;
  estado: EstadoCuenta;
  contadorCampos: number;
  contadorLicencias: number;
  contadorHectareas: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  createdAt?: string; // Timestamp automático de MongoDB
  updatedAt?: string; // Timestamp automático de MongoDB
  __v?: number; // Version field de MongoDB
}

export interface CuentaCompletaDto {
  cuenta: CuentaDto;
  usuarios: UsuarioCuentaDto[];
  licencias: LicenciaPorCuentaDto[];
  companias: CompaniaDto[];
  // contratoSocietario?: ContratoSocietarioDto;
  // companiaPorContrato?: CompaniaPorContratoDto;
}


// ===============================
// TIPOS PARA FORMULARIOS
// ===============================

export interface DatosUsuarioDto {
  nombreUsuario: string;
  email: string;
  password: string;
  foto?: any; // Archivo de imagen
}

export interface CrearCompaniaDto {
  direccion: string;
  logoCompania?: any; // Archivo
  nombreFantasia: string;
  localidad: string;
  observacion?: string;
  telefono: string;
  provincia: string;
  razonSocial: string;
  codigoTributario: string;
  sitioWeb?: string;
  codigoPostal: string;
}

export interface CrearCuentaDto {
  referenciaCuenta: string;
  denominacion: string;
  paisId: string;
  categoria: CategoriaCuenta;

  // Datos del usuario a crear/asociar
  usuario: DatosUsuarioDto;

  // Campos de licencia (obligatorios)
  licenciaId: string;
  cantidadLicenciasPermitidas?: number;
  fechaInicioLicencia?: string;
  fechaFinLicencia?: string;

  // Campos para compañía (solo categoría A)
  compania?: CrearCompaniaDto;

  // Campo para asociar usuario existente
  asociarUsuario?: boolean;
  emailParaAsociar?: string;

  // Campos adicionales
  esLicenciaMultiPais?: boolean;
}

// ===============================
// TIPOS DE RESPUESTA
// ===============================

export interface RespuestaCrearCuenta {
  cuenta: CuentaDto;
  usuario: UsuarioCuentaDto;
  licenciaPorCuenta: LicenciaPorCuentaDto;
  compania?: CompaniaDto;
  contratoSocietario?: ContratoSocietarioDto;
  companiaPorContrato?: CompaniaPorContratoDto;
}

export interface UsuarioCuentaDto {
  _id: string; // MongoDB ObjectId
  cognitoId: string;
  nombreUsuario: string;
  email: string;
  cuentaId: string;
  estado: string;
  esAdmin: boolean;
  esUsuarioConLicenciaAdmin: boolean;
  rol: RolUsuario;
  idioma: string;
  moneda: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  foto?: any;
}

export interface LicenciaPorCuentaDto {
  _id: string; // MongoDB ObjectId
  cuentaId: string | null;
  licenciaId: LicenciaDto | string;
  cantidadLicenciasPermitidas: number;
  codigoPais: string;
  fechaInicioLicencia: string;
  fechaFinLicencia: string;
  estado: EstadoCuenta;
  fechaCreacion: string;
  fechaActualizacion: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CompaniaDto {
  _id: string; // MongoDB ObjectId
  cuentaId: string;
  licenciaId: LicenciaDto | string;
  paisId: PaisDto | string;
  direccion: string;
  logoCompania?: any;
  email: string;
  nombreFantasia: string;
  localidad: string;
  nombre: string;
  observacion?: string;
  telefono: string;
  provincia: string;
  razonSocial: string;
  codigoTributario: string;
  sitioWeb?: string;
  codigoPostal: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ContratoSocietarioDto {
  _id: string; // MongoDB ObjectId
  cuentaId: string;
  contratoId: string;
  licenciaId: string;
  descripcion: string;
  fechaCreacion: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CompaniaPorContratoDto {
  _id: string; // MongoDB ObjectId
  cuentaId: string;
  companiaId: string;
  contratoId: string;
  porcentajeParticipacion: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ===============================
// TIPOS PARA FILTROS Y BÚSQUEDAS
// ===============================

export interface FiltrosCuentasDto {
  categoria?: CategoriaCuenta;
  estado?: EstadoCuenta;
  paisId?: string;
  busqueda?: string; // Para buscar por referencia o denominación
}

export interface PaginacionCuentasDto {
  pagina: number;
  limite: number;
  total: number;
}

export interface ResultadoBusquedaCuentasDto {
  cuentas: CuentaDto[];
  paginacion: PaginacionCuentasDto;
}

// ===============================
// TIPOS PARA FORMULARIOS DE EDICIÓN
// ===============================

export interface ActualizarCuentaDto {
  denominacion?: string;
  paisId?: string;
  estado?: EstadoCuenta;
}

export interface AgregarUsuarioACuentaDto {
  usuarioEmail: string;
  licenciaId: string;
}

// ===============================
// TIPOS PARA VALIDACIONES
// ===============================

export interface ValidacionCuentaDto {
  referenciaCuenta: {
    valida: boolean;
    mensaje?: string;
    disponible?: boolean;
  };
  email: {
    valido: boolean;
    mensaje?: string;
    existe?: boolean;
  };
  licencia: {
    valida: boolean;
    mensaje?: string;
    disponible?: boolean;
  };
}

// ===============================
// TIPOS PARA ESTADOS DEL HOOK
// ===============================

export interface EstadoCuentasHook {
  cuentas: CuentaDto[];
  cuentaActiva: CuentaDto | null;
  isLoading: boolean;
  error: string | null;
  paginacion: PaginacionCuentasDto | null;
  filtros: FiltrosCuentasDto;
  licencias: LicenciaDto[];
  isLoadingLicencias: boolean;
}

export interface AccionesCuentasHook {
  cargarCuentas: (filtros?: FiltrosCuentasDto) => Promise<void>;
  buscarCuentaPorId: (id: string) => Promise<CuentaDto | null>;
  buscarCuentaPorReferencia: (referencia: string) => Promise<CuentaDto | null>;
  crearCuenta: (datos: CrearCuentaDto) => Promise<RespuestaCrearCuenta>;
  actualizarCuenta: (id: string, datos: ActualizarCuentaDto) => Promise<CuentaDto>;
  desactivarCuenta: (id: string) => Promise<CuentaDto>;
  obtenerUsuariosDeCuenta: (cuentaId: string) => Promise<UsuarioCuentaDto[]>;
  obtenerUsuarioAdminDeCuenta: (cuentaId: string) => Promise<UsuarioCuentaDto>;
  obtenerCompaniasDeCuenta: (cuentaId: string) => Promise<CompaniaDto[]>;
  agregarUsuarioACuenta: (cuentaId: string, datos: AgregarUsuarioACuentaDto) => Promise<void>;
  setCuentaActiva: (cuenta: CuentaDto | null) => void;
  setFiltros: (filtros: FiltrosCuentasDto) => void;
  limpiarErrores: () => void;
  validarReferencia: (referencia: string) => Promise<boolean>;
  validarEmailUsuario: (email: string) => Promise<boolean>;
  irACrearCuenta: () => void;
  irAEditarCuenta: (cuenta: CuentaDto) => void;
  irADetalleCuenta: (cuenta: CuentaDto) => void;
  filtrarPorCategoria: (categoria: CategoriaCuenta) => void;
  filtrarPorEstado: (estado: EstadoCuenta) => void;
  buscarCuentas: (termino: string) => void;
}