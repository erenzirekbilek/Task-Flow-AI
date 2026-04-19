export interface Query {
  text: string;
  params: any[];
}

export class QueryBuilder {
  private parts: string[] = [];
  private params: any[] = [];

  select(columns: string[] = ['*']): this {
    this.parts.push(`SELECT ${columns.join(', ')}`);
    return this;
  }

  from(table: string): this {
    this.parts.push(`FROM ${table}`);
    return this;
  }

  where(condition: string, ...params: any[]): this {
    this.parts.push(`WHERE ${condition}`);
    this.params.push(...params);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.parts.push(`ORDER BY ${column} ${direction}`);
    return this;
  }

  limit(count: number): this {
    this.parts.push(`LIMIT ${count}`);
    return this;
  }

  build(): Query {
    return { text: this.parts.join(' '), params: this.params };
  }
}