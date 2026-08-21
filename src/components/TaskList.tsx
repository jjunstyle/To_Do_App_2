import type { Task } from '../types/task';
import type { TaskEdits } from '../hooks/useTasks';
import { TaskItem } from './TaskItem';

interface Props {
  tasks: Task[];
  hasAnyTasks: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, edits: TaskEdits) => void;
}

export function TaskList({ tasks, hasAnyTasks, onToggle, onDelete, onEdit }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
        <span className="text-3xl">{hasAnyTasks ? '🔍' : '📝'}</span>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {hasAnyTasks ? '조건에 맞는 할 일이 없어요' : '아직 할 일이 없어요. 하나 추가해보세요!'}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </ul>
  );
}
