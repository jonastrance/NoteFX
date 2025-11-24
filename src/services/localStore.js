import { openDB } from "idb";
const DB_NAME = "modern-notes-sync";
const STORE_NAME = "entities";
export class IndexedDbStore {
    constructor() {
        this.dbPromise = openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            }
        });
    }
    async db() {
        return this.dbPromise;
    }
    async get(key) {
        return (await this.db()).get(STORE_NAME, key);
    }
    async set(key, value) {
        await (await this.db()).put(STORE_NAME, value, key);
    }
    async delete(key) {
        await (await this.db()).delete(STORE_NAME, key);
    }
    async getAll() {
        return (await this.db()).getAll(STORE_NAME);
    }
    async clear() {
        await (await this.db()).clear(STORE_NAME);
    }
}
export class MemoryStore {
    constructor() {
        this.store = new Map();
    }
    async get(key) {
        return this.store.get(key);
    }
    async set(key, value) {
        this.store.set(key, value);
    }
    async delete(key) {
        this.store.delete(key);
    }
    async getAll() {
        return Array.from(this.store.values());
    }
    async clear() {
        this.store.clear();
    }
}
