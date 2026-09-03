import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const createWordSchema = z.object({
  word: z.string().min(1),
  category: z.string().optional(),
  difficulty: z.number().int().min(1).max(10).optional(),
  hints: z.array(z.string()).optional(),
});

export async function wordRoutes(app: FastifyInstance) {
  // List words
  app.get('/', async (req: FastifyRequest, _rep: FastifyReply) => {
    const { category, difficulty } = req.query as Record<string, string>;
    let query = app.db('words').select('*');
    if (category) query = query.where({ category });
    if (difficulty) query = query.where({ difficulty: parseInt(difficulty, 10) });
    const words = await query.orderBy('created_at', 'desc');
    return { words };
  });

  // Get word by ID
  app.get('/:id', async (req: FastifyRequest, _rep: FastifyReply) => {
    const { id } = req.params as { id: string };
    const word = await app.db('words').where({ id }).first();
    if (!word) return _rep.status(404).send({ error: 'Word not found' });
    return { word };
  });

  // Create word
  app.post('/', async (req: FastifyRequest, _rep: FastifyReply) => {
    const parsed = createWordSchema.parse(req.body);
    const normalized = parsed.word
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    const [word] = await app.db('words')
      .insert({
        word: parsed.word,
        normalized,
        category: parsed.category ?? null,
        difficulty: parsed.difficulty ?? 1,
        hints: parsed.hints ?? [],
      })
      .returning('*');
    return { word };
  });
}