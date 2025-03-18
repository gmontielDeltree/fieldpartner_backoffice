import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find'
import { getEnvVariables } from '../helpers/getEnvVariables';
import { Category, Country, Crops, Movement, SupplyType, System, Licences, MenuModules, TypeDevices } from '../types';

PouchDB.plugin(PouchDBFind);

const remoteCouchDBUrl = Object.freeze(getEnvVariables().VITE_COUCHDB_URL);
const environment = getEnvVariables().VITE_ENVIRONMENT;


const isEnvSTG = () => {
  return environment === "stg" ? "_stg" : "";
};

const dbNames = Object.freeze({
    categories: `categories${isEnvSTG()}`,
    movementsType: `movements-type${isEnvSTG()}`,
    supply_type: `supply-type${isEnvSTG()}`,
    crops: `crops${isEnvSTG()}`,
    countries: `countries${isEnvSTG()}`,
    system: `system${isEnvSTG()}`,
    licences: `licences${isEnvSTG()}`,
    menuModules: `menu-modules${isEnvSTG()}`,
    typeDevices: `type-of-devices${isEnvSTG()}`
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
    typeDevices: new PouchDB<TypeDevices>(dbNames.typeDevices)
});

dbContext.categories.sync(`${remoteCouchDBUrl}${dbNames.categories}`, { live: true, retry: true, });

dbContext.movementsType.sync(`${remoteCouchDBUrl}${dbNames.movementsType}`, { live: true, retry: true, });

dbContext.supply_type.sync(`${remoteCouchDBUrl}${dbNames.supply_type}`, { live: true, retry: true, });

dbContext.crops.sync(`${remoteCouchDBUrl}${dbNames.crops}`, { live: true, retry: true, });

dbContext.countries.sync(`${remoteCouchDBUrl}${dbNames.countries}`, { live: true, retry: true, });

dbContext.system.sync(`${remoteCouchDBUrl}${dbNames.system}`, { live: true, retry: true, });

dbContext.licences.sync(`${remoteCouchDBUrl}${dbNames.licences}`, { live: true, retry: true, });

dbContext.menuModules.sync(`${remoteCouchDBUrl}${dbNames.menuModules}`, { live: true, retry: true, });

dbContext.typeDevices.sync(`${remoteCouchDBUrl}${dbNames.typeDevices}`,{live: true, retry: true,});

