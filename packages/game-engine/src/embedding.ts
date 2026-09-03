export class LocalEmbedding {
  private dimensions = 384;
  private cache: Map<string, number[]> = new Map();

  async getEmbedding(text: string): Promise<number[]> {
    const key = text.toLowerCase().trim();
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Gera um embedding pseudo-aleatório determinístico baseado no texto
    const embedding = this.generatePseudoEmbedding(text);
    this.cache.set(key, embedding);
    return embedding;
  }

  private generatePseudoEmbedding(text: string): number[] {
    const emb: number[] = [];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }

    for (let i = 0; i < this.dimensions; i++) {
      hash = ((hash << 5) - hash + i * 7) | 0;
      emb.push((hash % 200) / 100 - 1); // normalize to [-1, 1]
    }
    return emb;
  }
}