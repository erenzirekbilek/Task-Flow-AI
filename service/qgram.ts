export class QGramDistance {
  static distance(s1: string, s2: string, q: number = 2): number {
    const qgrams1 = this.getQGrams(s1, q);
    const qgrams2 = this.getQGrams(s2, q);
    const union = new Set([...qgrams1, ...qgrams2]);
    const intersection = new Set([...qgrams1].filter(x => qgrams2.has(x)));
    return union.size - intersection.size;
  }

  static similarity(s1: string, s2: string, q: number = 2): number {
    const dist = this.distance(s1, s2, q);
    const maxLen = Math.max(s1.length, s2.length);
    return maxLen > 0 ? 1 - dist / maxLen : 1;
  }

  private static getQGrams(str: string, q: number): Set<string> {
    const qgrams = new Set<string>();
    const s = '^' + str.toLowerCase() + '$';
    for (let i = 0; i < s.length - q + 1; i++) {
      qgrams.add(s.substring(i, i + q));
    }
    return qgrams;
  }
}