import { openDB, IDBPDatabase } from "idb";
import type { LocalStore, SyncEntity } from "../types/sync";

const DB_NAME = "modern-notes-sync";
const STORE_NAME = "entities";

export class IndexedDbStore implements LocalStore {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      }
    });
  }

  private async db() {
    return this.dbPromise;
  }

  async get(key: string) {
    return (await this.db()).get(STORE_NAME, key);
  }

  async set(key: string, value: SyncEntity) {
    await (await this.db()).put(STORE_NAME, value, key);
  }

  async delete(key: string) {
    await (await this.db()).delete(STORE_NAME, key);
  }

  async getAll() {
    return (await this.db()).getAll(STORE_NAME);
  }

  async clear() {
    await (await this.db()).clear(STORE_NAME);
  }
}

export class MemoryStore implements LocalStore {
  private store = new Map<string, SyncEntity>();

  async get(key: string) {
    return this.store.get(key);
  }

  async set(key: string, value: SyncEntity) {
    this.store.set(key, value);
  }

  async delete(key: string) {
    this.store.delete(key);
  }

  async getAll() {
    return Array.from(this.store.values());
  }

  async clear() {
    this.store.clear();
  }
}
