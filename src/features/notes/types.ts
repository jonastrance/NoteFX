import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  pinned: z.boolean().default(false)
});

export type Note = z.infer<typeof noteSchema>;
