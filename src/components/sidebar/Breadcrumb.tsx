import { ChevronRight, Home } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Breadcrumb() {
  const { currentPath, rootPath, loadPath } = useAppStore();

  if (!currentPath || !rootPath) return null;

  const relativePath = currentPath.replace(rootPath, '').replace(/^\/+/, '');
  const extraSegments = relativePath ? relativePath.split('/').filter(Boolean) : [];

  const rootName = rootPath.split('/').filter(Boolean).pop() || rootPath;
  const allSegments = [rootName, ...extraSegments];

  const navigateTo = (index: number) => {
    if (index === 0) {
      loadPath(rootPath);
    } else {
      const target = rootPath + '/' + extraSegments.slice(0, index).join('/');
      loadPath(target);
    }
  };

  const isAtRoot = extraSegments.length === 0;

  return (
    <div className="px-3.5 py-2 border-b border-border w-full overflow-hidden">
      <div className="flex items-center gap-0.5 text-[12px] font-medium w-full">
        <Home size={12} className="text-text-muted shrink-0" />
        {allSegments.map((seg, i) => {
          const isLast = i === allSegments.length - 1;
          return (
            <span key={i} className="flex items-center gap-0.5 min-w-0 flex-shrink" style={{ flexShrink: isLast ? 0 : 1 }}>
              <button
                onClick={() => navigateTo(i)}
                disabled={isLast && isAtRoot}
                className={`
                  block truncate w-full rounded-md px-1.5 py-0.5 transition-all duration-200 cursor-pointer
                  ${isLast
                    ? 'text-text-primary cursor-default font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }
                `}
              >
                {seg}
              </button>
              {!isLast && (
                <ChevronRight size={10} className="text-text-muted shrink-0" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
