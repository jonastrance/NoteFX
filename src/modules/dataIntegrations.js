import { nowIsoString } from "../utils/time";
export const createDelta = (entityType, entity, operation, version, baseVersion) => ({
    entityType,
    entity,
    operation,
    version,
    baseVersion
});
export const noteDelta = (note, operation, version) => createDelta("note", note, operation, version, version - 1);
export const taskDelta = (task, operation, version) => createDelta("task", task, operation, version, version - 1);
export const tagDelta = (tag, operation, version) => createDelta("tag", tag, operation, version, version - 1);
export const withUpdatedTimestamp = (entity) => ({
    ...entity,
    updatedAt: nowIsoString()
});
