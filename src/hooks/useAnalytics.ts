import { useMemo } from 'react';
import {
  AnalyticsData,
  DateRange,
  analyticsDataSchema
} from '../types/analytics';
import { getPreviousRange, isWithinRange } from '../utils/date';
import {
  buildComparisonMetrics,
  calculateFocusMetrics,
  calculateGoalProgress,
  calculateNoteFrequency,
  calculateNoteLengthStats,
  calculateProductivityTrends,
  calculateTagUsage,
  calculateTaskCompletionMetrics,
  generateInsights
} from '../utils/analytics';

export interface UseAnalyticsOptions {
  dateRange: DateRange;
  analyticsEnabled: boolean;
  trendView: 'daily' | 'weekly' | 'monthly';
}

export const useAnalytics = (data: AnalyticsData, options: UseAnalyticsOptions) => {
  const { dateRange, analyticsEnabled, trendView } = options;
  const parsed = useMemo(() => analyticsDataSchema.parse(data), [data]);

  const previousRange = useMemo(() => getPreviousRange(dateRange.start, dateRange.end), [dateRange.start, dateRange.end]);

  const filterByRange = useMemo(() => {
    return (start: Date, end: Date) => {
      if (!analyticsEnabled) {
        return {
          notes: [] as typeof parsed.notes,
          tasks: [] as typeof parsed.tasks,
          focusSessions: [] as typeof parsed.focusSessions
        };
      }

      const notes = parsed.notes.filter((note) => isWithinRange(note.createdAt, start, end));
      const tasks = parsed.tasks.filter((task) =>
        isWithinRange(task.createdAt, start, end) ||
        (task.completed && task.completedAt ? isWithinRange(task.completedAt, start, end) : false)
      );
      const focusSessions = parsed.focusSessions.filter((session) => isWithinRange(session.startedAt, start, end));

      return { notes, tasks, focusSessions };
    };
  }, [analyticsEnabled, parsed]);

  const currentRangeData = useMemo(
    () => filterByRange(dateRange.start, dateRange.end),
    [dateRange.start, dateRange.end, analyticsEnabled, parsed]
  );

  const previousRangeData = useMemo(
    () => filterByRange(previousRange.start, previousRange.end),
    [previousRange.start, previousRange.end, analyticsEnabled, parsed]
  );

  const noteFrequency = useMemo(
    () => calculateNoteFrequency(currentRangeData.notes, dateRange.start, dateRange.end),
    [currentRangeData.notes, dateRange.start, dateRange.end]
  );

  const taskMetrics = useMemo(
    () => calculateTaskCompletionMetrics(currentRangeData.tasks),
    [currentRangeData.tasks]
  );

  const focusMetrics = useMemo(
    () => calculateFocusMetrics(currentRangeData.focusSessions),
    [currentRangeData.focusSessions]
  );

  const tagUsage = useMemo(
    () => calculateTagUsage(currentRangeData.notes),
    [currentRangeData.notes]
  );

  const noteStats = useMemo(
    () => calculateNoteLengthStats(currentRangeData.notes),
    [currentRangeData.notes]
  );

  const trendData = useMemo(
    () =>
      calculateProductivityTrends(
        currentRangeData.notes,
        currentRangeData.tasks,
        currentRangeData.focusSessions,
        trendView
      ),
    [currentRangeData.notes, currentRangeData.tasks, currentRangeData.focusSessions, trendView]
  );

  const goalProgress = useMemo(
    () => calculateGoalProgress(parsed.goals),
    [parsed.goals]
  );

  const comparison = useMemo(
    () => buildComparisonMetrics(currentRangeData, previousRangeData),
    [currentRangeData, previousRangeData]
  );

  const insights = useMemo(
    () => generateInsights({ noteStats, taskMetrics, focusMetrics, tagUsage }),
    [noteStats, taskMetrics, focusMetrics, tagUsage]
  );

  return {
    raw: parsed,
    currentRangeData,
    previousRangeData,
    noteFrequency,
    taskMetrics,
    focusMetrics,
    tagUsage,
    noteStats,
    trendData,
    goalProgress,
    comparison,
    insights
  };
};
