import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  wordCount: z.number().nonnegative(),
  readingTimeMinutes: z.number().nonnegative()
});

export type Note = z.infer<typeof noteSchema>;

export const taskSchema = z.object({
  id: z.string(),
  noteId: z.string().nullable(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
  dueDate: z.string().nullable()
});

export type Task = z.infer<typeof taskSchema>;

export const focusSessionSchema = z.object({
  id: z.string(),
  startedAt: z.string(),
  endedAt: z.string(),
  durationMinutes: z.number().nonnegative()
});

export type FocusSession = z.infer<typeof focusSessionSchema>;

export const goalSchema = z.object({
  id: z.string(),
  title: z.string(),
  metric: z.enum(['notesCreated', 'tasksCompleted', 'focusMinutes']),
  targetValue: z.number().positive(),
  currentValue: z.number().nonnegative(),
  deadline: z.string().nullable()
});

export type Goal = z.infer<typeof goalSchema>;

export const analyticsDataSchema = z.object({
  notes: z.array(noteSchema),
  tasks: z.array(taskSchema),
  focusSessions: z.array(focusSessionSchema),
  goals: z.array(goalSchema)
});

export type AnalyticsData = z.infer<typeof analyticsDataSchema>;

export type DateRangePreset = '7d' | '30d' | '90d' | '365d' | 'custom';

export interface DateRange {
  preset: DateRangePreset;
  start: Date;
  end: Date;
}

export interface ComparisonResult {
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
}

export interface ProductivityInsight {
  id: string;
  title: string;
  description: string;
  severity: 'positive' | 'warning' | 'info';
}
