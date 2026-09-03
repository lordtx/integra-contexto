import { LocalEmbedding } from './embedding.js';

export interface SimilarityResult {
  word: string;
  similarity: number;
}

export class SemanticEngine {
  private embedding: LocalEmbedding;

  constructor(embedding: LocalEmbedding) {
    this.embedding = embedding;
  }

  async computeSimilarity(wordA: string, wordB: string): Promise<number> {
    const [embA, embB] = await Promise.all([
      this.embedding.getEmbedding(wordA),
      this.embedding.getEmbedding(wordB),
    ]);
    return this.cosineSimilarity(embA, embB);
  }

  async findSimilar(word: string, candidates: string[], topK = 5): Promise<SimilarityResult[]> {
    const wordEmb = await this.embedding.getEmbedding(word);
    const candidateEmbs = await Promise.all(
      candidates.map((c) => this.embedding.getEmbedding(c))
    );

    const results: SimilarityResult[] = candidates.map((c, i) => ({
      word: c,
      similarity: this.cosineSimilarity(wordEmb, candidateEmbs[i]),
    }));

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}