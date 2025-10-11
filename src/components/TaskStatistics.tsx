import { differenceInCalendarDays, isAfter } from 'date-fns';
import { Task } from '../utils/taskTypes';

interface TaskStatisticsProps {
  tasks: Task[];
}

export function TaskStatistics({ tasks }: TaskStatisticsProps) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const overdue = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }
    return isAfter(new Date(), new Date(task.dueDate)) && task.status !== 'completed';
  });

  const averageCompletionTime = calculateAverageCompletionTime(tasks);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="task-stats-heading">
      <h2 id="task-stats-heading" className="text-xl font-semibold text-slate-900">
        Task insights
      </h2>
      <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total tasks</dt>
          <dd className="text-2xl font-bold text-slate-900">{total}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completion rate</dt>
          <dd className="text-2xl font-bold text-slate-900">{completionRate}%</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overdue tasks</dt>
          <dd className="text-2xl font-bold text-rose-600">{overdue.length}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg. days to complete</dt>
          <dd className="text-2xl font-bold text-slate-900">{averageCompletionTime.toFixed(1)}</dd>
        </div>
      </dl>
    </section>
  );
}

function calculateAverageCompletionTime(tasks: Task[]): number {
  const completedTasks = tasks.filter((task) => task.status === 'completed' && task.dueDate);
  if (completedTasks.length === 0) {
    return 0;
  }

  const totalDays = completedTasks.reduce((sum, task) => {
    if (!task.dueDate) {
      return sum;
    }
    const diff = differenceInCalendarDays(new Date(task.updatedAt), new Date(task.createdAt));
    return sum + Math.max(diff, 0);
  }, 0);

  return totalDays / completedTasks.length;
}
