import { database, ensureTable, json } from '../lib/server.js';
import { authenticateTeacher, clearTeacherSession, loginTeacher } from '../lib/teacher-auth.js';
import { handleTeacherAccounts } from '../lib/teacher-accounts.js';
import { listLessons, loadLesson } from '../lib/lesson-store.js';
import { EXCELLENT_SCORE } from '../lib/score-levels.js';
import { summarizeQuestionResponses } from '../lib/question-stats.js';

export function createTeacherHandler(getDatabase = database, prepare = ensureTable) {
return async function handler(request, response) {
  const action = request.method === 'POST' ? request.body?.action : null;
  const isMerge = action === 'merge-students';
  const isEdit = action === 'edit-student';
  try {
    if (action === 'logout') return clearTeacherSession(response);
    if (action === 'login') return await loginTeacher(request, response, getDatabase, prepare);
    const identity = await authenticateTeacher(request, getDatabase);
    if (!identity) return json(response, 401, { error: 'UNAUTHORIZED' });

    const params = request.method === 'GET' ? new URL(request.url, 'https://local.invalid').searchParams : null;
    const type = params?.get('type') || '';
    const accountRequest = type === 'accounts' || action === 'create-account' || action === 'update-account';
    if (identity.role !== 'admin' &&
        (accountRequest || type === 'student-history' || isMerge ||
          (isEdit && !identity.canEditStudents) || request.method === 'DELETE')) {
      return json(response, 403, { error: 'FORBIDDEN' });
    }
    if (accountRequest) return await handleTeacherAccounts(request, response, getDatabase());
    if (type === 'student-history') {
      const before = params.get('before');
      if (before !== null && !/^[1-9]\d{0,17}$/.test(before)) {
        return json(response, 400, { error: 'INVALID_FILTER' });
      }
      const sql = getDatabase();
      const rows = await sql`SELECT id::text AS id, changed_at, actor_username, action,
        previous_name, previous_class, current_name, current_class, attempt_count
        FROM quiz_student_history
        WHERE (${before}::bigint IS NULL OR quiz_student_history.id < ${before}::bigint)
        ORDER BY quiz_student_history.id DESC LIMIT 51`;
      const entries = rows.slice(0, 50);
      return json(response, 200, { entries, nextBefore: rows.length > 50 ? entries.at(-1).id : null });
    }
    if (request.method === 'POST' && !isMerge && !isEdit) {
      return json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
    }
    if (isMerge) {
      const { sourceName, targetName, className } = request.body;
      if (!validMergeValue(sourceName, 100) || !validMergeValue(targetName, 100) ||
          !validMergeValue(className, 30) || sourceName === targetName) {
        return json(response, 400, { error: 'INVALID_STUDENT_MERGE' });
      }
    }
    if (isEdit) {
      const { sourceName, className, targetName, targetClass } = request.body;
      if (!validMergeValue(sourceName, 100) || !validMergeValue(className, 30) ||
          !validMergeValue(targetName, 100) || !validMergeValue(targetClass, 30) ||
          (sourceName === targetName.trim() && className === targetClass.trim())) {
        return json(response, 400, { error: 'INVALID_STUDENT_EDIT' });
      }
      if (identity.classes !== null &&
          ![className, targetClass].every(value => identity.classes.includes(value.trim().toUpperCase()))) {
        return json(response, 403, { error: 'FORBIDDEN' });
      }
    }

    const sql = getDatabase();
    await prepare(sql);
    const scope = identity.classes === null ? null : JSON.stringify(identity.classes);
    if (isEdit) {
      const { sourceName, className, targetName, targetClass } = request.body;
      const [, , [result]] = await sql.transaction(tx => [
        tx`LOCK TABLE quiz_attempts IN SHARE ROW EXCLUSIVE MODE`,
        tx`SELECT set_config('quiz.audit_actor', ${identity.username}, true), set_config('quiz.audit_action', 'edit-student', true)`,
        tx`WITH target AS (
          SELECT EXISTS (
            SELECT 1 FROM quiz_attempts
            WHERE student_name = ${targetName.trim()} AND class_name = ${targetClass.trim()}
          ) AS already_exists
        ), updated AS (
          UPDATE quiz_attempts AS source
          SET student_name = ${targetName.trim()}, class_name = ${targetClass.trim()},
            original_student_name = COALESCE(source.original_student_name, source.student_name),
            original_class_name = COALESCE(source.original_class_name, source.class_name)
          FROM target
          WHERE source.student_name = ${sourceName} AND source.class_name = ${className}
            AND NOT target.already_exists
          RETURNING source.id
        ) SELECT (SELECT COUNT(*)::int FROM updated) AS updated_count, already_exists AS target_exists
          FROM target`
      ]);
      if (result.target_exists) return json(response, 409, { error: 'STUDENT_EDIT_DUPLICATE' });
      if (!result.updated_count) return json(response, 409, { error: 'STUDENT_EDIT_CHANGED' });
      return json(response, 200, { updatedCount: result.updated_count });
    }
    if (isMerge) {
      const { sourceName, targetName, className } = request.body;
      // Serialize merges and keep the selected target in place while moving its classmate's attempts.
      const [, , [result]] = await sql.transaction(tx => [
        tx`LOCK TABLE quiz_attempts IN SHARE ROW EXCLUSIVE MODE`,
        tx`SELECT set_config('quiz.audit_actor', ${identity.username}, true), set_config('quiz.audit_action', 'merge-students', true)`,
        tx`WITH moved AS (
          UPDATE quiz_attempts AS source
          SET student_name = ${targetName}, original_student_name = COALESCE(source.original_student_name, source.student_name)
          WHERE source.student_name = ${sourceName} AND source.class_name = ${className}
            AND EXISTS (
              SELECT 1 FROM quiz_attempts AS target
              WHERE target.student_name = ${targetName} AND target.class_name = source.class_name
            )
          RETURNING source.id
        ) SELECT COUNT(*)::int AS merged_count FROM moved`
      ]);
      if (!result.merged_count) return json(response, 409, { error: 'STUDENT_MERGE_CHANGED' });
      return json(response, 200, { mergedCount: result.merged_count });
    }
    if (request.method === 'GET') {
      const classFilter = params.get('className') || '';
      const requestedClass = classFilter.trim();
      if (identity.classes !== null && requestedClass && (type !== 'ranking' || requestedClass !== 'ALL') &&
          !identity.classes.includes(requestedClass.toUpperCase())) {
        return json(response, 403, { error: 'FORBIDDEN' });
      }
      if (type === 'student-attempts') {
        const studentName = params.get('studentName') || '';
        const className = classFilter;
        const offset = Number(params.get('offset') ?? '0');
        if (!studentName.trim() || studentName.length > 100 || !className.trim() ||
            className.length > 30 || !Number.isSafeInteger(offset) || offset < 0) {
          return json(response, 400, { error: 'INVALID_FILTER' });
        }

        const pageSize = 50;
        const rows = await sql`SELECT lesson_id, correct_count, total_questions, score, time_taken_seconds, submitted_at
          FROM quiz_attempts WHERE student_name = ${studentName} AND class_name = ${className}
          AND COALESCE(jsonb_exists(${scope}::jsonb, upper(btrim(class_name))), true)
          ORDER BY submitted_at DESC, id DESC LIMIT ${pageSize + 1} OFFSET ${offset}`;
        return json(response, 200, { rows: rows.slice(0, pageSize), hasMore: rows.length > pageSize });
      }
      if (type === 'ranking') {
        const mode = params.get('mode') || (classFilter ? 'student' : 'class');
        const className = requestedClass;
        if (className.length > 30) return json(response, 400, { error: 'INVALID_FILTER' });

        const { gradeTotals, lessonIdsByGrade } = await loadRankingCatalog(sql);
        const catalog = JSON.stringify(lessonIdsByGrade);

        if (mode === 'student') {
          const students = await sql`SELECT student_name,
            class_name,
            COUNT(DISTINCT lesson_id) FILTER (
              WHERE jsonb_exists(${catalog}::jsonb -> COALESCE(substring(class_name FROM '^[^0-9]*([345])'), 'all'), lesson_id)
            )::int AS completed_lessons,
            COUNT(*)::int AS total_attempts,
            COALESCE(ROUND(AVG(score), 1), 0)::float AS avg_score,
            COALESCE(MAX(score), 0)::float AS max_score,
            COALESCE(ROUND(AVG(time_taken_seconds)), 0)::int AS avg_time_seconds,
            MAX(submitted_at) AS latest_submission
            FROM quiz_attempts
            WHERE (${className} = '' OR ${className} = 'ALL' OR class_name = ${className})
            AND COALESCE(jsonb_exists(${scope}::jsonb, upper(btrim(class_name))), true)
            GROUP BY student_name, class_name
            ORDER BY avg_score DESC,
              AVG(time_taken_seconds) ASC NULLS LAST, student_name ASC, class_name ASC`;
          return json(response, 200, { students, gradeTotals });
        }

        const classes = await sql`SELECT class_name,
          COUNT(DISTINCT student_name)::int AS student_count,
          COUNT(DISTINCT lesson_id) FILTER (
            WHERE jsonb_exists(${catalog}::jsonb -> COALESCE(substring(class_name FROM '^[^0-9]*([345])'), 'all'), lesson_id)
          )::int AS completed_lessons,
          COUNT(*)::int AS total_attempts,
          COALESCE(ROUND(AVG(score), 1), 0)::float AS avg_score,
          COALESCE(MAX(score), 0)::float AS max_score,
          COUNT(*) FILTER (WHERE score >= ${EXCELLENT_SCORE})::int AS good_count,
          MAX(submitted_at) AS latest_submission
          FROM quiz_attempts
          WHERE COALESCE(jsonb_exists(${scope}::jsonb, upper(btrim(class_name))), true)
          GROUP BY class_name
          ORDER BY (COUNT(*) FILTER (WHERE score >= ${EXCELLENT_SCORE}))::numeric / COUNT(*) DESC,
            avg_score DESC, class_name ASC`;
        return json(response, 200, { classes, gradeTotals });
      }

      const lessonId = params.get('lessonId') || '';
      const offset = Number(params.get('offset') ?? '0');
      if (!/^[a-z0-9-]{1,64}$/.test(lessonId)) return json(response, 400, { error: 'INVALID_LESSON' });
      if (type === 'classes') {
        const classes = await sql`SELECT DISTINCT class_name FROM quiz_attempts
          WHERE lesson_id = ${lessonId}
          AND COALESCE(jsonb_exists(${scope}::jsonb, upper(btrim(class_name))), true)
          ORDER BY class_name`;
        return json(response, 200, { classes: classes.map(row => row.class_name) });
      }
      const className = classFilter;
      const search = params.get('search')?.trim() || '';
      if (className.length > 30 || search.length > 100 || !Number.isSafeInteger(offset) || offset < 0) {
        return json(response, 400, { error: 'INVALID_FILTER' });
      }
      if (params.get('questionStats') === '1') {
        const lesson = await loadLesson(sql, lessonId);
        const counts = await sql`SELECT (item.ordinal - 1)::int AS question_index,
          item.answer AS answer, COUNT(*)::int AS count
          FROM quiz_attempts AS attempt
          CROSS JOIN LATERAL jsonb_array_elements_text(attempt.answers) WITH ORDINALITY AS item(answer, ordinal)
          WHERE attempt.lesson_id = ${lessonId}
          AND (${className} = '' OR attempt.class_name = ${className})
          AND (${search} = '' OR position(lower(${search}) in lower(attempt.student_name)) > 0)
          AND COALESCE(jsonb_exists(${scope}::jsonb, upper(btrim(attempt.class_name))), true)
          GROUP BY item.ordinal, item.answer`;
        return json(response, 200, { questions: summarizeQuestionResponses(lesson, counts) });
      }
      if (params.get('stats') === '1') {
        const [row] = await sql`SELECT COUNT(*)::int AS total,
          COALESCE(ROUND(AVG(score), 1), 0) AS avg,
          COALESCE(MAX(score), 0) AS max,
          COUNT(*) FILTER (WHERE score >= ${EXCELLENT_SCORE})::int AS good_count
          FROM quiz_attempts WHERE lesson_id = ${lessonId}
          AND (${className} = '' OR class_name = ${className})
          AND (${search} = '' OR position(lower(${search}) in lower(student_name)) > 0)
          AND COALESCE(jsonb_exists(${scope}::jsonb, upper(btrim(class_name))), true)`;
        return json(response, 200, { stats: {
          total: row.total,
          avg: Number(row.avg),
          max: Number(row.max),
          goodRatio: row.total ? Math.round(row.good_count * 100 / row.total) : 0
        } });
      }
      const rows = await sql`SELECT id, lesson_id, student_name, class_name, correct_count, total_questions, score, time_taken_seconds, submitted_at
        FROM quiz_attempts WHERE lesson_id = ${lessonId}
        AND (${className} = '' OR class_name = ${className})
        AND (${search} = '' OR position(lower(${search}) in lower(student_name)) > 0)
        AND COALESCE(jsonb_exists(${scope}::jsonb, upper(btrim(class_name))), true)
        ORDER BY submitted_at DESC, id DESC LIMIT 100 OFFSET ${offset}`;
      return json(response, 200, { rows });
    }
    if (request.method === 'DELETE') {
      const id = String(request.body?.id || '');
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return json(response, 400, { error: 'INVALID_ID' });
      await sql`DELETE FROM quiz_attempts WHERE id = ${id}`;
      return json(response, 200, { ok: true });
    }
    return json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    if (error.message === 'DATABASE_NOT_CONFIGURED' || error.code === '42P01') return json(response, 503, { error: 'STORAGE_NOT_CONFIGURED' });
    if (error.message === 'LESSON_NOT_FOUND') return json(response, 404, { error: 'LESSON_NOT_FOUND' });
    console.error('Teacher API failed', error);
    return json(response, 500, { error: 'SERVER_ERROR' });
  }
}
}

function validMergeValue(value, maxLength) {
  return typeof value === 'string' && value.length <= maxLength && Boolean(value.trim());
}

async function loadRankingCatalog(sql) {
  const lessons = await listLessons(sql);
  const lessonIdsByGrade = { '3': [], '4': [], '5': [], all: [] };
  for (const { id, grade } of lessons) {
    lessonIdsByGrade.all.push(id);
    lessonIdsByGrade[grade]?.push(id);
  }
  const gradeTotals = Object.fromEntries(Object.entries(lessonIdsByGrade).map(([grade, lessons]) => [grade, lessons.length]));
  return { gradeTotals, lessonIdsByGrade };
}

export default createTeacherHandler();

