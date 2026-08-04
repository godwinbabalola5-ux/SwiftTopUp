const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../config/db');

test('db.query should support callback-based usage', async (t) => {
  t.timeout(5000);

  await new Promise((resolve, reject) => {
    db.query('SELECT 1 AS value', [], (err, rows) => {
      try {
        assert.ifError(err);
        assert.ok(Array.isArray(rows));
        assert.equal(rows[0].value, 1);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
});
