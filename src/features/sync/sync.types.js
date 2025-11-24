import { z } from 'zod';
export const syncStateSchema = z.object({
    lastSyncedAt: z.string().nullable(),
    status: z.enum(['idle', 'syncing', 'error']),
    conflictCount: z.number().nonnegative().default(0)
});
