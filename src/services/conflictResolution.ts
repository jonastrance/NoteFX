import type { ConflictResolution, SyncDelta, SyncEntity, SyncEntityType } from "../types/sync";

const mergeEntities = (type: SyncEntityType, local: SyncEntity, remote: SyncEntity): SyncEntity => {
  if (type === "note") {
    const mergedTags = Array.from(new Set([...(local as any).tags, ...(remote as any).tags]));
    return {
      ...(remote.updatedAt > local.updatedAt ? remote : local),
      tags: mergedTags,
      content: `${(local as any).content}\n${(remote as any).content}`.trim()
    } as SyncEntity;
  }
  if (type === "task") {
    return {
      ...local,
      ...remote,
      completed: (local as any).completed || (remote as any).completed
    } as SyncEntity;
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
