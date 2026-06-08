import { Play } from 'lucide-react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200 cursor-pointer select-none
        ${checked
          ? 'bg-accent text-white shadow-lg shadow-accent/30'
          : 'bg-neutral-800 text-text-secondary hover:bg-neutral-700'
        }
      `}
    >
      <Play size={14} className={checked ? 'fill-white' : ''} />
      <span>{label}</span>
    </button>
  );
}
