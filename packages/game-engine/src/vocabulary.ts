export interface WordEntry { id: string; word: string; normalized: string; }
export class WordManager {
  private words = new Map<string, WordEntry>();
  private blocked = new Set<string>();
  private secretWordId: string | null = null;

  addWord(word: string, id?: string): WordEntry {
    const normalized = word.toLowerCase().trim();
    const entry = { id: id || crypto.randomUUID(), word, normalized };
    this.words.set(normalized, entry);
    return entry;
  }
  getWord(normalized: string): WordEntry | undefined { return this.words.get(normalized); }
  getSecretWord(): WordEntry {
    if (!this.secretWordId) throw new Error('No secret word set');
    const entry = Array.from(this.words.values()).find(w => w.id === this.secretWordId);
    if (!entry) throw new Error('Secret word not found');
    return entry;
  }
  setSecretWord(wordId: string): void { this.secretWordId = wordId; }
  isBlocked(word: string): boolean { return this.blocked.has(word.toLowerCase().trim()); }
  addBlockedWord(word: string): void { this.blocked.add(word.toLowerCase().trim()); }
  isValidWord(word: string): boolean { return !!word && word.length >= 2 && word.length <= 50; }
  getAllWords(): WordEntry[] { return Array.from(this.words.values()); }
}