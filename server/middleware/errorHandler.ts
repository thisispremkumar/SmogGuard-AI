import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { sendError } from '../utils/apiResponse.js';
import { Logger } from '../utils/logger.js';
import { config } from '../config.js';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    Logger.warn('Request validation failed', { path: req.path, errors: formattedErrors });
    sendError(res, 'Validation failed on input parameters', 400, formattedErrors);
    return;
  }

  // 2. Custom Domain Operational Errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      Logger.error(`Operational error: ${err.message}`, err, { path: req.path });
    } else {
      Logger.warn(`Client error: ${err.message}`, { path: req.path, statusCode: err.statusCode });
    }
    sendError(res, err.message, err.statusCode, err.details);
    return;
  }

  // 3. Unhandled Internal Errors
  const genericError = err as Error;
  Logger.error('Unhandled internal server error', genericError, { path: req.path });

  const safeMessage = config.nodeEnv === 'production'
    ? 'An unexpected error occurred. Please try again later.'
    : genericError.message || 'Internal Server Error';

  sendError(res, safeMessage, 500);
};
