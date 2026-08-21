import type { Theme } from '../hooks/useTheme';

const OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: '라이트 모드', icon: '☀️' },
  { value: 'system', label: '시스템 설정', icon: '💻' },
  { value: 'dark', label: '다크 모드', icon: '🌙' },
];

interface Props {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          aria-label={opt.label}
          aria-pressed={theme === opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm transition ${
            theme === opt.value
              ? 'bg-white shadow-sm dark:bg-slate-600'
              : 'opacity-50 hover:opacity-80'
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
