import { z } from 'zod';

export const reminderSchema = z.object({
  minutesBefore: z.number().int().min(5).max(7 * 24 * 60)
});

export const recurrenceSchema = z
  .object({
    pattern: z.enum(['daily', 'weekly', 'monthly']),
    interval: z.number().int().positive().max(30).optional()
  })
  .nullable();

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(2000).optional(),
  dueDate: z
    .string()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Invalid due date')
    .or(z.null())
    .optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'completed']),
  noteId: z.string().uuid().optional().nullable(),
  recurrence: recurrenceSchema,
  reminders: z.array(reminderSchema).max(3).optional()
});

export type TaskSchema = z.infer<typeof taskSchema>;
