import Dexie from 'dexie';

export const db = new Dexie('produtos-app');
db.version(1).stores({
    produtos: '++id,nome,valor,quantidade,total',
})

export default db;