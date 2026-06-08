import { useAppStore } from '@/store/useAppStore';
import { getImageUrl } from '@/lib/api';
import { ImageIcon } from 'lucide-react';

export default function Preview() {
  const { images, selectedImageIndex, previewWidth } = useAppStore();
  const selectedImage = selectedImageIndex >= 0 ? images[selectedImageIndex] : null;

  return (
    <div
      className="flex flex-col h-full glass overflow-hidden shrink-0"
      style={{ width: previewWidth }}
    >
      {selectedImage ? (
        <>
          {/* Info header */}
          <div className="px-5 py-3 border-b border-border shrink-0">
            <p className="text-[13px] text-text-primary truncate font-semibold">
              {selectedImage.name}
            </p>
            <p className="text-[11px] text-text-muted font-medium mt-0.5">
              {(selectedImage.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>

          {/* Image area */}
          <div className="flex-1 flex items-center justify-center p-5 overflow-auto">
            <img
              src={getImageUrl(selectedImage.path)}
              alt={selectedImage.name}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl shadow-black/30"
            />
          </div>

          {/* Position indicator */}
          <div className="px-5 py-2.5 border-t border-border text-center text-[12px] text-text-muted font-medium shrink-0">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-muted">
          <ImageIcon size={44} strokeWidth={1} className="text-text-muted/20" />
          <p className="text-[13px] font-medium">选择一张图片以预览</p>
        </div>
      )}
    </div>
  );
}
