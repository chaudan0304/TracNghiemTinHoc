import assert from 'node:assert/strict';
import test from 'node:test';
import ExcelJS from 'exceljs';
import { createReportFile } from '../ui/report-export.js';

const report = {
  title: 'Kết quả luyện tập',
  scope: 'Lớp 5A1',
  rows: [
    ['STT', 'Họ và tên', 'Điểm', 'Tiến độ (%)'],
    [1, '=Nguyễn Thị Ánh', 9.5, '75%']
  ]
};

test('Excel preserves numeric scores and percentages, and exports names as text', async () => {
  const file = await createReportFile('xlsx', report);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const sheet = workbook.worksheets[0];
  assert.equal(sheet.getCell('B5').value, '=Nguyễn Thị Ánh');
  assert.equal(sheet.getCell('C5').value, 9.5);
  assert.equal(sheet.getCell('D5').value, 0.75);
  assert.equal(sheet.getCell('D5').numFmt, '0%');
  assert.equal(sheet.views[0].ySplit, 4);
});

test('Word and PDF produce native files for empty and populated reports', async () => {
  for (const rows of [report.rows, report.rows.slice(0, 1)]) {
    for (const [format, signature] of [['docx', 'PK'], ['pdf', '%PDF-']]) {
      const file = await createReportFile(format, { ...report, rows });
      assert.equal(await file.slice(0, signature.length).text(), signature);
    }
  }
});
