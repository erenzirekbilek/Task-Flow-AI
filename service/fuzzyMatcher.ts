export interface FuzzyResult {
  score: number;
  matched: boolean;
  original: string;
  normalized: string;
}

export class FuzzyMatcher {
  private static readonly THRESHOLD = 0.75;

  static normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  static levenshteinDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[m][n];
  }

  static calculateSimilarity(s1: string, s2: string): number {
    const normalized1 = this.normalize(s1);
    const normalized2 = this.normalize(s2);

    if (normalized1 === normalized2) return 1;
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return 0.9;
    }

    const maxLen = Math.max(normalized1.length, normalized2.length);
    if (maxLen === 0) return 1;

    const distance = this.levenshteinDistance(normalized1, normalized2);
    return 1 - distance / maxLen;
  }

  static match(input: string, target: string): FuzzyResult {
    const similarity = this.calculateSimilarity(input, target);
    return {
      score: similarity,
      matched: similarity >= this.THRESHOLD,
      original: input,
      normalized: this.normalize(input),
    };
  }

  static findBestMatch(input: string, candidates: string[]): FuzzyResult | null {
    let best: FuzzyResult | null = null;

    for (const candidate of candidates) {
      const result = this.match(input, candidate);
      if (!best || result.score > best.score) {
        best = result;
      }
    }

    return best && best.matched ? best : null;
  }

  static isDuplicate(input: string, existingNames: string[]): FuzzyResult | null {
    return this.findBestMatch(input, existingNames);
  }
}