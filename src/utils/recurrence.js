import { addDays, addMonths, addWeeks } from 'date-fns';
export function getNextDueDate(task) {
    if (!task.dueDate || !task.recurrence) {
        return null;
    }
    const dueDate = new Date(task.dueDate);
    const interval = task.recurrence.interval ?? 1;
    switch (task.recurrence.pattern) {
        case 'daily':
            return addDays(dueDate, interval).toISOString();
        case 'weekly':
            return addWeeks(dueDate, interval).toISOString();
        case 'monthly':
            return addMonths(dueDate, interval).toISOString();
        default:
            return null;
    }
}
export function createRecurringInstance(task) {
    const nextDueDate = getNextDueDate(task);
    if (!nextDueDate) {
        return null;
    }
    return {
        ...task,
        id: crypto.randomUUID(),
        status: 'pending',
        dueDate: nextDueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}
