import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

export function database() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_NOT_CONFIGURED');
  return neon(url);
}

export async function ensureTable(sql) {
  await sql`CREATE TABLE IF NOT EXISTS quiz_attempts (
    id uuid PRIMARY KEY,
    lesson_id text NOT NULL,
    student_name text NOT NULL,
    class_name text NOT NULL,
    answers jsonb NOT NULL,
    correct_count integer NOT NULL,
    total_questions integer NOT NULL,
    score numeric(5,2) NOT NULL,
    submitted_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS quiz_attempts_lesson_time ON quiz_attempts (lesson_id, submitted_at DESC)`;
  await sql`CREATE TABLE IF NOT EXISTS teacher_login_limits (
    client_key text PRIMARY KEY,
    failures integer NOT NULL DEFAULT 0,
    window_start timestamptz NOT NULL DEFAULT now(),
    blocked_until timestamptz NOT NULL DEFAULT 'epoch'
  )`;
  await sql`CREATE TABLE IF NOT EXISTS submission_limits (
    client_key text PRIMARY KEY,
    attempts integer NOT NULL DEFAULT 0,
    window_start timestamptz NOT NULL DEFAULT now()
  )`;
}

export async function loadLesson(id) {
  if (!/^[a-z0-9-]{1,64}$/.test(id || '')) throw new Error('INVALID_LESSON');
  const lesson = JSON.parse(await readFile(join(process.cwd(), 'lessons', `${id}.json`), 'utf8'));
  if (lesson.id !== id || !Array.isArray(lesson.questions)) throw new Error('INVALID_LESSON');
  return lesson;
}

export function grade(lesson, answers) {
  if (!Array.isArray(answers) || answers.length > lesson.questions.length) throw new Error('INVALID_ANSWERS');
  let correctCount = 0;
  for (let i = 0; i < lesson.questions.length; i++) {
    const answer = answers[i];
    if (answer !== null && answer !== undefined && (!Number.isInteger(answer) || answer < 0 || answer >= lesson.questions[i].options.length)) throw new Error('INVALID_ANSWERS');
    if (answer === lesson.questions[i].correctIndex) correctCount++;
  }
  return { correctCount, totalQuestions: lesson.questions.length, score: Number((correctCount * lesson.pointsPerQuestion).toFixed(2)) };
}

export function equalSecret(left, right) {
  if (!left || !right) return false;
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionToken(secret, expires) {
  const payload = String(expires);
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function loginClientKey(request, secret) {
  const headers = request.headers || {};
  const address = String(headers['x-vercel-forwarded-for'] || headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  return createHash('sha256').update(secret).update(':').update(address).digest('hex');
}

export function isTeacher(request) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  const match = /(?:^|;\s*)teacher_session=([^;]+)/.exec(request.headers.cookie || '');
  if (!match) return false;
  const [expires, signature] = match[1].split('.');
  return Number(expires) > Date.now() && equalSecret(sessionToken(secret, expires), match[1]);
}

export function json(response, status, body) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(status).json(body);
}
