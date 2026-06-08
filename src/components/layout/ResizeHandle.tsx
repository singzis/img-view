import { useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MIN_PREVIEW_WIDTH, MAX_PREVIEW_WIDTH } from '@/lib/constants';

export default function ResizeHandle() {
  const { setPreviewWidth } = useAppStore();
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startXRef.current = e.clientX;
      startWidthRef.current = useAppStore.getState().previewWidth;

      const onMouseMove = (e: MouseEvent) => {
        const delta = startXRef.current - e.clientX;
        const newWidth = Math.min(
          MAX_PREVIEW_WIDTH,
          Math.max(MIN_PREVIEW_WIDTH, startWidthRef.current + delta)
        );
        setPreviewWidth(newWidth);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [setPreviewWidth]
  );

  return (
    <div
      onMouseDown={onMouseDown}
      className="w-[3px] bg-transparent hover:bg-accent/40 cursor-col-resize
                 transition-colors duration-300 shrink-0 relative group"
    >
      {/* Subtle handle dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-1 h-8 rounded-full bg-white/[0.08]
                      group-hover:bg-accent/60 group-hover:h-12
                      transition-all duration-300" />
    </div>
  );
}
