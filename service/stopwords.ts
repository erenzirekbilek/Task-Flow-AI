export class StopWords {
  private static readonly english = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'it', 'its', 'i', 'you', 'he', 'she', 'we', 'they',
  ]);

  static remove(text: string): string {
    return text.toLowerCase().split(/\s+/).filter(word => !this.english.has(word)).join(' ');
  }

  static isStopWord(word: string): boolean {
    return this.english.has(word.toLowerCase());
  }
}