export interface RankedGuess {
  wordId: string; word: string; normalized: string; score: number;
  rank: number; userId?: string; username?: string;
}

export class RankingEngine {
  private guesses: RankedGuess[] = [];

  addGuess(wordId: string, word: string, normalized: string, score: number,
           userId?: string, username?: string): RankedGuess[] {
    const existing = this.guesses.find(g => g.normalized === normalized);
    if (existing) return this.guesses;
    this.guesses.push({ wordId, word, normalized, score, rank: 0, userId, username });
    this.guesses.sort((a, b) => b.score - a.score || (a.rank || 0) - (b.rank || 0));
    this.guesses.forEach((g, i) => { g.rank = i + 1; });
    return this.guesses;
  }
  getLeaderboard(): RankedGuess[] { return [...this.guesses]; }
  getTopN(n: number): RankedGuess[] { return this.guesses.slice(0, n); }
  reset(): void { this.guesses = []; }
}