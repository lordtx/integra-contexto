// ============================================================
// Integra Contexto — API Principal (Fastify)
// ============================================================

import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });

app.get('/health', async () => ({
  status: 'ok',
  service: 'integra-contexto-api',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
}));

app.get('/status', async () => ({
  adapter: { type: 'piratetok', connected: false },
  game: { active: null },
}));

const PORT = parseInt(process.env.API_PORT || '3001', 10);
const HOST = process.env.API_HOST || '0.0.0.0';

try {
  await app.listen({ port: PORT, host: HOST });
  console.log(`🚀 API rodando em http://${HOST}:${PORT}`);
} catch (err) {
  console.error('❌ Erro ao iniciar API:', err);
  process.exit(1);
}