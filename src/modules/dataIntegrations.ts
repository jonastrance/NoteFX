import type { Note, SyncDelta, SyncEntityType, Tag, Task } from "../types/sync";
import { nowIsoString } from "../utils/time";

export const createDelta = <T extends Note | Task | Tag>(
  entityType: SyncEntityType,
  entity: T,
  operation: SyncDelta["operation"],
  version: number,
  baseVersion?: number
): SyncDelta<T> => ({
  entityType,
  entity,
  operation,
  version,
  baseVersion
});

export const noteDelta = (note: Note, operation: SyncDelta["operation"], version: number): SyncDelta<Note> =>
  createDelta("note", note, operation, version, version - 1);

export const taskDelta = (task: Task, operation: SyncDelta["operation"], version: number): SyncDelta<Task> =>
  createDelta("task", task, operation, version, version - 1);

export const tagDelta = (tag: Tag, operation: SyncDelta["operation"], version: number): SyncDelta<Tag> =>
  createDelta("tag", tag, operation, version, version - 1);

export const withUpdatedTimestamp = <T extends { updatedAt: string }>(entity: T): T => ({
  ...entity,
  updatedAt: nowIsoString()
});
