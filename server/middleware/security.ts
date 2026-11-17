import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { config } from '../config.js';

export const configureSecurityHeaders = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'http://localhost:5173', 'http://localhost:3001', 'https://air-quality-api.open-meteo.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
  });
};

export const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP. Please wait before trying again.',
  },
});

export const sanitizeString = (input: unknown): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // strip entire HTML tags like <script> or </script>
    .replace(/[<>]/g, '')    // strip any remaining brackets
    .replace(/javascript:/gi, '')
    .trim();
};

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+override/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /jailbreak/i,
  /act\s+as\s+a\s+dan/i,
  /disregard\s+(the\s+)?(safety\s+)?guidelines/i,
  /reveal\s+(internal\s+)?system\s+prompt/i,
];

export const checkPromptInjection = (text: string): { isSuspicious: boolean; cleanedText: string } => {
  let isSuspicious = false;
  let cleaned = text;

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(cleaned)) {
      isSuspicious = true;
      cleaned = cleaned.replace(pattern, '[REDACTED_OVERRIDE_ATTEMPT]');
    }
  }

  return { isSuspicious, cleanedText: cleaned };
};

export const inputSanitizationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
};
