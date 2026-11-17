import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  gcpProjectId: process.env.GCP_PROJECT_ID || 'promptwars-edition',
  gcpProjectNumber: process.env.GCP_PROJECT_NUMBER || '730243407394',
  gcpRegion: process.env.GCP_REGION || 'us-central1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '120', 10),
};
