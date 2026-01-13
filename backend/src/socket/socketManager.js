import { Server } from 'socket.io';
import cookie from 'cookie';
import { verifyToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

/**
 * In-memory mapping: userId -> socketId
 */
const userSocketMap = new Map();

/**
 * Socket.io server instance (set during initialization)
 */
let io = null;

/**
 * Initialize Socket.io with the HTTP server
 */
export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
    }

    socket.on('disconnect', () => {
      if (userId) {
        userSocketMap.delete(userId);
      }
    });
  });

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error('Authentication error: No cookies'));
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies[env.cookieName];

      if (!token) {
        return next(new Error('Authentication error: No token'));
      }

      const decoded = verifyToken(token);

      if (!decoded?.sub) {
        return next(new Error('Authentication error: Invalid token'));
      }

      // Attach userId to socket for later use
      socket.userId = decoded.sub;

      return next();
    } catch (error) {
      return next(new Error('Authentication error: Token verification failed'));
    }
  });

  return io;
}

/**
 * Get the Socket.io server instance
 */
export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

/**
 * Get socket ID for a specific user
 */
export function getSocketIdByUserId(userId) {
  return userSocketMap.get(userId) ?? null;
}

/**
 * Emit event to a specific user by userId
 * Returns true if user is online and event was emitted, false otherwise
 */
export function emitToUser(userId, event, payload) {
  const socketId = getSocketIdByUserId(userId);

  if (!socketId || !io) {
    return false;
  }

  io.to(socketId).emit(event, payload);
  return true;
}

/**
 * Check if a user is currently connected
 */
export function isUserOnline(userId) {
  return userSocketMap.has(userId);
}
