import { useCallback, useMemo } from 'react';
import type { Priority, Task } from '../types/task';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'todo-app:tasks';

export interface NewTaskInput {
  title: string;
  priority: Priority;
  dueDate: string | null;
}

export interface TaskEdits {
  title?: string;
  priority?: Priority;
  dueDate?: string | null;
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  const addTask = useCallback(
    ({ title, priority, dueDate }: NewTaskInput) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      const task: Task = {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        priority,
        dueDate,
        createdAt: Date.now(),
        completedAt: null,
      };
      setTasks((prev) => [task, ...prev]);
    },
    [setTasks],
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completed: !t.completed, completedAt: t.completed ? null : Date.now() }
            : t,
        ),
      );
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  const editTask = useCallback(
    (id: string, edits: TaskEdits) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const nextTitle = edits.title !== undefined ? edits.title.trim() : t.title;
          if (!nextTitle) return t;
          return { ...t, ...edits, title: nextTitle };
        }),
      );
    },
    [setTasks],
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, [setTasks]);

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.length - activeCount, [tasks, activeCount]);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
    activeCount,
    completedCount,
  };
}
