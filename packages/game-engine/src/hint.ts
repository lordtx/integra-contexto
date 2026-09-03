export interface HintOptions {
  maxHints: number;
  revealLetters: boolean;
  showCategory: boolean;
}

export class HintEngine {
  generateHints(word: string, category?: string, options?: Partial<HintOptions>): string[] {
    const opts: HintOptions = {
      maxHints: options?.maxHints ?? 3,
      revealLetters: options?.revealLetters ?? true,
      showCategory: options?.showCategory ?? true,
    };

    const hints: string[] = [];

    if (opts.showCategory && category) {
      hints.push(`Categoria: ${category}`);
    }

    if (opts.revealLetters) {
      hints.push(this.letterHint(word, 1));
      if (opts.maxHints >= 2) {
        hints.push(this.letterHint(word, 2));
      }
      if (opts.maxHints >= 3) {
        hints.push(`A palavra tem ${word.length} letras`);
      }
    }

    return hints.slice(0, opts.maxHints);
  }

  private letterHint(word: string, count: number): string {
    const positions = new Set<number>();
    while (positions.size < count) {
      positions.add(Math.floor(Math.random() * word.length));
    }
    const chars = word.split('');
    const hint = chars.map((c, i) => (positions.has(i) ? c : '_')).join(' ');
    return `Dica: ${hint}`;
  }
}