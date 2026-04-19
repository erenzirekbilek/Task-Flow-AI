import * as SQLite from 'expo-sqlite';

export interface Company {
  id: number;
  name: string;
  metroStation: string;
  completed: number;
  createdAt?: string;
}

export interface CompanyRepository {
  findAll(): Promise<Company[]>;
  findById(id: number): Promise<Company | null>;
  findByName(name: string): Promise<Company | null>;
  create(name: string, metroStation: string): Promise<Company>;
  update(id: number, data: Partial<Company>): Promise<void>;
  delete(id: number): Promise<void>;
  getNames(): Promise<string[]>;
}

class SQLiteCompanyRepository implements CompanyRepository {
  private db: SQLite.SQLiteDatabase | null = null;

  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync('interview_tracker.db');
      await this.initSchema();
    }
    return this.db;
  }

  private async initSchema(): Promise<void> {
    await this.db!.execAsync(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        metroStation TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
    `);
  }

  async findAll(): Promise<Company[]> {
    const db = await this.getDb();
    return db.getAllAsync<Company>('SELECT * FROM companies ORDER BY completed ASC, id DESC');
  }

  async findById(id: number): Promise<Company | null> {
    const db = await this.getDb();
    return db.getFirstAsync<Company>('SELECT * FROM companies WHERE id = ?', [id]);
  }

  async findByName(name: string): Promise<Company | null> {
    const db = await this.getDb();
    return db.getFirstAsync<Company>(
      'SELECT * FROM companies WHERE LOWER(name) = LOWER(?)',
      [name]
    );
  }

  async create(name: string, metroStation: string): Promise<Company> {
    const db = await this.getDb();
    const result = await db.runAsync(
      'INSERT INTO companies (name, metroStation, completed) VALUES (?, ?, 0)',
      [name, metroStation]
    );
    return {
      id: result.lastInsertRowId,
      name,
      metroStation,
      completed: 0,
    };
  }

  async update(id: number, data: Partial<Company>): Promise<void> {
    const db = await this.getDb();
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.metroStation !== undefined) {
      updates.push('metroStation = ?');
      values.push(data.metroStation);
    }
    if (data.completed !== undefined) {
      updates.push('completed = ?');
      values.push(data.completed);
    }

    if (updates.length > 0) {
      values.push(id);
      await db.runAsync(
        `UPDATE companies SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb();
    await db.runAsync('DELETE FROM companies WHERE id = ?', [id]);
  }

  async getNames(): Promise<string[]> {
    const db = await this.getDb();
    const companies = await db.getAllAsync<{ name: string }>(
      'SELECT name FROM companies'
    );
    return companies.map((c) => c.name);
  }
}

let repository: CompanyRepository | null = null;

export function getCompanyRepository(): CompanyRepository {
  if (!repository) {
    repository = new SQLiteCompanyRepository();
  }
  return repository;
}

export async function initDatabase(): Promise<void> {
  await getCompanyRepository().findAll();
}

export async function getAllCompanies(): Promise<Company[]> {
  return getCompanyRepository().findAll();
}

export async function addCompany(name: string, metroStation: string): Promise<Company> {
  const repo = getCompanyRepository();
  const existing = await repo.findByName(name);
  if (existing) {
    throw new Error('DUPLICATE');
  }
  return repo.create(name, metroStation);
}

export async function updateCompanyStatus(id: number, completed: boolean): Promise<void> {
  await getCompanyRepository().update(id, { completed: completed ? 1 : 0 });
}

export async function deleteCompany(id: number): Promise<void> {
  await getCompanyRepository().delete(id);
}

export async function checkCompanyExists(name: string): Promise<Company | null> {
  return getCompanyRepository().findByName(name);
}

export async function getCompanyNames(): Promise<string[]> {
  return getCompanyRepository().getNames();
}