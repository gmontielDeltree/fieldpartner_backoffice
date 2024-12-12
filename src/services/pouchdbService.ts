import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find'
import { getEnvVariables } from '../helpers/getEnvVariables';
import { Category, Country, Crops, Movement, SupplyType, System, Licences, MenuModules, TypeDevices, Devices } from '../types';
import { PublicDeviceDetalles } from '../interfaces/devices';

PouchDB.plugin(PouchDBFind);

const remoteCouchDBUrl = Object.freeze(getEnvVariables().VITE_COUCHDB_URL);


const dbNames = Object.freeze({
    db_sensores_pro: "telemetry_raw",
    categories: "categories",
    movementsType: "movements-type",
    supply_type: "supply_type",
    crops: "crops",
    countries: "countries",
    system: "system",
    licences: "licences",
    menuModules: "menu-modules",
    typeDevices: "type-of-devices",
    devices: "devices"
});


export const dbContext = Object.freeze({
    categories: new PouchDB<Category>(dbNames.categories),
    movementsType: new PouchDB<Movement>(dbNames.movementsType),
    supply_type: new PouchDB<SupplyType>(dbNames.supply_type),
    crops: new PouchDB<Crops>(dbNames.crops),
    countries: new PouchDB<Country>(dbNames.countries),
    system: new PouchDB<System>(dbNames.system),
    licences: new PouchDB<Licences>(dbNames.licences),
    menuModules: new PouchDB<MenuModules>(dbNames.menuModules),
    typeDevices: new PouchDB<TypeDevices>(dbNames.typeDevices),
    devices: new PouchDB<Devices>(dbNames.devices),
    db_sensores_pro: new PouchDB<PublicDeviceDetalles>(dbNames.db_sensores_pro)
});


 dbContext.devices.sync(`${remoteCouchDBUrl}${dbNames.devices}`,{live: true, retry: true,});

// dbContext.db_sensores_pro.sync(`${remoteCouchDBUrl}${dbNames.db_sensores_pro}`, { live: true, retry: true });

