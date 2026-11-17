/**
 * Production-Grade Structured Logger for SmogGuard AI
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class Logger {
  private static formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context && Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] [SmogGuard] ${message}${contextStr}`;
  }

  public static info(message: string, context?: Record<string, unknown>): void {
    console.log(this.formatMessage('INFO', message, context));
  }

  public static warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.formatMessage('WARN', message, context));
  }

  public static error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const errorDetails = error instanceof Error 
      ? { errorMessage: error.message, stack: error.stack, ...context }
      : { rawError: error, ...context };
    console.error(this.formatMessage('ERROR', message, errorDetails));
  }

  public static debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }
}
