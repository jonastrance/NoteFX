import { describe, it, expect, beforeEach, vi } from "vitest";
import { SyncEngine } from "../src/services/SyncEngine";
import { MemoryStore } from "../src/services/localStore";
import { ExponentialBackoffStrategy } from "../src/services/retryStrategy";
import type { SyncDelta, SyncEntity, SyncPreferences } from "../src/types/sync";
import { AesEncryptionLayer, PassthroughEncryptionLayer } from "../src/services/encryptionLayer";

const deviceId = "device-1";

const createNote = (id: string, content: string, version: number): SyncEntity => ({
  id,
  title: `Note ${id}`,
  content,
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deviceId
});

describe("SyncEngine", () => {
  beforeEach(() => {
    Object.assign(globalThis, {
      navigator: { onLine: true }
    });
  });

  const createEngine = (options?: { preferences?: Partial<SyncPreferences>; encryption?: boolean }) => {
    const store = new MemoryStore();
    const pushed: SyncDelta[] = [];
    const encryption = options?.encryption
      ? new AesEncryptionLayer("deadbeef")
      : new PassthroughEncryptionLayer();
    const remoteAdapter = {
      pushChanges: vi.fn(async (changes: any) => {
        const decoded = Array.isArray(changes)
          ? changes
          : await encryption.decrypt(changes);
        pushed.push(...decoded);
        return { success: true, nextToken: "token" };
      }),
      pullChanges: vi.fn(async () => ({ deltas: [], nextToken: "token" }))
    };

    const engine = new SyncEngine({
      localStore: store,
      remoteAdapter: remoteAdapter as any,
      preferences: {
        enableBackgroundSync: false,
        autoSyncIntervalMs: 60_000,
        resolveConflictsWith: "prompt",
        encryptionEnabled: true,
        ...options?.preferences
      },
      encryption,
      retryStrategy: new ExponentialBackoffStrategy(10, 50)
    });

    return { engine, store, remoteAdapter, pushed };
  };

  it("queues optimistic updates and pushes them during sync", async () => {
    const { engine, pushed } = createEngine();
    const note = createNote("1", "hello", 1);
    const delta: SyncDelta = { entityType: "note", entity: note, operation: "create", version: 1 };

    engine.applyOptimisticUpdate(delta);
    expect(engine.getQueue()).toHaveLength(1);

    await engine.syncNow();
    expect(pushed).toHaveLength(1);
    expect(engine.getQueue()).toHaveLength(0);
  });

  it("applies remote changes during pull", async () => {
    const { engine, store, remoteAdapter } = createEngine();
    const remoteNote = createNote("2", "remote", 1);
    (remoteAdapter.pullChanges as any).mockResolvedValueOnce({
      deltas: [{ entityType: "note", entity: remoteNote, operation: "update", version: 1 }],
      nextToken: "token-2"
    });

    await engine.syncNow();
    const stored = await store.get("2");
    expect(stored).toMatchObject(remoteNote);
  });

  it("defers sync when offline", async () => {
    const { engine, remoteAdapter } = createEngine();
    Object.assign(globalThis.navigator!, { onLine: false });
    engine.applyOptimisticUpdate({
      entityType: "note",
      entity: createNote("offline", "content", 1),
      operation: "update",
      version: 1
    });

    await engine.syncNow();
    expect(remoteAdapter.pushChanges).not.toHaveBeenCalled();
  });

  it("handles conflicts via merge strategy", async () => {
    const { engine, store, remoteAdapter } = createEngine();
    const localNote = createNote("3", "local", 1);
    await store.set("3", localNote);

    (remoteAdapter.pushChanges as any).mockResolvedValueOnce({
      success: true,
      nextToken: "token",
      conflicts: [
        {
          entityType: "note",
          entity: { ...localNote, content: "remote content" },
          operation: "update",
          version: 2,
          local: localNote,
          remote: { ...localNote, content: "remote content" }
        }
      ]
    });

    engine.applyOptimisticUpdate({ entityType: "note", entity: localNote, operation: "update", version: 2 });
    await engine.syncNow();

    const resolved = await store.get("3");
    expect(resolved?.content).toContain("local");
    expect(resolved?.content).toContain("remote");
  });

  it("retries when sync fails and retry strategy allows", async () => {
    const { engine, remoteAdapter } = createEngine();
    const error = new Error("network timeout");
    (remoteAdapter.pushChanges as any).mockRejectedValueOnce(error);
    (remoteAdapter.pushChanges as any).mockResolvedValueOnce({ success: true, nextToken: "token" });

    engine.applyOptimisticUpdate({
      entityType: "note",
      entity: createNote("retry", "content", 1),
      operation: "update",
      version: 1
    });

    await expect(engine.syncNow()).rejects.toThrowError();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect((remoteAdapter.pushChanges as any).mock.calls.length).toBeGreaterThan(1);
  });
});
