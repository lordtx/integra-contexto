import type { GameStatus } from '@integra/types';

export interface GameState {
  id: string; streamId: string; secretWord: string; secretWordId: string;
  status: GameStatus; startedAt: number | null; finishedAt: number | null; round: number;
}

const VALID_TRANSITIONS: Record<string, GameStatus[]> = {
  draft: ['ready'], ready: ['active'], active: ['paused', 'finished'],
  paused: ['active', 'finished'], finished: ['ready'],
};

export class GameManager {
  private currentState: GameState | null = null;

  createGame(streamId: string, secretWord: string, secretWordId: string): GameState {
    this.currentState = {
      id: crypto.randomUUID(), streamId, secretWord, secretWordId,
      status: 'draft', startedAt: null, finishedAt: null, round: 1,
    };
    return this.currentState;
  }

  private transition(target: GameStatus): GameState {
    if (!this.currentState) throw new Error('No active game');
    const allowed = VALID_TRANSITIONS[this.currentState.status];
    if (!allowed?.includes(target)) throw new Error(`Cannot transition from ${this.currentState.status} to ${target}`);
    this.currentState.status = target;
    if (target === 'active') this.currentState.startedAt = Date.now();
    if (target === 'finished') this.currentState.finishedAt = Date.now();
    return this.currentState;
  }

  startGame(): GameState { return this.transition('active'); }
  pauseGame(): GameState { return this.transition('paused'); }
  resumeGame(): GameState { return this.transition('active'); }
  finishGame(): GameState { return this.transition('finished'); }

  resetGame(secretWord: string, secretWordId: string): GameState {
    if (!this.currentState) throw new Error('No game to reset');
    this.currentState = {
      id: crypto.randomUUID(), streamId: this.currentState.streamId,
      secretWord, secretWordId, status: 'ready',
      startedAt: null, finishedAt: null, round: this.currentState.round + 1,
    };
    return this.currentState;
  }

  getCurrentState(): GameState | null { return this.currentState; }
}