import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', register);

// POST /api/auth/login
authRouter.post('/login', login);

// POST /api/auth/logout
authRouter.post('/logout', logout);

// GET /api/auth/me (protected)
authRouter.get('/me', protect, getMe);
