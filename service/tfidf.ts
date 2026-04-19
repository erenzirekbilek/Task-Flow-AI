export interface TermFrequency {
  term: string;
  tf: number;
  idf: number;
  tfidf: number;
}

export class TFIDF {
  private docTerms: Map<string, Map<string, number>> = new Map();
  private termDocFreq: Map<string, number> = new Map();
  private totalDocs: number = 0;

  addDocument(id: string, text: string): void {
    const terms = this.tokenize(text);
    const freq = new Map<string, number>();
    terms.forEach(term => {
      freq.set(term, (freq.get(term) || 0) + 1);
    });
    this.docTerms.set(id, freq);
    freq.forEach((_, term) => {
      this.termDocFreq.set(term, (this.termDocFreq.get(term) || 0) + 1);
    });
    this.totalDocs++;
  }

  calculate(id: string): TermFrequency[] {
    const result: TermFrequency[] = [];
    const doc = this.docTerms.get(id);
    if (!doc) return result;

    doc.forEach((count, term) => {
      const tf = count / doc.size;
      const idf = Math.log(this.totalDocs / (this.termDocFreq.get(term) || 1));
      result.push({ term, tf, idf, tfidf: tf * idf });
    });

    return result.sort((a, b) => b.tfidf - a.tfidf);
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  }
}