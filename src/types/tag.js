import { z } from 'zod';
export const confidenceLevels = ['low', 'medium', 'high'];
export const tagSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Tag name is required'),
    color: z
        .string()
        .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/i, 'Color must be a valid hex value'),
    description: z.string().optional(),
    parentId: z.string().nullable().default(null),
    createdAt: z.number(),
    usageCount: z.number().nonnegative().default(0)
});
export const noteTagSchema = z.object({
    noteId: z.string(),
    tagId: z.string(),
    appliedAt: z.number(),
    source: z.enum(['manual', 'ai'])
});
export const tagSuggestionSchema = z.object({
    tag: tagSchema,
    confidence: z.enum(confidenceLevels),
    reason: z.string(),
    keywords: z.array(z.string()).default([])
});
export const tagFeedbackSchema = z.object({
    tagId: z.string(),
    accepted: z.boolean(),
    noteId: z.string(),
    feedbackAt: z.number()
});
