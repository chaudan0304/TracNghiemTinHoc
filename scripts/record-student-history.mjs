import { pathToFileURL } from 'node:url';
import { database } from '../lib/server.js';

export { installStudentHistory } from '../lib/student-history-schema.js';
import { installStudentHistory } from '../lib/student-history-schema.js';

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await installStudentHistory(database());
  console.log('Đã bật ghi lịch sử sửa thông tin học sinh.');
}
