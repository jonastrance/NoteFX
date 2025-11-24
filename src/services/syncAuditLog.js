export class InMemoryAuditLog {
    constructor() {
        this.entries = [];
    }
    add(entry) {
        this.entries.push(entry);
        if (this.entries.length > 500) {
            this.entries.shift();
        }
    }
    getAll() {
        return [...this.entries];
    }
}
