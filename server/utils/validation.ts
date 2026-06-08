import { z } from 'zod';

/** Check if a path is absolute — cross-platform (Unix / Windows) */
export function isAbsolutePath(p: string): boolean {
  // Unix: /Users/... or /home/...
  if (p.startsWith('/')) return true;
  // Windows: C:\... or C:/...
  if (/^[A-Za-z]:[/\\]/.test(p)) return true;
  // Windows UNC: \\server\share\...
  if (p.startsWith('\\\\')) return true;
  return false;
}

export const pathQuerySchema = z.object({
  path: z
    .string()
    .min(1, 'Path is required')
    .refine(isAbsolutePath, 'Path must be absolute (e.g., /Users/... or C:\\Users\\...)')
    .refine((p) => !p.includes('..'), 'Path traversal not allowed'),
});

export const imagePathQuerySchema = z.object({
  path: z
    .string()
    .min(1)
    .refine(isAbsolutePath, 'Path must be absolute')
    .refine((p) => !p.includes('..'), 'Path traversal not allowed')
    .refine(
      (p) => /\.(jpe?g|png|gif|webp|bmp|svg|avif)$/i.test(p),
      'File must be an image'
    ),
  width: z.coerce.number().int().min(1).max(1024).optional(),
});
