import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PREVIEW_WIDTH } from '@/lib/constants';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      theme: 'system',
      currentPath: '',
      rootPath: '',
      folders: [],
      images: [],
      totalCount: 0,
      loading: false,
      selectedImageIndex: -1,
      previewWidth: DEFAULT_PREVIEW_WIDTH,
      carouselMode: false,
    });
  });

  it('initializes with default values', () => {
    const s = useAppStore.getState();
    expect(s.theme).toBe('system');
    expect(s.currentPath).toBe('');
    expect(s.rootPath).toBe('');
    expect(s.folders).toEqual([]);
    expect(s.images).toEqual([]);
    expect(s.totalCount).toBe(0);
    expect(s.loading).toBe(false);
    expect(s.selectedImageIndex).toBe(-1);
    expect(s.previewWidth).toBe(DEFAULT_PREVIEW_WIDTH);
    expect(s.carouselMode).toBe(false);
  });

  it('setCurrentPath updates currentPath', () => {
    useAppStore.getState().setCurrentPath('/Users/test/images');
    expect(useAppStore.getState().currentPath).toBe('/Users/test/images');
  });

  it('setPreviewWidth updates previewWidth', () => {
    useAppStore.getState().setPreviewWidth(500);
    expect(useAppStore.getState().previewWidth).toBe(500);
  });

  it('toggleCarousel toggles carouselMode', () => {
    expect(useAppStore.getState().carouselMode).toBe(false);
    useAppStore.getState().toggleCarousel();
    expect(useAppStore.getState().carouselMode).toBe(true);
    useAppStore.getState().toggleCarousel();
    expect(useAppStore.getState().carouselMode).toBe(false);
  });

  it('setSelectedImage updates index', () => {
    useAppStore.getState().setSelectedImage(3);
    expect(useAppStore.getState().selectedImageIndex).toBe(3);
  });

  it('nextImage increments index', () => {
    useAppStore.setState({
      images: [
        { name: 'a.jpg', path: '/a.jpg', size: 100, mimeType: 'image/jpeg' },
        { name: 'b.jpg', path: '/b.jpg', size: 200, mimeType: 'image/jpeg' },
        { name: 'c.jpg', path: '/c.jpg', size: 300, mimeType: 'image/jpeg' },
      ],
      selectedImageIndex: 0,
    });
    useAppStore.getState().nextImage();
    expect(useAppStore.getState().selectedImageIndex).toBe(1);
    useAppStore.getState().nextImage();
    expect(useAppStore.getState().selectedImageIndex).toBe(2);
    // Should not go past the last image
    useAppStore.getState().nextImage();
    expect(useAppStore.getState().selectedImageIndex).toBe(2);
  });

  it('prevImage decrements index', () => {
    useAppStore.setState({
      images: [
        { name: 'a.jpg', path: '/a.jpg', size: 100, mimeType: 'image/jpeg' },
        { name: 'b.jpg', path: '/b.jpg', size: 200, mimeType: 'image/jpeg' },
      ],
      selectedImageIndex: 1,
    });
    useAppStore.getState().prevImage();
    expect(useAppStore.getState().selectedImageIndex).toBe(0);
    // Should not go below 0
    useAppStore.getState().prevImage();
    expect(useAppStore.getState().selectedImageIndex).toBe(0);
  });

  it('nextImage/prevImage do nothing when images is empty', () => {
    useAppStore.getState().nextImage();
    expect(useAppStore.getState().selectedImageIndex).toBe(-1);
    useAppStore.getState().prevImage();
    expect(useAppStore.getState().selectedImageIndex).toBe(-1);
  });

  it('setRootPath updates rootPath', () => {
    useAppStore.getState().setRootPath('/Users/test/images');
    expect(useAppStore.getState().rootPath).toBe('/Users/test/images');
  });

  it('toggleCarousel auto-selects first image when entering with no selection', () => {
    useAppStore.setState({
      images: [
        { name: 'a.jpg', path: '/a.jpg', size: 100, mimeType: 'image/jpeg' },
        { name: 'b.jpg', path: '/b.jpg', size: 200, mimeType: 'image/jpeg' },
      ],
      selectedImageIndex: -1,
      carouselMode: false,
    });
    useAppStore.getState().toggleCarousel();
    expect(useAppStore.getState().carouselMode).toBe(true);
    expect(useAppStore.getState().selectedImageIndex).toBe(0);
  });

  it('toggleCarousel keeps current selection when entering if already selected', () => {
    useAppStore.setState({
      images: [
        { name: 'a.jpg', path: '/a.jpg', size: 100, mimeType: 'image/jpeg' },
        { name: 'b.jpg', path: '/b.jpg', size: 200, mimeType: 'image/jpeg' },
      ],
      selectedImageIndex: 1,
      carouselMode: false,
    });
    useAppStore.getState().toggleCarousel();
    expect(useAppStore.getState().carouselMode).toBe(true);
    expect(useAppStore.getState().selectedImageIndex).toBe(1);
  });

  // Theme
  it('setTheme updates theme and persists to localStorage', () => {
    useAppStore.getState().setTheme('dark');
    expect(useAppStore.getState().theme).toBe('dark');
    expect(localStorage.getItem('imgview-theme')).toBe('dark');

    useAppStore.getState().setTheme('light');
    expect(useAppStore.getState().theme).toBe('light');
    expect(localStorage.getItem('imgview-theme')).toBe('light');

    useAppStore.getState().setTheme('system');
    expect(useAppStore.getState().theme).toBe('system');
    expect(localStorage.getItem('imgview-theme')).toBe('system');
  });
});
