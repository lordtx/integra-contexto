import { getDb, runMigrations } from '@integra/database';
import { ProcessChatWorker } from './workers/process-chat.js';
import { ProcessGuessWorker } from './workers/process-guess.js';
import { CalculateScoreWorker } from './workers/calculate-score.js';
import { BroadcastWorker } from './workers/broadcast-worker.js';
import { initializeQueues } from './queues.js';

async function main() {
  console.log('[Worker] Inicializando...');

  await runMigrations();

  const queues = await initializeQueues();

  const processChatWorker = new ProcessChatWorker(queues.processChat);
  const processGuessWorker = new ProcessGuessWorker(queues.processGuess);
  const calculateScoreWorker = new CalculateScoreWorker(queues.calculateScore);
  const broadcastWorker = new BroadcastWorker(queues.broadcast);

  processChatWorker.start();
  processGuessWorker.start();
  calculateScoreWorker.start();
  broadcastWorker.start();

  console.log('[Worker] Todos os workers estão rodando');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('[Worker] Encerrando...');
    processChatWorker.stop();
    processGuessWorker.stop();
    calculateScoreWorker.stop();
    broadcastWorker.stop();
    await getDb().destroy();
    process.exit(0);
  });
}

main().catch(console.error);