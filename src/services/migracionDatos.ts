/**
 * Servicio de Migración de Datos PouchDB → Backend
 * Migra datos de licencias desde PouchDB local hacia el backend NestJS
 */

import Swal from 'sweetalert2';
import { dbContext } from './pouchdbService';
import { licenciasService } from './licenciasService';
import {
  Licencia,
  CrearLicenciaDto,
  TipoLicencia,
  TipoSistema,
} from '../types/licencias.types';

// Interfaz para datos legacy de PouchDB
interface LicenciaLegacy {
  _id: string;
  _rev: string;
  id: string;
  description: string;
  licenceType: string;
  systemType: string;
  maximumUnitAllowed: number;
}

// Mapeo de enums legacy → nuevos
const mapearTipoLicencia = (tipoLegacy: string): TipoLicencia => {
  switch (tipoLegacy) {
    case 'Campo':
    case 'C':
      return TipoLicencia.CAMPO;
    case 'Licencia':
    case 'L':
      return TipoLicencia.LICENCIA;
    case 'Hectarea':
    case 'H':
      return TipoLicencia.HECTAREA;
    default:
      return TipoLicencia.LICENCIA; // Default fallback
  }
};

const mapearTipoSistema = (sistemaLegacy: string): TipoSistema => {
  switch (sistemaLegacy) {
    case 'FieldPartner':
    case 'Field Partner':
      return TipoSistema.FIELD_PARTNER;
    case 'AgroTools':
    case 'Agro Tools':
      return TipoSistema.AGRO_TOOLS;
    case 'FarmManager':
    case 'Farm Manager':
      return TipoSistema.FARM_MANAGER;
    default:
      return TipoSistema.FIELD_PARTNER; // Default fallback
  }
};

// Convertir licencia legacy → DTO backend
const convertirLicenciaLegacy = (licenciaLegacy: LicenciaLegacy): CrearLicenciaDto => {
  return {
    codigoLicencia: licenciaLegacy.id || `MIGR-${Date.now()}`,
    descripcion: licenciaLegacy.description || 'Migrado desde PouchDB',
    tipoLicencia: mapearTipoLicencia(licenciaLegacy.licenceType),
    maximoUnidadesPermitidas: licenciaLegacy.maximumUnitAllowed || 1,
    tipoSistema: mapearTipoSistema(licenciaLegacy.systemType),
    esLicenciaMultiPais: false, // Default para migrados
  };
};

export class MigracionDatos {
  private static instance: MigracionDatos;
  private logMigracion: string[] = [];

  private constructor() {}

  static getInstance(): MigracionDatos {
    if (!MigracionDatos.instance) {
      MigracionDatos.instance = new MigracionDatos();
    }
    return MigracionDatos.instance;
  }

  /**
   * 📊 ANÁLISIS PRE-MIGRACIÓN
   * Analiza los datos existentes en PouchDB y Backend
   */
  async analizarDatos(): Promise<{
    pouchdb: {
      total: number;
      licencias: LicenciaLegacy[];
    };
    backend: {
      total: number;
      licencias: Licencia[];
    };
    conflictos: string[];
  }> {
    try {
      // Obtener datos de PouchDB
      const responsePouchDB = await dbContext.licences.allDocs({ include_docs: true });
      const licenciasPouchDB: LicenciaLegacy[] = responsePouchDB.rows
        .map(row => row.doc as LicenciaLegacy)
        .filter(doc => doc && !doc._id.startsWith('_design'));

      // Obtener datos del Backend
      let licenciasBackend: Licencia[] = [];
      try {
        licenciasBackend = await licenciasService.obtenerLicencias();
      } catch (error) {
        console.warn('No se pudieron obtener licencias del backend:', error);
      }

      // Detectar conflictos
      const conflictos: string[] = [];
      const codigosBackend = new Set(licenciasBackend.map(l => l.codigoLicencia));

      licenciasPouchDB.forEach(licencia => {
        const codigo = licencia.id || `MIGR-${licencia._id}`;
        if (codigosBackend.has(codigo)) {
          conflictos.push(`Código duplicado: ${codigo}`);
        }
      });

      return {
        pouchdb: {
          total: licenciasPouchDB.length,
          licencias: licenciasPouchDB,
        },
        backend: {
          total: licenciasBackend.length,
          licencias: licenciasBackend,
        },
        conflictos,
      };
    } catch (error) {
      throw new Error(`Error analizando datos: ${error}`);
    }
  }

  /**
   * 🚀 MIGRACIÓN COMPLETA
   * Migra todas las licencias de PouchDB al Backend
   */
  async migrarLicencias(opciones: {
    sobreescribir?: boolean;
    crearBackup?: boolean;
    validarDatos?: boolean;
  } = {}): Promise<{
    exito: boolean;
    migradas: number;
    errores: string[];
    log: string[];
  }> {
    const {
      sobreescribir = false,
      crearBackup = true,
      validarDatos = true,
    } = opciones;

    this.logMigracion = [];
    const errores: string[] = [];
    let migradas = 0;

    try {
      this.log('🚀 Iniciando migración de licencias...');

      // 1. Análisis pre-migración
      this.log('📊 Analizando datos existentes...');
      const analisis = await this.analizarDatos();

      this.log(`PouchDB: ${analisis.pouchdb.total} licencias`);
      this.log(`Backend: ${analisis.backend.total} licencias`);
      this.log(`Conflictos detectados: ${analisis.conflictos.length}`);

      if (analisis.pouchdb.total === 0) {
        this.log('ℹ️ No hay licencias en PouchDB para migrar');
        return { exito: true, migradas: 0, errores: [], log: this.logMigracion };
      }

      // 2. Crear backup si se solicita
      if (crearBackup) {
        await this.crearBackup(analisis.backend.licencias);
      }

      // 3. Validar conflictos
      if (analisis.conflictos.length > 0 && !sobreescribir) {
        throw new Error(`Conflictos detectados. Use sobreescribir=true para continuar: ${analisis.conflictos.join(', ')}`);
      }

      // 4. Migrar cada licencia
      this.log('🔄 Iniciando migración de licencias...');

      for (const [index, licenciaLegacy] of analisis.pouchdb.licencias.entries()) {
        try {
          this.log(`Migrando ${index + 1}/${analisis.pouchdb.total}: ${licenciaLegacy.id}`);

          // Validar datos si se solicita
          if (validarDatos) {
            const validacion = this.validarLicenciaLegacy(licenciaLegacy);
            if (!validacion.valida) {
              errores.push(`Licencia ${licenciaLegacy.id}: ${validacion.errores.join(', ')}`);
              continue;
            }
          }

          // Convertir a formato backend
          const licenciaDto = convertirLicenciaLegacy(licenciaLegacy);

          // Crear en backend
          await licenciasService.crearLicencia(licenciaDto);

          migradas++;
          this.log(`✅ Migrada: ${licenciaDto.codigoLicencia}`);

        } catch (error: any) {
          const mensaje = `Error migrando ${licenciaLegacy.id}: ${error.message}`;
          errores.push(mensaje);
          this.log(`❌ ${mensaje}`);
        }
      }

      this.log(`✅ Migración completada: ${migradas}/${analisis.pouchdb.total} licencias`);

      return {
        exito: errores.length === 0,
        migradas,
        errores,
        log: this.logMigracion,
      };

    } catch (error: any) {
      const mensaje = `Error en migración: ${error.message}`;
      errores.push(mensaje);
      this.log(`❌ ${mensaje}`);

      return {
        exito: false,
        migradas,
        errores,
        log: this.logMigracion,
      };
    }
  }

  /**
   * 🛡️ VALIDACIÓN DE DATOS LEGACY
   */
  private validarLicenciaLegacy(licencia: LicenciaLegacy): {
    valida: boolean;
    errores: string[];
  } {
    const errores: string[] = [];

    if (!licencia.id || licencia.id.trim() === '') {
      errores.push('ID vacío o inválido');
    }

    if (!licencia.description || licencia.description.trim() === '') {
      errores.push('Descripción vacía');
    }

    if (!licencia.maximumUnitAllowed || licencia.maximumUnitAllowed <= 0) {
      errores.push('Máximo unidades debe ser mayor a 0');
    }

    return {
      valida: errores.length === 0,
      errores,
    };
  }

  /**
   * 💾 CREAR BACKUP
   */
  private async crearBackup(licenciasBackend: Licencia[]): Promise<void> {
    try {
      const fecha = new Date().toISOString().split('T')[0];
      const backup = {
        fecha,
        total: licenciasBackend.length,
        licencias: licenciasBackend,
      };

      // Guardar en localStorage como backup temporal
      localStorage.setItem(`backup_licencias_${fecha}`, JSON.stringify(backup));

      // También crear archivo descargable
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_licencias_${fecha}.json`;
      a.click();
      URL.revokeObjectURL(url);

      this.log(`💾 Backup creado: backup_licencias_${fecha}.json`);
    } catch (error) {
      this.log(`⚠️ Error creando backup: ${error}`);
    }
  }

  /**
   * 🗑️ LIMPIAR DATOS POUCHDB (POST-MIGRACIÓN)
   */
  async limpiarPouchDB(): Promise<void> {
    try {
      const response = await dbContext.licences.allDocs({ include_docs: true });
      const docs = response.rows.map(row => ({
        ...row.doc,
        _deleted: true,
      }));

      await dbContext.licences.bulkDocs(docs);
      this.log('🗑️ Datos de PouchDB limpiados');
    } catch (error) {
      throw new Error(`Error limpiando PouchDB: ${error}`);
    }
  }

  /**
   * 📋 GENERAR REPORTE DE MIGRACIÓN
   */
  generarReporte(resultado: Awaited<ReturnType<typeof this.migrarLicencias>>): string {
    const fecha = new Date().toLocaleString('es-ES');

    return `
# 📋 REPORTE DE MIGRACIÓN DE LICENCIAS

**Fecha:** ${fecha}
**Estado:** ${resultado.exito ? '✅ EXITOSA' : '❌ CON ERRORES'}

## 📊 Estadísticas
- **Licencias migradas:** ${resultado.migradas}
- **Errores encontrados:** ${resultado.errores.length}

${resultado.errores.length > 0 ? `
## ❌ Errores
${resultado.errores.map(error => `- ${error}`).join('\n')}
` : ''}

## 📝 Log de Migración
${resultado.log.map(linea => `- ${linea}`).join('\n')}

---
*Reporte generado automáticamente por el sistema de migración*
    `.trim();
  }

  /**
   * 🖥️ MIGRACIÓN CON UI (SweetAlert)
   */
  async migrarConUI(): Promise<void> {
    try {
      // Confirmar migración
      const confirmacion = await Swal.fire({
        title: '🚀 Migración de Licencias',
        text: '¿Deseas migrar las licencias de PouchDB al backend?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, migrar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const analisis = await this.analizarDatos();
            return analisis;
          } catch (error) {
            Swal.showValidationMessage(`Error: ${error}`);
          }
        },
      });

      if (!confirmacion.isConfirmed) return;

      const analisis = confirmacion.value;

      // Mostrar información del análisis
      const confirmacionFinal = await Swal.fire({
        title: '📊 Análisis de Datos',
        html: `
          <div style="text-align: left;">
            <p><strong>PouchDB:</strong> ${analisis.pouchdb.total} licencias</p>
            <p><strong>Backend:</strong> ${analisis.backend.total} licencias</p>
            <p><strong>Conflictos:</strong> ${analisis.conflictos.length}</p>
            ${analisis.conflictos.length > 0 ? `
              <div style="color: orange;">
                <p><strong>⚠️ Conflictos detectados:</strong></p>
                <ul>${analisis.conflictos.map(c => `<li>${c}</li>`).join('')}</ul>
              </div>
            ` : ''}
          </div>
        `,
        icon: analisis.conflictos.length > 0 ? 'warning' : 'info',
        showCancelButton: true,
        confirmButtonText: 'Continuar migración',
        cancelButtonText: 'Cancelar',
      });

      if (!confirmacionFinal.isConfirmed) return;

      // Ejecutar migración
      Swal.fire({
        title: '🔄 Migrando datos...',
        text: 'Por favor espera mientras se migran las licencias',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const resultado = await this.migrarLicencias({
        sobreescribir: analisis.conflictos.length > 0,
        crearBackup: true,
        validarDatos: true,
      });

      // Mostrar resultado
      await Swal.fire({
        title: resultado.exito ? '✅ Migración Exitosa' : '❌ Migración con Errores',
        html: `
          <div style="text-align: left;">
            <p><strong>Licencias migradas:</strong> ${resultado.migradas}</p>
            <p><strong>Errores:</strong> ${resultado.errores.length}</p>
            ${resultado.errores.length > 0 ? `
              <details>
                <summary>Ver errores</summary>
                <ul>${resultado.errores.map(e => `<li>${e}</li>`).join('')}</ul>
              </details>
            ` : ''}
          </div>
        `,
        icon: resultado.exito ? 'success' : 'warning',
        confirmButtonText: 'Descargar reporte',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.descargarReporte(resultado);
        }
      });

    } catch (error: any) {
      Swal.fire('❌ Error', error.message, 'error');
    }
  }

  private descargarReporte(resultado: Awaited<ReturnType<typeof this.migrarLicencias>>): void {
    const reporte = this.generarReporte(resultado);
    const blob = new Blob([reporte], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_migracion_licencias_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private log(mensaje: string): void {
    const timestamp = new Date().toLocaleTimeString('es-ES');
    const logMessage = `[${timestamp}] ${mensaje}`;
    this.logMigracion.push(logMessage);
    console.log(logMessage);
  }
}

// Exportar instancia singleton
export const migracionDatos = MigracionDatos.getInstance();