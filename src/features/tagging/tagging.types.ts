import { z } from 'zod';

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  color: z.string().optional(),
  createdAt: z.string()
});

export type Tag = z.infer<typeof tagSchema>;
