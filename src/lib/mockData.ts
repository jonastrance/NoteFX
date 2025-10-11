import { AnalyticsData } from '../types/analytics';
import { estimateReadingTime } from '../utils/date';

const lorem = `The Modern Notes app enables creators to capture, organize, and act on their ideas quickly. With AI tagging and privacy-first analytics, teams can stay in flow while making informed decisions about productivity.`;

const makeNote = (id: number, daysAgo: number, tags: string[]): AnalyticsData['notes'][number] => {
  const wordCount = lorem.split(' ').length + id * 25;
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  return {
    id: `note-${id}`,
    title: `Productivity Note ${id}`,
    content: lorem.repeat((id % 3) + 1),
    tags,
    createdAt,
    updatedAt: createdAt,
    wordCount,
    readingTimeMinutes: estimateReadingTime(wordCount)
  };
};

const makeTask = (id: number, daysAgo: number, completed: boolean): AnalyticsData['tasks'][number] => {
  const createdAt = new Date(Date.now() - (daysAgo + 1) * 24 * 60 * 60 * 1000);
  const completedAt = completed ? new Date(createdAt.getTime() + 2 * 60 * 60 * 1000) : null;
  return {
    id: `task-${id}`,
    noteId: `note-${(id % 8) + 1}`,
    title: `Task ${id}`,
    completed,
    createdAt: createdAt.toISOString(),
    completedAt: completedAt ? completedAt.toISOString() : null,
    dueDate: new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
  };
};

const makeSession = (id: number, daysAgo: number, minutes: number): AnalyticsData['focusSessions'][number] => {
  const start = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000);
  return {
    id: `focus-${id}`,
    startedAt: start.toISOString(),
    endedAt: new Date(start.getTime() + minutes * 60 * 1000).toISOString(),
    durationMinutes: minutes
  };
};

export const mockAnalyticsData: AnalyticsData = {
  notes: [
    makeNote(1, 1, ['planning', 'weekly-review']),
    makeNote(2, 2, ['deep-work']),
    makeNote(3, 3, ['planning', 'meeting']),
    makeNote(4, 4, ['personal']),
    makeNote(5, 5, ['deep-work', 'research']),
    makeNote(6, 6, ['learning']),
    makeNote(7, 7, ['planning']),
    makeNote(8, 8, ['learning', 'weekly-review']),
    makeNote(9, 9, ['meeting']),
    makeNote(10, 10, ['deep-work'])
  ],
  tasks: [
    makeTask(1, 0, true),
    makeTask(2, 1, true),
    makeTask(3, 2, false),
    makeTask(4, 3, true),
    makeTask(5, 4, true),
    makeTask(6, 5, false),
    makeTask(7, 6, true),
    makeTask(8, 7, true)
  ],
  focusSessions: [
    makeSession(1, 0, 45),
    makeSession(2, 1, 50),
    makeSession(3, 2, 30),
    makeSession(4, 3, 60),
    makeSession(5, 4, 25),
    makeSession(6, 5, 70),
    makeSession(7, 6, 40)
  ],
  goals: [
    {
      id: 'goal-1',
      title: 'Create 20 notes this month',
      metric: 'notesCreated',
      targetValue: 20,
      currentValue: 12,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'goal-2',
      title: 'Complete 15 tasks',
      metric: 'tasksCompleted',
      targetValue: 15,
      currentValue: 10,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'goal-3',
      title: 'Focus for 600 minutes',
      metric: 'focusMinutes',
      targetValue: 600,
      currentValue: 420,
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};
