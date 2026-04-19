export class Stemmer {
  private static readonly vowels = 'aeiou';
  private static readonly suffixes = ['ing', 'ed', 'es', 'est', 'ly', 'ment', 'ness', 'ful', 'less', 'able', 'ible'];

  stem(word: string): string {
    let result = word.toLowerCase();
    for (const suffix of this.suffixes) {
      if (result.endsWith(suffix) && result.length > suffix.length + 2) {
        result = result.slice(0, -suffix.length);
        break;
      }
    }
    return result;
  }
}