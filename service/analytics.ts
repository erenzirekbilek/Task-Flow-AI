import { Company } from './database';

export interface CompanyStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export function calculateStats(companies: Company[]): CompanyStats {
  const total = companies.length;
  const completed = companies.filter(c => c.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return { total, completed, pending, completionRate };
}