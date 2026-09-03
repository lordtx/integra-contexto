// ============================================================
// Integra Contexto — Database Connection Manager
// ============================================================
import knex, { Knex } from 'knex';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db: Knex | null = null;

export function loadDbConfig(): Knex.Config {
  return {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'integra_contexto',
      user: process.env.POSTGRES_USER || 'integra_user',
      password: process.env.POSTGRES_PASSWORD || 'integra_pass',
    },
    pool: {
      min: parseInt(process.env.POSTGRES_POOL_MIN || '2'),
      max: parseInt(process.env.POSTGRES_POOL_MAX || '10'),
      idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '30000'),
    },
  };
}

export function getDb(): Knex {
  if (!db) {
    db = knex(loadDbConfig());
  }
  return db;
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
  }
}

export async function runMigrations(): Promise<void> {
  const db = getDb();
  const migrationsDir = path.resolve(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const tableName = `knex_migrations_${path.parse(file).name}`;
    const exists = await db.schema.hasTable(tableName);
    if (!exists) {
      await db.raw(sql);
      await db.schema.createTable(tableName, (t) => t.string('id').primary());
      console.log(`Migration applied: ${file}`);
    }
  }
}

export { knex };