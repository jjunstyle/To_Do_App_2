import type { Priority, Task } from '../types/task';

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/**
 * Active tasks: soonest due date first (no date last), then priority, then oldest first.
 * Completed tasks: most recently completed first.
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    if (a.completed && b.completed) {
      return (b.completedAt ?? 0) - (a.completedAt ?? 0);
    }

    if (a.dueDate !== b.dueDate) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate < b.dueDate ? -1 : 1;
    }

    if (a.priority !== b.priority) {
      return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    }

    return a.createdAt - b.createdAt;
  });
}

function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function getDueStatus(dueDate: string | null, completed: boolean): 'overdue' | 'today' | 'upcoming' | null {
  if (!dueDate || completed) return null;
  const today = todayISO();
  if (dueDate < today) return 'overdue';
  if (dueDate === today) return 'today';
  return 'upcoming';
}

export function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split('-').map(Number);
  const today = new Date();
  const isThisYear = year === today.getFullYear();
  return isThisYear ? `${month}월 ${day}일` : `${year}년 ${month}월 ${day}일`;
}
