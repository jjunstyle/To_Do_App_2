import type { Filter } from '../types/task';

const TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행중' },
  { value: 'completed', label: '완료' },
];

interface Props {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function FilterBar({ filter, onFilterChange, activeCount, completedCount, onClearCompleted }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span className="text-slate-500 dark:text-slate-400">
        {activeCount}개 남음
      </span>

      <div className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onFilterChange(tab.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === tab.value
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className="text-slate-500 transition hover:text-rose-500 disabled:opacity-0 dark:text-slate-400 dark:hover:text-rose-400"
      >
        완료 항목 지우기
      </button>
    </div>
  );
}
