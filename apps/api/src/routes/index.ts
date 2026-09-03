import type { FastifyInstance } from 'fastify';
import { gameRoutes } from './games.js';
import { streamRoutes } from './streams.js';
import { wordRoutes } from './words.js';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(gameRoutes, { prefix: '/api' });
  await app.register(streamRoutes, { prefix: '/api' });
  await app.register(wordRoutes, { prefix: '/api' });
}