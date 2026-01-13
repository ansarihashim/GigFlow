import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';

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
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);

  // Basic error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const status = err.statusCode ?? 500;
    const message = env.nodeEnv === 'production' ? 'Server error' : err.message;
    res.status(status).json({ error: message });
  });

  return app;
}
