import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { getEnvVariables } from '../helpers/getEnvVariables';
import { fieldsService } from './fieldsService';

PouchDB.plugin(PouchDBFind);

const environment = getEnvVariables().VITE_ENVIRONMENT;
const remoteCouchDBUrl = getEnvVariables().VITE_COUCHDB_URL;

const isEnvSTG = () => {
  return environment === "stg" ? "_stg" : "";
};

export interface Activity {
  _id?: string;
  _rev?: string;
  uuid: string;
  tipo: 'siembra' | 'cosecha' | 'aplicacion' | 'preparado';
  estado: 'pendiente' | 'completada' | 'en_proceso';
  lote_uuid: string;
  campo_nombre?: string;
  lote_nombre?: string;
  comentario?: string;
  actividad_uuid?: string;
  detalles?: {
    cultivo?: {
      descriptionES?: string;
      name?: string;
      _id?: string;
    };
    fecha_ejecucion_tentativa?: string;
    fecha_ejecucion?: string;
    fecha_hora_inicio?: string;
    fecha_hora_fin?: string;
    rinde_obtenido?: number;
    deposito?: string;
    superficie?: number;
    dosis?: number;
    insumo?: any;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Execution {
  _id?: string;
  _rev?: string;
  uuid: string;
  actividad_uuid: string;
  fecha_ejecucion: string;
  fecha_hora_inicio?: string;
  fecha_hora_fin?: string;
  rinde_obtenido?: number;
  deposito?: string;
  observaciones?: string;
}

class ActivitiesService {
  private db: PouchDB.Database<Activity>;
  private dbName: string;

  constructor() {
    this.dbName = `fields${isEnvSTG()}`;
    this.db = new PouchDB<Activity>(this.dbName);
    
    // Sync with remote if URL is available
    if (remoteCouchDBUrl) {
      this.db.sync(`${remoteCouchDBUrl}${this.dbName}`, { 
        live: true, 
        retry: true 
      });
    }
  }

  async getAllActivities(): Promise<Activity[]> {
    try {
      const result = await this.db.allDocs({
        include_docs: true,
        startkey: 'actividad:',
        endkey: 'actividad:\ufff0'
      });
      
      const activities = result.rows
        .map(row => row.doc)
        .filter((doc): doc is Activity => doc !== undefined && doc.tipo !== undefined);
      
      // Enriquecer actividades con nombres de campos y lotes
      const enrichedActivities = await fieldsService.enrichActivitiesWithFieldNames(activities);
      
      return enrichedActivities;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  async getActivitiesByLote(lote_uuid: string): Promise<Activity[]> {
    try {
      await this.db.createIndex({
        index: { fields: ['lote_uuid'] }
      });

      const result = await this.db.find({
        selector: {
          lote_uuid: { $eq: lote_uuid }
        }
      });

      // Enriquecer actividades con nombres
      const enrichedActivities = await fieldsService.enrichActivitiesWithFieldNames(result.docs);
      
      return enrichedActivities;
    } catch (error) {
      console.error('Error fetching activities by lote:', error);
      return [];
    }
  }

  async getActivityById(id: string): Promise<Activity | null> {
    try {
      const doc = await this.db.get(id);
      return doc;
    } catch (error) {
      console.error('Error fetching activity:', error);
      return null;
    }
  }

  async updateActivity(activity: Activity): Promise<boolean> {
    try {
      if (!activity._id) {
        console.error('Activity must have an _id to update');
        return false;
      }

      const existingDoc = await this.db.get(activity._id);
      const updatedActivity = {
        ...existingDoc,
        ...activity,
        _rev: existingDoc._rev,
        updated_at: new Date().toISOString()
      };

      await this.db.put(updatedActivity);
      return true;
    } catch (error) {
      console.error('Error updating activity:', error);
      return false;
    }
  }

  async resetActivity(activityId: string): Promise<boolean> {
    try {
      const activity = await this.db.get(activityId);
      
      activity.estado = 'pendiente';
      delete activity.actividad_uuid;
      
      if (activity.detalles) {
        delete activity.detalles.fecha_ejecucion;
        delete activity.detalles.fecha_hora_inicio;
        delete activity.detalles.fecha_hora_fin;
        delete activity.detalles.rinde_obtenido;
        delete activity.detalles.deposito;
      }

      await this.db.put(activity);

      // Try to remove associated execution if exists
      if (activity.uuid) {
        const executionId = `ejecucion:${new Date().toISOString().split('T')[0]}:${activity.uuid}`;
        try {
          const execution = await this.db.get(executionId);
          await this.db.remove(execution);
        } catch (e) {
          // Execution might not exist
        }
      }

      return true;
    } catch (error) {
      console.error('Error resetting activity:', error);
      return false;
    }
  }

  async createActivity(activity: Omit<Activity, '_id' | '_rev'>): Promise<Activity | null> {
    try {
      const newActivity = {
        ...activity,
        _id: `actividad:${new Date().toISOString()}:${activity.uuid}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const response = await this.db.put(newActivity);
      
      if (response.ok) {
        return { ...newActivity, _rev: response.rev };
      }
      return null;
    } catch (error) {
      console.error('Error creating activity:', error);
      return null;
    }
  }

  async deleteActivity(activityId: string): Promise<boolean> {
    try {
      const activity = await this.db.get(activityId);
      await this.db.remove(activity);
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  }

  async getActivitiesByFilters(filters: {
    tipo?: string;
    estado?: string;
    lote_uuid?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Activity[]> {
    try {
      const selector: any = {};

      if (filters.tipo) selector.tipo = filters.tipo;
      if (filters.estado) selector.estado = filters.estado;
      if (filters.lote_uuid) selector.lote_uuid = filters.lote_uuid;

      const result = await this.db.find({ selector });
      
      let activities = result.docs;

      // Apply date filters if provided
      if (filters.startDate || filters.endDate) {
        activities = activities.filter(activity => {
          const activityDate = activity.detalles?.fecha_ejecucion_tentativa || 
                              activity.detalles?.fecha_ejecucion;
          if (!activityDate) return false;

          if (filters.startDate && activityDate < filters.startDate) return false;
          if (filters.endDate && activityDate > filters.endDate) return false;

          return true;
        });
      }

      return activities;
    } catch (error) {
      console.error('Error filtering activities:', error);
      return [];
    }
  }

  onChanges(callback: (change: any) => void) {
    const changes = this.db.changes({
      since: 'now',
      live: true,
      include_docs: true
    });

    changes.on('change', callback);
    
    return () => changes.cancel();
  }

  async getUniqueFields(): Promise<{ campo_nombre: string; lotes: string[] }[]> {
    try {
      const allActivities = await this.getAllActivities();
      const fieldsMap = new Map<string, Set<string>>();
      
      // Agrupar lotes por campo
      allActivities.forEach(activity => {
        const campo = activity.campo_nombre || 'Sin Campo';
        const lote = activity.lote_nombre || activity.lote_uuid || 'Sin Lote';
        
        if (!fieldsMap.has(campo)) {
          fieldsMap.set(campo, new Set());
        }
        fieldsMap.get(campo)?.add(lote);
      });
      
      // Convertir a array
      return Array.from(fieldsMap.entries()).map(([campo_nombre, lotes]) => ({
        campo_nombre,
        lotes: Array.from(lotes)
      }));
    } catch (error) {
      console.error('Error getting unique fields:', error);
      return [];
    }
  }

  async getUniqueLotes(): Promise<{ uuid: string; nombre: string; campo?: string }[]> {
    try {
      const allActivities = await this.getAllActivities();
      const lotesMap = new Map<string, { nombre: string; campo?: string }>();
      
      allActivities.forEach(activity => {
        if (activity.lote_uuid) {
          const nombre = activity.lote_nombre || `Lote ${activity.lote_uuid.substring(0, 8)}`;
          const campo = activity.campo_nombre;
          lotesMap.set(activity.lote_uuid, { nombre, campo });
        }
      });
      
      return Array.from(lotesMap.entries()).map(([uuid, info]) => ({
        uuid,
        nombre: info.campo ? `${info.campo} - ${info.nombre}` : info.nombre,
        campo: info.campo
      }));
    } catch (error) {
      console.error('Error getting unique lotes:', error);
      return [];
    }
  }
}

export const activitiesService = new ActivitiesService();