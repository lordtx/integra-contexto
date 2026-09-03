import { Queue, Worker, Job } from 'bullmq';
import { getDb } from '@integra/database';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export class ProcessGuessWorker {
  private queue: Queue;
  private worker: Worker | null = null;

  constructor(queue: Queue) {
    this.queue = queue;
  }

  start(): void {
    this.worker = new Worker(
      'process-guess',
      async (job: Job) => {
        console.log(`[ProcessGuess] Job ${job.id}: processando palpite`);
        const { gameId, userId, guessText, similarity } = job.data;

        const db = getDb();
        // Registra o palpite no banco
        await db('guesses').insert({
          game_id: gameId,
          user_id: userId,
          guess_text: guessText,
          similarity_score: similarity,
          is_correct: similarity > 0.85,
        });
      },
      { connection: { url: REDIS_URL } }
    );

    this.worker.on('completed', (job) => {
      console.log(`[ProcessGuess] Job ${job.id} concluído`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`[ProcessGuess] Job ${job?.id} falhou:`, err);
    });
  }

  stop(): void {
    this.worker?.close();
  }
}