import { nowIsoString } from "../utils/time";
import { generateId } from "../utils/id";
import { resolveConflicts } from "./conflictResolution";
import { InMemoryAuditLog } from "./syncAuditLog";
const defaultPreferences = {
    autoSyncIntervalMs: 30000,
    enableBackgroundSync: true,
    resolveConflictsWith: "prompt",
    encryptionEnabled: true
};
export class SyncEngine {
    constructor(options) {
        this.options = options;
        this.metadata = {
            lastSync: null,
            lastSuccessfulSync: null,
            queueSize: 0,
            state: "idle"
        };
        this.listeners = new Set();
        this.queue = [];
        this.retryCount = 0;
        this.preferences = defaultPreferences;
        this.auditLog = new InMemoryAuditLog();
        if (options.preferences) {
            this.preferences = { ...defaultPreferences, ...options.preferences };
        }
        if (this.preferences.enableBackgroundSync) {
            this.startAutoSync();
        }
        this.updateMetadata();
    }
    getAuditLog() {
        return this.auditLog.getAll();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        listener(this.metadata);
        return () => {
            this.listeners.delete(listener);
        };
    }
    setPreferences(preferences) {
        this.preferences = { ...this.preferences, ...preferences };
        if (this.preferences.enableBackgroundSync) {
            this.startAutoSync();
        }
        else {
            this.stopAutoSync();
        }
        this.record("info", "Updated sync preferences", { preferences: this.preferences });
        this.updateMetadata();
    }
    getPreferences() {
        return { ...this.preferences };
    }
    applyOptimisticUpdate(delta) {
        this.queue.push(delta);
        this.metadata.queueSize = this.queue.length;
        this.record("info", "Queued optimistic update", { delta });
        this.options.localStore.set(delta.entity.id, delta.entity).catch((error) => {
            this.record("error", "Failed to apply optimistic update locally", { error });
        });
        this.updateMetadata();
    }
    async syncNow() {
        await this.processQueue();
    }
    startAutoSync() {
        if (this.timer)
            return;
        this.timer = setInterval(() => {
            if (this.preferences.enableBackgroundSync) {
                this.processQueue().catch((error) => this.record("error", "Auto sync failed", { error }));
            }
        }, this.preferences.autoSyncIntervalMs);
    }
    stopAutoSync() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
    setState(state, error) {
        this.metadata.state = state;
        this.metadata.error = error;
        this.updateMetadata();
    }
    updateMetadata() {
        this.metadata.queueSize = this.queue.length;
        this.listeners.forEach((listener) => listener({ ...this.metadata }));
    }
    record(level, message, metadata) {
        this.auditLog.add({
            id: generateId(),
            level,
            message,
            timestamp: nowIsoString(),
            metadata
        });
    }
    async encryptPayload(changes) {
        if (!this.options.encryption || !this.preferences.encryptionEnabled) {
            return changes;
        }
        return this.options.encryption.encrypt(changes);
    }
    async decryptPayload(payload) {
        if (!this.options.encryption || !this.preferences.encryptionEnabled) {
            return payload;
        }
        return this.options.encryption.decrypt(payload);
    }
    async processQueue() {
        const online = typeof globalThis.navigator === "undefined" ? true : globalThis.navigator.onLine;
        if (!online) {
            this.record("warning", "Device offline, postponing sync");
            return;
        }
        if (this.queue.length && this.metadata.state === "idle") {
            this.setState("syncing");
        }
        try {
            if (this.queue.length) {
                await this.flushQueue();
            }
            await this.pullRemoteChanges();
            this.metadata.lastSync = nowIsoString();
            this.metadata.lastSuccessfulSync = this.metadata.lastSync;
            this.setState("idle");
            this.retryCount = 0;
        }
        catch (error) {
            this.retryCount += 1;
            this.setState("error", error instanceof Error ? error.message : "Unknown error");
            this.record("error", "Sync failed", { error, retryCount: this.retryCount });
            if (this.options.retryStrategy?.shouldRetry(error, this.retryCount)) {
                const delay = this.options.retryStrategy.getDelay(this.retryCount);
                setTimeout(() => this.processQueue().catch(() => undefined), delay);
            }
            throw error;
        }
    }
    async flushQueue() {
        if (!this.queue.length)
            return;
        this.setState("syncing");
        const changes = [...this.queue];
        const payload = await this.encryptPayload(changes);
        const response = await this.options.remoteAdapter.pushChanges(payload);
        if (!response.success) {
            throw new Error("Failed to push changes");
        }
        this.record("info", "Pushed changes", { count: changes.length });
        if (response.conflicts?.length) {
            const resolutions = this.resolveConflicts(response.conflicts);
            await this.applyResolutions(resolutions);
        }
        this.syncToken = response.nextToken ?? this.syncToken;
        this.queue = [];
        this.metadata.queueSize = 0;
        this.setState("idle");
    }
    resolveConflicts(conflicts) {
        this.record("warning", "Conflicts detected", { count: conflicts.length });
        if (this.preferences.resolveConflictsWith === "local") {
            return conflicts.map((conflict) => ({
                entityType: conflict.entityType,
                local: conflict.entity,
                remote: conflict.entity,
                resolved: conflict.entity,
                strategy: "local"
            }));
        }
        if (this.preferences.resolveConflictsWith === "remote") {
            return conflicts.map((conflict) => ({
                entityType: conflict.entityType,
                local: conflict.entity,
                remote: conflict.entity,
                resolved: conflict.entity,
                strategy: "remote"
            }));
        }
        return resolveConflicts(conflicts);
    }
    async applyResolutions(resolutions) {
        for (const resolution of resolutions) {
            await this.options.localStore.set(resolution.resolved.id, resolution.resolved);
        }
        this.record("info", "Applied conflict resolutions", { count: resolutions.length });
    }
    async pullRemoteChanges() {
        const response = await this.options.remoteAdapter.pullChanges(this.syncToken);
        const deltas = (await this.decryptPayload(response.deltas));
        for (const delta of deltas) {
            if (delta.operation === "delete") {
                await this.options.localStore.delete(delta.entity.id);
            }
            else {
                await this.options.localStore.set(delta.entity.id, delta.entity);
            }
        }
        this.syncToken = response.nextToken ?? this.syncToken;
        this.record("info", "Pulled remote changes", { count: deltas.length });
    }
    getMetadata() {
        return { ...this.metadata };
    }
    getQueue() {
        return [...this.queue];
    }
}
