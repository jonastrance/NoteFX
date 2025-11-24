function isNoteEntity(entity) {
    return 'tags' in entity && Array.isArray(entity.tags) && 'content' in entity && typeof entity.content === 'string';
}
function isTaskEntity(entity) {
    return 'completed' in entity && typeof entity.completed === 'boolean';
}
const mergeEntities = (type, local, remote) => {
    if (type === "note" && isNoteEntity(local) && isNoteEntity(remote)) {
        const mergedTags = Array.from(new Set([...local.tags, ...remote.tags]));
        return {
            ...(remote.updatedAt > local.updatedAt ? remote : local),
            tags: mergedTags,
            content: `${local.content}\n${remote.content}`.trim()
        };
    }
    if (type === "task" && isTaskEntity(local) && isTaskEntity(remote)) {
        return {
            ...local,
            ...remote,
            completed: local.completed || remote.completed
        };
    }
    return remote.updatedAt > local.updatedAt ? remote : local;
};
export const resolveConflicts = (conflicts) => {
    return conflicts.map((conflict) => {
        const { entityType, entity } = conflict;
        const local = conflict.local ?? entity;
        const remote = conflict.remote ?? entity;
        const resolved = mergeEntities(entityType, local, remote);
        const strategy = "merge";
        return {
            entityType,
            local,
            remote,
            resolved,
            strategy
        };
    });
};
