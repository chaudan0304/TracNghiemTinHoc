import { pathToFileURL } from 'node:url';
import { database } from '../lib/server.js';

export async function lockAttemptScores(sql) {
  await sql.transaction(tx => [
    tx`SET LOCAL lock_timeout = '5s'`,
    tx`CREATE OR REPLACE FUNCTION public.reject_quiz_attempt_score_update()
      RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'Stored quiz attempt scores are read-only';
      END;
      $$`,
    tx`CREATE OR REPLACE TRIGGER quiz_attempts_score_read_only
      BEFORE UPDATE OF score ON public.quiz_attempts
      FOR EACH STATEMENT EXECUTE FUNCTION public.reject_quiz_attempt_score_update()`
  ]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await lockAttemptScores(database());
  console.log('Đã khóa cập nhật cột điểm của các lượt làm đã lưu.');
}
