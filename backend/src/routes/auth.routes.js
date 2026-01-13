import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', register);

// POST /api/auth/login
authRouter.post('/login', login);
