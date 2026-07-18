/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Cache Configuration values.
 */
export interface CacheOptions {
  ttlMs?: number; // Time to live in milliseconds
  persistent?: boolean; // Save in localStorage or keep transient
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * High-performance Cache Layer providing Offline Support, Session Caching, and IndexedDB layouts.
 * Optimizes read-bandwidth, preventing O(N) client-side Firebase cost explosions.
 */
export class LocalCache {
  private static memoryCache = new Map<string, CacheEntry<any>>();
  private static defaultTtl = 5 * 60 * 1000; // Default: 5 Minutes

  /**
   * Sets an item inside the cache pool with standard TTL management.
   */
  static set<T>(key: string, value: T, options?: CacheOptions): void {
    const ttl = options?.ttlMs ?? this.defaultTtl;
    const expiresAt = Date.now() + ttl;
    const entry: CacheEntry<T> = { value, expiresAt };

    // Set inside volatile runtime cache
    this.memoryCache.set(key, entry);

    // If marked as persistent, write to client localStorage
    if (options?.persistent) {
      try {
        localStorage.setItem(`tasknova_cache_${key}`, JSON.stringify(entry));
      } catch {
        // Fallback for isolated iframe restrictions
      }
    }
  }

  /**
   * Reads an item from the cache. Performs auto-expiry eviction if TTL is exceeded.
   */
  static get<T>(key: string): T | null {
    // 1. Check in-memory store
    let entry = this.memoryCache.get(key);

    // 2. Fallback to localStorage if not found
    if (!entry) {
      try {
        const stored = localStorage.getItem(`tasknova_cache_${key}`);
        if (stored) {
          entry = JSON.parse(stored) as CacheEntry<T>;
          // Hydrate memory cache
          this.memoryCache.set(key, entry);
        }
      } catch {
        // Fallback
      }
    }

    if (!entry) return null;

    // 3. Verify TTL
    if (Date.now() > entry.expiresAt) {
      this.evict(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Removes a specific key from all cache storage types.
   */
  static evict(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`tasknova_cache_${key}`);
    } catch {
      // Fail-silent
    }
  }

  /**
   * Instantly purges expired caches or clears the pool.
   */
  static clearAll(): void {
    this.memoryCache.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('tasknova_cache_')) {
          localStorage.removeItem(k);
        }
      });
    } catch {
      // Fail-silent
    }
  }

  /**
   * Outline for future IndexedDB multi-megabyte structured document offline caching.
   * Leveraged in large-scale mobile/offline microtasking pipelines.
   */
  static async openIndexedDBStore(storeName: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!('indexedDB' in window)) {
        console.warn('[LocalCache] IndexedDB is not supported on this platform browser.');
        resolve(false);
        return;
      }

      const req = indexedDB.open('TaskNovaOfflineEngine', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => {
        resolve(true);
      };
      req.onerror = () => {
        resolve(false);
      };
    });
  }
}
