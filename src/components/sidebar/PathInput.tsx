import { useState } from 'react';
import { FolderOpen, Loader, ArrowRight, FolderSearch } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useIsElectron } from '@/hooks/useIsElectron';

export default function PathInput() {
  const isElectron = useIsElectron();
  const { currentPath, loading, loadPath, setRootPath } = useAppStore();
  const [inputValue, setInputValue] = useState(currentPath);
  const [pickerLoading, setPickerLoading] = useState(false);

  const handleSubmit = () => {
    setRootPath(inputValue);
    loadPath(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleNativePick = async () => {
    setPickerLoading(true);
    try {
      const selectedPath = await window.imgview?.selectDirectory();
      if (selectedPath) {
        setInputValue(selectedPath);
        setRootPath(selectedPath);
        loadPath(selectedPath);
      }
    } finally {
      setPickerLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3.5 border-b border-border overflow-hidden">
      {isElectron ? (
        /* Electron: native directory picker */
        <button
          onClick={handleNativePick}
          disabled={pickerLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                     bg-accent text-white rounded-xl text-[13px] font-semibold
                     hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-200 cursor-pointer shadow-sm shadow-accent/20"
        >
          {pickerLoading ? (
            <Loader size={15} className="animate-spin" />
          ) : (
            <FolderSearch size={15} />
          )}
          <span>选择文件夹...</span>
        </button>
      ) : (
        /* Web: manual path input */
        <>
          <div className="relative flex-1 min-w-0">
            <FolderOpen
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="/path/to/images..."
              className="w-full pl-8 pr-3 py-2 bg-white/[0.04] border border-border
                         rounded-lg text-[13px] text-text-primary placeholder:text-text-muted
                         focus:outline-none focus:border-accent/30 focus:bg-white/[0.06]
                         transition-all duration-200 font-medium"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !inputValue.trim()}
            className="flex items-center gap-1.5 px-3 py-2 bg-accent text-white rounded-lg
                       text-[13px] font-semibold
                       hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200 cursor-pointer shadow-sm shadow-accent/20"
          >
            {loading ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <ArrowRight size={14} />
            )}
          </button>
        </>
      )}
    </div>
  );
}
