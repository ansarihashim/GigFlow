import { io } from 'socket.io-client';

let socket = null;

const SOCKET_URL = 'http://localhost:5000';

export function connectSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      withCredentials: true, // Important for cookies
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }
  return socket;
}

export function onHired(callback) {
  if (!socket) return;
  socket.on('hired', callback);

  // Return cleanup function
  return () => {
    socket.off('hired', callback);
  };
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export default { connectSocket, onHired, disconnectSocket };
