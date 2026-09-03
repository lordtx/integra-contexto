export class LocalEmbedding {
  private dimension: number = 100;
  constructor(dim?: number) { if (dim) this.dimension = dim; }
  generate(text: string): number[] {
    const vec = new Array(this.dimension).fill(0);
    const normalized = `^${text.toLowerCase().trim()}$`;
    for (let i = 0; i < normalized.length - 2; i++) {
      const trigram = normalized.substring(i, i + 3);
      let hash = 0;
      for (const ch of trigram) { hash = ((hash << 5) - hash) + ch.charCodeAt(0); hash = hash & hash; }
      const idx = ((hash % this.dimension) + this.dimension) % this.dimension;
      vec[idx] += 1.0;
    }
    return this.normalize(vec);
  }
  cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; normA += a[i] * a[i]; normB += b[i] * b[i]; }
    return normA === 0 || normB === 0 ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  normalize(v: number[]): number[] {
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    return norm === 0 ? v : v.map(x => x / norm);
  }
}