import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { getDb, runMigrations } from '@integra/database';

export const databasePlugin = fp(async (app: FastifyInstance) => {
  const db = getDb();
  await runMigrations();

  app.decorate('db', db);
  app.addHook('onClose', async () => {
    await db.destroy();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof getDb>;
  }
}