import { useId } from 'react';
import clsx from 'clsx';
import { TaskPriority, TaskStatus } from '../utils/taskTypes';

export interface TaskFilterState {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  due: 'all' | 'overdue' | 'upcoming';
}

interface TaskFilterProps {
  value: TaskFilterState;
  onChange: (value: TaskFilterState) => void;
}

export function TaskFilter({ value, onChange }: TaskFilterProps) {
  const id = useId();

  const update = (partial: Partial<TaskFilterState>) => onChange({ ...value, ...partial });

  const filterClassName = (active: boolean) =>
    clsx(
      'rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      active ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    );

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Filter
      </span>
      <div className="flex items-center gap-1">
        {[
          { label: 'All', value: 'all' as const },
          { label: 'Pending', value: 'pending' as const },
          { label: 'Completed', value: 'completed' as const }
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={filterClassName(value.status === option.value)}
            onClick={() => update({ status: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {[
          { label: 'All priorities', value: 'all' as const },
          { label: 'High', value: 'high' as const },
          { label: 'Medium', value: 'medium' as const },
          { label: 'Low', value: 'low' as const }
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={filterClassName(value.priority === option.value)}
            onClick={() => update({ priority: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {[
          { label: 'Any due date', value: 'all' as const },
          { label: 'Overdue', value: 'overdue' as const },
          { label: 'Upcoming', value: 'upcoming' as const }
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={filterClassName(value.due === option.value)}
            onClick={() => update({ due: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
