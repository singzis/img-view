import { useAppStore } from '@/store/useAppStore';
import { SIDEBAR_WIDTH } from '@/lib/constants';
import { useIsElectron, useElectronPlatform } from '@/hooks/useIsElectron';
import PathInput from './PathInput';
import Breadcrumb from './Breadcrumb';
import FolderList from './FolderList';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export default function Sidebar() {
  const { totalCount, currentPath } = useAppStore();
  const isElectron = useIsElectron();
  const platform = useElectronPlatform();
  const isMacElectron = isElectron && platform === 'darwin';

  return (
    <div
      className="flex flex-col h-full glass-strong border-r border-border shrink-0 overflow-hidden"
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* macOS traffic lights spacer — draggable region clearing the close/minimize/zoom buttons */}
      {isMacElectron && (
        <div className="shrink-0 electron-drag-region h-[38px]" />
      )}

      <PathInput />
      <Breadcrumb />
      <FolderList />

      <div className="mt-auto">
        {/* Theme switcher */}
        <div className="px-3 py-2 border-t border-border">
          <ThemeSwitcher />
        </div>

        {currentPath && (
          <div className="px-4 py-2.5 border-t border-border text-xs text-text-muted font-medium tracking-wide">
            共 {totalCount} 张图片
          </div>
        )}
      </div>
    </div>
  );
}
