import { describe, it, expect } from "vitest";
import { resolveConflicts } from "../src/services/conflictResolution";
import type { SyncDelta } from "../src/types/sync";

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
    const conflicts: SyncDelta[] = [
      {
        entityType: "note",
        entity: { ...base, content: "remote", tags: ["b"] },
        operation: "update",
        version: 2,
        local: base,
        remote: { ...base, content: "remote", tags: ["b"] }
      } as any
    ];

    const [result] = resolveConflicts(conflicts);
    expect(result.resolved.content).toContain("local");
    expect(result.resolved.content).toContain("remote");
    expect(result.resolved.tags).toEqual(["a", "b"]);
  });
});
