export interface NormalizationRule {
  pattern: RegExp;
  replacement: string;
}

export class TextNormalizer {
  private rules: NormalizationRule[] = [
    { pattern: /\s+/g, replacement: ' ' },
    { pattern: /[^\w\s]/g, replacement: '' },
    { pattern: /-+/g, replacement: '-' },
  ];

  clearRules(): void {
    this.rules = [];
  }

  addRule(pattern: RegExp, replacement: string): void {
    this.rules.push({ pattern, replacement });
  }

  normalize(text: string): string {
    let result = text;
    this.rules.forEach(rule => {
      result = result.replace(rule.pattern, rule.replacement);
    });
    return result.trim();
  }
}