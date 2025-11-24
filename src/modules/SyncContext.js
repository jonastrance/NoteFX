import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
const SyncContext = createContext(undefined);
export const SyncProvider = ({ engine, children }) => {
    const [metadata, setMetadata] = useState(engine.getMetadata());
    useEffect(() => {
        return engine.subscribe(setMetadata);
    }, [engine]);
    const value = useMemo(() => ({
        engine,
        metadata,
        applyChange: (delta) => engine.applyOptimisticUpdate(delta),
        syncNow: () => engine.syncNow(),
        updatePreferences: (prefs) => engine.setPreferences(prefs),
        getAuditTrail: () => engine.getAuditLog()
    }), [engine, metadata]);
    return _jsx(SyncContext.Provider, { value: value, children: children });
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
        resolve: (conflicts) => engine.resolveConflicts(conflicts),
        auditTrail: engine.getAuditLog()
    };
};
