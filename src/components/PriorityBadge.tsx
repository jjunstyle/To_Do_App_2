import type { Priority } from '../types/task';
import { PRIORITY_LABEL } from '../utils/priority';

const DOT_COLOR: Record<Priority, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-sky-500',
};

export function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${DOT_COLOR[priority]}`}
      title={`우선순위: ${PRIORITY_LABEL[priority]}`}
    />
  );
}
