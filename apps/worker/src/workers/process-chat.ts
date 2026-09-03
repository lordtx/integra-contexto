import { Queue, Worker, Job } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export class ProcessChatWorker {
  private queue: Queue;
  private worker: Worker | null = null;

  constructor(queue: Queue) {
    this.queue = queue;
  }

  start(): void {
    this.worker = new Worker(
      'process-chat',
      async (job: Job) => {
        console.log(`[ProcessChat] Job ${job.id}: processando mensagem`);
        const { userId, username, message, roomId, platform } = job.data;
        // Lógica de processamento de chat
        console.log(`[ProcessChat] ${username}: ${message} (${platform})`);
      },
      { connection: { url: REDIS_URL } }
    );

    this.worker.on('completed', (job) => {
      console.log(`[ProcessChat] Job ${job.id} concluído`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`[ProcessChat] Job ${job?.id} falhou:`, err);
    });
  }

  stop(): void {
    this.worker?.close();
  }
}