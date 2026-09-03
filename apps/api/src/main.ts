import Fastify from 'fastify';
import cors from '@fastify/cors';
import databasePlugin from './plugins/database.js';
import { registerRoutes } from './routes/index.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });
await app.register(databasePlugin);
await registerRoutes(app);

app.get('/health', async () => ({
  status: 'ok',
  service: 'integra-contexto-api',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
}));

app.get('/status', async () => {
  const db = (app as any).db;
  const games = await db('games').count('* as total');
  const words = await db('words').count('* as total');
  return { database: { games: games[0]?.total, words: words[0]?.total }, uptime: process.uptime() };
});

const PORT = parseInt(process.env.API_PORT || '3001', 10);
const HOST = process.env.API_HOST || '0.0.0.0';

try {
  await app.listen({ port: PORT, host: HOST });
  console.log(`API rodando em http://${HOST}:${PORT}`);
} catch (err) {
  console.error('Erro ao iniciar API:', err);
  process.exit(1);
}