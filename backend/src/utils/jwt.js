import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate a JWT for the given user payload
 */
export function generateToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

/**
 * Verify a JWT and return the decoded payload
 */
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

/**
 * Cookie options for storing JWT
 */
export function getCookieOptions() {
  const isProduction = env.nodeEnv === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: '/'
  };
}

/**
 * Set auth token cookie on response
 */
export function setTokenCookie(res, token) {
  res.cookie(env.cookieName, token, getCookieOptions());
}

/**
 * Clear auth token cookie
 */
export function clearTokenCookie(res) {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'strict' : 'lax',
    path: '/'
  });
}
