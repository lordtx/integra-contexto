import knex, { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db: Knex | null = null;

export function getDb(): Knex {
  if (!db) {
    const host = process.env.POSTGRES_HOST || 'localhost';
    const port = process.env.POSTGRES_PORT || '5432';
    const user = process.env.POSTGRES_USER || 'integra';
    const pass = process.env.POSTGRES_PASSWORD || '';
    const database = process.env.POSTGRES_DB || 'integra_contexto';
    db = knex({
      client: 'pg',
      connection: {
        host,
        port: parseInt(port, 10),
        user,
        password: pass,
        database,
      },
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
  const exists = await knex.schema.hasTable('knex_migrations');
  if (!exists) {
    await knex.schema.createTable('knex_migrations', (t) => {
      t.increments('id');
      t.string('name');
      t.integer('batch');
      t.timestamp('migration_time').defaultTo(knex.fn.now());
    });
  }
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