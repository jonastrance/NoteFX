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
export const taskSchema = z.object({
    id: z.string(),
    noteId: z.string().nullable(),
    title: z.string(),
    completed: z.boolean(),
    createdAt: z.string(),
    completedAt: z.string().nullable(),
    dueDate: z.string().nullable()
});
export const focusSessionSchema = z.object({
    id: z.string(),
    startedAt: z.string(),
    endedAt: z.string(),
    durationMinutes: z.number().nonnegative()
});
export const goalSchema = z.object({
    id: z.string(),
    title: z.string(),
    metric: z.enum(['notesCreated', 'tasksCompleted', 'focusMinutes']),
    targetValue: z.number().positive(),
    currentValue: z.number().nonnegative(),
    deadline: z.string().nullable()
});
export const analyticsDataSchema = z.object({
    notes: z.array(noteSchema),
    tasks: z.array(taskSchema),
    focusSessions: z.array(focusSessionSchema),
    goals: z.array(goalSchema)
});
