import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function streamRoutes(app: FastifyInstance): Promise<void> {
  app.post('/streams', async (req, reply) => {
    const schema = z.object({ streamerId: z.string().uuid(), platformStreamId: z.string().optional() });
    const body = schema.parse(req.body);
    const db = (app as any).db;
    const [stream] = await db('streams').insert({ streamer_id: body.streamerId, platform_stream_id: body.platformStreamId || null, status: 'active' }).returning('*');
    return reply.status(201).send(stream);
  });

  app.post('/streams/:id/end', async (req, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const db = (app as any).db;
    const [stream] = await db('streams').where({ id }).update({ status: 'ended', ended_at: db.fn.now() }).returning('*');
    if (!stream) return reply.status(404).send({ error: 'Stream not found' });
    return stream;
  });

  app.get('/streams/active', async (req) => {
    const db = (app as any).db;
    return db('streams').where({ status: 'active' }).orderBy('started_at', 'desc').limit(1).first();
  });
}