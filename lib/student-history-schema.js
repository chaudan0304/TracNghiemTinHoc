export async function installStudentHistory(sql) {
  await sql.transaction(tx => [
    tx`SET LOCAL lock_timeout = '5s'`,
    tx`CREATE TABLE IF NOT EXISTS public.quiz_student_history (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      changed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
      actor_username text,
      action text NOT NULL CHECK (action IN ('edit-student', 'merge-students')),
      previous_name text NOT NULL,
      previous_class text NOT NULL,
      current_name text NOT NULL,
      current_class text NOT NULL,
      attempt_count integer NOT NULL CHECK (attempt_count > 0)
    )`,
    tx`ALTER TABLE public.quiz_student_history
      ADD COLUMN IF NOT EXISTS school_id text NOT NULL DEFAULT 'quynh-loc'`,
    tx`CREATE OR REPLACE FUNCTION public.record_quiz_student_history()
      RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        INSERT INTO public.quiz_student_history (
          actor_username, action, previous_name, previous_class, current_name, current_class, attempt_count, school_id
        )
        SELECT NULLIF(current_setting('quiz.audit_actor', true), ''),
          CASE WHEN current_setting('quiz.audit_action', true) = 'merge-students' THEN 'merge-students' ELSE 'edit-student' END,
          previous.student_name, previous.class_name, current.student_name, current.class_name, COUNT(*)::int, previous.school_id
        FROM previous_attempts AS previous
        JOIN current_attempts AS current USING (id)
        WHERE (previous.student_name, previous.class_name) IS DISTINCT FROM (current.student_name, current.class_name)
        GROUP BY previous.student_name, previous.class_name, current.student_name, current.class_name, previous.school_id;
        RETURN NULL;
      END;
      $$`,
    tx`CREATE OR REPLACE TRIGGER quiz_attempts_student_history
      AFTER UPDATE ON public.quiz_attempts
      REFERENCING OLD TABLE AS previous_attempts NEW TABLE AS current_attempts
      FOR EACH STATEMENT EXECUTE FUNCTION public.record_quiz_student_history()`
  ]);
}

