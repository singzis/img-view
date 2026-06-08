import type { FileListResponse } from '@/store/types';

const API_BASE = '/api';

export async function fetchFiles(dirPath: string): Promise<FileListResponse> {
  const url = new URL(`${API_BASE}/files`, window.location.origin);
  url.searchParams.set('path', dirPath);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function getImageUrl(imagePath: string): string {
  const url = new URL(`${API_BASE}/image`, window.location.origin);
  url.searchParams.set('path', imagePath);
  return url.toString();
}

export function getThumbnailUrl(imagePath: string, width = 320): string {
  const url = new URL(`${API_BASE}/image`, window.location.origin);
  url.searchParams.set('path', imagePath);
  url.searchParams.set('width', String(width));
  return url.toString();
}
