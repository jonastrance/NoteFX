import { z } from 'zod';
export const analyticsSnapshotSchema = z.object({
    activeNotes: z.number().nonnegative(),
    completedTasks: z.number().nonnegative(),
    focusTimeMinutes: z.number().nonnegative(),
    generatedAt: z.string()
});
