import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find'
import { getEnvVariables } from '../helpers/getEnvVariables';
import { Category, Country, Crops, Movement, SupplyType, System, Licences,MenuModules} from '../types';

PouchDB.plugin(PouchDBFind);

const remoteCouchDBUrl = Object.freeze(getEnvVariables().VITE_COUCHDB_URL);


const dbNames = Object.freeze({
    categories: "categories",
    movementsType: "movements-type",
    supply_type: "supply_type",
    crops:"crops",
    country:"country",
    system:"system",
    licences:"licences",
    menuModules:"menu-modules"
});


export const dbContext = Object.freeze({
    categories: new PouchDB<Category>(dbNames.categories),
    movementsType: new PouchDB<Movement>(dbNames.movementsType),
    supply_type: new PouchDB<SupplyType>(dbNames.supply_type),
    crops: new PouchDB<Crops>(dbNames.crops),
    country:new PouchDB<Country>(dbNames.country),
    system:new PouchDB<System>(dbNames.system),
    licences:new PouchDB<Licences>(dbNames.licences),
    menuModules:new PouchDB<MenuModules>(dbNames.menuModules)
});

dbContext.categories.sync(`${remoteCouchDBUrl}${dbNames.categories}`, { live: true, retry: true, });

dbContext.movementsType.sync(`${remoteCouchDBUrl}${dbNames.movementsType}`, { live: true, retry: true, });

dbContext.supply_type.sync(`${remoteCouchDBUrl}${dbNames.supply_type}`, { live: true, retry: true, });

dbContext.crops.sync(`${remoteCouchDBUrl}${dbNames.crops}`, { live: true, retry: true, });

dbContext.country.sync(`${remoteCouchDBUrl}${dbNames.country}`, { live: true, retry: true, });

dbContext.system.sync(`${remoteCouchDBUrl}${dbNames.system}`, { live: true, retry: true, });

dbContext.licences.sync(`${remoteCouchDBUrl}${dbNames.licences}`,{live: true, retry: true,});

dbContext.menuModules.sync(`${remoteCouchDBUrl}${dbNames.menuModules}`,{live: true, retry: true,});

