import { memo } from 'react';
import { CheckCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Task } from '../utils/taskTypes';
import { useNotes } from '../modules/notes/useNotes';

interface TasksListProps {
  tasks: Task[];
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

const priorityStyles: Record<Task['priority'], string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700'
};

// Memoize individual task item to reduce re-renders
const TaskItem = memo(({ 
  task, 
  note, 
  onEdit, 
  onDelete, 
  onToggle 
}: { 
  task: Task; 
  note: any; 
  onEdit: () => void; 
  onDelete: () => void; 
  onToggle: () => void; 
}) => {
  const dueLabel = task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date';

  return (
    <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                task.status === 'completed'
                  ? 'border-accent bg-accent text-white'
                  : 'border-slate-300 bg-white text-slate-500 hover:border-primary hover:text-primary'
              )}
              onClick={onToggle}
            >
              <CheckCircleIcon className="h-5 w-5" aria-hidden />
            </button>
            <div>
              <p className="text-lg font-semibold text-slate-900">{task.title}</p>
              {task.description ? (
                <p className="text-sm text-slate-600">{task.description}</p>
              ) : null}
            </div>
          </div>
          <dl className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <dt className="font-medium uppercase tracking-wide">Due</dt>
              <dd>{dueLabel}</dd>
            </div>
            <div className="flex items-center gap-1">
              <dt className="font-medium uppercase tracking-wide">Priority</dt>
              <dd>
                <span className={clsx('rounded-full px-2 py-0.5 text-xs font-semibold', priorityStyles[task.priority])}>
                  {task.priority}
                </span>
              </dd>
            </div>
            <div className="flex items-center gap-1">
              <dt className="font-medium uppercase tracking-wide">Status</dt>
              <dd>{task.status}</dd>
            </div>
            {note ? (
              <div className="flex items-center gap-1">
                <dt className="font-medium uppercase tracking-wide">Note</dt>
                <dd className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-700">{note.title}</dd>
              </div>
            ) : null}
            {task.recurrence ? (
              <div className="flex items-center gap-1">
                <dt className="font-medium uppercase tracking-wide">Repeats</dt>
                <dd>
                  {task.recurrence.interval ?? 1} {task.recurrence.pattern}
                  {task.recurrence.interval && task.recurrence.interval > 1 ? 's' : ''}
                </dd>
              </div>
            ) : null}
            {task.reminders?.length ? (
              <div className="flex items-center gap-1">
                <dt className="font-medium uppercase tracking-wide">Reminders</dt>
                <dd>
                  {task.reminders
                    .map((reminder) => `${reminder.minutesBefore} min before`)
                    .join(', ')}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="flex gap-2 self-start">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 rounded-lg border border-transparent bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <PencilSquareIcon className="h-4 w-4" aria-hidden /> Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 rounded-lg border border-transparent bg-rose-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            <TrashIcon className="h-4 w-4" aria-hidden /> Delete
          </button>
        </div>
      </div>
    </li>
  );
});

TaskItem.displayName = 'TaskItem';

export const TasksList = memo(function TasksList({ tasks, onEditTask, onDeleteTask, onToggleComplete }: TasksListProps) {
  const { notesMap } = useNotes();

  if (tasks.length === 0) {
    return <p className="text-sm text-slate-500">No tasks yet. Create one to get started.</p>;
  }

  return (
    <ul className="space-y-4" aria-label="Tasks list">
      {tasks.map((task) => {
        const note = task.noteId ? notesMap[task.noteId] : null;
        return (
          <TaskItem
            key={task.id}
            task={task}
            note={note}
            onEdit={() => onEditTask(task.id)}
            onDelete={() => onDeleteTask(task.id)}
            onToggle={() => onToggleComplete(task.id, task.status === 'pending')}
          />
        );
      })}
    </ul>
  );
});
