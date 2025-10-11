import type { Note } from '../types/note';

export const defaultNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Weekly Planning Ritual',
    content:
      'Outline priorities for the week, break goals into actionable tasks, and schedule deep work blocks. Mention time blocking and focus sprints.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'note-2',
    title: 'Transformer Interpretability',
    content:
      'Research notes on transformer attention patterns, sparse autoencoders, mechanistic interpretability and alignment strategy.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  },
  {
    id: 'note-3',
    title: 'Healthy Habits Review',
    content:
      'Track meditation sessions, habit streaks, nutrition logs and reflection on wellness routines. Include keywords like mindfulness and resilience.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24
  }
];
