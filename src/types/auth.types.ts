/**
 * Tipos TypeScript para Autenticación - Backend Español
 * Compatible con endpoints del backend NestJS en español
 */

// ==========================================
// TIPOS DE PETICIÓN (REQUEST DTOs)
// ==========================================

export interface UsuarioLoginDto {
  email: string;
  password: string;
}

export interface UsuarioRegistroDto {
  email: string;
  password: string;
  name: string;
}

export interface ConfirmarEmailDto {
  email: string;
  confirmationCode: string;
}

// ==========================================
// TIPOS DE RESPUESTA (RESPONSE DTOs)
// ==========================================

export interface UsuarioDto {
  id: string;
  nombreUsuario: string;
  clienteId: string;
  esAdmin?: boolean;
  licenciaId: string;
  paisId: string;
  email: string;
  moneda: string;
}

export interface AutenticacionDto {
  accessToken: string;
  refreshToken: string;
  expiration: number;
}

export interface RespuestaLoginDto {
  usuario: UsuarioDto;
  autenticacion: AutenticacionDto;
}

export interface RespuestaRefreshTokenDto {
  accessToken: string;
  expiration: number;
}

// ==========================================
// TIPOS DE ERROR
// ==========================================

export interface ErrorRespuestaAuth {
  code: 'UserNotConfirmedException' | 'NotAuthorizedException' | 'UsernameExistsException' | 'UNKNOWN_ERROR';
  message: string;
}

// ==========================================
// ENUM PARA CANALES
// ==========================================

export enum CanalAutenticacion {
  BACKOFFICE = 'Backoffice',
  LICENCIA_FRONT = 'LicenciaFront',
  FIELDPARTNER_FRONT = 'FieldpartnerFront'
}

// ==========================================
// ESTADO DE AUTENTICACIÓN (REDUX)
// ==========================================

export interface EstadoAuth {
  estado: 'verificando' | 'autenticado' | 'no-autenticado';
  usuario: UsuarioDto | null;
  mensajeError: string;
  estaCargando: boolean;
}

// ==========================================
// TIPOS LEGACY (COMPATIBILIDAD)
// ==========================================

// Mantener compatibilidad con código existente
export interface User extends UsuarioDto {
  // Mapeo de campos legacy
  username: string;      // → nombreUsuario
  accountId: string;     // → clienteId
  countryId: string;     // → paisId
  isAdmin: boolean;      // → esAdmin
}

export interface UserLogin extends UsuarioLoginDto {}
export interface UserRegister extends UsuarioRegistroDto {}
export interface Authenticate extends AutenticacionDto {}
export interface ResponseAuthLogin extends RespuestaLoginDto {}

// ==========================================
// UTILIDADES DE MAPEO
// ==========================================

/**
 * Convierte UsuarioDto del backend a User legacy para compatibilidad
 */
export const mapearUsuarioALegacy = (usuario: UsuarioDto): User => ({
  ...usuario,
  username: usuario.nombreUsuario,
  accountId: usuario.clienteId,
  countryId: usuario.paisId,
  isAdmin: usuario.esAdmin || false,
});

/**
 * Convierte RespuestaLoginDto a ResponseAuthLogin legacy
 */
export const mapearRespuestaLoginALegacy = (respuesta: RespuestaLoginDto): any => ({
  user: mapearUsuarioALegacy(respuesta.usuario),
  auth: respuesta.autenticacion,
});

// ==========================================
// CONSTANTES
// ==========================================

export const CLAVES_LOCALSTORAGE = {
  TOKEN_ACCESO: 't_bo',
  TOKEN_REFRESH: 'r_bo',
  EXPIRACION_TOKEN: 't_exp_bo',
  SESION_USUARIO: 'user_session_bo',
  ULTIMA_RUTA: 'lastPath_bo',
  USUARIO_TEMPORAL: 'username_temp'
} as const;

export const ENDPOINTS_AUTH = {
  LOGIN: '/usuarios/login',
  REGISTRAR: '/usuarios/registrar',
  CONFIRMAR_EMAIL: '/usuarios/confirmar-email',
  REFRESH_TOKEN: '/usuarios/refresh-token',
} as const;

// ==========================================
// FUNCIONES DE VALIDACIÓN
// ==========================================

/**
 * Función helper para validar formato de email
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Función helper para validar fortaleza de contraseña
 * @param password - Contraseña a validar
 * @returns true si la contraseña es válida
 */
export const validarPassword = (password: string): boolean => {
  // Mínimo 8 caracteres, al menos una letra y un número
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};