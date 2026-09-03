import { Worker } from 'bullmq';
import { connection, queues } from '../queues.js';
import { getDb } from '@integra/database';
import { SemanticEngine, RankingEngine, normalizeWord } from '@integra/game-engine';

export const guessWorker = new Worker('process-guesses', async (job) => {
  const { gameId, userId, username, word, normalizedWord, timestamp } = job.data;
  const db = getDb();
  const semantic = new SemanticEngine();
  const ranking = new RankingEngine();
  let wordRow = await db('words').where({ normalized_word: normalizedWord, language: 'pt' }).first();
  if (!wordRow) {
    const embedding = new Array(768).fill(0);
    [wordRow] = await db('words').insert({ word, normalized_word: normalizedWord, language: 'pt', embedding: `[${embedding.join(',')}]` }).returning('*');
  }
  const game = await db('games').where({ id: gameId }).first();
  if (!game || game.status !== 'active') return;
  const secret = await db('words').where({ id: game.secret_word_id }).first();
  if (!secret) return;
  const guess = await db('guesses').insert({ game_id: gameId, user_id: userId, word_id: wordRow.id, original_word: word, normalized_word: normalizedWord, score: 0, rank: 0 }).returning('*');
  const fromDB = await db('guesses').where({ game_id: gameId }).orderBy('created_at');
  for (const g of fromDB) {
    const w = await db('words').where({ id: g.word_id }).first();
    if (w) ranking.addGuess(w.id, w.word, w.normalized_word, w.normalized_word === secret.normalized_word ? 1 : Math.random() * 0.3, g.user_id);
  }
  const leaderboard = ranking.getLeaderboard();
  for (const entry of leaderboard) {
    await db('leaderboards').insert({ game_id: gameId, user_id: entry.userId, best_rank: entry.rank, score: entry.score }).onConflict(['game_id', 'user_id']).merge();
  }
  const hit = leaderboard.find(l => l.normalized === secret.normalized_word);
  if (hit) {
    await db('games').where({ id: gameId }).update({ status: 'finished', finished_at: db.fn.now() });
  }
  await queues.broadcastEvents.add('leaderboard', { event: 'leaderboard.updated', gameId, data: { leaderboard: leaderboard.slice(0, 10), hit: !!hit } });
  return { guessId: guess[0].id, rank: leaderboard.find(l => l.wordId === wordRow.id)?.rank };
}, { connection, concurrency: 5 });

console.log('Guess worker registered');