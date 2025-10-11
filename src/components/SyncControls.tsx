import { useCallback, useState } from "react";
import { useSyncContext } from "../modules/SyncContext";

export const SyncControls = () => {
  const { syncNow, metadata, engine } = useSyncContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualSync = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await syncNow();
    } finally {
      setIsRefreshing(false);
    }
  }, [syncNow]);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleManualSync}
        disabled={isRefreshing || metadata.state === "syncing"}
        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {isRefreshing ? "Refreshing..." : "Sync Now"}
      </button>
      <span className="text-xs text-slate-600">Auto-sync every {Math.round(engine.getPreferences().autoSyncIntervalMs / 60000)} minutes</span>
    </div>
  );
};
