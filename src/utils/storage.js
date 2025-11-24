const STORAGE_KEY = 'modern-notes-app/tasks';
export function loadTasks() {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (error) {
        console.error('Failed to load tasks from storage', error);
        return [];
    }
}
export function persistTasks(tasks) {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
    catch (error) {
        console.error('Failed to persist tasks', error);
    }
}
