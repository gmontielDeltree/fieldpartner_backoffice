import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find'
import { getEnvVariables } from '../helpers/getEnvVariables';
import { Category, Movement } from '../types';

PouchDB.plugin(PouchDBFind);

const remoteCouchDBUrl = Object.freeze(getEnvVariables().VITE_COUCHDB_URL);


const dbNames = Object.freeze({
    categories: "categories",
});
 const dbMovit = Object.freeze({
    movements: "movements",
});

export const dbContext = Object.freeze({
    categories: new PouchDB<Category>(dbNames.categories),
});

dbContext.categories.sync(`${remoteCouchDBUrl}${dbNames.categories}`, { live: true, retry: true, });

export const dbMovement = Object.freeze({
    movements: new PouchDB<Movement>(dbMovit.movements),
});

dbMovement.movements.sync(`${remoteCouchDBUrl}${dbMovit.movements}`, { live: true, retry: true, });
