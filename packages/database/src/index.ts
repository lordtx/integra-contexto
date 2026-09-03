import knex, { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db: Knex | null = null;

export function getDb(): Knex {
  if (!db) {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL || 'postgres://integra:integra_secret@localhost:5432/integra_contexto',
      migrations: {
        directory: path.join(__dirname, 'migrations'),
        extension: 'sql',
        loadExtensions: ['.sql'],
      },
    });
  }
  return db;
}

export async function runMigrations(): Promise<void> {
  const knex = getDb();
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS knex_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      batch INTEGER NOT NULL,
      migration_time TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const migrationSql = await import('./migrations/001_initial.sql', { assert: { type: 'json' } });
  // Fallback: ler do filesystem
  const fs = await import('fs/promises');
  const sql = await fs.readFile(path.join(__dirname, 'migrations', '001_initial.sql'), 'utf-8');
  await knex.raw(sql);
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
  }
}