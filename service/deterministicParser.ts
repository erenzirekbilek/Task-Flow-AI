export interface ParsedCompany {
  name: string;
  metroStation: string;
  raw: string;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedCompany;
  error?: string;
}

export class DeterministicParser {
  private static readonly COMPANY_KEYWORDS = [
    'company',
    'firm',
    'inc',
    'ltd',
    'llc',
    'corp',
    'group',
    'technologies',
    'tech',
    'solutions',
    'systems',
    'services',
    'consulting',
  ];

  private static readonly METRO_KEYWORDS = [
    'metro',
    'station',
    ' Subway',
    'underground',
    'metro station',
  ];

  static parse(input: string): ParseResult {
    if (!input || input.trim().length === 0) {
      return { success: false, error: 'Input cannot be empty' };
    }

    const cleaned = this.cleanInput(input);
    const parts = this.splitInput(cleaned);

    if (parts.length === 0) {
      return { success: false, error: 'No valid content found' };
    }

    if (parts.length === 1) {
      return {
        success: true,
        data: {
          name: parts[0].trim(),
          metroStation: '',
          raw: input,
        },
      };
    }

    if (parts.length === 2) {
      const [first, second] = parts;
      if (this.looksLikeMetro(second)) {
        return {
          success: true,
          data: { name: first.trim(), metroStation: second.trim(), raw: input },
        };
      } else {
        return {
          success: true,
          data: { name: second.trim(), metroStation: first.trim(), raw: input },
        };
      }
    }

    const metroIndex = this.findMetroStationIndex(parts);
    if (metroIndex !== -1) {
      const nameParts = parts.slice(0, metroIndex);
      const metroParts = parts.slice(metroIndex);
      return {
        success: true,
        data: {
          name: nameParts.join(' ').trim(),
          metroStation: metroParts.join(' ').trim(),
          raw: input,
        },
      };
    }

    const lastIsMetroLike = this.looksLikeMetro(parts[parts.length - 1]);
    return {
      success: true,
      data: {
        name: lastIsMetroLike
          ? parts.slice(0, -1).join(' ').trim()
          : input,
        metroStation: lastIsMetroLike ? parts[parts.length - 1].trim() : '',
        raw: input,
      },
    };
  }

  private static cleanInput(input: string): string {
    return input
      .replace(/[-_,;|]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static splitInput(input: string): string[] {
    const cleaned = this.cleanInput(input);
    return cleaned.split(' ').filter((part) => part.length > 0);
  }

  private static looksLikeMetro(text: string): boolean {
    const lower = text.toLowerCase();
    const isKeyword = this.METRO_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
    if (isKeyword) return true;

    const metroPattern = /^(fatih|sultan|ceviz|탑시|列表|安卡拉|伊斯坦布尔)/i;
    if (metroPattern.test(text)) return true;

    return text.length <= 20 && text.length >= 2;
  }

  private static findMetroStationIndex(parts: string[]): number {
    for (let i = 0; i < parts.length; i++) {
      if (this.looksLikeMetro(parts[i])) {
        return i;
      }
    }
    return -1;
  }

  static extractCompanyName(input: string): string {
    const result = this.parse(input);
    return result.success && result.data ? result.data.name : input;
  }

  static extractMetroStation(input: string): string {
    const result = this.parse(input);
    return result.success && result.data ? result.data.metroStation : '';
  }

  static validate(input: string): boolean {
    const result = this.parse(input);
    return result.success;
  }
}