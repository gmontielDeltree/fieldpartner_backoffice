import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBHttp from 'pouchdb-adapter-http';
import { getEnvVariables } from '../helpers/getEnvVariables';
import {
  Category,
  Country,
  Crops,
  Movement,
  SupplyType,
  System,
  Licences,
  MenuModules,
  TypeDevices,
  Modules,
} from '../types';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBHttp);

// #region URL & ENVIRONMENT
const normalizeRemoteUrl = (value?: string) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
};

const normalizeEnvironment = (value?: string) => {
  const trimmed = String(value || 'stg').trim().toLowerCase();
  return trimmed.replace(/^['"]+|['"]+$/g, '');
};

export const remoteCouchDBUrl = Object.freeze(
  normalizeRemoteUrl(getEnvVariables().VITE_COUCHDB_URL as string | undefined),
);

const environment = normalizeEnvironment(
  getEnvVariables().VITE_ENVIRONMENT as string | undefined,
);

export const isEnvSTG = () => {
  return environment === 'stg' ? '_stg' : '';
};
// #endregion

// #region DATABASE SLUGS
const dbSlugs = Object.freeze({
  categories: `categories${isEnvSTG()}`,
  movementsType: `movements-type${isEnvSTG()}`,
  supply_type: `supply-type${isEnvSTG()}`,
  crops: `crops${isEnvSTG()}`,
  countries: `countries${isEnvSTG()}`,
  system: `system${isEnvSTG()}`,
  licences: `licences${isEnvSTG()}`,
  menuModules: `menu-modules${isEnvSTG()}`,
  typeDevices: `type-of-devices${isEnvSTG()}`,
  modules: `modules${isEnvSTG()}`,
});

/** @deprecated Usar `dbSlugs`. Conservado por compatibilidad. */
export const dbNames = dbSlugs;
// #endregion

// #region REMOTE-ONLY DB FACTORY
const httpOpts: PouchDB.Configuration.RemoteDatabaseConfiguration = {
  adapter: 'http',
  skip_setup: true,
};

const remoteDb = <T extends Record<string, any>>(slug: string): PouchDB.Database<T> => {
  if (!remoteCouchDBUrl) {
    console.error(
      '[pouchdbService] VITE_COUCHDB_URL no está definido. Las llamadas a CouchDB van a fallar.',
    );
  }
  return new PouchDB<T>(`${remoteCouchDBUrl}${slug}`, httpOpts);
};

export const dbContext = Object.freeze({
  categories: remoteDb<Category>(dbSlugs.categories),
  movementsType: remoteDb<Movement>(dbSlugs.movementsType),
  supply_type: remoteDb<SupplyType>(dbSlugs.supply_type),
  crops: remoteDb<Crops>(dbSlugs.crops),
  countries: remoteDb<Country>(dbSlugs.countries),
  system: remoteDb<System>(dbSlugs.system),
  licences: remoteDb<Licences>(dbSlugs.licences),
  menuModules: remoteDb<MenuModules>(dbSlugs.menuModules),
  typeDevices: remoteDb<TypeDevices>(dbSlugs.typeDevices),
  modules: remoteDb<Modules>(dbSlugs.modules),
});
// #endregion

// #region ÍNDICES MANGO
const createIndexes = async () => {
  try {
    await Promise.all([
      dbContext.categories.createIndex({ index: { fields: ['idCategory'] } }),
    ]);
  } catch (err) {
    console.error('[pouchdbService] Error creando índices Mango:', err);
  }
};
// #endregion

// #region SYNC MANAGER STUB
type SyncHandlerStub = {
  on: (...args: unknown[]) => SyncHandlerStub;
  cancel: () => void;
};

const noopSyncHandler: SyncHandlerStub = {
  on() {
    return noopSyncHandler;
  },
  cancel() {
    /* no-op */
  },
};

class SyncManagerStub {
  register(
    _name: string,
    _local: PouchDB.Database<any>,
    _remoteUrl: string,
    _opts: PouchDB.Replication.SyncOptions = {},
  ) {
    return noopSyncHandler;
  }

  cancel(_name: string) {
    /* no-op */
  }

  cancelAll() {
    /* no-op */
  }
}

export const syncManager = new SyncManagerStub();
// #endregion

// #region START / STOP
let started = false;

export const startSync = () => {
  if (started) {
    console.debug('[pouchdbService] startSync ignorado: ya inicializado');
    return;
  }

  if (!remoteCouchDBUrl) {
    console.error(
      '[pouchdbService] Missing VITE_COUCHDB_URL. CouchDB online no está disponible.',
    );
    return;
  }

  started = true;
  createIndexes().catch((err) => console.error('[pouchdbService] Error creando índices:', err));
};

export const stopSync = () => {
  started = false;
};
// #endregion
