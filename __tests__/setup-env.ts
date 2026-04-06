// Set DATABASE_URL before any module (including db.ts) is imported.
// Jest's setupFiles run in the worker context before module evaluation.
process.env.DATABASE_URL = '/tmp/test-polymarket.db';
