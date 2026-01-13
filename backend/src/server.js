import http from 'http';

import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

async function main() {
  await connectDb(env.mongoUri);

  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`GigFlow backend listening on :${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
