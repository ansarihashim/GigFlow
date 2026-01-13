import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { User } from '../models/User.model.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  });
}

authRouter.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    });

    setAuthCookie(res, token);

    return res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    return next(err);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    });

    setAuthCookie(res, token);

    return res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    return next(err);
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax'
  });
  return res.json({ ok: true });
});

authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    const user = await User.findById(userId).select('_id name email');
    if (!user) return res.status(404).json({ error: 'not found' });
    return res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    return next(err);
  }
});
