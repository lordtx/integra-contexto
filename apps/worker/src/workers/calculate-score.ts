import { Queue, Worker, Job } from 'bullmq';
import { getDb } from '@integra/database';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export class CalculateScoreWorker {
  private queue: Queue;
  private worker: Worker | null = null;

  constructor(queue: Queue) {
    this.queue = queue;
  }

  start(): void {
    this.worker = new Worker(
      'calculate-score',
      async (job: Job) => {
        console.log(`[CalculateScore] Job ${job.id}: calculando pontuação`);
        const { gameId, userId, correctGuesses, score } = job.data;

        const db = getDb();

        // Atualiza ou insere no leaderboard
        await db('leaderboards')
          .insert({
            game_id: gameId,
            user_id: userId,
            score,
            rank: 0,
          })
          .onConflict(['game_id', 'user_id'])
          .merge();

        // Recalcula ranks
        const rankings = await db('leaderboards')
          .where({ game_id: gameId })
          .orderBy('score', 'desc');

        for (let i = 0; i < rankings.length; i++) {
          await db('leaderboards')
            .where({ id: rankings[i].id })
            .update({ rank: i + 1 });
        }
      },
      { connection: { url: REDIS_URL } }
    );

    this.worker.on('completed', (job) => {
      console.log(`[CalculateScore] Job ${job.id} concluído`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`[CalculateScore] Job ${job?.id} falhou:`, err);
    });
  }

  stop(): void {
    this.worker?.close();
  }
}