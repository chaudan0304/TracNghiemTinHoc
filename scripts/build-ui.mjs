import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
await mkdir('assets', { recursive: true });
for (const page of ['index', 'quiz', 'teacher']) {
  await build({
    entryPoints: [`ui/${page}.js`],
    bundle: true,
    format: 'iife',
    target: ['chrome63', 'safari11'],
    outfile: `assets/${page}.js`,
    minify: true
  });
}
await build({
  entryPoints: ['ui/report-export.js'],
  bundle: true,
  format: 'iife',
  globalName: 'QuizReportExport',
  target: 'es2020',
  outfile: 'assets/report-export.js',
  minify: true
});
execFileSync(process.execPath, [
  require.resolve('tailwindcss/lib/cli.js'), '-i', 'ui/quiz.css',
  '--content', 'quiz.html,ui/quiz.js', '-o', 'assets/quiz.css', '--minify'
], { stdio: 'inherit' });
