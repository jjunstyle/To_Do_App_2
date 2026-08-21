import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Priority, Task } from '../types/task';
import type { TaskEdits } from '../hooks/useTasks';
import { PriorityDot } from './PriorityBadge';
import { PRIORITY_LABEL } from '../utils/priority';
import { formatDueDate, getDueStatus } from '../utils/tasks';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, edits: TaskEdits) => void;
}

const DUE_STYLES = {
  overdue: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
  today: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  upcoming: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400',
};

const DUE_LABEL = { overdue: '지남', today: '오늘', upcoming: null };

export function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const startEdit = () => {
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate ?? '');
    setIsEditing(true);
  };

  const commit = () => {
    if (!title.trim()) {
      setIsEditing(false);
      return;
    }
    onEdit(task.id, { title, priority, dueDate: dueDate || null });
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') setIsEditing(false);
  };

  const dueStatus = getDueStatus(task.dueDate, task.completed);

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-2.5 sm:flex-row sm:items-center dark:border-indigo-500/30 dark:bg-indigo-500/5">
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:[color-scheme:dark]"
          />
          <button
            type="button"
            onClick={commit}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            취소
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/50">
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        onClick={() => onToggle(task.id)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-slate-300 hover:border-indigo-400 dark:border-slate-600'
        }`}
      >
        {task.completed && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <PriorityDot priority={task.priority} />

      <button
        type="button"
        onDoubleClick={startEdit}
        className={`min-w-0 flex-1 truncate text-left text-sm ${
          task.completed ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
        }`}
        title="더블클릭하여 수정"
      >
        {task.title}
      </button>

      {task.dueDate && (
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${DUE_STYLES[dueStatus ?? 'upcoming']}`}>
          {DUE_LABEL[dueStatus ?? 'upcoming'] ? `${DUE_LABEL[dueStatus ?? 'upcoming']} · ` : ''}
          {formatDueDate(task.dueDate)}
        </span>
      )}

      <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={startEdit}
          aria-label="수정"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M13.5 3.5a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L7.5 15.5 3 17l1.5-4.5 9-9Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label="삭제"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M6 2a1 1 0 0 0-1 1v1H3v2h14V4h-2V3a1 1 0 0 0-1-1H6ZM4 7h12l-.867 10.142A2 2 0 0 1 13.138 19H6.862a2 2 0 0 1-1.995-1.858L4 7Z" />
          </svg>
        </button>
      </div>
    </li>
  );
}
