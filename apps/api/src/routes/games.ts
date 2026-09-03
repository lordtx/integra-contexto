import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { GameManager, HintEngine, WordManager, normalizeWord } from '@integra/game-engine';

export async function gameRoutes(app: FastifyInstance): Promise<void> {
  const gm = new GameManager();
  const hint = new HintEngine();

  app.get('/games', async (req) => {
    const db = (app as any).db;
    return db('games').orderBy('created_at', 'desc').limit(50);
  });

  app.post('/games', async (req, reply) => {
    const schema = z.object({ streamId: z.string().uuid(), secretWord: z.string().min(2), secretWordId: z.string().uuid() });
    const body = schema.parse(req.body);
    const state = gm.createGame(body.streamId, body.secretWord, body.secretWordId);
    const db = (app as any).db;
    const [game] = await db('games').insert({
      id: state.id, stream_id: body.streamId, game_type: 'context', secret_word_id: body.secretWordId,
      status: state.status, created_at: db.fn.now(),
    }).returning('*');
    return reply.status(201).send(game);
  });

  app.get('/games/:id', async (req, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const db = (app as any).db;
    const game = await db('games').where({ id }).first();
    if (!game) return reply.status(404).send({ error: 'Game not found' });
    return game;
  });

  app.post('/games/:id/start', async (req, reply) => updateGameStatus(req, reply, app, 'startGame');
  app.post('/games/:id/pause', async (req, reply) => updateGameStatus(req, reply, app, 'pauseGame');
  app.post('/games/:id/resume', async (req, reply) => updateGameStatus(req, reply, app, 'resumeGame');
  app.post('/games/:id/finish', async (req, reply) => updateGameStatus(req, reply, app, 'finishGame');

  app.post('/games/:id/hint', async (req, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const db = (app as any).db;
    const game = await db('games').where({ id }).first();
    if (!game) return reply.status(404).send({ error: 'Game not found' });
    const secret = await db('words').where({ id: game.secret_word_id }).first();
    const h = hint.generateHint(secret?.word || '');
    await db('game_events').insert({ game_id: id, event_type: 'hint', payload: JSON.stringify({ hint: h }) });
    return { hint: h, hints_used: hint.getHintsUsed() };
  });

  app.get('/games/:id/leaderboard', async (req, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const db = (app as any).db;
    return db('leaderboards').where({ game_id: id }).orderBy('best_rank').orderBy('score', 'desc').limit(20);
  });

  async function updateGameStatus(req: any, reply: any, app: any, method: string) {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const db = (app as any).db;
    const game = await db('games').where({ id }).first();
    if (!game) return reply.status(404).send({ error: 'Game not found' });
    try {
      gm.createGame(game.stream_id, '', game.secret_word_id);
      const updated = (gm as any)[method]();
      await db('games').where({ id }).update({ status: updated.status, started_at: updated.startedAt ? new Date(updated.startedAt) : undefined, finished_at: updated.finishedAt ? new Date(updated.finishedAt) : undefined });
      await db('game_events').insert({ game_id: id, event_type: `game.${method.replace('Game', '').toLowerCase()}`, payload: JSON.stringify({ status: updated.status }) });
      return { ...game, status: updated.status };
    } catch (e: any) {
      return reply.status(409).send({ error: e.message });
    }
  }
}