import { useMemo, useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { FilterBar } from './components/FilterBar';
import { ThemeToggle } from './components/ThemeToggle';
import { sortTasks } from './utils/tasks';
import type { Filter } from './types/task';

const TODAY = new Date().toLocaleDateString('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

function App() {
  const { tasks, addTask, toggleTask, deleteTask, editTask, clearCompleted, activeCount, completedCount } =
    useTasks();
  const [theme, setTheme] = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const visibleTasks = useMemo(() => {
    let result = tasks;
    if (filter === 'active') result = result.filter((t) => !t.completed);
    if (filter === 'completed') result = result.filter((t) => t.completed);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    return sortTasks(result);
  }, [tasks, filter, query]);

  const total = tasks.length;
  const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">할 일</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{TODAY}</p>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <TaskInput onAdd={addTask} />

          {total > 0 && (
            <div className="mt-4">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {total > 0 && (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="할 일 검색"
              className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20"
            />
          )}

          <div className="mt-5">
            <TaskList
              tasks={visibleTasks}
              hasAnyTasks={total > 0}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          </div>

          {total > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <FilterBar
                filter={filter}
                onFilterChange={setFilter}
                activeCount={activeCount}
                completedCount={completedCount}
                onClearCompleted={clearCompleted}
              />
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
          더블클릭하여 할 일을 수정할 수 있어요 · 데이터는 브라우저에 저장돼요
        </p>
      </div>
    </div>
  );
}

export default App;
