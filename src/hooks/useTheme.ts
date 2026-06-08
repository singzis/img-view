import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

/** Sync theme to DOM — run once on mount + listen for system changes */
export function useThemeSync() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    function apply() {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // system
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      }
    }

    apply();

    // Listen for OS theme changes when in system mode
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => apply();
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, [theme]);
}
