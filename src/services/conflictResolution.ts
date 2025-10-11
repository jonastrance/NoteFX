import type { ConflictResolution, SyncDelta, SyncEntity, SyncEntityType } from "../types/sync";

// Define type guards for note and task entities
interface NoteEntity extends SyncEntity {
  tags: string[];
  content: string;
}

interface TaskEntity extends SyncEntity {
  completed: boolean;
}

function isNoteEntity(entity: SyncEntity): entity is NoteEntity {
  return 'tags' in entity && Array.isArray((entity as any).tags) && 'content' in entity && typeof (entity as any).content === 'string';
}

function isTaskEntity(entity: SyncEntity): entity is TaskEntity {
  return 'completed' in entity && typeof (entity as any).completed === 'boolean';
}

const mergeEntities = (type: SyncEntityType, local: SyncEntity, remote: SyncEntity): SyncEntity => {
  if (type === "note" && isNoteEntity(local) && isNoteEntity(remote)) {
    const mergedTags = Array.from(new Set([...local.tags, ...remote.tags]));
    return {
      ...(remote.updatedAt > local.updatedAt ? remote : local),
      tags: mergedTags,
      content: `${local.content}\n${remote.content}`.trim()
    } as NoteEntity;
  }
  if (type === "task" && isTaskEntity(local) && isTaskEntity(remote)) {
    return {
      ...local,
      ...remote,
      completed: local.completed || remote.completed
    } as TaskEntity;
  }
  return remote.updatedAt > local.updatedAt ? remote : local;
};

export const resolveConflicts = (conflicts: SyncDelta[]): ConflictResolution[] => {
  return conflicts.map((conflict) => {
    const { entityType, entity } = conflict;
    const local = (conflict as any).local ?? entity;
    const remote = (conflict as any).remote ?? entity;
    const resolved = mergeEntities(entityType, local, remote);
    const strategy = "merge";
    return {
      entityType,
      local,
      remote,
      resolved,
      strategy
    } satisfies ConflictResolution;
  });
};
