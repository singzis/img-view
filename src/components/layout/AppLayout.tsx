import { useAppStore } from '@/store/useAppStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import Sidebar from '@/components/sidebar/Sidebar';
import Gallery from '@/components/gallery/Gallery';
import Preview from '@/components/preview/Preview';
import Carousel from '@/components/carousel/Carousel';
import ResizeHandle from './ResizeHandle';

export default function AppLayout() {
  const { carouselMode, toggleCarousel, nextImage, prevImage } = useAppStore();

  // Keyboard navigation only active during carousel mode
  useKeyboard(
    {
      onArrowLeft: prevImage,
      onArrowRight: nextImage,
      onEscape: toggleCarousel,
    },
    carouselMode
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar />

      {carouselMode ? (
        <div className="flex-1 min-w-0">
          <Carousel />
        </div>
      ) : (
        <>
          <div className="flex-1 min-w-[200px]">
            <Gallery />
          </div>

          <ResizeHandle />

          <Preview />
        </>
      )}
    </div>
  );
}
