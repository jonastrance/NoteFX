import { FormEvent, useEffect, useState } from "react";
import { useSyncContext } from "../modules/SyncContext";
import type { SyncPreferences } from "../types/sync";

const toMinutes = (ms: number) => Math.round(ms / 60000);
const toMs = (minutes: number) => minutes * 60000;

export const SyncSettings = () => {
  const { metadata, updatePreferences, engine } = useSyncContext();
  const [preferences, setPreferences] = useState<SyncPreferences>(engine.getPreferences());

  useEffect(() => {
    setPreferences(engine.getPreferences());
  }, [engine, metadata.state, metadata.lastSuccessfulSync]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updatePreferences(preferences);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      data-testid="sync-settings"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Sync Preferences</h2>
        <p className="text-sm text-slate-600">Customize how and when your data synchronizes across devices.</p>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Auto-sync interval (minutes)
        <input
          type="number"
          min={1}
          value={toMinutes(preferences.autoSyncIntervalMs)}
          onChange={(event) =>
            setPreferences((prev) => ({ ...prev, autoSyncIntervalMs: toMs(Number(event.target.value)) }))
          }
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={preferences.enableBackgroundSync}
          onChange={(event) =>
            setPreferences((prev) => ({ ...prev, enableBackgroundSync: event.target.checked }))
          }
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        Enable background sync
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={preferences.encryptionEnabled}
          onChange={(event) =>
            setPreferences((prev) => ({ ...prev, encryptionEnabled: event.target.checked }))
          }
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        Encrypt data in transit
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Conflict resolution strategy
        <select
          value={preferences.resolveConflictsWith}
          onChange={(event) =>
            setPreferences((prev) => ({ ...prev, resolveConflictsWith: event.target.value as SyncPreferences["resolveConflictsWith"] }))
          }
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="prompt">Prompt me when conflicts occur</option>
          <option value="local">Prefer this device's changes</option>
          <option value="remote">Prefer remote changes</option>
        </select>
      </label>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          Save preferences
        </button>
        <p className="text-xs text-slate-500">
          Last sync: {metadata.lastSuccessfulSync ? new Date(metadata.lastSuccessfulSync).toLocaleString() : "Never"}
        </p>
      </div>
    </form>
  );
};
