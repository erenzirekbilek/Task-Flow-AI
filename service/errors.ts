export class AppError extends Error {
  constructor(message: string, public code: string = 'UNKNOWN') {
    super(message);
    this.name = 'AppError';
  }
}

export class DuplicateError extends AppError {
  constructor(entity: string) {
    super(`${entity} already exists`, 'DUPLICATE');
    this.name = 'DuplicateError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION');
    this.name = 'ValidationError';
  }
}