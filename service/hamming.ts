export class HammingDistance {
  static distance(s1: string, s2: string): number {
    if (s1.length !== s2.length) return -1;
    let distance = 0;
    for (let i = 0; i < s1.length; i++) {
      if (s1[i] !== s2[i]) distance++;
    }
    return distance;
  }

  static similarity(s1: string, s2: string): number {
    const dist = this.distance(s1, s2);
    if (dist === -1) return 0;
    return 1 - dist / s1.length;
  }
}