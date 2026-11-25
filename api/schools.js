import { database, json } from '../lib/server.js';
import { ensureSchoolsOnce } from '../lib/schools.js';

export function createSchoolsHandler(getDatabase = database) {
  return async (request, response) => {
    if (request.method !== 'GET') return json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
    try {
      const sql = getDatabase();
      await ensureSchoolsOnce(sql);
      const schools = await sql`SELECT id, name FROM quiz_schools WHERE active = true ORDER BY name, id`;
      return json(response, 200, { schools });
    } catch {
      return json(response, 503, { error: 'STORAGE_NOT_CONFIGURED' });
    }
  };
}

export default createSchoolsHandler();
