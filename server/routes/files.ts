import { FastifyInstance } from 'fastify';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathQuerySchema } from '../utils/validation';
import { isImageFile, isHidden, safeStat, getMimeType } from '../utils/image-utils';

interface FolderEntry {
  name: string;
  path: string;
  imageCount: number;
}

interface ImageEntry {
  name: string;
  path: string;
  size: number;
  mimeType: string;
}

export async function filesRoutes(app: FastifyInstance) {
  app.get('/api/files', async (request, reply) => {
    const parsed = pathQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid path',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { path: dirPath } = parsed.data;

    const dirStat = safeStat(dirPath);
    if (!dirStat || !dirStat.isDirectory()) {
      return reply.status(400).send({ error: 'Path is not a valid directory' });
    }

    let entries: string[];
    try {
      entries = readdirSync(dirPath);
    } catch {
      return reply.status(500).send({ error: 'Failed to read directory' });
    }

    const folders: FolderEntry[] = [];
    const images: ImageEntry[] = [];

    for (const entry of entries.sort((a, b) => a.localeCompare(b))) {
      if (isHidden(entry)) continue;

      const fullPath = join(dirPath, entry);
      const stat = safeStat(fullPath);
      if (!stat) continue;

      if (stat.isDirectory()) {
        let imageCount = 0;
        try {
          imageCount = readdirSync(fullPath).filter(
            (f) => !isHidden(f) && isImageFile(f)
          ).length;
        } catch { /* skip unreadable */ }
        folders.push({ name: entry, path: fullPath, imageCount });
      } else if (stat.isFile() && isImageFile(entry)) {
        images.push({
          name: entry,
          path: fullPath,
          size: stat.size,
          mimeType: getMimeType(entry),
        });
      }
    }

    return {
      folders,
      images,
      totalCount: images.length,
    };
  });
}
