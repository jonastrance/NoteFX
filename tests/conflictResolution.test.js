import { describe, it, expect } from "vitest";
import { resolveConflicts } from "../src/services/conflictResolution";
const base = {
    id: "1",
    title: "Note",
    content: "local",
    tags: ["a"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "device"
};
describe("resolveConflicts", () => {
    it("merges note content and tags", () => {
        const conflicts = [
            {
                entityType: "note",
                entity: { ...base, content: "remote", tags: ["b"] },
                operation: "update",
                version: 2,
                local: base,
                remote: { ...base, content: "remote", tags: ["b"] }
            }
        ];
        const [result] = resolveConflicts(conflicts);
        expect(result.resolved.content).toContain("local");
        expect(result.resolved.content).toContain("remote");
        expect(result.resolved.tags).toEqual(["a", "b"]);
    });
});
