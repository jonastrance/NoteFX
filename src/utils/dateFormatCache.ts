/**
 * Simple LRU cache for date formatting to avoid expensive toLocaleString calls
 * in frequently rendered components
 */

interface CacheEntry {
  formatted: string;
  timestamp: number;
}

const MAX_CACHE_SIZE = 100;
const CACHE_TTL = 60000; // 60 seconds

class DateFormatCache {
  private cache = new Map<string, CacheEntry>();

  format(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const key = `${date.toString()}-${JSON.stringify(options || {})}`;
    const now = Date.now();
    
    const cached = this.cache.get(key);
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return cached.formatted;
    }

    // Format the date
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formatted = dateObj.toLocaleString(undefined, options);

    // Add to cache
    this.cache.set(key, { formatted, timestamp: now });

    // Prune cache if too large
    if (this.cache.size > MAX_CACHE_SIZE) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      entries.slice(0, entries.length - MAX_CACHE_SIZE).forEach(([key]) => {
        this.cache.delete(key);
      });
    }

    return formatted;
  }

  formatDate(date: string | Date): string {
    return this.format(date, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatDateTime(date: string | Date): string {
    return this.format(date, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const dateFormatCache = new DateFormatCache();
