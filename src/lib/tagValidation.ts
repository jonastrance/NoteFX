import { z } from 'zod';
import { tagSchema } from '../types/tag';

export const createTagSchema = tagSchema.extend({
  id: z.string().optional(),
  createdAt: z.number().optional(),
  usageCount: z.number().nonnegative().optional()
});

export type CreateTagInput = z.input<typeof createTagSchema>;

export const updateTagSchema = tagSchema.partial();

export type UpdateTagInput = z.input<typeof updateTagSchema>;
