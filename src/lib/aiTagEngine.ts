import { unique } from 'd3-array';
import type { Note } from '../types/note';
import type { ConfidenceLevel, NoteTag, Tag, TagFeedback, TagSuggestion } from '../types/tag';

const KEYWORD_LIBRARY: Array<{
  label: string;
  keywords: string[];
  patterns?: RegExp[];
  parent?: string;
}> = [
  {
    label: 'Productivity',
    keywords: ['productivity', 'focus', 'time block', 'ritual', 'planning', 'sprint'],
    patterns: [/\bdeep work\b/i, /task\s+list/i]
  },
  {
    label: 'AI Research',
    keywords: ['alignment', 'model', 'ai', 'neural', 'transformer'],
    patterns: [/\battention\b/i, /interpretability/i]
  },
  {
    label: 'Deep Learning',
    keywords: ['transformer', 'training', 'epochs', 'gradient', 'neuron'],
    parent: 'AI Research'
  },
  {
    label: 'Wellness',
    keywords: ['meditation', 'mindfulness', 'nutrition', 'wellness', 'resilience', 'habit'],
    parent: 'Health'
  },
  {
    label: 'Health',
    keywords: ['sleep', 'fitness', 'wellness', 'health']
  }
];

const computeConfidence = (score: number): ConfidenceLevel => {
  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
};

const normalise = (value: string) => value.toLowerCase();

const tokenise = (input: string) =>
  input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const calculateFeedbackBoost = (feedback: TagFeedback[], tagId: string) => {
  const relevant = feedback.filter((item) => item.tagId === tagId);
  if (!relevant.length) return 0;
  const accepted = relevant.filter((item) => item.accepted).length;
  const rate = accepted / relevant.length;
  return rate >= 0.75 ? 1.5 : rate >= 0.5 ? 0.5 : rate < 0.25 ? -0.5 : 0;
};

const buildKnowledgeGraph = (tags: Tag[]) => {
  const map = new Map<string, Tag>();
  tags.forEach((tag) => map.set(normalise(tag.name), tag));
  return map;
};

const findOrCreateTag = (label: string, tags: Tag[]): Tag | undefined => {
  const normalisedLabel = normalise(label);
  return tags.find((tag) => normalise(tag.name) === normalisedLabel);
};

export type SuggestTagOptions = {
  note: Note;
  tags: Tag[];
  assignments: NoteTag[];
  feedback: TagFeedback[];
};

export const suggestTagsForNote = ({
  note,
  tags,
  assignments,
  feedback
}: SuggestTagOptions): TagSuggestion[] => {
  const tokens = tokenise(`${note.title} ${note.content}`);
  const suggestions: TagSuggestion[] = [];
  const usedTagIds = new Set(assignments.map((item) => item.tagId));

  const counts = KEYWORD_LIBRARY.map((entry) => {
    const matches = entry.keywords.reduce((acc, keyword) => {
      const occurrences = tokens.filter((token) => token.includes(keyword.toLowerCase())).length;
      return acc + occurrences;
    }, 0);

    const patternHits = entry.patterns?.reduce(
      (acc, pattern) => (pattern.test(note.content) ? acc + 1 : acc),
      0
    );

    return {
      entry,
      score: matches + (patternHits ?? 0)
    };
  });

  counts
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .forEach(({ entry, score }) => {
      const candidate = findOrCreateTag(entry.label, tags);
      if (!candidate || usedTagIds.has(candidate.id)) return;

      const confidence = computeConfidence(score + calculateFeedbackBoost(feedback, candidate.id));

      const reason = `Detected ${score} relevant keywords (${entry.keywords
        .filter((keyword) => tokens.some((token) => token.includes(keyword)))
        .slice(0, 3)
        .join(', ')})`;

      suggestions.push({
        tag: candidate,
        confidence,
        reason,
        keywords: unique(
          entry.keywords.filter((keyword) => tokens.some((token) => token.includes(keyword)))
        )
      });

      if (entry.parent) {
        const parent = findOrCreateTag(entry.parent, tags);
        if (parent && !usedTagIds.has(parent.id)) {
          suggestions.push({
            tag: parent,
            confidence: confidence === 'high' ? 'medium' : confidence,
            reason: `${entry.label} maps to parent category ${entry.parent}`,
            keywords: [entry.parent, entry.label]
          });
        }
      }
    });

  return suggestions.slice(0, 6);
};
