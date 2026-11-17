import { Response } from 'express';

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
  errors?: unknown;
  meta: {
    timestamp: string;
    version: string;
  };
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): Response => {
  const payload: ApiResponse<T> = {
    status: 'success',
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown
): Response => {
  const status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
  const payload: ApiResponse<never> = {
    status,
    message,
    ...(errors ? { errors } : {}),
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };
  return res.status(statusCode).json(payload);
};
