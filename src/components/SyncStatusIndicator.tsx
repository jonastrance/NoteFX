import { useMemo } from "react";
import { useSyncStatus } from "../modules/SyncContext";

const stateStyles: Record<string, string> = {
  idle: "bg-emerald-100 text-emerald-800 border-emerald-200",
  syncing: "bg-sky-100 text-sky-800 border-sky-200 animate-pulse",
  error: "bg-rose-100 text-rose-800 border-rose-200"
};

export const SyncStatusIndicator = () => {
  const status = useSyncStatus();
  const state = status.state ?? "idle";
  const indicatorClass = stateStyles[state] ?? stateStyles.idle;

  const subtitle = useMemo(() => {
    if (state === "syncing") return "Synchronizing changes across devices";
    if (state === "error") return status.error ?? "Sync error";
    return status.lastSuccessfulSync ? `Last synced ${new Date(status.lastSuccessfulSync).toLocaleTimeString()}` : "Awaiting first sync";
  }, [state, status.error, status.lastSuccessfulSync]);

  return (
    <div className={`rounded-lg border px-4 py-3 shadow-sm transition-all ${indicatorClass}`} data-testid="sync-status">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">Sync Status</p>
          <p className="text-base font-medium">{state.charAt(0).toUpperCase() + state.slice(1)}</p>
        </div>
        <span className="text-xs font-mono text-slate-700">Queue: {status.queueSize}</span>
      </div>
      <p className="mt-2 text-sm text-slate-700">{subtitle}</p>
    </div>
  );
};
