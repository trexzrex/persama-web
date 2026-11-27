import { readFile } from 'node:fs/promises';
import { Client } from 'pg';

const { DATABASE_URI } = process.env;
if (!DATABASE_URI || DATABASE_URI === '[SENSITIVE]') throw new Error('DATABASE_URI must be supplied for the intended database.');
const client = new Client({ connectionString: DATABASE_URI, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
try {
  await client.connect();
  const before = await client.query("SELECT count(*)::int AS total FROM public.pengurus");
  await client.query(await readFile(new URL('./induk-bagan-pembina.sql', import.meta.url), 'utf8'));
  const after = await client.query('SELECT count(*)::int AS total, count(induk_bagan_id)::int AS terhubung FROM public.pengurus');
  console.log('Pengurus sebelum:', before.rows[0].total, 'sesudah:', after.rows[0].total, 'terhubung:', after.rows[0].terhubung);
} catch (error) {
  console.error('Migrasi gagal:', error.code || error.name);
  process.exitCode = 1;
} finally {
  await client.end();
}
