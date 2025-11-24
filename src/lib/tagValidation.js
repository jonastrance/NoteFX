import { z } from 'zod';
import { tagSchema } from '../types/tag';
export const createTagSchema = tagSchema.extend({
    id: z.string().optional(),
    createdAt: z.number().optional(),
    usageCount: z.number().nonnegative().optional()
});
export const updateTagSchema = tagSchema.partial();
