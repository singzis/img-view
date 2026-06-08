export interface FolderItem {
  name: string;
  path: string;
  imageCount: number;
}

export interface ImageItem {
  name: string;
  path: string;
  size: number;
  mimeType: string;
}

export interface FileListResponse {
  folders: FolderItem[];
  images: ImageItem[];
  totalCount: number;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppState {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Path
  currentPath: string;
  rootPath: string;
  setCurrentPath: (path: string) => void;
  setRootPath: (path: string) => void;

  // File data
  folders: FolderItem[];
  images: ImageItem[];
  totalCount: number;
  loading: boolean;

  // Selection
  selectedImageIndex: number;
  setSelectedImage: (index: number) => void;

  // Layout
  previewWidth: number;
  setPreviewWidth: (width: number) => void;

  // Carousel
  carouselMode: boolean;
  toggleCarousel: () => void;

  // Actions
  loadPath: (path: string) => Promise<void>;
  nextImage: () => void;
  prevImage: () => void;
}
