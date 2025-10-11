import { Fragment } from "react";
import type { ConflictResolution } from "../types/sync";

interface ConflictResolutionDialogProps {
  conflicts: ConflictResolution[];
  onResolve: (conflict: ConflictResolution) => void;
}

export const ConflictResolutionDialog = ({ conflicts, onResolve }: ConflictResolutionDialogProps) => {
  if (!conflicts.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
      <div className="w-full max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-2xl">
        <header>
          <h2 className="text-xl font-semibold text-slate-900">Resolve Sync Conflicts</h2>
          <p className="text-sm text-slate-600">Choose which version to keep or merge content.</p>
        </header>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {conflicts.map((conflict) => (
            <Fragment key={conflict.resolved.id}>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{conflict.entityType.toUpperCase()}</h3>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                    Strategy: {conflict.strategy}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700">Local version</h4>
                    <pre className="mt-1 whitespace-pre-wrap rounded-md bg-white p-3 text-xs text-slate-800 shadow-inner">
                      {JSON.stringify(conflict.local, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700">Remote version</h4>
                    <pre className="mt-1 whitespace-pre-wrap rounded-md bg-white p-3 text-xs text-slate-800 shadow-inner">
                      {JSON.stringify(conflict.remote, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700">Resolved</h4>
                    <pre className="mt-1 whitespace-pre-wrap rounded-md bg-white p-3 text-xs text-slate-800 shadow-inner">
                      {JSON.stringify(conflict.resolved, null, 2)}
                    </pre>
                    <button
                      type="button"
                      onClick={() => onResolve(conflict)}
                      className="mt-3 w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                    >
                      Accept resolution
                    </button>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
