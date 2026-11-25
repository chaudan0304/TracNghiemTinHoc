import { ensureTable } from './server.js';
import { ensureTeacherAccounts } from './teacher-accounts.js';
import { installStudentHistory } from './student-history-schema.js';

export async function migrateSchools(sql) {
  const [before] = await sql`SELECT COUNT(*)::int AS attempts, COALESCE(SUM(score), 0)::text AS score_total FROM quiz_attempts`;
  await ensureTable(sql);
  await ensureTeacherAccounts(sql);
  await installStudentHistory(sql);
  const [after] = await sql`SELECT COUNT(*)::int AS attempts, COALESCE(SUM(score), 0)::text AS score_total FROM quiz_attempts`;
  const schools = await sql`SELECT school_id, COUNT(*)::int AS attempts FROM quiz_attempts GROUP BY school_id`;
  const teachers = await sql`SELECT school_id, COUNT(*)::int AS teachers FROM teacher_accounts GROUP BY school_id`;
  return { before, after, schools, teachers };
}
