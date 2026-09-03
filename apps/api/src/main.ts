import Fastify from 'fastify';
import cors from '@fastify/cors';
import { databasePlugin } from './plugins/database.js';
import { gameRoutes } from './routes/games.js';
import { streamRoutes } from './routes/streams.js';
import { wordRoutes } from './routes/words.js';

const app = Fastify({ logger: true });

async function main() {
  await app.register(cors);
  await app.register(databasePlugin);

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Status
  app.get('/status', async () => ({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '0.1.0',
  }));

  // Rotas
  await app.register(gameRoutes, { prefix: '/api/games' });
  await app.register(streamRoutes, { prefix: '/api/streams' });
  await app.register(wordRoutes, { prefix: '/api/words' });

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`API rodando na porta ${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export default app;