import { z } from 'zod';
export const taskSchema = z.object({
    id: z.string().uuid(),
    noteId: z.string().uuid().optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.string().nullable().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    completed: z.boolean().default(false),
    createdAt: z.string(),
    updatedAt: z.string()
});
