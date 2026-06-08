import { create } from 'zustand';
import type { AppState, FileListResponse, ThemeMode } from './types';
import { fetchFiles } from '@/lib/api';
import { DEFAULT_PREVIEW_WIDTH } from '@/lib/constants';

function getStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem('imgview-theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch { /* localStorage unavailable */ }
  return 'system';
}

function persistTheme(theme: ThemeMode) {
  try {
    localStorage.setItem('imgview-theme', theme);
  } catch { /* ignore */ }
}

function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // system — follow OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  // Theme
  theme: getStoredTheme(),
  setTheme: (theme: ThemeMode) => {
    persistTheme(theme);
    applyThemeClass(theme);
    set({ theme });
  },

  // Path
  currentPath: '',
  rootPath: '',
  setCurrentPath: (path: string) => set({ currentPath: path }),
  setRootPath: (path: string) => set({ rootPath: path }),

  // File data
  folders: [],
  images: [],
  totalCount: 0,
  loading: false,

  // Selection
  selectedImageIndex: -1,
  setSelectedImage: (index: number) => set({ selectedImageIndex: index }),

  // Layout
  previewWidth: DEFAULT_PREVIEW_WIDTH,
  setPreviewWidth: (width: number) => set({ previewWidth: width }),

  // Carousel
  carouselMode: false,
  toggleCarousel: () =>
    set((s) => {
      const entering = !s.carouselMode;
      const nextIndex =
        entering && s.selectedImageIndex === -1 && s.images.length > 0
          ? 0
          : s.selectedImageIndex;
      return { carouselMode: !s.carouselMode, selectedImageIndex: nextIndex };
    }),

  // Actions
  loadPath: async (path: string) => {
    if (!path.trim()) return;
    set({ currentPath: path, loading: true, selectedImageIndex: -1 });
    try {
      const data: FileListResponse = await fetchFiles(path);
      set({
        folders: data.folders,
        images: data.images,
        totalCount: data.totalCount,
        loading: false,
      });
    } catch (err) {
      console.error('Failed to load path:', err);
      set({ loading: false, folders: [], images: [], totalCount: 0 });
    }
  },

  nextImage: () => {
    const { images, selectedImageIndex } = get();
    if (images.length === 0) return;
    if (selectedImageIndex < images.length - 1) {
      set({ selectedImageIndex: selectedImageIndex + 1 });
    }
  },

  prevImage: () => {
    const { selectedImageIndex } = get();
    if (selectedImageIndex > 0) {
      set({ selectedImageIndex: selectedImageIndex - 1 });
    }
  },
}));
