export interface NBDocument {
  text: string;
  category: string;
}

export class NaiveBayesTextClassifier {
  private vocab: Set<string> = new Set();
  private catDocs: Map<string, string[]> = new Map();
  private catWordCounts: Map<string, Map<string, number>> = new Map();

  train(documents: NBDocument[]): void {
    documents.forEach(doc => {
      if (!this.catDocs.has(doc.category)) {
        this.catDocs.set(doc.category, []);
        this.catWordCounts.set(doc.category, new Map());
      }
      const words = this.tokenize(doc.text);
      this.catDocs.get(doc.category)!.push(doc.text);
      words.forEach(word => {
        this.vocab.add(word);
        const counts = this.catWordCounts.get(doc.category)!;
        counts.set(word, (counts.get(word) || 0) + 1);
      });
    });
  }

  predict(text: string): { category: string; probability: number } {
    const words = this.tokenize(text);
    const totalDocs = Array.from(this.catDocs.values()).reduce((sum, arr) => sum + arr.length, 0);
    let bestCat = '';
    let bestProb = -Infinity;

    this.catDocs.forEach((docs, cat) => {
      let prob = Math.log(docs.length / totalDocs);
      words.forEach(word => {
        const wordCount = this.catWordCounts.get(cat)?.get(word) || 0;
        const probWord = (wordCount + 1) / (this.vocab.size + docs.length);
        prob += Math.log(probWord);
      });
      if (prob > bestProb) {
        bestProb = prob;
        bestCat = cat;
      }
    });

    return { category: bestCat, probability: Math.exp(bestProb) };
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  }
}