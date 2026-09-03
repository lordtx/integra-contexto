// ============================================================
// Integra Contexto — Tipos Compartilhados (Event Contracts)
// ============================================================

export type Platform = 'tiktok' | 'youtube' | 'twitch' | 'instagram';

export interface PlatformUser {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface NormalizedChatEvent {
  event: 'chat.message';
  platform: Platform;
  streamId: string;
  user: PlatformUser;
  message: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface NormalizedFollowEvent {
  event: 'follow';
  platform: Platform;
  streamId: string;
  user: PlatformUser;
  timestamp: number;
}

export interface NormalizedGiftEvent {
  event: 'gift';
  platform: Platform;
  streamId: string;
  user: PlatformUser;
  giftName: string;
  diamondCount: number;
  repeatCount: number;
  timestamp: number;
}

export type NormalizedEvent = NormalizedChatEvent | NormalizedFollowEvent | NormalizedGiftEvent;

export type GameStatus = 'draft' | 'ready' | 'active' | 'paused' | 'finished';

export interface GameState {
  id: string;
  streamId: string;
  gameType: string;
  secretWordId: string;
  secretWord: string;
  status: GameStatus;
  startedAt?: number;
  finishedAt?: number;
}

export type RealtimeEventType =
  | 'game.started'
  | 'guess.created'
  | 'guess.rank_updated'
  | 'leaderboard.updated'
  | 'player.joined'
  | 'hint.created'
  | 'game.finished';

export interface RealtimeEvent {
  event: RealtimeEventType;
  gameId: string;
  [key: string]: unknown;
}