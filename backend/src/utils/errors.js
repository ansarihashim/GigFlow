/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Factory functions for common errors
 */
export const badRequest = (message = 'Bad request') => new ApiError(400, message);
export const unauthorized = (message = 'Unauthorized') => new ApiError(401, message);
export const forbidden = (message = 'Forbidden') => new ApiError(403, message);
export const notFound = (message = 'Not found') => new ApiError(404, message);
export const conflict = (message = 'Conflict') => new ApiError(409, message);
export const internal = (message = 'Internal server error') => new ApiError(500, message);

/**
 * Wrap async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Sanitize error for client response (hide sensitive info)
 */
export function sanitizeError(err, isProduction) {
  // Known operational errors - safe to expose message
  if (err.isOperational) {
    return {
      status: err.statusCode,
      message: err.message
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return {
      status: 400,
      message: messages.join(', ')
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)?.[0] ?? 'field';
    return {
      status: 409,
      message: `Duplicate value for ${field}`
    };
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return {
      status: 400,
      message: 'Invalid ID format'
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return {
      status: 401,
      message: 'Invalid token'
    };
  }

  if (err.name === 'TokenExpiredError') {
    return {
      status: 401,
      message: 'Token expired'
    };
  }

  // Unknown errors - hide details in production
  return {
    status: 500,
    message: isProduction ? 'Internal server error' : err.message
  };
}
