import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;

    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
