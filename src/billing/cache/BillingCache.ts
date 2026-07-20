/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface CacheEntry<T> {
  value: T;
  expiry: number; // TTL timestamp
}

export class BillingCache {
  private static STORAGE_KEY_PREFIX = 'tasknova_billing_cache:';
  private inMemoryCache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Write data to TTL cache (in-memory + local storage for offline durability)
   */
  public set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    const entry: CacheEntry<T> = { value, expiry };
    this.inMemoryCache.set(key, entry);

    try {
      localStorage.setItem(
        `${BillingCache.STORAGE_KEY_PREFIX}${key}`,
        JSON.stringify(entry)
      );
    } catch (e) {
      console.warn('[BillingCache] Error saving to localStorage:', e);
    }
  }

  /**
   * Read data from TTL cache (check local storage if memory misses for full offline support)
   */
  public get<T>(key: string): T | null {
    // Memory check
    const memEntry = this.inMemoryCache.get(key);
    if (memEntry) {
      if (memEntry.expiry > Date.now()) {
        return memEntry.value as T;
      } else {
        this.inMemoryCache.delete(key);
      }
    }

    // Storage check
    try {
      const stored = localStorage.getItem(`${BillingCache.STORAGE_KEY_PREFIX}${key}`);
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);
        if (entry.expiry > Date.now()) {
          // Hydrate memory
          this.inMemoryCache.set(key, entry);
          return entry.value;
        } else {
          localStorage.removeItem(`${BillingCache.STORAGE_KEY_PREFIX}${key}`);
        }
      }
    } catch (e) {
      console.warn('[BillingCache] Error reading from localStorage:', e);
    }

    return null;
  }

  /**
   * Clear cache for a key
   */
  public invalidate(key: string): void {
    this.inMemoryCache.delete(key);
    try {
      localStorage.removeItem(`${BillingCache.STORAGE_KEY_PREFIX}${key}`);
    } catch (e) {
      // Ignored
    }
  }

  /**
   * Manage offline transaction retry queue
   */
  public addToRetryQueue(transaction: any): void {
    const queue = this.getRetryQueue();
    queue.push({
      ...transaction,
      queuedAt: new Date().toISOString(),
      attempts: 0
    });
    localStorage.setItem(
      `${BillingCache.STORAGE_KEY_PREFIX}retry_queue`,
      JSON.stringify(queue)
    );
  }

  public getRetryQueue(): any[] {
    try {
      const stored = localStorage.getItem(`${BillingCache.STORAGE_KEY_PREFIX}retry_queue`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public clearRetryQueue(): void {
    localStorage.removeItem(`${BillingCache.STORAGE_KEY_PREFIX}retry_queue`);
  }

  public saveRetryQueue(queue: any[]): void {
    localStorage.setItem(
      `${BillingCache.STORAGE_KEY_PREFIX}retry_queue`,
      JSON.stringify(queue)
    );
  }
}

export const globalBillingCache = new BillingCache();
