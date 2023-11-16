import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find'
import { getEnvVariables } from '../helpers/getEnvVariables';
import { Category, Movement } from '../types';

PouchDB.plugin(PouchDBFind);

const remoteCouchDBUrl = Object.freeze(getEnvVariables().VITE_COUCHDB_URL);


const dbNames = Object.freeze({
    categories: "categories",
    movements: "movements",
});


export const dbContext = Object.freeze({
    categories: new PouchDB<Category>(dbNames.categories),
    movements: new PouchDB<Movement>(dbNames.movements),
});

dbContext.categories.sync(`${remoteCouchDBUrl}${dbNames.categories}`, { live: true, retry: true, });

dbContext.movements.sync(`${remoteCouchDBUrl}${dbNames.movements}`, { live: true, retry: true, });
