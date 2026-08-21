export type Priority = 'low' | 'medium' | 'high';

export type Filter = 'all' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null; // ISO date string (yyyy-mm-dd), no time component
  createdAt: number;
  completedAt: number | null;
}
