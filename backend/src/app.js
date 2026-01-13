import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { env } from './config/env.js';
import { sanitizeError } from './utils/errors.js';
import { authRouter } from './routes/auth.routes.js';
import { gigRouter } from './routes/gig.routes.js';
import { bidRouter } from './routes/bid.routes.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/gigs', gigRouter);
  app.use('/api/bids', bidRouter);

  // 404 handler for unknown routes
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  // Centralized error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const { status, message } = sanitizeError(err, env.nodeEnv === 'production');
    res.status(status).json({ success: false, error: message });
  });

  return app;
}
