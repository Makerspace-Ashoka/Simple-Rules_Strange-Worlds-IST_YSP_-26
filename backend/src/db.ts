import fs from 'node:fs';
import path from 'node:path';
import { Pool, type QueryResultRow } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to start the backend.');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

function resolveSchemaPath() {
  const candidates = [
    path.resolve(__dirname, 'schema.sql'),
    path.resolve(__dirname, '../src/schema.sql'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Could not locate backend/src/schema.sql.');
}

let initPromise: Promise<void> | null = null;

export async function initDatabase() {
  if (!initPromise) {
    initPromise = (async () => {
      const schema = fs.readFileSync(resolveSchemaPath(), 'utf8');
      await pool.query(schema);
    })();
  }

  return initPromise;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return pool.query<T>(text, params);
}

export async function closeDatabase() {
  await pool.end();
}
