/**
 * Índice principal de tipos para el módulo de cuentas
 * Exporta todos los tipos necesarios para el frontend
 */

// Tipos principales
export * from './cuenta.types';
export * from './enums';
export * from './api-responses.types';

// Re-exportaciones para compatibilidad con el sistema existente
// export {
//   CategoriaCuenta,
//   EstadoCuenta,
//   CategoriasCuentaLabels,
//   EstadosCuentaLabels,
//   ColoresCategorias,
//   ColoresEstados
// } from './enums';

// export {
//   CuentaDto,
//   CrearCuentaDto,
//   DatosUsuarioDto,
//   CrearCompaniaDto,
//   RespuestaCrearCuenta,
//   UsuarioCuentaDto,
//   LicenciaPorCuentaDto,
//   CompaniaDto,
//   FiltrosCuentasDto,
//   EstadoCuentasHook,
//   AccionesCuentasHook
// } from './cuenta.types';

// export {
//   ApiRespuestaCrearCuenta,
//   ApiRespuestaListaCuentas,
//   ApiRespuestaObtenerCuenta,
//   ApiRespuestaCuentaCompleta,
//   ApiErrorResponse,
//   CodigosErrorCuentas,
//   MensajesErrorCuentas
// } from './api-responses.types';