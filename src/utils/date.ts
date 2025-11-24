import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const toDate = (value: string | Date): Date => {
  if (value instanceof Date) return value;
  return dayjs(value).toDate();
};

export const isWithinRange = (date: string | Date, start: Date, end: Date): boolean => {
  const d = dayjs(date);
  return d.isAfter(dayjs(start).subtract(1, 'millisecond')) && d.isBefore(dayjs(end).add(1, 'millisecond'));
};

export const getPresetRange = (preset: '7d' | '30d' | '90d' | '365d'): { start: Date; end: Date } => {
  const end = dayjs().endOf('day');
  const start = end.subtract(Number(preset.replace('d', '')) - 1, 'day').startOf('day');
  return { start: start.toDate(), end: end.toDate() };
};

export const diffInDays = (start: Date, end: Date): number => dayjs(end).diff(dayjs(start), 'day') + 1;

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => dayjs(date).format(format);

export const getPreviousRange = (start: Date, end: Date): { start: Date; end: Date } => {
  const days = diffInDays(start, end);
  const previousEnd = dayjs(start).subtract(1, 'day').endOf('day');
  const previousStart = previousEnd.subtract(days - 1, 'day').startOf('day');
  return { start: previousStart.toDate(), end: previousEnd.toDate() };
};

export const calculateStreak = (dates: Date[]): { current: number; longest: number } => {
  if (dates.length === 0) return { current: 0, longest: 0 };
  const sorted = [...dates].sort((a, b) => dayjs(a).diff(dayjs(b)));
  let longest = 1;
  let current = 1;
  let best = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    const diff = dayjs(sorted[i]).diff(sorted[i - 1], 'day');
    if (diff === 1) {
      current += 1;
    } else if (diff === 0) {
      continue;
    } else {
      best = Math.max(best, current);
      current = 1;
    }
  }

  best = Math.max(best, current);

  const today = dayjs().startOf('day');
  const last = dayjs(sorted[sorted.length - 1]).startOf('day');
  const currentStreak = today.diff(last, 'day') <= 1 ? current : 0;

  return { current: currentStreak, longest: best };
};

export const estimateReadingTime = (wordCount: number, wordsPerMinute = 200): number => {
  if (wordCount <= 0) return 0;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const formatDateDisplay = (date: string | number | Date) => {
  const value = typeof date === 'string' ? new Date(date) : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
};
