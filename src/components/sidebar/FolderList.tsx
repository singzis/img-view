import { Folder, Image } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function FolderList() {
  const { folders, images, currentPath, loadPath, loading } = useAppStore();

  if (!currentPath) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-text-muted text-[13px] font-medium">
        输入路径后显示文件夹
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-text-muted text-[13px]">
        加载中...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-2 px-1.5">
      <div className="px-3.5 py-2 text-[11px] text-text-muted uppercase tracking-widest font-semibold">
        文件夹
      </div>

      {folders.map((folder) => (
        <button
          key={folder.path}
          onClick={() => loadPath(folder.path)}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium
                     text-text-secondary hover:bg-surface-hover hover:text-text-primary
                     transition-all duration-150 cursor-pointer text-left rounded-lg"
        >
          <Folder size={15} className="shrink-0 text-accent/50" />
          <span className="truncate flex-1">{folder.name}</span>
          <span className="text-[11px] text-text-muted shrink-0 font-medium tabular-nums">
            {folder.imageCount}
          </span>
        </button>
      ))}

      {folders.length > 0 && images.length > 0 && (
        <div className="my-2 border-t border-border" />
      )}

      {images.length > 0 && (
        <div className="px-3.5 py-1.5 text-[12px] text-text-muted font-medium flex items-center gap-1.5">
          <Image size={12} />
          <span>{images.length} 张图片</span>
        </div>
      )}
    </div>
  );
}
