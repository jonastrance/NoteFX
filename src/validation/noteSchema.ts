import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(120, 'Title must be under 120 characters'),
  content: z.string(),
  pinned: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const noteInputSchema = noteSchema.pick({ title: true, content: true, pinned: true });
export type NoteSchema = z.infer<typeof noteSchema>;
export type NoteInputSchema = z.infer<typeof noteInputSchema>;
