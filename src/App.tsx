import { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/store/useAppStore';

function ThemeInitializer() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    function apply() {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      }
    }

    apply();

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => apply();
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, [theme]);

  return null;
}

export default function App() {
  return (
    <>
      <ThemeInitializer />
      <AppLayout />
    </>
  );
}
