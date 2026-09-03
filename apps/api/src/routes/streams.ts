import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const createStreamSchema = z.object({
  platform: z.string().min(1),
  platformStreamId: z.string().optional(),
  title: z.string().optional(),
});

export async function streamRoutes(app: FastifyInstance) {
  // List all streams
  app.get('/', async (_req: FastifyRequest, _rep: FastifyReply) => {
    const streams = await app.db('streams').select('*').orderBy('started_at', 'desc');
    return { streams };
  });

  // Get stream by ID
  app.get('/:id', async (req: FastifyRequest, _rep: FastifyReply) => {
    const { id } = req.params as { id: string };
    const stream = await app.db('streams').where({ id }).first();
    if (!stream) return _rep.status(404).send({ error: 'Stream not found' });
    return { stream };
  });

  // Create stream
  app.post('/', async (req: FastifyRequest, _rep: FastifyReply) => {
    const parsed = createStreamSchema.parse(req.body);
    const [stream] = await app.db('streams')
      .insert({
        platform: parsed.platform,
        platform_stream_id: parsed.platformStreamId,
        title: parsed.title,
      })
      .returning('*');
    return { stream };
  });

  // End stream (set ended_at)
  app.patch('/:id/end', async (req: FastifyRequest, _rep: FastifyReply) => {
    const { id } = req.params as { id: string };
    const [stream] = await app.db('streams')
      .where({ id })
      .update({ ended_at: new Date(), status: 'ended' })
      .returning('*');
    if (!stream) return _rep.status(404).send({ error: 'Stream not found' });
    return { stream };
  });
}