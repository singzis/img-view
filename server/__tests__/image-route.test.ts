import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import sharp from 'sharp';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { imageRoutes } from '../routes/image';

describe('imageRoutes', () => {
  it('returns a resized thumbnail when width is requested', async () => {
    const app = Fastify();
    await app.register(imageRoutes);

    try {
      const dir = mkdtempSync(join(tmpdir(), 'img-view-route-'));
      const filePath = join(dir, 'sample.png');
      const source = await sharp({
        create: {
          width: 800,
          height: 600,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      }).png().toBuffer();
      writeFileSync(filePath, source);

      const response = await app.inject({
        method: 'GET',
        url: '/api/image',
        query: { path: filePath, width: '160' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('image/webp');

      const metadata = await sharp(response.rawPayload).metadata();
      expect(metadata.width).toBe(160);
      expect(metadata.height).toBe(160);
    } finally {
      await app.close();
    }
  });
});
