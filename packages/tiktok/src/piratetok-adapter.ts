import { TikTokAdapter, TikTokAdapterConfig, TikTokAdapterEvents } from './index.js';
import { NormalizedEvent } from '@integra/types';

type Listener = (event: NormalizedEvent) => void;

export class PirateTokAdapter implements TikTokAdapter {
  private _connected = false;
  private _config: TikTokAdapterConfig | null = null;
  private _listeners: Partial<TikTokAdapterEvents> = {};
  private _interval: ReturnType<typeof setInterval> | null = null;

  async connect(config: TikTokAdapterConfig): Promise<void> {
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