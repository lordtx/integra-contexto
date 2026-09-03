export interface ScoreConfig {
  basePoints: number;
  timeBonus: number;
  streakMultiplier: number;
  maxStreak: number;
}

export class ScoreEngine {
  private streaks: Map<string, number> = new Map();
  private config: ScoreConfig;

  constructor(config?: Partial<ScoreConfig>) {
    this.config = {
      basePoints: config?.basePoints ?? 100,
      timeBonus: config?.timeBonus ?? 50,
      streakMultiplier: config?.streakMultiplier ?? 0.5,
      maxStreak: config?.maxStreak ?? 5,
    };
  }

  calculateScore(
    userId: string,
    similarity: number,
    responseTimeMs: number,
    isCorrect: boolean
  ): number {
    if (!isCorrect) {
      this.streaks.set(userId, 0);
      return 0;
    }

    const currentStreak = this.streaks.get(userId) ?? 0;
    const newStreak = Math.min(currentStreak + 1, this.config.maxStreak);
    this.streaks.set(userId, newStreak);

    const accuracyBonus = Math.round(similarity * this.config.basePoints);
    const timeBonusCalc = responseTimeMs < 10000 ? this.config.timeBonus : 0;
    const streakBonus = Math.round(accuracyBonus * (newStreak - 1) * this.config.streakMultiplier);

    return accuracyBonus + timeBonusCalc + streakBonus;
  }

  resetStreak(userId: string): void {
    this.streaks.set(userId, 0);
  }
}