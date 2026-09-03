// ============================================================
// PirateTok Adapter
// ============================================================

import { TikTokLiveClient, EventType } from 'piratetok-live-js';
import type {
  NormalizedChatEvent,
  NormalizedFollowEvent,
  NormalizedGiftEvent,
  Platform,
} from '@integra/types';
import type { TikTokAdapter, TikTokAdapterConfig, TikTokAdapterEvents } from './index.js';

const PLATFORM: Platform = 'tiktok';

export function createPirateTokAdapter(): TikTokAdapter {
  let client: TikTokLiveClient | null = null;
  let lastStreamId: string | null = null;

  return {
    platform: PLATFORM,

    async connect(config: TikTokAdapterConfig, handlers: TikTokAdapterEvents): Promise<void> {
      const { streamerUsername, language, region } = config;
      client = new TikTokLiveClient(streamerUsername);
      if (language) client.language(language);
      if (region) client.region(region);

      client.on(EventType.chat, (data) => {
        handlers.onChat({
          event: 'chat.message',
          platform: PLATFORM,
          streamId: lastStreamId || streamerUsername,
          user: {
            id: data.user?.uniqueId || data.user?.userId || 'unknown',
            username: data.user?.uniqueId || 'unknown',
            displayName: data.user?.nickname,
            avatarUrl: data.user?.profilePicture?.urls?.[0],
          },
          message: data.content || '',
          timestamp: Date.now(),
          metadata: { raw: data },
        });
      });

      client.on(EventType.follow, (data) => {
        handlers.onFollow({
          event: 'follow',
          platform: PLATFORM,
          streamId: lastStreamId || streamerUsername,
          user: {
            id: data.user?.uniqueId || 'unknown',
            username: data.user?.uniqueId || 'unknown',
            displayName: data.user?.nickname,
          },
          timestamp: Date.now(),
        });
      });

      client.on(EventType.gift, (data) => {
        handlers.onGift({
          event: 'gift',
          platform: PLATFORM,
          streamId: lastStreamId || streamerUsername,
          user: {
            id: data.user?.uniqueId || 'unknown',
            username: data.user?.uniqueId || 'unknown',
            displayName: data.user?.nickname,
          },
          giftName: data.gift?.name || 'unknown',
          diamondCount: data.gift?.diamondCount ?? 0,
          repeatCount: data.repeatCount ?? 1,
          timestamp: Date.now(),
        });
      });

      client.on('connected', () => handlers.onConnected());
      client.on('disconnected', () => handlers.onDisconnected());

      await client.connect();
    },

    async disconnect(): Promise<void> {
      if (client) { try { client.close(); } catch { /* ok */ } client = null; }
    },

    isConnected(): boolean {
      return client !== null;
    },
  };
}