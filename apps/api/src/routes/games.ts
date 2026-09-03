import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const createGameSchema = z.object({
  streamId: z.string().uuid(),
  maxRounds: z.number().int().positive().optional(),
});

export async function gameRoutes(app: FastifyInstance) {
  // List all games
  app.get('/', async (_req: FastifyRequest, _rep: FastifyReply) => {
    const games = await app.db('games').select('*').orderBy('created_at', 'desc');
    return { games };
  });

  // Get game by ID
  app.get('/:id', async (req: FastifyRequest, _rep: FastifyReply) => {
    const { id } = req.params as { id: string };
    const game = await app.db('games').where({ id }).first();
    if (!game) return _rep.status(404).send({ error: 'Game not found' });
    return { game };
  });

  // Create game
  app.post('/', async (req: FastifyRequest, _rep: FastifyReply) => {
    const parsed = createGameSchema.parse(req.body);
    const [game] = await app.db('games')
      .insert({
        stream_id: parsed.streamId,
        max_rounds: parsed.maxRounds ?? 10,
      })
      .returning('*');
    return { game };
  });

  // Update game status
  app.patch('/:id', async (req: FastifyRequest, _rep: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: string };
    const [game] = await app.db('games')
      .where({ id })
      .update({ status, ended_at: status === 'completed' ? new Date() : undefined })
      .returning('*');
    if (!game) return _rep.status(404).send({ error: 'Game not found' });
    return { game };
  });
}