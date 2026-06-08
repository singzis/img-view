import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { filesRoutes } from './routes/files';
import { imageRoutes } from './routes/image';

const app = Fastify({ logger: true });

async function start() {
  await app.register(cors, { origin: true });
  await app.register(filesRoutes);
  await app.register(imageRoutes);

  // Serve static files in production (Electron / deployed mode)
  const staticDir = process.env.SERVE_STATIC
    ? join(process.cwd(), process.env.SERVE_STATIC)
    : null;

  if (staticDir && existsSync(staticDir)) {
    await app.register(fastifyStatic, {
      root: staticDir,
      prefix: '/',
      wildcard: false,
    });
    // SPA fallback — serve index.html for non-API routes
    app.setNotFoundHandler((_req, reply) => {
      reply.sendFile('index.html');
    });
    console.log(`Serving static files from ${staticDir}`);
  }

  const port = parseInt(process.env.PORT || '3001', 10);
  const host = process.env.HOST || '127.0.0.1';

  try {
    const address = await app.listen({ port, host });
    console.log(`Server running at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
