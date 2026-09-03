export interface PlayerScore {
  userId: string;
  username: string;
  score: number;
  correctGuesses: number;
  totalGuesses: number;
}

export class RankingEngine {
  private players: Map<string, PlayerScore> = new Map();

  addPlayer(userId: string, username: string): void {
    if (!this.players.has(userId)) {
      this.players.set(userId, {
        userId,
        username,
        score: 0,
        correctGuesses: 0,
        totalGuesses: 0,
      });
    }
  }

  recordGuess(userId: string, isCorrect: boolean, points?: number): void {
    const player = this.players.get(userId);
    if (!player) return;

    player.totalGuesses++;
    if (isCorrect) {
      player.correctGuesses++;
      player.score += points ?? 10;
    }
  }

  getRanking(): PlayerScore[] {
    return [...this.players.values()].sort((a, b) => b.score - a.score);
  }

  getPlayerScore(userId: string): PlayerScore | undefined {
    return this.players.get(userId);
  }

  reset(): void {
    this.players.clear();
  }
}