import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { configureSecurityHeaders, apiLimiter, inputSanitizationMiddleware } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';

import aqiRoutes from './routes/aqiRoutes.js';
import routineRoutes from './routes/routineRoutes.js';
import indoorAirRoutes from './routes/indoorAirRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// High-Efficiency Gzip/Deflate Response Compression
app.use(compression({
  threshold: 1024, // Compress responses > 1 KB
}));

// Performance Timing Header
app.use((_req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  res.send = function (body) {
    if (!res.headersSent) {
      res.setHeader('Server-Timing', `total;dur=${Date.now() - start}`);
    }
    return originalSend.call(this, body);
  };
  next();
});

// Security Headers
app.use(configureSecurityHeaders());

// CORS configuration
app.use(cors({
  origin: config.nodeEnv === 'production' ? config.corsOrigin : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request limits & body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Input sanitization
app.use(inputSanitizationMiddleware);

// Rate limiting on API routes
app.use('/api', apiLimiter);

// Health check endpoint with GCP telemetry
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'SmogGuard AI Backend',
    gcpProjectId: config.gcpProjectId,
    gcpProjectNumber: config.gcpProjectNumber,
    geminiConfigured: !!config.geminiApiKey,
  });
});

// Cache control middleware for read-heavy static API routes
app.use('/api/indoor-hacks', (_req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=120');
  next();
});

// Mount modular API routes
app.use('/api/aqi', aqiRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/indoor-hacks', indoorAirRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/community', communityRoutes);

// Static file serving in production with aggressive immutable asset caching
if (config.nodeEnv === 'production') {
  const clientDist = path.join(__dirname, '../../dist/client');
  app.use('/assets', express.static(path.join(clientDist, 'assets'), {
    maxAge: '1y',
    immutable: true,
  }));
  app.use(express.static(clientDist, {
    maxAge: '1h',
  }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Centralized error handling
app.use(errorHandler);

// Start server if not running in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[SmogGuard AI] Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
}
