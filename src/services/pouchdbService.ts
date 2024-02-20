import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find'
import { getEnvVariables } from '../helpers/getEnvVariables';
import { Category, Crops, Movement, SupplyType } from '../types';

PouchDB.plugin(PouchDBFind);

const remoteCouchDBUrl = Object.freeze(getEnvVariables().VITE_COUCHDB_URL);


const dbNames = Object.freeze({
    categories: "categories",
    movements: "movements",
    supply_type: "supply_type",
    crops:"crops",
});


export const dbContext = Object.freeze({
    categories: new PouchDB<Category>(dbNames.categories),
    movements: new PouchDB<Movement>(dbNames.movements),
    supply_type: new PouchDB<SupplyType>(dbNames.supply_type),
    crops: new PouchDB<Crops>(dbNames.crops),

});

dbContext.categories.sync(`${remoteCouchDBUrl}${dbNames.categories}`, { live: true, retry: true, });

dbContext.movements.sync(`${remoteCouchDBUrl}${dbNames.movements}`, { live: true, retry: true, });

dbContext.supply_type.sync(`${remoteCouchDBUrl}${dbNames.supply_type}`, { live: true, retry: true, });

dbContext.crops.sync(`${remoteCouchDBUrl}${dbNames.crops}`, { live: true, retry: true, });
