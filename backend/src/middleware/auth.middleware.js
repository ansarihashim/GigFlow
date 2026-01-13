import { env } from '../config/env.js';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.model.js';

/**
 * Middleware to protect routes
 * - Reads token from cookies
 * - Verifies JWT
 * - Attaches user to req.user
 */
export async function protect(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.sub).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized, token invalid' });
  }
}
