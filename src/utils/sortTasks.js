import { compareAsc } from 'date-fns';
function priorityWeight(priority) {
    switch (priority) {
        case 'high':
            return 0;
        case 'medium':
            return 1;
        default:
            return 2;
    }
}
export function sortTasks(tasks, sortBy) {
    const copy = [...tasks];
    switch (sortBy) {
        case 'priority':
            return copy.sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority));
        case 'createdAt':
            return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'dueDate':
        default:
            return copy.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) {
                    return 0;
                }
                if (!a.dueDate) {
                    return 1;
                }
                if (!b.dueDate) {
                    return -1;
                }
                return compareAsc(new Date(a.dueDate), new Date(b.dueDate));
            });
    }
}
