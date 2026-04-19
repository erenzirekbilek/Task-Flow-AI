export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private static log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}]`, message, data || '');
  }

  static debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  static info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  static warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  static error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }
}