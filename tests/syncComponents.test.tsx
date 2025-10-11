import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SyncProvider } from "../src/modules/SyncContext";
import { SyncEngine } from "../src/services/SyncEngine";
import { MemoryStore } from "../src/services/localStore";
import { SyncStatusIndicator } from "../src/components/SyncStatusIndicator";
import { SyncControls } from "../src/components/SyncControls";
import { SyncSettings } from "../src/components/SyncSettings";
import { ConflictResolutionDialog } from "../src/components/ConflictResolutionDialog";

const createEngine = () =>
  new SyncEngine({
    localStore: new MemoryStore(),
    remoteAdapter: {
      pushChanges: async () => ({ success: true }),
      pullChanges: async () => ({ deltas: [] })
    },
    preferences: { enableBackgroundSync: false, autoSyncIntervalMs: 60_000, resolveConflictsWith: "prompt", encryptionEnabled: false }
  });

describe("sync components", () => {
  it("renders sync status indicator", () => {
    const engine = createEngine();
    render(
      <SyncProvider engine={engine}>
        <SyncStatusIndicator />
      </SyncProvider>
    );

    expect(screen.getByTestId("sync-status")).toBeInTheDocument();
  });

  it("renders controls and settings", () => {
    const engine = createEngine();
    render(
      <SyncProvider engine={engine}>
        <SyncControls />
        <SyncSettings />
      </SyncProvider>
    );

    expect(screen.getByText(/Sync Now/i)).toBeInTheDocument();
    expect(screen.getByTestId("sync-settings")).toBeInTheDocument();
  });

  it("renders conflict dialog", () => {
    render(
      <ConflictResolutionDialog
        conflicts={[
          {
            entityType: "note",
            local: { id: "1", content: "local" } as any,
            remote: { id: "1", content: "remote" } as any,
            resolved: { id: "1", content: "merged" } as any,
            strategy: "merge"
          }
        ]}
        onResolve={() => undefined}
      />
    );

    expect(screen.getByText(/Resolve Sync Conflicts/)).toBeInTheDocument();
  });
});
