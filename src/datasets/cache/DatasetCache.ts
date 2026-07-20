/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetEntity } from '../types';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class DatasetCache {
  private static MEMORY_CACHE = new Map<string, CacheEntry<any>>();
  private static DEFAULT_TTL_MS = 60000; // 60 seconds

  /**
   * Set cache item with custom TTL
   */
  static set<T>(key: string, data: T, ttlMs: number = this.DEFAULT_TTL_MS): void {
    const expiry = Date.now() + ttlMs;
    const entry: CacheEntry<T> = { data, expiry };
    
    // Store in memory
    this.MEMORY_CACHE.set(key, entry);

    // Backup to localStorage for offline preservation (except if too large)
    try {
      localStorage.setItem(`cache_ds_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('LocalStorage cache backing failed. Continuing in-memory.', e);
    }
  }

  /**
   * Get cached item if not expired
   */
  static get<T>(key: string): T | null {
    // 1. Try memory cache
    const memoryEntry = this.MEMORY_CACHE.get(key);
    if (memoryEntry) {
      if (Date.now() < memoryEntry.expiry) {
        return memoryEntry.data as T;
      }
      this.MEMORY_CACHE.delete(key); // Expired
    }

    // 2. Fallback to localStorage offline cache
    try {
      const localValue = localStorage.getItem(`cache_ds_${key}`);
      if (localValue) {
        const localEntry: CacheEntry<T> = JSON.parse(localValue);
        if (Date.now() < localEntry.expiry) {
          // Re-populate memory cache
          this.MEMORY_CACHE.set(key, localEntry);
          return localEntry.data;
        }
        localStorage.removeItem(`cache_ds_${key}`); // Expired local item
      }
    } catch (e) {
      console.error('Error fetching cache from localStorage', e);
    }

    return null;
  }

  /**
   * Evict specific key
   */
  static evict(key: string): void {
    this.MEMORY_CACHE.delete(key);
    try {
      localStorage.removeItem(`cache_ds_${key}`);
    } catch (e) {}
  }

  /**
   * Clear entire datasets cache
   */
  static clear(): void {
    this.MEMORY_CACHE.clear();
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('cache_ds_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}
  }

  /**
   * Background Refresh simulation wrapper
   */
  static async refreshInBackground<T>(key: string, fetcher: () => Promise<T>, ttlMs: number = this.DEFAULT_TTL_MS): Promise<void> {
    try {
      // Execute the fetcher in the background
      const freshData = await fetcher();
      this.set(key, freshData, ttlMs);
      console.log(`[Cache Background Refresh] Refreshed cache key "${key}" successfully.`);
    } catch (e) {
      console.error(`[Cache Background Refresh] Failed to refresh key "${key}"`, e);
    }
  }
}
