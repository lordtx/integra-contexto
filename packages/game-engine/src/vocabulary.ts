import { normalizeWord } from './normalization.js';

export interface WordEntry {
  id?: string;
  word: string;
  normalized: string;
  category?: string;
  difficulty: number;
  hints: string[];
}

export class WordManager {
  private words: WordEntry[] = [];
  private usedWords: Set<string> = new Set();

  constructor(initialWords?: WordEntry[]) {
    if (initialWords) {
      this.words = initialWords.map((w) => ({
        ...w,
        normalized: w.normalized || normalizeWord(w.word),
      }));
    }
  }

  addWord(entry: Omit<WordEntry, 'normalized'>): void {
    this.words.push({
      ...entry,
      normalized: normalizeWord(entry.word),
    });
  }

  getRandomWord(difficulty?: number): WordEntry | null {
    const pool = difficulty
      ? this.words.filter((w) => w.difficulty === difficulty && !this.usedWords.has(w.normalized))
      : this.words.filter((w) => !this.usedWords.has(w.normalized));

    if (pool.length === 0) return null;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    this.usedWords.add(chosen.normalized);
    return chosen;
  }

  findWord(normalized: string): WordEntry | undefined {
    return this.words.find((w) => w.normalized === normalized);
  }

  resetUsedWords(): void {
    this.usedWords.clear();
  }

  getAllWords(): WordEntry[] {
    return [...this.words];
  }

  getCategories(): string[] {
    return [...new Set(this.words.map((w) => w.category).filter(Boolean))] as string[];
  }
}