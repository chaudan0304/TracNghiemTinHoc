const origin = 'https://trac-nghiem-tin-hoc-chau-dan.vercel.app';
const password = process.env.ADMIN_PASSWORD || process.env.TEACHER_PASSWORD;
if (!password) throw new Error('Admin password is unavailable in the local environment.');
const login = await fetch(origin + '/api/teacher', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'login', username: 'admin', password })
});
const identity = await login.json();
if (!login.ok || identity.teacher?.role !== 'admin') throw new Error('Production admin verification failed with status ' + login.status);
const cookie = login.headers.get('set-cookie')?.split(';')[0];
if (!cookie) throw new Error('No production session returned.');
console.log(JSON.stringify({ authenticated: true, role: identity.teacher.role }));
try {
  if (process.argv.includes('--migrate')) {
    const result = await fetch(origin + '/api/teacher', {
      method: 'POST', headers: { 'Content-Type': 'application/json', cookie },
      body: JSON.stringify({ action: 'migrate-schools' })
    });
    if (!result.ok) throw new Error('Production school migration failed with status ' + result.status);
    const summary = await result.json();
    console.log(JSON.stringify({ migration: summary }));
  }
  const schools = await fetch(origin + '/api/teacher?type=schools', { headers: { cookie } });
  if (process.argv.includes('--migrate')) {
    if (!schools.ok) throw new Error('Production school listing failed.');
    const catalog = await schools.json();
    const legacy = catalog.schools.find(school => school.id === 'quynh-loc');
    if (!legacy) throw new Error('Missing default school.');
    const accounts = await fetch(origin + '/api/teacher?type=accounts', { headers: { cookie } });
    if (!accounts.ok) throw new Error('Production account listing failed.');
    const records = await accounts.json();
    if (!records.accounts.every(account => account.schoolId === 'quynh-loc')) throw new Error('Review existing account school assignments.');
    const classes = await fetch(origin + '/api/teacher?type=ranking&schoolId=quynh-loc', { headers: { cookie } });
    if (!classes.ok) throw new Error('Production school ranking failed.');
    console.log(JSON.stringify({ school: legacy.name, teacherAccounts: records.accounts.length, rankingHttp: classes.status }));
  } else console.log(JSON.stringify({ schoolsHttpBeforeDeployment: schools.status }));
} finally {
  await fetch(origin + '/api/teacher', {
    method: 'POST', headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify({ action: 'logout' })
  });
}
