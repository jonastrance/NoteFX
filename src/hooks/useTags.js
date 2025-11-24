import { useMemo } from 'react';
import { useTagStoreContext } from '../context/TagStoreProvider';
const getHierarchyDepth = (tags) => {
    const map = new Map();
    tags.forEach((tag) => map.set(tag.id, tag));
    const depthMemo = new Map();
    const computeDepth = (tag) => {
        if (!tag.parentId)
            return 1;
        if (depthMemo.has(tag.id))
            return depthMemo.get(tag.id);
        const parent = map.get(tag.parentId);
        if (!parent)
            return 1;
        const depth = 1 + computeDepth(parent);
        depthMemo.set(tag.id, depth);
        return depth;
    };
    return Math.max(1, ...tags.map((tag) => computeDepth(tag)));
};
export const useTags = () => {
    const { state, actions } = useTagStoreContext();
    const stats = useMemo(() => {
        const totalTags = state.tags.length;
        const topTags = [...state.tags]
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, 5);
        const hierarchyDepth = getHierarchyDepth(state.tags);
        const feedbackAcceptanceRate = (() => {
            if (!state.feedback.length)
                return 0;
            const accepted = state.feedback.filter((item) => item.accepted).length;
            return Math.round((accepted / state.feedback.length) * 100);
        })();
        return { totalTags, topTags, hierarchyDepth, feedbackAcceptanceRate };
    }, [state.tags, state.feedback]);
    const search = (query) => {
        const lower = query.toLowerCase();
        return state.tags.filter((tag) => `${tag.name} ${tag.description ?? ''}`.toLowerCase().includes(lower));
    };
    const getChildren = (parentId) => state.tags.filter((tag) => tag.parentId === parentId);
    return {
        tags: state.tags,
        noteTags: state.noteTags,
        feedback: state.feedback,
        stats,
        search,
        getChildren,
        ...actions
    };
};
