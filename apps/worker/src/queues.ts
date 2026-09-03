import IORedis from 'ioredis';
import { Queue, Worker } from 'bullmq';
import type { NormalizedEvent } from '@integra/types';

const REDIS_URL = process.env.REDIS_URL || `redis://:${process.env.REDIS_PASSWORD || ''}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;
export const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

export const queues = {
  tiktokEvents: new Queue<NormalizedEvent>('tiktok-events', { connection }),
  processGuesses: new Queue<{ gameId: string; userId: string; username?: string; word: string; normalizedWord: string; timestamp: number }>('process-guesses', { connection }),
  calculateScore: new Queue<{ guessId: string; gameId: string; word: string; normalizedWord: string; secretWord: string; userId: string }>('calculate-score', { connection }),
  broadcastEvents: new Queue<{ event: string; gameId: string; data: unknown }>('broadcast-events', { connection }),
};