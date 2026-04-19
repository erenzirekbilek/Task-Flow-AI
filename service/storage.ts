export interface StorageItem {
  key: string;
  value: any;
}

export class Storage {
  private data: Map<string, any> = new Map();

  set(key: string, value: any): void {
    this.data.set(key, value);
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    return this.data.get(key) ?? defaultValue;
  }

  remove(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }

  has(key: string): boolean {
    return this.data.has(key);
  }
}