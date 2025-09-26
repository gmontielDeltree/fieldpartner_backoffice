/**
 * Índice principal del módulo de cuentas
 * Exporta todas las funcionalidades necesarias
 */

// Tipos
export * from './types';
export {
  CuentaDto,
  CrearCuentaDto,
  DatosUsuarioDto,
  CrearCompaniaDto,
  CategoriaCuenta,
  EstadoCuenta,
  RespuestaCrearCuenta,
  UsuarioCuentaDto,
  CompaniaDto as CompaniaDto,
  LicenciaPorCuentaDto,
  FiltrosCuentasDto,
  EstadoCuentasHook,
  AccionesCuentasHook,
  CategoriasCuentaLabels,
  EstadosCuentaLabels,
  ColoresCategorias,
  ColoresEstados
} from './types';

// Servicios
export * from './services';
export { cuentasService, CuentasServiceError } from './services';

// Hooks
export * from './hooks';
export { useCuentas, useCuentaForm } from './hooks';

// Componentes
export * from './components';
export { CuentasTable, CuentaRow } from './components';