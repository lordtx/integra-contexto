import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { normalizeWord, LocalEmbedding } from '@integra/game-engine';

export async function wordRoutes(app: FastifyInstance): Promise<void> {
  app.get('/words/search', async (req) => {
    const { q } = z.object({ q: z.string().min(1) }).parse(req.query);
    const db = (app as any).db;
    return db('words').where('word', 'ilike', `%${q}%`).orWhere('normalized_word', 'ilike', `%${q}%`).limit(20);
  });

  app.post('/words', async (req, reply) => {
    const schema = z.object({ word: z.string().min(1).max(50), language: z.string().default('pt') });
    const body = schema.parse(req.body);
    const normalized = normalizeWord(body.word);
    if (!normalized) return reply.status(400).send({ error: 'Invalid word' });
    const db = (app as any).db;
    const existing = await db('words').where({ normalized_word: normalized, language: body.language }).first();
    if (existing) return reply.status(409).send({ error: 'Word already exists', word: existing });
    const emb = new LocalEmbedding();
    const vector = emb.generate(body.word);
    const padded = [...vector, ...new Array(668).fill(0)];
    const [word] = await db('words').insert({ word: body.word, normalized_word: normalized, language: body.language, embedding: `[${padded.join(',')}]` }).returning('*');
    return reply.status(201).send(word);
  });
}