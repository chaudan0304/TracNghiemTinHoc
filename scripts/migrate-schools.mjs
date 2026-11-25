import { database } from '../lib/server.js';
import { migrateSchools } from '../lib/school-migration.js';
console.log(JSON.stringify(await migrateSchools(database())));
