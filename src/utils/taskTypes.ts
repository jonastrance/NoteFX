export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';
export type TaskRecurrencePattern = 'daily' | 'weekly' | 'monthly';

export interface TaskRecurrence {
  pattern: TaskRecurrencePattern;
  interval?: number;
}

export interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  noteId?: string | null;
  recurrence?: TaskRecurrence | null;
  reminders?: ReminderConfig[];
}

export interface Task extends TaskInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderConfig {
  minutesBefore: number;
}

export type TaskSortOption = 'dueDate' | 'priority' | 'createdAt';
