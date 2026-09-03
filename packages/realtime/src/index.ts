import { WebSocketServer, WebSocket } from 'ws';
import { createServer, Server as HttpServer } from 'http';
import Redis from 'ioredis';
import { RealtimeEvent } from '@integra/types';

export class RealtimeGateway {
  private wss: WebSocketServer;
  private redis: Redis;
  private redisSub: Redis;
  private rooms: Map<string, Set<WebSocket>> = new Map();

  constructor(server?: HttpServer) {
    const httpServer = server ?? createServer();
    this.wss = new WebSocketServer({ server: httpServer });
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.redisSub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

    this.setupWebSocket();
    this.setupRedisPubSub();
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws) => {
      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'join' && msg.roomId) {
            this.joinRoom(ws, msg.roomId);
          } else if (msg.type === 'leave' && msg.roomId) {
            this.leaveRoom(ws, msg.roomId);
          }
        } catch {
          // ignore invalid messages
        }
      });

      ws.on('close', () => {
        this.removeFromAllRooms(ws);
      });
    });
  }

  private setupRedisPubSub(): void {
    this.redisSub.subscribe('game:events');
    this.redisSub.on('message', (_channel, message) => {
      try {
        const event: RealtimeEvent = JSON.parse(message);
        this.broadcastToRoom(event.payload['roomId'] || 'default', event);
      } catch {
        // ignore
      }
    });
  }

  private joinRoom(ws: WebSocket, roomId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(ws);
  }

  private leaveRoom(ws: WebSocket, roomId: string): void {
    this.rooms.get(roomId)?.delete(ws);
  }

  private removeFromAllRooms(ws: WebSocket): void {
    for (const [, clients] of this.rooms) {
      clients.delete(ws);
    }
  }

  private broadcastToRoom(roomId: string, event: RealtimeEvent): void {
    const clients = this.rooms.get(roomId);
    if (!clients) return;

    const message = JSON.stringify(event);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  async publish(event: RealtimeEvent): Promise<void> {
    await this.redis.publish('game:events', JSON.stringify(event));
  }

  getServer(): HttpServer {
    return this.wss.options.server as HttpServer;
  }

  async close(): Promise<void> {
    this.wss.close();
    this.redis.disconnect();
    this.redisSub.disconnect();
  }
}