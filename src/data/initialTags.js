export const defaultTags = [
    {
        id: 'tag-productivity',
        name: 'Productivity',
        color: '#38bdf8',
        description: 'Workflows, goals and productivity systems',
        parentId: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
        usageCount: 4
    },
    {
        id: 'tag-ai',
        name: 'AI Research',
        color: '#f472b6',
        description: 'Notes about artificial intelligence breakthroughs',
        parentId: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
        usageCount: 3
    },
    {
        id: 'tag-deep-learning',
        name: 'Deep Learning',
        color: '#c084fc',
        description: 'Architectures, experiments and training logs',
        parentId: 'tag-ai',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
        usageCount: 2
    }
];
