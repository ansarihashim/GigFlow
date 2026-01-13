// Socket.io client will be initialized here
let socket = null;

export function getSocket() {
  return socket;
}

export function initSocket() {
  // Socket initialization will be implemented
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export default { getSocket, initSocket, disconnectSocket };
