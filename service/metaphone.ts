export class Metaphone {
  private static readonly vowels = 'AEIOU';
  private static readonly rules: Array<{ pattern: RegExp; replacement: string }> = [
    { pattern: /^PS/, replacement: 'S' },
    { pattern: /^KN/, replacement: 'N' },
    { pattern: /^GN/, replacement: 'N' },
    { pattern: /^PN/, replacement: 'N' },
    { pattern: /^AE/, replacement: 'E' },
    { pattern: /^WR/, replacement: 'R' },
    { pattern: /^WH/, replacement: /'W'/ },
    { pattern: /MB$/, replacement: 'M' },
    { pattern: /(?<!C)IA/, replacement: 'ION' },
    { pattern: /(?<!C)IO/, replacement: 'ION' },
    { pattern: /(?<!C)IE/, replacement: 'ION' },
  ];

  static encode(word: string): string {
    if (!word || word.length === 0) return '';
    
    const upper = word.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length === 0) return '';

    let code = upper;
    this.rules.forEach(rule => {
      code = code.replace(rule.pattern, rule.replacement);
    });

    code = code
      .replace(/([BFPV])[BFPV]/g, '$1')
      .replace(/([CGJKQSXZ])[CGJKQSXZ]/g, '$1')
      .replace(/D(?=T)/g, '')
      .replace(/M(?=M)/g, '');

    let result = '';
    let prev = '';
    for (let i = 0; i < code.length && result.length < 4; i++) {
      const char = code[i];
      if (char !== prev || this.vowels.includes(char)) {
        if (this.vowels.includes(char) || char !== prev) {
          result += char;
        }
        prev = char;
      }
    }

    return result.replace(/[^A-Z]/g, '').slice(0, 4);
  }

  static compare(a: string, b: string): boolean {
    return this.encode(a) === this.encode(b);
  }

  static similarity(a: string, b: string): number {
    const codeA = this.encode(a);
    const codeB = this.encode(b);
    if (!codeA || !codeB) return 0;
    
    let matches = 0;
    const len = Math.min(codeA.length, codeB.length);
    for (let i = 0; i < len; i++) {
      if (codeA[i] === codeB[i]) matches++;
    }
    return matches / Math.max(codeA.length, codeB.length);
  }
}