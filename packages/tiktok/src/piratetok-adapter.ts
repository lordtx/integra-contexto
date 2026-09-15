import type { TikTokAdapter, TikTokAdapterConfig, TikTokAdapterEvents } from './index.js';
import type { NormalizedEvent } from '@integra/types';

type Listener = (event: NormalizedEvent) => void;

export class PirateTokAdapter implements TikTokAdapter {
  private _connected = false;
  private _config: TikTokAdapterConfig | null = null;
  private _listeners: Partial<TikTokAdapterEvents> = {};
  private _interval: ReturnType<typeof setInterval> | null = null;

  async connect(config: TikTokAdapterConfig): Promise<void> {
    if (this._connected) {
      throw new Error('TikTok adapter is already connected');
    }
    if (!config.sessionId.trim()) {
      throw new Error('A non-empty sessionId is required');
    }
    if (!config.roomId?.trim()) {
      throw new Error('A TikTok roomId is required');
    }

    this._config = config;
    this._connected = true;
    this._listeners.onConnected?.();

    this._interval = setInterval(() => {
      // Simula polling de eventos do TikTok via piratetok-live-js
      if (this._listeners.onEvent) {
        const mockEvent: NormalizedEvent = {
          type: 'chat',
          id: `mock-${Date.now()}`,
          platform: 'tiktok',
          roomId: config.roomId ?? 'default',
          userId: 'mock-user',
          username: 'mock_user',
          displayName: 'Mock User',
          message: 'Mensagem simulada',
          timestamp: new Date(),
        };
        this._listeners.onEvent(mockEvent);
      }
    }, config.pollIntervalMs ?? 5000);
  }

  async disconnect(): Promise<void> {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    this._connected = false;
    this._listeners.onDisconnected?.();
  }

  isConnected(): boolean {
    return this._connected;
  }

  on(events: Partial<TikTokAdapterEvents>): void {
    this._listeners = { ...this._listeners, ...events };
  }
}
