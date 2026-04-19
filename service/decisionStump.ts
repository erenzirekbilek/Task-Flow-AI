export interface DecisionStumpParams {
  feature: string;
  threshold: number;
  direction: 'left' | 'right';
}

export class DecisionStump {
  private params: DecisionStumpParams | null = null;
  private predictions: Map<string, 'left' | 'right'> = new Map();

  train(data: { features: Map<string, number>; label: string }[]): void {
    let bestGini = Infinity;

    data.forEach(d => {
      d.features.forEach((value, feature) => {
        const left = data.filter(x => x.features.get(feature)! <= value);
        const right = data.filter(x => x.features.get(feature)! > value);
        const gini = this.giniImpurity(left, right);
        if (gini < bestGini) {
          bestGini = gini;
          this.params = { feature, threshold: value, direction: 'left' };
        }
      });
    });
  }

  predict(features: Map<string, number>): 'left' | 'right' {
    if (!this.params) return 'left';
    const value = features.get(this.params.feature) || 0;
    return value <= this.params.threshold ? 'left' : 'right';
  }

  private giniImpurity(left: any[], right: any[]): number {
    const g = (subset: any[]) => {
      if (subset.length === 0) return 0;
      const counts = new Map<string, number>();
      subset.forEach(s => counts.set(s.label, (counts.get(s.label) || 0) + 1));
      let impurity = 1;
      counts.forEach(c => {
        const p = c / subset.length;
        impurity -= p * p;
      });
      return impurity;
    };
    const total = left.length + right.length;
    return (left.length * g(left) + right.length * g(right)) / total;
  }
}