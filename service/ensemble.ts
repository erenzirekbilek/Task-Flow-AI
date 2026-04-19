export interface EnsembleClassifier {
  predict(features: number[]): string;
}

export class VotingEnsemble {
  private classifiers: EnsembleClassifier[] = [];
  private weights: number[] = [];

  add(classifier: EnsembleClassifier, weight: number = 1): void {
    this.classifiers.push(classifier);
    this.weights.push(weight);
  }

  predict(features: number[]): string {
    const votes = new Map<string, number>();
    
    this.classifiers.forEach((clf, i) => {
      const pred = clf.predict(features);
      votes.set(pred, (votes.get(pred) || 0) + this.weights[i]);
    });

    let best = '';
    let bestCount = 0;
    votes.forEach((count, label) => {
      if (count > bestCount) {
        bestCount = count;
        best = label;
      }
    });

    return best;
  }
}