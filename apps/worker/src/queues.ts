import { Queue, QueueEvents } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export interface AppQueues {
  processChat: Queue;
  processGuess: Queue;
  calculateScore: Queue;
  broadcast: Queue;
  events: {
    processChat: QueueEvents;
    processGuess: QueueEvents;
    calculateScore: QueueEvents;
    broadcast: QueueEvents;
  };
}

export async function initializeQueues(): Promise<AppQueues> {
  const connection = { url: REDIS_URL };

  const processChat = new Queue('process-chat', { connection });
  const processGuess = new Queue('process-guess', { connection });
  const calculateScore = new Queue('calculate-score', { connection });
  const broadcast = new Queue('broadcast', { connection });

  const processChatEvents = new QueueEvents('process-chat', { connection });
  const processGuessEvents = new QueueEvents('process-guess', { connection });
  const calculateScoreEvents = new QueueEvents('calculate-score', { connection });
  const broadcastEvents = new QueueEvents('broadcast', { connection });

  return {
    processChat,
    processGuess,
    calculateScore,
    broadcast,
    events: {
      processChat: processChatEvents,
      processGuess: processGuessEvents,
      calculateScore: calculateScoreEvents,
      broadcast: broadcastEvents,
    },
  };
}