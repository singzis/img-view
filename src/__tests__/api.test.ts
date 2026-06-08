import { describe, it, expect } from 'vitest';
import { getImageUrl, getThumbnailUrl } from '@/lib/api';

describe('API client', () => {
  it('getImageUrl builds correct URL with encoded path', () => {
    const url = getImageUrl('/Users/test/my photo.jpg');
    expect(url).toContain('/api/image');
    expect(url).toContain('path=');
    expect(url).toMatch(/my\+photo\.jpg|my%20photo\.jpg/);
  });

  it('getImageUrl handles simple paths', () => {
    const url = getImageUrl('/tmp/test.png');
    expect(url).toContain('/api/image');
    expect(url).toContain('test.png');
  });

  it('getThumbnailUrl adds a thumbnail width', () => {
    const url = getThumbnailUrl('/tmp/test.png', 240);
    expect(url).toContain('/api/image');
    expect(url).toContain('test.png');
    expect(url).toContain('width=240');
  });
});
