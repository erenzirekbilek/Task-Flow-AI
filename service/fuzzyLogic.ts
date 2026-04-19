export interface FuzzySet {
  name: string;
  membershipFn: (value: number) => number;
}

export interface FuzzyRule {
  antecedent: string;
  consequent: string;
  weight: number;
}

export interface FuzzyOutput {
  variable: string;
  value: number;
  membership: number;
}

export class FuzzyLogic {
  private sets: Map<string, FuzzySet> = new Map();
  private rules: FuzzyRule[] = [];
  private AND = 'and';
  private OR = 'or';

  addSet(name: string, type: 'triangle' | 'trapezoid' | 'gaussian', params: number[]): void {
    let membershipFn: (value: number) => number;
    if (type === 'triangle') {
      const [a, b, c] = params;
      membershipFn = (x) => {
        if (x <= a || x >= c) return 0;
        if (x < b) return (x - a) / (b - a);
        return (c - x) / (c - b);
      };
    } else if (type === 'trapezoid') {
      const [a, b, c, d] = params;
      membershipFn = (x) => {
        if (x <= a || x >= d) return 0;
        if (x >= b && x <= c) return 1;
        if (x < b) return (x - a) / (b - a);
        return (d - x) / (d - c);
      };
    } else {
      const [mean, sigma] = params;
      membershipFn = (x) => Math.exp(-Math.pow(x - mean, 2) / (2 * sigma * sigma));
    }
    this.sets.set(name, { name, membershipFn });
  }

  addRule(antecedent: string, consequent: string, weight: number = 1): void {
    this.rules.push({ antecedent, consequent, weight });
  }

  evaluate(inputs: Map<string, number>): FuzzyOutput[] {
    const outputs: FuzzyOutput[] = [];
    this.rules.forEach(rule => {
      const truthValue = this.fuzzyOR(this.fuzzyAND(this.evaluateAntecedent(rule.antecedent, inputs)));
      if (truthValue > 0) {
        outputs.push({ variable: rule.consequent, value: truthValue * rule.weight, membership: truthValue });
      }
    });
    return outputs;
  }

  defuzzify(outputs: FuzzyOutput[]): Map<string, number> {
    const result = new Map<string, number>();
    const total = outputs.reduce((sum, o) => sum + o.value, 0);
    outputs.forEach(o => {
      const current = result.get(o.variable) || 0;
      result.set(o.variable, current + o.value);
    });
    result.forEach((v, k) => result.set(k, total > 0 ? v / outputs.length : 0));
    return result;
  }

  private evaluateAntecedent(ante: string, inputs: Map<string, number>): number {
    const set = this.sets.get(ante);
    if (!set) return 0;
    return set.membershipFn(inputs.get(ante) || 0);
  }

  private fuzzyAND(a: number, b: number): number {
    return Math.min(a, b);
  }

  private fuzzyOR(a: number, b: number): number {
    return Math.max(a, b);
  }
}