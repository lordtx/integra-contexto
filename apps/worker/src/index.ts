import './workers/process-chat.js';
import './workers/process-guess.js';
import './workers/calculate-score.js';
import './workers/broadcast-worker.js';
import { connection } from './queues.js';

console.log('Workers ready');
process.on('SIGTERM', () => { connection.quit(); process.exit(0); });
process.on('SIGINT', () => { connection.quit(); process.exit(0); });