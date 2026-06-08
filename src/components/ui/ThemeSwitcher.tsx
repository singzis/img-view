import { Sun, Moon, Monitor } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { ThemeMode } from '@/store/types';

const options: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: 'system', icon: Monitor, label: '跟随系统' },
  { mode: 'light', icon: Sun, label: '浅色' },
  { mode: 'dark', icon: Moon, label: '深色' },
];

export default function ThemeSwitcher() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-surface-hover border border-border">
      {options.map(({ mode, icon: Icon, label }) => {
        const active = theme === mode;
        return (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            title={label}
            className={`
              flex items-center justify-center w-8 h-8 rounded-lg
              transition-all duration-200 cursor-pointer
              ${active
                ? 'bg-white dark:bg-white/[0.12] text-accent shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
              }
            `}
            aria-label={label}
          >
            <Icon size={16} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}
