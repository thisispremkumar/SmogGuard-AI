import express from 'express';
import cors from 'cors';
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

// Health check endpoint
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

// Mount modular API routes
app.use('/api/aqi', aqiRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/indoor-hacks', indoorAirRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/community', communityRoutes);

// Static file serving in production
if (config.nodeEnv === 'production') {
  const clientDist = path.join(__dirname, '../../dist/client');
  app.use(express.static(clientDist));
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

