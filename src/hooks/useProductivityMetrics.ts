import { useMemo } from 'react';
import { FocusMetrics, TaskCompletionMetrics } from '../utils/analytics';
import { FocusSession, Note, Task, DateRange } from '../types/analytics';
import { calculateStreak, diffInDays } from '../utils/date';

export interface ProductivitySummary {
  averageDailyNotes: number;
  averageDailyFocusMinutes: number;
  focusEfficiency: number;
  streak: {
    current: number;
    longest: number;
  };
  estimatedFocusTimeToday: number;
  productivityScore: number;
  tasksCompleted: number;
}

interface UseProductivityMetricsArgs {
  notes: Note[];
  tasks: Task[];
  focusSessions: FocusSession[];
  focusMetrics: FocusMetrics;
  taskMetrics: TaskCompletionMetrics;
  dateRange: DateRange;
}

export const useProductivityMetrics = ({
  notes,
  tasks,
  focusSessions,
  focusMetrics,
  taskMetrics,
  dateRange
}: UseProductivityMetricsArgs) => {
  const totalDays = useMemo(() => Math.max(1, diffInDays(dateRange.start, dateRange.end)), [dateRange.start, dateRange.end]);

  const averageDailyNotes = useMemo(() => Number((notes.length / totalDays).toFixed(2)), [notes.length, totalDays]);

  const averageDailyFocusMinutes = useMemo(
    () => Number((focusMetrics.totalMinutes / totalDays).toFixed(1)),
    [focusMetrics.totalMinutes, totalDays]
  );

  const focusEfficiency = useMemo(() => {
    if (tasks.length === 0 || focusMetrics.totalMinutes === 0) return 0;
    return Number(((tasks.filter((task) => task.completed).length / focusMetrics.totalMinutes) * 60).toFixed(2));
  }, [tasks, focusMetrics.totalMinutes]);

  const streak = useMemo(
    () => calculateStreak(notes.map((note) => new Date(note.createdAt))),
    [notes]
  );

  const estimatedFocusTimeToday = useMemo(() => {
    if (focusSessions.length === 0) return 0;
    return focusMetrics.averageSessionMinutes * Math.max(1, focusSessions.length / totalDays);
  }, [focusSessions.length, focusMetrics.averageSessionMinutes, totalDays]);

  const productivityScore = useMemo(() => {
    const completionWeight = taskMetrics.completionRate / 100;
    const focusWeight = Math.min(1, averageDailyFocusMinutes / 120);
    const creationWeight = Math.min(1, averageDailyNotes / 3);
    return Number(((completionWeight * 0.5 + focusWeight * 0.3 + creationWeight * 0.2) * 100).toFixed(1));
  }, [taskMetrics.completionRate, averageDailyFocusMinutes, averageDailyNotes]);

  const tasksCompleted = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  return {
    averageDailyNotes,
    averageDailyFocusMinutes,
    focusEfficiency,
    streak,
    estimatedFocusTimeToday,
    productivityScore,
    tasksCompleted
  } satisfies ProductivitySummary;
};
