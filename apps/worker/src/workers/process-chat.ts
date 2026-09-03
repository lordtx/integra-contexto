import { Worker } from 'bullmq';
import { connection } from '../queues.js';
import { normalizeWord } from '@integra/game-engine';

const CHAT_RATE_LIMIT = 5;
const CHAT_RATE_WINDOW = 10000;

export const chatWorker = new Worker('tiktok-events', async (job) => {
  const { event, user, message, streamId } = job.data;
  if (event !== 'chat.message') return;
  const normalized = normalizeWord(message);
  if (!normalized || normalized.startsWith('!')) return;
  const redis = connection;
  const ratelimitKey = `ratelimit:chat:${user.id}`;
  const count = await redis.incr(ratelimitKey);
  if (count === 1) await redis.pexpire(ratelimitKey, CHAT_RATE_WINDOW);
  if (count > CHAT_RATE_LIMIT) return;
  const dedupKey = `dedup:guess:${streamId}:${normalized}`;
  const deduped = await redis.set(dedupKey, '1', 'EX', 300, 'NX');
  if (!deduped) return;
  await job.updateProgress(50);
  return { gameId: streamId, userId: user.id, username: user.username, word: message, normalizedWord: normalized, timestamp: Date.now() };
}, { connection, concurrency: 10 });

console.log('Chat worker registered');