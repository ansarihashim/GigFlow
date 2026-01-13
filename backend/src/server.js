import http from 'http';

import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { initializeSocket } from './socket/socketManager.js';

async function main() {
  await connectDb(env.mongoUri);
  console.log('Database connected');

  const app = createApp();
  const server = http.createServer(app);

  // Initialize Socket.io with the same HTTP server
  initializeSocket(server);
  console.log('Socket.io initialized');

  server.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
}

main().catch((err) => {
  console.error('Server startup failed:', err.message);
  process.exit(1);
});
