import test from 'node:test';
import assert from 'node:assert/strict';
import { csvCell } from '../lib/csv.js';

test('CSV cells escape quotes and prevent spreadsheet formulas', () => {
  assert.equal(csvCell('An, Bình'), '"An, Bình"');
  assert.equal(csvCell('A"B'), '"A""B"');
  for (const prefix of ['=', '+', '-', '@', '\t', '\r', '\n']) {
    assert.equal(csvCell(prefix + 'SUM(1)'), `"'${prefix}SUM(1)"`);
  }
});
