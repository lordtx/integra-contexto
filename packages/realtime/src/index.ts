import { WebSocketServer, WebSocket } from 'ws';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || `redis://:${process.env.REDIS_PASSWORD || ''}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;
const WS_PORT = parseInt(process.env.WS_PORT || '3002');
const HEARTBEAT_INTERVAL = 30000;

export class RealtimeGateway {
  private wss!: WebSocketServer;
  private redis!: IORedis;
  private rooms = new Map<string, Set<WebSocket>>();
  private clientRooms = new Map<WebSocket, Set<string>>();
  private heartbeatTimer?: ReturnType<typeof setInterval>;

  async start(): Promise<void> {
    this.wss = new WebSocketServer({ port: WS_PORT });
    this.redis = new IORedis(REDIS_URL);

    await this.redis.subscribe('game:events');
    this.redis.on('message', (channel, message) => {
      if (channel === 'game:events') {
        try {
          const data = JSON.parse(message);
          this.broadcast(data.gameId || 'all', data);
        } catch { /* ignore parse errors */ }
      }
    });

    this.wss.on('connection', (ws) => {
      ws.on('message', (raw) => this.handleMessage(ws, raw.toString()));
      ws.on('close', () => this.removeClient(ws));
      ws.on('error', () => this.removeClient(ws));
      ws.send(JSON.stringify({ event: 'connected', message: 'Conectado ao Integra Contexto Gateway' }));
    });

    this.heartbeatTimer = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) ws.ping();
      });
    }, HEARTBEAT_INTERVAL);

    console.log(`Realtime Gateway rodando na porta ${WS_PORT}`);
  }

  private handleMessage(ws: WebSocket, raw: string): void {
    try {
      const msg = JSON.parse(raw);
      if (msg.type === 'subscribe' && msg.gameId) {
        if (!this.rooms.has(msg.gameId)) this.rooms.set(msg.gameId, new Set());
        this.rooms.get(msg.gameId)!.add(ws);
        if (!this.clientRooms.has(ws)) this.clientRooms.set(ws, new Set());
        this.clientRooms.get(ws)!.add(msg.gameId);
        ws.send(JSON.stringify({ event: 'subscribed', gameId: msg.gameId }));
      } else if (msg.type === 'unsubscribe' && msg.gameId) {
        this.rooms.get(msg.gameId)?.delete(ws);
        this.clientRooms.get(ws)?.delete(msg.gameId);
      }
    } catch { /* ignore */ }
  }

  private removeClient(ws: WebSocket): void {
    const rooms = this.clientRooms.get(ws);
    if (rooms) {
      for (const roomId of rooms) {
        this.rooms.get(roomId)?.delete(ws);
        if (this.rooms.get(roomId)?.size === 0) this.rooms.delete(roomId);
      }
    }
    this.clientRooms.delete(ws);
  }

  private broadcast(gameId: string, event: unknown): void {
    const clients = this.rooms.get(gameId);
    if (!clients) return;
    const msg = JSON.stringify(event);
    for (const ws of clients) {
      if (ws.readyState === WebSocket.OPEN) ws.send(msg);
    }
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.redis.publish(channel, message);
  }

  async stop(): Promise<void> {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.redis.unsubscribe();
    this.redis.quit();
    this.wss.close();
  }
}

// Auto-start quando executado diretamente
if (process.argv[1]?.endsWith('index.js') || process.argv[1]?.endsWith('index.ts')) {
  const gateway = new RealtimeGateway();
  gateway.start().catch(console.error);
  process.on('SIGTERM', () => gateway.stop());
  process.on('SIGINT', () => gateway.stop());
}