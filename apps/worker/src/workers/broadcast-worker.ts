import { Queue, Worker, Job } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export class BroadcastWorker {
  private queue: Queue;
  private worker: Worker | null = null;

  constructor(queue: Queue) {
    this.queue = queue;
  }

  start(): void {
    this.worker = new Worker(
      'broadcast',
      async (job: Job) => {
        console.log(`[Broadcast] Job ${job.id}: transmitindo evento`);
        const { eventType, payload, roomId } = job.data;
        // Publica no Redis para o RealtimeGateway distribuir via WebSocket
        console.log(`[Broadcast] ${eventType} para sala ${roomId}`);
      },
      { connection: { url: REDIS_URL } }
    );

    this.worker.on('completed', (job) => {
      console.log(`[Broadcast] Job ${job.id} concluído`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`[Broadcast] Job ${job?.id} falhou:`, err);
    });
  }

  stop(): void {
    this.worker?.close();
  }
}