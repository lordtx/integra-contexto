import { GameState, GameStatus } from '@integra/types';
import { WordManager } from './vocabulary.js';
import { RankingEngine } from './ranking.js';
import { ScoreEngine } from './score.js';
import { HintEngine } from './hint.js';
import { SemanticEngine } from './semantic.js';
import { LocalEmbedding } from './embedding.js';

export class GameManager {
  private wordManager: WordManager;
  private rankingEngine: RankingEngine;
  private scoreEngine: ScoreEngine;
  private hintEngine: HintEngine;
  private semanticEngine: SemanticEngine;
  private game: GameState | null = null;

  constructor() {
    const embedding = new LocalEmbedding();
    this.wordManager = new WordManager();
    this.rankingEngine = new RankingEngine();
    this.scoreEngine = new ScoreEngine();
    this.hintEngine = new HintEngine();
    this.semanticEngine = new SemanticEngine(embedding);
  }

  createGame(streamId: string, maxRounds = 10): GameState {
    this.game = {
      id: crypto.randomUUID(),
      streamId,
      status: 'waiting',
      currentWord: '',
      hints: [],
      scores: {},
      round: 0,
      maxRounds,
      createdAt: new Date(),
    };
    return this.game;
  }

  async startGame(word?: string): Promise<GameState> {
    if (!this.game) throw new Error('No game created');
    if (this.game.status !== 'waiting') throw new Error('Game already started');

    const selected = word
      ? this.wordManager.findWord(word)
      : this.wordManager.getRandomWord();

    if (!selected) throw new Error('No word available');

    this.game.status = 'active';
    this.game.currentWord = selected.word;
    this.game.hints = this.hintEngine.generateHints(selected.word, selected.category);
    this.game.round = 1;
    this.game.startedAt = new Date();

    return this.game;
  }

  async submitGuess(userId: string, username: string, guess: string): Promise<{
    isCorrect: boolean;
    similarity: number;
    score: number;
  }> {
    if (!this.game || this.game.status !== 'active') {
      throw new Error('Game not active');
    }

    this.rankingEngine.addPlayer(userId, username);
    const similarity = await this.semanticEngine.computeSimilarity(
      this.game.currentWord,
      guess
    );

    const isCorrect = similarity > 0.85;
    const score = this.scoreEngine.calculateScore(userId, similarity, 5000, isCorrect);

    if (isCorrect) {
      this.rankingEngine.recordGuess(userId, true, score);
      this.game.scores[userId] = (this.game.scores[userId] || 0) + score;
    } else {
      this.rankingEngine.recordGuess(userId, false);
    }

    return { isCorrect, similarity, score };
  }

  nextRound(): void {
    if (!this.game) throw new Error('No game');
    if (this.game.round >= this.game.maxRounds) {
      this.endGame();
      return;
    }

    const word = this.wordManager.getRandomWord();
    if (!word) {
      this.endGame();
      return;
    }

    this.game.round++;
    this.game.currentWord = word.word;
    this.game.hints = this.hintEngine.generateHints(word.word, word.category);
  }

  endGame(): GameState {
    if (!this.game) throw new Error('No game');
    this.game.status = 'completed';
    this.game.endedAt = new Date();
    return this.game;
  }

  getGame(): GameState | null {
    return this.game;
  }

  getRanking() {
    return this.rankingEngine.getRanking();
  }
}