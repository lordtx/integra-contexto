import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { getDb, runMigrations, closeDb } from '@integra/database';

async function databasePlugin(app: FastifyInstance): Promise<void> {
  const db = getDb();
  await runMigrations();
  app.decorate('db', db);
  app.addHook('onClose', async () => { await closeDb(); });
}

export default fp(databasePlugin);