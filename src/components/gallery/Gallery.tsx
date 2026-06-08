import { useAppStore } from '@/store/useAppStore';
import { Play, ChevronRight, Grid3X3 } from 'lucide-react';
import ThumbnailCard from './ThumbnailCard';

export default function Gallery() {
  const {
    images, currentPath, rootPath, selectedImageIndex,
    setSelectedImage, carouselMode, toggleCarousel, loadPath,
  } = useAppStore();

  const relativePath = rootPath
    ? currentPath.replace(rootPath, '').replace(/^\/+/, '')
    : '';
  const extraSegments = relativePath ? relativePath.split('/').filter(Boolean) : [];
  const rootName = rootPath
    ? rootPath.split('/').filter(Boolean).pop() || rootPath
    : currentPath.split('/').filter(Boolean).pop() || currentPath;

  const navigateTo = (index: number) => {
    if (!rootPath) return;
    if (index === -1) {
      loadPath(rootPath);
    } else {
      const target = rootPath + '/' + extraSegments.slice(0, index + 1).join('/');
      loadPath(target);
    }
  };

  const hasImages = images.length > 0;

  return (
    <div className="flex flex-col h-full glass-light">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-1 text-[13px] text-text-secondary min-w-0 overflow-x-auto font-medium">
          <Grid3X3 size={14} className="text-text-muted shrink-0 mr-0.5" />
          <button
            onClick={() => navigateTo(-1)}
            className="truncate max-w-[120px] rounded-md px-1.5 py-0.5 hover:bg-surface-hover hover:text-text-primary transition-all duration-200 cursor-pointer shrink-0"
          >
            {rootName}
          </button>
          {extraSegments.map((seg, i) => {
            const isLast = i === extraSegments.length - 1;
            return (
              <span key={i} className="flex items-center gap-0.5 min-w-0">
                <ChevronRight size={12} className="text-text-muted shrink-0" />
                <button
                  onClick={() => navigateTo(i)}
                  className={`
                    truncate max-w-[120px] rounded-md px-1.5 py-0.5 transition-all duration-200 cursor-pointer shrink-0
                    ${isLast
                      ? 'text-text-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    }
                  `}
                >
                  {seg}
                </button>
              </span>
            );
          })}
          {hasImages && (
            <span className="text-text-muted shrink-0 ml-2 text-[12px]">· {images.length} 张</span>
          )}
        </div>

        <button
          onClick={toggleCarousel}
          className={`
            flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[13px] font-semibold
            transition-all duration-300 cursor-pointer shrink-0
            ${carouselMode
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'bg-surface-hover text-text-secondary hover:text-text-primary hover:bg-white/[0.08]'
            }
          `}
        >
          <Play size={13} className={carouselMode ? 'fill-white' : ''} />
          <span>轮播</span>
        </button>
      </div>

      {/* Empty state */}
      {images.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-muted">
          <Grid3X3 size={36} strokeWidth={1} className="text-text-muted/25" />
          <p className="text-[13px] font-medium">
            {currentPath ? '当前目录无图片' : '请输入图片目录路径'}
          </p>
        </div>
      )}

      {/* Thumbnail grid */}
      {hasImages && (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
            {images.map((img, i) => (
              <ThumbnailCard
                key={img.path}
                image={img}
                isSelected={i === selectedImageIndex}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
