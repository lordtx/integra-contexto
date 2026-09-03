export class ScoreEngine {
  private readonly POINTS_TABLE: Record<number, number> = {
    1: 1000, 2: 500, 3: 300, 4: 200, 5: 100,
    10: 50, 20: 10,
  };
  calculatePoints(rank: number): number {
    if (rank <= 1) return 1000;
    if (rank <= 2) return 500;
    if (rank <= 3) return 300;
    if (rank <= 4) return 200;
    if (rank <= 5) return 100;
    if (rank <= 10) return 50;
    if (rank <= 20) return 10;
    return 5;
  }
  calculateSpeedBonus(elapsedMs: number): number {
    if (elapsedMs < 10000) return 500;
    if (elapsedMs < 30000) return 300;
    if (elapsedMs < 60000) return 200;
    if (elapsedMs < 120000) return 100;
    if (elapsedMs < 300000) return 50;
    return 10;
  }
  calculateFinalScore(rank: number, _totalGuesses: number, elapsedMs: number): number {
    const base = this.calculatePoints(rank);
    if (rank === 1) return base + this.calculateSpeedBonus(elapsedMs);
    return base;
  }
}