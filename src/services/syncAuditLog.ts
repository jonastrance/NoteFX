import type { SyncAuditLog, SyncHistoryEntry } from "../types/sync";

export class InMemoryAuditLog implements SyncAuditLog {
  entries: SyncHistoryEntry[] = [];

  add(entry: SyncHistoryEntry): void {
    this.entries.push(entry);
    if (this.entries.length > 500) {
      this.entries.shift();
    }
  }

  getAll(): SyncHistoryEntry[] {
    return [...this.entries];
  }
}
