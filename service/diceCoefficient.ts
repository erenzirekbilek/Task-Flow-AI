export class DiceCoefficient {
  static coefficient(s1: string, s2: string): number {
    const bigrams1 = this.getBigrams(s1);
    const bigrams2 = this.getBigrams(s2);
    const intersection = new Set([...bigrams1].filter(x => bigrams2.has(x)));
    return (2 * intersection.size) / (bigrams1.size + bigrams2.size);
  }

  private static getBigrams(str: string): Set<string> {
    const bigrams = new Set<string>();
    const s = str.toLowerCase();
    for (let i = 0; i < s.length - 1; i++) {
      bigrams.add(s.substring(i, i + 2));
    }
    return bigrams;
  }
}