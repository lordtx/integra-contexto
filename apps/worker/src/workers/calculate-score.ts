import { Worker } from 'bullmq';
import { connection } from '../queues.js';

new Worker('calculate-score', async (job) => {
  console.log('Calculating score for:', job.data.guessId);
  return { score: Math.random() };
}, { connection, concurrency: 10 });

console.log('Score worker registered');