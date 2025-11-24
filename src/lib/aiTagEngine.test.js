import { describe, expect, it } from 'vitest';
import { suggestTagsForNote } from './aiTagEngine';
const mockTags = [
    {
        id: 'productivity',
        name: 'Productivity',
        color: '#38bdf8',
        description: 'Workflows and rituals',
        parentId: null,
        createdAt: Date.now(),
        usageCount: 10
    },
    {
        id: 'ai-research',
        name: 'AI Research',
        color: '#f472b6',
        description: 'AI and alignment',
        parentId: null,
        createdAt: Date.now(),
        usageCount: 5
    },
    {
        id: 'deep-learning',
        name: 'Deep Learning',
        color: '#c084fc',
        description: 'Neural nets and training',
        parentId: 'ai-research',
        createdAt: Date.now(),
        usageCount: 3
    }
];
const baseNote = {
    id: 'note-1',
    title: 'Weekly reset',
    content: 'Plan deep work sessions and time blocking for focus sprints. Create actionable task list.',
    createdAt: Date.now(),
    updatedAt: Date.now()
};
describe('suggestTagsForNote', () => {
    it('prioritises tags with strong keyword matches', () => {
        const suggestions = suggestTagsForNote({
            note: baseNote,
            tags: mockTags,
            assignments: [],
            feedback: []
        });
        expect(suggestions[0]?.tag.name).toBe('Productivity');
        expect(suggestions[0]?.confidence).toBe('high');
        expect(suggestions[0]?.keywords).toContain('focus');
    });
    it('includes parent categories when configured', () => {
        const note = {
            ...baseNote,
            content: 'Studying transformer interpretability and gradient descent during training.',
            title: 'Transformer research'
        };
        const suggestions = suggestTagsForNote({
            note,
            tags: mockTags,
            assignments: [],
            feedback: []
        });
        const deepLearning = suggestions.find((item) => item.tag.id === 'deep-learning');
        const aiResearch = suggestions.find((item) => item.tag.id === 'ai-research');
        expect(deepLearning).toBeTruthy();
        expect(aiResearch).toBeTruthy();
        expect(aiResearch?.confidence === 'high' || aiResearch?.confidence === 'medium').toBe(true);
    });
    it('boosts confidence when positive feedback exists', () => {
        const feedback = [
            { tagId: 'productivity', accepted: true, noteId: 'note-previous', feedbackAt: Date.now() },
            { tagId: 'productivity', accepted: true, noteId: 'note-previous-2', feedbackAt: Date.now() }
        ];
        const suggestions = suggestTagsForNote({
            note: baseNote,
            tags: mockTags,
            assignments: [],
            feedback
        });
        expect(suggestions[0]?.confidence).not.toBe('low');
    });
    it('omits tags already assigned to the note', () => {
        const assignments = [
            { noteId: baseNote.id, tagId: 'productivity', appliedAt: Date.now(), source: 'ai' }
        ];
        const suggestions = suggestTagsForNote({
            note: baseNote,
            tags: mockTags,
            assignments,
            feedback: []
        });
        expect(suggestions.find((item) => item.tag.id === 'productivity')).toBeUndefined();
    });
});
