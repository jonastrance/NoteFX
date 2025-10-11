import { Task } from './taskTypes';

const STORAGE_KEY = 'modern-notes-app/tasks';

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load tasks from storage', error);
    return [];
  }
}

export function persistTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to persist tasks', error);
  }
}
