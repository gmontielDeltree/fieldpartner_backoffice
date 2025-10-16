import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { getEnvVariables } from '../helpers/getEnvVariables';

PouchDB.plugin(PouchDBFind);

const environment = getEnvVariables().VITE_ENVIRONMENT;
const remoteCouchDBUrl = getEnvVariables().VITE_COUCHDB_URL;

const isEnvSTG = () => {
  return environment === "stg" ? "_stg" : "";
};

export interface Field {
  _id: string;
  _rev?: string;
  uuid: string;
  nombre: string;
  campo_nombre?: string;
  superficie?: number;
  ubicacion?: {
    lat?: number;
    lng?: number;
  };
  empresa_uuid?: string;
  productiveUnit_uuid?: string;
}

export interface ProductiveUnit {
  _id: string;
  _rev?: string;
  uuid: string;
  name: string;
  description?: string;
  fields?: Field[];
}

class FieldsService {
  private fieldsDb: PouchDB.Database;
  private productiveUnitsDb: PouchDB.Database;
  private fieldsDbName: string;
  private productiveUnitsDbName: string;

  constructor() {
    this.fieldsDbName = `fields${isEnvSTG()}`;
    this.productiveUnitsDbName = `productive-units${isEnvSTG()}`;
    
    this.fieldsDb = new PouchDB(this.fieldsDbName);
    this.productiveUnitsDb = new PouchDB(this.productiveUnitsDbName);
    
    // Sync with remote if URL is available
    if (remoteCouchDBUrl) {
      this.fieldsDb.sync(`${remoteCouchDBUrl}${this.fieldsDbName}`, { 
        live: true, 
        retry: true 
      });
      
      this.productiveUnitsDb.sync(`${remoteCouchDBUrl}${this.productiveUnitsDbName}`, { 
        live: true, 
        retry: true 
      });
    }
  }

  async getAllFields(): Promise<Field[]> {
    try {
      const result = await this.fieldsDb.allDocs({
        include_docs: true,
        startkey: 'field:',
        endkey: 'field:\ufff0'
      });
      
      const fields = result.rows
        .map(row => row.doc)
        .filter((doc): doc is Field => doc !== undefined && 'uuid' in doc);
      
      // Si no encontramos con el prefijo field:, intentamos buscar lotes
      if (fields.length === 0) {
        const lotesResult = await this.fieldsDb.allDocs({
          include_docs: true,
          startkey: 'lote:',
          endkey: 'lote:\ufff0'
        });
        
        return lotesResult.rows
          .map(row => row.doc)
          .filter((doc): doc is Field => doc !== undefined && 'uuid' in doc);
      }
      
      return fields;
    } catch (error) {
      console.error('Error fetching fields:', error);
      return [];
    }
  }

  async getFieldByUuid(uuid: string): Promise<Field | null> {
    try {
      // Intentar buscar por diferentes patrones de ID
      const patterns = [
        `field:${uuid}`,
        `lote:${uuid}`,
        uuid
      ];

      for (const pattern of patterns) {
        try {
          const doc = await this.fieldsDb.get(pattern);
          if (doc && 'uuid' in doc) {
            return doc as Field;
          }
        } catch (e) {
          // Continuar con el siguiente patrón
        }
      }

      // Si no encontramos por ID, buscar en todos los documentos
      const result = await this.fieldsDb.find({
        selector: {
          uuid: { $eq: uuid }
        }
      });

      if (result.docs.length > 0) {
        return result.docs[0] as Field;
      }

      return null;
    } catch (error) {
      console.error('Error fetching field by UUID:', error);
      return null;
    }
  }

  async getProductiveUnits(): Promise<ProductiveUnit[]> {
    try {
      const result = await this.productiveUnitsDb.allDocs({
        include_docs: true
      });
      
      return result.rows
        .map(row => row.doc)
        .filter((doc): doc is ProductiveUnit => doc !== undefined && 'uuid' in doc);
    } catch (error) {
      console.error('Error fetching productive units:', error);
      return [];
    }
  }

  async getFieldsMapping(): Promise<Map<string, { nombre: string; campo: string }>> {
    try {
      const fieldsMap = new Map<string, { nombre: string; campo: string }>();
      
      // Buscar documentos con prefijo campos_
      const camposResult = await this.fieldsDb.allDocs({
        include_docs: true,
        startkey: 'campos_',
        endkey: 'campos_\ufff0'
      });
      
      // Procesar campos y sus lotes
      camposResult.rows.forEach(row => {
        const doc: any = row.doc;
        if (doc && doc.nombre && doc.lotes) {
          const campoNombre = doc.nombre;
          
          // Procesar cada lote dentro del campo
          if (Array.isArray(doc.lotes)) {
            doc.lotes.forEach((lote: any) => {
              const loteUuid = lote.properties?.uuid || lote.id;
              const loteNombre = lote.properties?.nombre || campoNombre;
              
              if (loteUuid) {
                fieldsMap.set(loteUuid, { 
                  nombre: loteNombre, 
                  campo: campoNombre 
                });
              }
            });
          }
          
          // También agregar el campo mismo si tiene UUID
          if (doc.uuid) {
            fieldsMap.set(doc.uuid, { 
              nombre: campoNombre, 
              campo: campoNombre 
            });
          }
        }
      });
      
      console.log('Fields mapping created:', fieldsMap.size, 'entries');
      
      // Log algunas entradas para debug
      const entries = Array.from(fieldsMap.entries()).slice(0, 5);
      console.log('Sample mappings:', entries);
      
      return fieldsMap;
    } catch (error) {
      console.error('Error creating fields mapping:', error);
      return new Map();
    }
  }

  async enrichActivitiesWithFieldNames(activities: any[]): Promise<any[]> {
    try {
      const fieldsMap = await this.getFieldsMapping();
      
      console.log(`Enriching ${activities.length} activities with field names`);
      
      return activities.map(activity => {
        let loteNombre = activity.lote_nombre;
        let campoNombre = activity.campo_nombre;
        
        // Buscar en el mapa usando el lote_uuid
        if (activity.lote_uuid) {
          const fieldInfo = fieldsMap.get(activity.lote_uuid);
          if (fieldInfo) {
            loteNombre = fieldInfo.nombre;
            campoNombre = fieldInfo.campo;
            console.log(`Found mapping for ${activity.lote_uuid}: ${campoNombre} - ${loteNombre}`);
          } else {
            // Si no encontramos el mapeo, usar el UUID parcial
            loteNombre = loteNombre || `Lote ${activity.lote_uuid.substring(0, 8)}`;
          }
        }
        
        return {
          ...activity,
          lote_nombre: loteNombre,
          campo_nombre: campoNombre
        };
      });
    } catch (error) {
      console.error('Error enriching activities:', error);
      return activities;
    }
  }
}

export const fieldsService = new FieldsService();