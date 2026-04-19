export class Soundex {
  private static readonly mapping: Record<string, string> = {
    B: '1', F: '1', P: '1', V: '1',
    C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
    D: '3', T: '3',
    L: '4',
    M: '5', N: '5',
    R: '6',
  };

  static encode(name: string): string {
    if (!name || name.length === 0) return '0000';
    
    const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length === 0) return '0000';

    let code = upper[0];
    let prevCode = this.mapping[upper[0]] || '';

    for (let i = 1; i < upper.length && code.length < 4; i++) {
      const char = upper[i];
      const charCode = this.mapping[char] || '';

      if (charCode && charCode !== prevCode) {
        code += charCode;
        prevCode = charCode;
      } else if (!charCode) {
        prevCode = '';
      }
    }

    return code.padEnd(4, '0');
  }

  static compare(a: string, b: string): boolean {
    return this.encode(a) === this.encode(b);
  }

  static similarity(a: string, b: string): number {
    const codeA = this.encode(a);
    const codeB = this.encode(b);
    let matches = 0;
    for (let i = 0; i < 4; i++) {
      if (codeA[i] === codeB[i]) matches++;
    }
    return matches / 4;
  }
}