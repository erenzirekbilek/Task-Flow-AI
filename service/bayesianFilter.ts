export interface BayesClass {
  name: string;
  prior: number;
  wordCounts: Map<string, number>;
  totalWords: number;
}

export interface BayesResult {
  classification: string;
  confidence: number;
  scores: Map<string, number>;
}

export class BayesianFilter {
  private classes: Map<string, BayesClass> = new Map();
  private vocabulary: Set<string> = new Set();
  private smoothing: number = 1;

  train(text: string, label: string): void {
    let classData = this.classes.get(label);
    if (!classData) {
      classData = { name: label, prior: 0, wordCounts: new Map(), totalWords: 0 };
      this.classes.set(label, classData);
    }

    const words = this.tokenize(text);
    classData.prior++;
    classData.totalWords += words.length;
    words.forEach(word => {
      classData!.wordCounts.set(word, (classData!.wordCounts.get(word) || 0) + 1);
      this.vocabulary.add(word);
    });
  }

  classify(text: string): BayesResult {
    const words = this.tokenize(text);
    const totalDocs = Array.from(this.classes.values()).reduce((sum, c) => sum + c.prior, 0);

    const scores: Map<string, number> = new Map();
    let bestClass = '';
    let bestScore = -Infinity;

    this.classes.forEach((classData, className) => {
      let score = Math.log(classData.prior / totalDocs);
      words.forEach(word => {
        const count = classData.wordCounts.get(word) || 0;
        const prob = (count + this.smoothing) / (classData.totalWords + this.smoothing * this.vocabulary.size);
        score += Math.log(prob);
      });
      scores.set(className, score);
      if (score > bestScore) {
        bestScore = score;
        bestClass = className;
      }
    });

    const totalScore = Array.from(scores.values()).reduce((sum, s) => sum + Math.exp(s), 0);
    const confidence = totalScore > 0 ? Math.exp(bestScore) / totalScore : 0;

    return { classification: bestClass, confidence, scores };
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  }
}