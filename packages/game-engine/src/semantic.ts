export class SemanticEngine {
  calculateScore(word: string, secretWord: string, vocabulary?: Map<string, number[]>): number {
    if (word === secretWord) return 1.0;
    if (!vocabulary || !vocabulary.has(word) || !vocabulary.has(secretWord)) {
      return Math.random() * 0.3 + 0.05;
    }
    const vecA = vocabulary.get(word)!;
    const vecB = vocabulary.get(secretWord)!;
    return this.cosineSimilarity(vecA, vecB);
  }
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return Math.max(0, Math.min(1, dot / (Math.sqrt(normA) * Math.sqrt(normB))));
  }
}