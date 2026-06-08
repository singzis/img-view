import { FastifyInstance } from 'fastify';
import { createReadStream } from 'node:fs';
import sharp from 'sharp';
import { imagePathQuerySchema } from '../utils/validation';
import { getMimeType, safeStat } from '../utils/image-utils';

export async function imageRoutes(app: FastifyInstance) {
  app.get('/api/image', async (request, reply) => {
    const parsed = imagePathQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid path',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { path: filePath, width } = parsed.data;
    const fileStat = safeStat(filePath);

    if (!fileStat || !fileStat.isFile()) {
      return reply.status(404).send({ error: 'Image not found' });
    }

    const mimeType = getMimeType(filePath);

    if (width) {
      try {
        const buffer = await sharp(filePath, { failOn: 'none' })
          .rotate()
          .resize({
            width,
            height: width,
            fit: 'cover',
            withoutEnlargement: true,
          })
          .webp({ quality: 78 })
          .toBuffer();

        reply.header('Content-Type', 'image/webp');
        reply.header('Content-Length', buffer.length);
        reply.header('Cache-Control', 'public, max-age=86400');
        return reply.send(buffer);
      } catch {
        return reply.status(500).send({ error: 'Failed to generate thumbnail' });
      }
    }

    const stream = createReadStream(filePath);

    reply.header('Content-Type', mimeType);
    reply.header('Content-Length', fileStat.size);
    reply.header('Cache-Control', 'public, max-age=3600');
    return reply.send(stream);
  });
}
