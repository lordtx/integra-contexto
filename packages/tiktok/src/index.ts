// ============================================================
// TikTok Adapter — Interface Abstrata
// ============================================================

import type {
  Platform,
  NormalizedChatEvent,
  NormalizedFollowEvent,
  NormalizedGiftEvent,
} from '@integra/types';

export interface TikTokAdapterConfig {
  streamerUsername: string;
  language?: string;
  region?: string;
}

export interface TikTokAdapterEvents {
  onChat: (event: NormalizedChatEvent) => void;
  onFollow: (event: NormalizedFollowEvent) => void;
  onGift: (event: NormalizedGiftEvent) => void;
  onError: (error: Error) => void;
  onConnected: () => void;
  onDisconnected: () => void;
}

export interface TikTokAdapter {
  readonly platform: Platform;
  connect(config: TikTokAdapterConfig, handlers: TikTokAdapterEvents): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

export { createPirateTokAdapter } from './piratetok-adapter.js';