export type SyncEntityType = "note" | "task" | "tag";

export interface BaseEntity {
  id: string;
  updatedAt: string;
  createdAt: string;
  deviceId: string;
}

export interface Note extends BaseEntity {
  title: string;
  content: string;
  tags: string[];
}

export interface Task extends BaseEntity {
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Tag extends BaseEntity {
  label: string;
  color: string;
}

export type SyncEntity = Note | Task | Tag;

export interface SyncDelta<T = SyncEntity> {
  entityType: SyncEntityType;
  entity: T;
  operation: "create" | "update" | "delete";
  version: number;
  baseVersion?: number;
}

export interface ConflictResolution<T = SyncEntity> {
  entityType: SyncEntityType;
  local: T;
  remote: T;
  resolved: T;
  strategy: "merge" | "local" | "remote";
}

export type SyncState = "idle" | "syncing" | "error";

export interface SyncMetadata {
  lastSync: string | null;
  lastSuccessfulSync: string | null;
  queueSize: number;
  state: SyncState;
  error?: string;
}

export interface SyncPreferences {
  autoSyncIntervalMs: number;
  enableBackgroundSync: boolean;
  resolveConflictsWith: "local" | "remote" | "prompt";
  encryptionEnabled: boolean;
}

export interface SyncHistoryEntry {
  id: string;
  timestamp: string;
  message: string;
  level: "info" | "warning" | "error";
  metadata?: Record<string, unknown>;
}

export interface SyncAuditLog {
  entries: SyncHistoryEntry[];
  add(entry: SyncHistoryEntry): void;
  getAll(): SyncHistoryEntry[];
}

export interface EncryptedPayload {
  iv: string;
  data: string;
  authTag?: string;
}

export interface EncryptionLayer {
  encrypt<T>(payload: T): Promise<EncryptedPayload>;
  decrypt<T>(payload: EncryptedPayload): Promise<T>;
}

export interface LocalStore<T = SyncEntity> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  getAll(): Promise<T[]>;
  clear(): Promise<void>;
}

export interface RemoteSyncAdapter {
  pushChanges(
    changes: SyncDelta[] | EncryptedPayload
  ): Promise<{ success: boolean; nextToken?: string; conflicts?: SyncDelta[] }>;
  pullChanges(
    token?: string
  ): Promise<{ deltas: SyncDelta[] | EncryptedPayload; nextToken?: string }>;
}

export interface RetryStrategy {
  getDelay(retryCount: number): number;
  shouldRetry(error: unknown, retryCount: number): boolean;
}
