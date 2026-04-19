import * as SQLite from 'expo-sqlite';

export interface Company {
  id: number;
  name: string;
  metroStation: string;
  completed: number;
}

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('interview_tracker.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      metroStation TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `);
}

export async function getAllCompanies(): Promise<Company[]> {
  if (!db) await initDatabase();
  const result = await db!.getAllAsync<Company>('SELECT * FROM companies ORDER BY completed ASC, id DESC');
  return result;
}

export async function addCompany(name: string, metroStation: string): Promise<boolean> {
  if (!db) await initDatabase();
  
  const existing = await db!.getFirstAsync<Company>(
    'SELECT * FROM companies WHERE LOWER(name) = LOWER(?)',
    [name]
  );
  
  if (existing) {
    return false;
  }
  
  await db!.runAsync(
    'INSERT INTO companies (name, metroStation, completed) VALUES (?, ?, 0)',
    [name, metroStation]
  );
  return true;
}

export async function updateCompanyStatus(id: number, completed: boolean): Promise<void> {
  if (!db) await initDatabase();
  await db!.runAsync(
    'UPDATE companies SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id]
  );
}

export async function deleteCompany(id: number): Promise<void> {
  if (!db) await initDatabase();
  await db!.runAsync('DELETE FROM companies WHERE id = ?', [id]);
}

export async function checkCompanyExists(name: string): Promise<Company | null> {
  if (!db) await initDatabase();
  const result = await db!.getFirstAsync<Company>(
    'SELECT * FROM companies WHERE LOWER(name) = LOWER(?)',
    [name]
  );
  return result;
}