export class HintEngine {
  private hintsUsed = 0;
  private hints = [
    'Esta palavra está presente no dia a dia de muitas pessoas.',
    'Você pode encontrar esta palavra em diversos lugares.',
    'Muitas pessoas usam ou mencionam esta palavra frequentemente.',
    'Esta palavra pode estar relacionada a uma experiência comum.',
    'Preste atenção aos detalhes ao seu redor — a resposta está mais perto do que parece.',
  ];
  generateHint(_secretWord: string): string {
    const hint = this.hints[Math.min(this.hintsUsed, this.hints.length - 1)];
    this.hintsUsed++;
    return hint;
  }
  getHintsUsed(): number { return this.hintsUsed; }
  reset(): void { this.hintsUsed = 0; }
}