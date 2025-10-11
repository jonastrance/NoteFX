import { differenceInMinutes, isBefore } from 'date-fns';
import { Task } from '../utils/taskTypes';

interface NotificationCenterProps {
  tasks: Task[];
}

const DUE_SOON_THRESHOLD_MINUTES = 60 * 24;

export function NotificationCenter({ tasks }: NotificationCenterProps) {
  const now = new Date();

  const dueSoonTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === 'completed') {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    const minutesUntilDue = differenceInMinutes(dueDate, now);

    const hasReminder = task.reminders?.some((reminder) => minutesUntilDue <= reminder.minutesBefore);

    return minutesUntilDue <= DUE_SOON_THRESHOLD_MINUTES || hasReminder || isBefore(dueDate, now);
  });

  if (dueSoonTasks.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Task reminders"
      className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 shadow-sm"
    >
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">Reminders</h2>
      <ul className="space-y-2">
        {dueSoonTasks.map((task) => {
          const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date';
          return (
            <li key={task.id} className="flex flex-col rounded-lg bg-white/50 p-3">
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-amber-700">
                Due {dueDate}
                {task.noteId ? ` · Linked to note ${task.noteId.slice(0, 8)}` : ''}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
