import type { NormalizedEvent } from '@integra/types';
import { PirateTokAdapter } from './piratetok-adapter.js';

export interface TikTokAdapterConfig {
  /**
   * Identificador da sessão local que está consumindo a LIVE. Não é um token
   * do TikTok e nunca deve ser exposto ao cliente web.
   */
  sessionId: string;
  /** Identificador/username da sala TikTok que será conectado. */
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
  return new PirateTokAdapter();
}

export { PirateTokAdapter } from './piratetok-adapter.js';
