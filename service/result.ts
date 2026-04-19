export type ResultStatus = 'success' | 'error';

export interface Result<T> {
  status: ResultStatus;
  data?: T;
  error?: string;
}

export function ok<T>(data: T): Result<T> {
  return { status: 'success', data };
}

export function fail<T>(error: string): Result<T> {
  return { status: 'error', error };
}