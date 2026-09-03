export type Platform = 'tiktok' | 'youtube' | 'twitch' | 'custom';

export interface PlatformUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  platform: Platform;
  platformUserId: string;
}

export interface NormalizedChatEvent {
  type: 'chat';
  id: string;
  platform: Platform;
  roomId: string;
  userId: string;
  username: string;
  displayName: string;
  message: string;
  timestamp: Date;
  raw?: unknown;
}

export interface NormalizedFollowEvent {
  type: 'follow';
  id: string;
  platform: Platform;
  roomId: string;
  userId: string;
  username: string;
  displayName: string;
  timestamp: Date;
  raw?: unknown;
}

export interface NormalizedGiftEvent {
  type: 'gift';
  id: string;
  platform: Platform;
  roomId: string;
  userId: string;
  username: string;
  displayName: string;
  giftName: string;
  giftAmount: number;
  timestamp: Date;
  raw?: unknown;
}

export type NormalizedEvent = NormalizedChatEvent | NormalizedFollowEvent | NormalizedGiftEvent;

export type GameStatus = 'waiting' | 'active' | 'completed' | 'cancelled';

export interface GameState {
  id: string;
  streamId: string;
  status: GameStatus;
  currentWord: string;
  hints: string[];
  scores: Record<string, number>;
  round: number;
  maxRounds: number;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

export type RealtimeEventType = 'game:update' | 'game:end' | 'chat:new' | 'score:update' | 'leaderboard:update';

export interface RealtimeEvent {
  type: RealtimeEventType;
  payload: unknown;
  timestamp: Date;
}