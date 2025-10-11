import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { SyncEngine } from "../services/SyncEngine";
import type { SyncMetadata, SyncPreferences, ConflictResolution, SyncDelta } from "../types/sync";

interface SyncContextValue {
  engine: SyncEngine;
  metadata: SyncMetadata;
  applyChange: (delta: SyncDelta) => void;
  syncNow: () => Promise<void>;
  updatePreferences: (prefs: Partial<SyncPreferences>) => void;
  getAuditTrail: () => ReturnType<SyncEngine["getAuditLog"]>;
}

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

interface SyncProviderProps {
  engine: SyncEngine;
  children: React.ReactNode;
}

export const SyncProvider = ({ engine, children }: SyncProviderProps) => {
  const [metadata, setMetadata] = useState(engine.getMetadata());

  useEffect(() => {
    return engine.subscribe(setMetadata);
  }, [engine]);

  const value = useMemo<SyncContextValue>(() => ({
    engine,
    metadata,
    applyChange: (delta) => engine.applyOptimisticUpdate(delta),
    syncNow: () => engine.syncNow(),
    updatePreferences: (prefs) => engine.setPreferences(prefs),
    getAuditTrail: () => engine.getAuditLog()
  }), [engine, metadata]);

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

export const useSyncContext = () => {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error("useSyncContext must be used within SyncProvider");
  }
  return ctx;
};

export const useSync = () => {
  const { metadata, applyChange, syncNow } = useSyncContext();
  return { metadata, applyChange, syncNow };
};

export const useSyncStatus = () => {
  const { metadata } = useSyncContext();
  return metadata;
};

export const useConflictResolution = () => {
  const { engine } = useSyncContext();
  return {
    resolve: (conflicts: SyncDelta[]): ConflictResolution[] => engine.resolveConflicts(conflicts),
    auditTrail: engine.getAuditLog()
  };
};
