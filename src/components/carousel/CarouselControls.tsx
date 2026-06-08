import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
  onDotClick: (index: number) => void;
  imageName: string;
}

export default function CarouselControls({
  onPrev, onNext, currentIndex, total,
  onDotClick, imageName,
}: CarouselControlsProps) {
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  return (
    <>
      {/* Left arrow */}
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10
                   p-3 rounded-full bg-white/[0.06] backdrop-blur-xl
                   border border-white/[0.08] hover:bg-white/[0.12]
                   text-white/80 hover:text-white
                   disabled:opacity-20 disabled:cursor-not-allowed
                   transition-all duration-200 cursor-pointer shadow-lg"
        aria-label="上一张"
      >
        <ChevronLeft size={28} strokeWidth={1.5} />
      </button>

      {/* Right arrow */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10
                   p-3 rounded-full bg-white/[0.06] backdrop-blur-xl
                   border border-white/[0.08] hover:bg-white/[0.12]
                   text-white/80 hover:text-white
                   disabled:opacity-20 disabled:cursor-not-allowed
                   transition-all duration-200 cursor-pointer shadow-lg"
        aria-label="下一张"
      >
        <ChevronRight size={28} strokeWidth={1.5} />
      </button>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2.5 pb-8">
        {/* Dots */}
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer
                ${i === currentIndex
                  ? 'w-6 h-2 bg-white shadow-md shadow-white/20'
                  : 'w-2 h-2 bg-white/25 hover:bg-white/45'
                }`}
              aria-label={`第 ${i + 1} 张`}
            />
          ))}
        </div>

        {/* Name + position */}
        <p className="text-[13px] text-white/75 font-medium">{imageName}</p>
        <p className="text-[11px] text-white/40 font-medium tabular-nums">
          {currentIndex + 1} / {total}
        </p>
      </div>
    </>
  );
}
