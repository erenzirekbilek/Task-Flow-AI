export interface Token {
  value: string;
  position: number;
  type: 'word' | 'number' | 'punctuation' | 'whitespace';
}

export class Tokenizer {
  private delimiters: RegExp = /[\s,;.:!?()[\]{}]/;

  tokenize(text: string): Token[] {
    const tokens: Token[] = [];
    let pos = 0;
    let current = '';
    let start = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (this.delimiters.test(char)) {
        if (current) {
          tokens.push(this.createToken(current, start, 'word'));
          current = '';
        }
        if (/\s/.test(char)) {
          tokens.push(this.createToken(char, i, 'whitespace'));
        } else {
          tokens.push(this.createToken(char, i, 'punctuation'));
        }
      } else {
        if (!current) start = i;
        current += char;
      }
    }

    if (current) {
      tokens.push(this.createToken(current, start, 'word'));
    }

    return tokens;
  }

  private createToken(value: string, position: number, type: Token['type']): Token {
    return { value, position, type };
  }
}