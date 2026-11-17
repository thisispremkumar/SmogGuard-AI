import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config.js';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'fail',
      message: 'Validation failed on input parameters',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Handle generic error
  const statusCode = (err as { status?: number }).status || 500;
  const message = (err as Error).message || 'Internal Server Error';

  console.error('[Error caught by centralized handler]:', err);

  res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 && config.nodeEnv === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : message,
    ...(config.nodeEnv !== 'production' && { stack: (err as Error).stack }),
  });
};

