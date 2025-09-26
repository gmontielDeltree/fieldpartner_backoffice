/**
 * Tipos para el módulo de países
 * Basado en la estructura del backend REST español
 */

// ============================
// INTERFACES PRINCIPALES
// ============================

/**
 * Interfaz principal para un país basada en el backend
 */
export interface PaisDto {
  _id: string;                      // ID de MongoDB
  codigo: string;                   // AR, BR, UY, US, MX, etc.
  descripcionES: string;            // Argentina, Brasil, Uruguay
  descripcionPT: string;            // Argentina, Brasil, Uruguai
  descripcionEN: string;            // Argentina, Brazil, Uruguay
  idioma: string;                   // es, pt, en
  moneda: string;                   // ARS, BRL, UYU, USD, MXN
  claveTributaria: string;          // CUIT, CPF, CI, SSN, RFC
  formatoClaveTributaria: string;   // XX-XXXXXXXX-X, etc.
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * DTO para crear un nuevo país
 */
export interface CrearPaisDto {
  codigo: string;
  descripcionES: string;
  descripcionPT: string;
  descripcionEN: string;
  idioma: string;
  moneda: string;
  claveTributaria: string;
  formatoClaveTributaria: string;
}

/**
 * DTO para actualizar un país existente
 */
export interface ActualizarPaisDto extends Partial<CrearPaisDto> {}

/**
 * Filtros para búsqueda de países
 */
export interface FiltrosPaisesDto {
  codigo?: string;
  descripcion?: string;
  idioma?: string;
  moneda?: string;
}

// ============================
// ENUMS Y CONSTANTES
// ============================

/**
 * Códigos de países más comunes (basados en datos reales del backend)
 */
export enum CodigosPaises {
  ARGENTINA = 'AR',
  BRASIL = 'BR',
  URUGUAY = 'UY',
  ESTADOS_UNIDOS = 'US',
  MEXICO = 'MX'
}

/**
 * Idiomas disponibles (basados en datos reales del backend)
 */
export enum IdiomasPaises {
  ESPANOL = 'es',
  PORTUGUES = 'pt',
  INGLES = 'en'
}

/**
 * Monedas principales (basadas en datos reales del backend)
 */
export enum MonedasPaises {
  PESO_ARGENTINO = 'ARS',
  REAL_BRASILENO = 'BRL',
  PESO_URUGUAYO = 'UYU',
  DOLAR_AMERICANO = 'USD',
  PESO_MEXICANO = 'MXN'
}

/**
 * Tipos de clave tributaria (basadas en datos reales del backend)
 */
export enum ClavesTributarias {
  CUIT = 'CUIT',         // Argentina
  CPF = 'CPF',           // Brasil
  CI = 'CI',             // Uruguay
  SSN = 'SSN',           // Estados Unidos
  RFC = 'RFC'            // México
}

// ============================
// LABELS Y CONSTANTES UI
// ============================

/**
 * Labels en español para los países
 */
// export const PaisesLabels: Record<CodigosPaises, string> = {
//   [CodigosPaises.ARGENTINA]: 'Argentina',
//   [CodigosPaises.BRASIL]: 'Brasil',
//   [CodigosPaises.COLOMBIA]: 'Colombia',
//   [CodigosPaises.CHILE]: 'Chile',
//   [CodigosPaises.URUGUAY]: 'Uruguay',
//   [CodigosPaises.PARAGUAY]: 'Paraguay',
//   [CodigosPaises.PERU]: 'Perú',
//   [CodigosPaises.MEXICO]: 'México',
//   [CodigosPaises.ESTADOS_UNIDOS]: 'Estados Unidos'
// };

/**
 * Labels para idiomas
 */
export const IdiomasLabels: Record<IdiomasPaises, string> = {
  [IdiomasPaises.ESPANOL]: 'Español',
  [IdiomasPaises.PORTUGUES]: 'Português',
  [IdiomasPaises.INGLES]: 'English'
};

/**
 * Labels para monedas
 */
// export const MonedasLabels: Record<MonedasPaises, string> = {
//   [MonedasPaises.PESO_ARGENTINO]: 'Peso Argentino (ARS)',
//   [MonedasPaises.REAL_BRASILENO]: 'Real Brasileño (BRL)',
//   [MonedasPaises.PESO_COLOMBIANO]: 'Peso Colombiano (COP)',
//   [MonedasPaises.PESO_CHILENO]: 'Peso Chileno (CLP)',
//   [MonedasPaises.PESO_URUGUAYO]: 'Peso Uruguayo (UYU)',
//   [MonedasPaises.GUARANI]: 'Guaraní (PYG)',
//   [MonedasPaises.SOL_PERUANO]: 'Sol Peruano (PEN)',
//   [MonedasPaises.PESO_MEXICANO]: 'Peso Mexicano (MXN)',
//   [MonedasPaises.DOLAR_AMERICANO]: 'Dólar Americano (USD)'
// };

// ============================
// TIPOS DE RESPUESTA API
// ============================

/**
 * Respuesta estándar del backend para países
 */
export interface RespuestaPaisesApi {
  paises: PaisDto[];
  total: number;
}

/**
 * Respuesta para un país individual
 */
export interface RespuestaPaisApi {
  pais: PaisDto;
}