import { useAppStore } from '@/store/useAppStore';
import { getImageUrl } from '@/lib/api';
import { X } from 'lucide-react';
import CarouselControls from './CarouselControls';

export default function Carousel() {
  const {
    images, selectedImageIndex, setSelectedImage,
    nextImage, prevImage, toggleCarousel,
  } = useAppStore();

  const currentImage =
    selectedImageIndex >= 0 && selectedImageIndex < images.length
      ? images[selectedImageIndex]
      : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center"
         style={{ background: '#0A0A0C' }}
    >
      {currentImage ? (
        <>
          <img
            src={getImageUrl(currentImage.path)}
            alt={currentImage.name}
            className="max-w-full max-h-full object-contain"
          />

          <CarouselControls
            onPrev={prevImage}
            onNext={nextImage}
            currentIndex={selectedImageIndex}
            total={images.length}
            onDotClick={setSelectedImage}
            imageName={currentImage.name}
          />
        </>
      ) : (
        <p className="text-white/20 text-[15px] font-medium">没有图片可展示</p>
      )}

      {/* Close button */}
      <button
        onClick={toggleCarousel}
        className="absolute top-5 right-5 flex items-center gap-1.5 px-4 py-2 rounded-xl
                   bg-white/[0.06] backdrop-blur-xl border border-white/[0.08]
                   hover:bg-white/[0.1] text-white/70 hover:text-white text-[13px] font-medium
                   transition-all duration-200 cursor-pointer z-10"
      >
        <X size={14} />
        <span>退出轮播</span>
      </button>
    </div>
  );
}
