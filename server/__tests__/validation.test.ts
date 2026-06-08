import { describe, it, expect } from 'vitest';
import { isAbsolutePath, pathQuerySchema, imagePathQuerySchema } from '../utils/validation';

describe('isAbsolutePath', () => {
  // === Unix paths ===
  describe('Unix paths', () => {
    it('accepts root path', () => {
      expect(isAbsolutePath('/')).toBe(true);
    });

    it('accepts /home/user/images', () => {
      expect(isAbsolutePath('/home/user/images')).toBe(true);
    });

    it('accepts /tmp', () => {
      expect(isAbsolutePath('/tmp')).toBe(true);
    });
  });

  // === Windows paths with backslash ===
  describe('Windows paths (backslash)', () => {
    it('accepts C:\\Users\\Name\\Pictures', () => {
      expect(isAbsolutePath('C:\\Users\\Name\\Pictures')).toBe(true);
    });

    it('accepts D:\\Photos\\2024', () => {
      expect(isAbsolutePath('D:\\Photos\\2024')).toBe(true);
    });

    it('accepts lowercase drive letter e:\\data', () => {
      expect(isAbsolutePath('e:\\data')).toBe(true);
    });

    it('accepts Z:\\', () => {
      expect(isAbsolutePath('Z:\\')).toBe(true);
    });
  });

  // === Windows paths with forward slash ===
  describe('Windows paths (forward slash)', () => {
    it('accepts C:/Users/Name/Pictures', () => {
      expect(isAbsolutePath('C:/Users/Name/Pictures')).toBe(true);
    });

    it('accepts D:/Photos', () => {
      expect(isAbsolutePath('D:/Photos')).toBe(true);
    });
  });

  // === UNC paths ===
  describe('UNC paths', () => {
    it('accepts \\\\server\\share\\folder', () => {
      expect(isAbsolutePath('\\\\server\\share\\folder')).toBe(true);
    });

    it('accepts \\\\localhost\\c$\\Users', () => {
      expect(isAbsolutePath('\\\\localhost\\c$\\Users')).toBe(true);
    });
  });

  // === Reject relative paths ===
  describe('relative paths (rejected)', () => {
    it('rejects foo/bar', () => {
      expect(isAbsolutePath('foo/bar')).toBe(false);
    });

    it('rejects ./images', () => {
      expect(isAbsolutePath('./images')).toBe(false);
    });

    it('rejects ../parent', () => {
      expect(isAbsolutePath('../parent')).toBe(false);
    });

    it('rejects just a filename', () => {
      expect(isAbsolutePath('photo.jpg')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isAbsolutePath('')).toBe(false);
    });

    it('rejects Windows-style relative path (no drive)', () => {
      expect(isAbsolutePath('Users\\Name\\Pics')).toBe(false);
    });
  });
});

describe('pathQuerySchema', () => {
  describe('valid paths', () => {
    it('accepts Unix absolute path', () => {
      const result = pathQuerySchema.safeParse({ path: '/Users/test/Pictures' });
      expect(result.success).toBe(true);
    });

    it('accepts Windows absolute path C:\\', () => {
      const result = pathQuerySchema.safeParse({ path: 'C:\\Users\\Name\\Pictures' });
      expect(result.success).toBe(true);
    });

    it('accepts Windows forward slash path', () => {
      const result = pathQuerySchema.safeParse({ path: 'C:/Users/Name/Pictures' });
      expect(result.success).toBe(true);
    });

    it('accepts UNC path', () => {
      const result = pathQuerySchema.safeParse({ path: '\\\\server\\share' });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid paths', () => {
    it('rejects relative path', () => {
      const result = pathQuerySchema.safeParse({ path: 'relative/folder' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('absolute');
      }
    });

    it('rejects path with .. traversal', () => {
      const result = pathQuerySchema.safeParse({ path: '/Users/../etc/passwd' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('traversal'))).toBe(true);
      }
    });

    it('rejects Windows path with .. traversal', () => {
      const result = pathQuerySchema.safeParse({ path: 'C:\\Users\\..\\Windows' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('traversal'))).toBe(true);
      }
    });

    it('rejects empty path', () => {
      const result = pathQuerySchema.safeParse({ path: '' });
      expect(result.success).toBe(false);
    });

    it('rejects missing path field', () => {
      const result = pathQuerySchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});

describe('imagePathQuerySchema', () => {
  describe('valid image paths', () => {
    it('accepts Unix .jpg path', () => {
      const result = imagePathQuerySchema.safeParse({ path: '/Users/test/photo.jpg' });
      expect(result.success).toBe(true);
    });

    it('accepts Windows .png path', () => {
      const result = imagePathQuerySchema.safeParse({ path: 'C:\\Pics\\screenshot.png' });
      expect(result.success).toBe(true);
    });

    it('accepts .webp extension', () => {
      const result = imagePathQuerySchema.safeParse({ path: '/tmp/img.webp' });
      expect(result.success).toBe(true);
    });

    it('accepts .avif extension', () => {
      const result = imagePathQuerySchema.safeParse({ path: 'D:/photos/img.AVIF' });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid image paths', () => {
    it('rejects .txt file', () => {
      const result = imagePathQuerySchema.safeParse({ path: '/Users/test/readme.txt' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('image'))).toBe(true);
      }
    });

    it('rejects .exe file', () => {
      const result = imagePathQuerySchema.safeParse({ path: 'C:\\Windows\\notepad.exe' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('image'))).toBe(true);
      }
    });

    it('rejects path with .. traversal', () => {
      const result = imagePathQuerySchema.safeParse({ path: '/Users/../etc/passwd.jpg' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('traversal'))).toBe(true);
      }
    });

    it('rejects relative image path', () => {
      const result = imagePathQuerySchema.safeParse({ path: 'photos/beach.jpg' });
      expect(result.success).toBe(false);
    });
  });
});
