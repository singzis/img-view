import { useEffect } from 'react';

interface KeyboardHandlers {
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEscape?: () => void;
}

const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  if (INPUT_TAGS.has(el.tagName)) return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export function useKeyboard(handlers: KeyboardHandlers, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Never capture when an input/textarea/select is focused
      if (isInputFocused()) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onArrowLeft?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.onArrowRight?.();
          break;
        case 'Escape':
          e.preventDefault();
          handlers.onEscape?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers.onArrowLeft, handlers.onArrowRight, handlers.onEscape, enabled]);
}
