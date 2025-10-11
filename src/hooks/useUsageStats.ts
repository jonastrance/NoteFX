import { useMemo } from 'react';
import { FrequencyPoint, FocusMetrics, TagUsagePoint, TaskCompletionMetrics } from '../utils/analytics';
import { FocusSession, Note } from '../types/analytics';
import dayjs from 'dayjs';

interface UseUsageStatsArgs {
  notes: Note[];
  focusSessions: FocusSession[];
  noteFrequency: FrequencyPoint[];
  focusMetrics: FocusMetrics;
  taskMetrics: TaskCompletionMetrics;
  tagUsage: TagUsagePoint[];
}

export const useUsageStats = ({
  notes,
  focusSessions,
  noteFrequency,
  focusMetrics,
  taskMetrics,
  tagUsage
}: UseUsageStatsArgs) => {
  const busiestDay = useMemo(() => {
    if (noteFrequency.length === 0) return null;
    return noteFrequency.reduce((max, current) => (current.count > max.count ? current : max));
  }, [noteFrequency]);

  const peakFocusSession = useMemo(() => {
    if (focusSessions.length === 0) return null;
    return focusSessions.reduce((max, session) => (session.durationMinutes > max.durationMinutes ? session : max));
  }, [focusSessions]);

  const averageNoteAgeDays = useMemo(() => {
    if (notes.length === 0) return 0;
    const today = dayjs();
    const total = notes.reduce((acc, note) => acc + today.diff(dayjs(note.createdAt), 'day'), 0);
    return Number((total / notes.length).toFixed(1));
  }, [notes]);

  const recommendedFocus = useMemo(() => Math.max(25, focusMetrics.averageSessionMinutes * 1.1), [focusMetrics]);

  const qualityIndicator = useMemo(() => {
    const completionWeight = taskMetrics.completionRate / 100;
    const focusWeight = Math.min(1, focusMetrics.averageSessionMinutes / 60);
    return Number(((completionWeight * 0.6 + focusWeight * 0.4) * 5).toFixed(2));
  }, [taskMetrics.completionRate, focusMetrics.averageSessionMinutes]);

  const topTags = useMemo(() => tagUsage.slice(0, 5), [tagUsage]);

  return {
    busiestDay,
    peakFocusSession,
    averageNoteAgeDays,
    recommendedFocus,
    qualityIndicator,
    topTags
  } as const;
};
