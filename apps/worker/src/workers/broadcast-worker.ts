import { Worker } from 'bullmq';
import { connection } from '../queues.js';

new Worker('broadcast-events', async (job) => {
  const msg = JSON.stringify(job.data);
  await connection.publish('game:events', msg);
}, { connection, concurrency: 20 });

console.log('Broadcast worker registered');