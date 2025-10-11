import { describe, expect, it } from 'vitest';
import {
  buildComparisonMetrics,
  calculateFocusMetrics,
  calculateGoalProgress,
  calculateNoteFrequency,
  calculateNoteLengthStats,
  calculateProductivityTrends,
  calculateTagUsage,
  calculateTaskCompletionMetrics,
  generateInsights,
  prepareCsvData,
  prepareJsonData
} from '../utils/analytics';
import { calculateStreak, estimateReadingTime, getPresetRange } from '../utils/date';
import { AnalyticsData } from '../types/analytics';

const data: AnalyticsData = {
  notes: [
    {
      id: '1',
      title: 'Daily Note',
      content: 'One',
      tags: ['daily'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: 400,
      readingTimeMinutes: estimateReadingTime(400)
    },
    {
      id: '2',
      title: 'Weekly Plan',
      content: 'Two',
      tags: ['planning', 'weekly'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: 800,
      readingTimeMinutes: estimateReadingTime(800)
    }
  ],
  tasks: [
    {
      id: 'task-1',
      noteId: '1',
      title: 'Ship feature',
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      dueDate: new Date().toISOString()
    },
    {
      id: 'task-2',
      noteId: '2',
      title: 'Draft plan',
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      dueDate: new Date().toISOString()
    }
  ],
  focusSessions: [
    {
      id: 'focus-1',
      startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      durationMinutes: 60
    },
    {
      id: 'focus-2',
      startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 45
    }
  ],
  goals: [
    {
      id: 'goal-1',
      title: 'Write 10 notes',
      metric: 'notesCreated',
      targetValue: 10,
      currentValue: 5,
      deadline: new Date().toISOString()
    }
  ]
};

describe('analytics utilities', () => {
  it('computes note frequency for the selected range', () => {
    const { start, end } = getPresetRange('7d');
    const frequency = calculateNoteFrequency(data.notes, start, end);
    expect(frequency).toHaveLength(7);
    const totalNotes = frequency.reduce((acc, item) => acc + item.count, 0);
    expect(totalNotes).toBe(data.notes.length);
  });

  it('computes task completion metrics accurately', () => {
    const metrics = calculateTaskCompletionMetrics(data.tasks);
    expect(metrics).toMatchObject({ completed: 1, total: 2, pending: 1 });
    expect(metrics.completionRate).toBe(50);
  });

  it('calculates focus metrics', () => {
    const focus = calculateFocusMetrics(data.focusSessions);
    expect(focus.totalMinutes).toBe(105);
    expect(focus.sessionsCount).toBe(2);
    expect(focus.averageSessionMinutes).toBeCloseTo(52.5);
  });

  it('aggregates tag usage', () => {
    const tags = calculateTagUsage(data.notes);
    expect(tags[0]).toMatchObject({ tag: 'daily', count: 1 });
    expect(tags.find((tag) => tag.tag === 'planning')).toBeDefined();
  });

  it('produces productivity trends for daily view', () => {
    const trends = calculateProductivityTrends(data.notes, data.tasks, data.focusSessions, 'daily');
    expect(trends.length).toBeGreaterThan(0);
    expect(trends[0]).toHaveProperty('notesCreated');
  });

  it('summarises note length stats', () => {
    const stats = calculateNoteLengthStats(data.notes);
    expect(stats.averageWordCount).toBeCloseTo(600);
    expect(stats.medianWordCount).toBe(600);
    expect(stats.averageReadingTime).toBeGreaterThan(0);
  });

  it('computes goal progress and ensures limits', () => {
    const progress = calculateGoalProgress(data.goals);
    expect(progress[0].progressPercentage).toBe(50);
    expect(progress[0].remaining).toBe(5);
  });

  it('builds comparison metrics', () => {
    const comparison = buildComparisonMetrics(
      { notes: data.notes, tasks: data.tasks, sessions: data.focusSessions },
      { notes: [], tasks: [], sessions: [] }
    );
    expect(comparison[0].change).toBe(data.notes.length);
    expect(comparison[1].change).toBe(1);
  });

  it('generates actionable insights', () => {
    const insights = generateInsights({
      noteStats: calculateNoteLengthStats(data.notes),
      taskMetrics: calculateTaskCompletionMetrics(data.tasks),
      focusMetrics: calculateFocusMetrics(data.focusSessions),
      tagUsage: calculateTagUsage(data.notes)
    });
    expect(insights.length).toBeGreaterThan(0);
  });

  it('exports csv and json data', () => {
    const csv = prepareCsvData(data.notes, data.tasks, data.focusSessions);
    const json = prepareJsonData(data.notes, data.tasks, data.focusSessions, data.goals);
    expect(csv.split('\n')[0]).toContain('type');
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('calculates streaks from note dates', () => {
    const streak = calculateStreak(data.notes.map((note) => new Date(note.createdAt)));
    expect(streak.longest).toBeGreaterThan(0);
  });
});
