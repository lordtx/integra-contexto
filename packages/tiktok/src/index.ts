import { NormalizedEvent } from '@integra/types';

export interface TikTokAdapterConfig {
  sessionId: string;
  roomId?: string;
  pollIntervalMs?: number;
}

export interface TikTokAdapterEvents {
  onEvent: (event: NormalizedEvent) => void;
  onError: (error: Error) => void;
  onConnected: () => void;
  onDisconnected: () => void;
}

export interface TikTokAdapter {
  connect(config: TikTokAdapterConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  on(events: Partial<TikTokAdapterEvents>): void;
}

export function createPirateTokAdapter(): TikTokAdapter {
  const { PirateTokAdapter } = require('./piratetok-adapter');
  return new PirateTokAdapter();
}

export { PirateTokAdapter } from './piratetok-adapter';