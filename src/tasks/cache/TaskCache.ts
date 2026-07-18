/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from '../../types/tasks';

interface CacheEntry<T> {
  data: T;
  timestamp: number; // epoch timestamp in ms
}

/**
 * Cache and Offline Queue Manager for Tasks and Submissions.
 */
class CoreTaskCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // Default 5 minutes TTL
  private STORAGE_KEY_PREFIX = 'tasknova_cache_';
  private OFFLINE_QUEUE_KEY = 'tasknova_offline_pending_queue';

  /**
   * Saves data into memory cache and localStorage.
   */
  set<T>(key: string, data: T, ttlMs: number = this.defaultTTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now() + ttlMs,
    };

    // 1. RAM / Memory Cache
    this.memoryCache.set(key, entry);

    // 2. Client Local Storage (Persistence)
    try {
      localStorage.setItem(`${this.STORAGE_KEY_PREFIX}${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('[TaskCache] LocalStorage storage limit exceeded:', e);
    }
  }

  /**
   * Fetches data from cache, verifying TTL expiration. Falls back to localStorage.
   */
  get<T>(key: string): T | null {
    // 1. Check RAM Cache
    let entry = this.memoryCache.get(key);

    // 2. Check localStorage if not in RAM
    if (!entry) {
      try {
        const stored = localStorage.getItem(`${this.STORAGE_KEY_PREFIX}${key}`);
        if (stored) {
          entry = JSON.parse(stored);
          if (entry) {
            // Restore back to RAM Cache
            this.memoryCache.set(key, entry);
          }
        }
      } catch (e) {
        console.error('[TaskCache] Error parsing localStorage item:', e);
      }
    }

    // 3. Verify TTL validity
    if (entry) {
      if (Date.now() < entry.timestamp) {
        return entry.data as T;
      } else {
        // Expired - invalidate
        this.invalidate(key);
      }
    }

    return null;
  }

  /**
   * Invalidates and deletes a cache key.
   */
  invalidate(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${key}`);
    } catch (e) {
      console.error('[TaskCache] Error invalidating key:', e);
    }
  }

  /**
   * Completely purges the Cache.
   */
  clear(): void {
    this.memoryCache.clear();
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.STORAGE_KEY_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error('[TaskCache] Error clearing localStorage Cache:', e);
    }
  }

  /**
   * OFFLINE & CONFLICT RESOLUTION: Enqueue a task submission or mutation while offline.
   */
  enqueueOfflineMutation(mutation: { id: string; type: 'submission' | 'creation' | 'update'; payload: any }): void {
    const queue = this.getOfflinePendingQueue();
    // Prevent duplicate submission mutations for same entity
    const filteredQueue = queue.filter(item => !(item.id === mutation.id && item.type === mutation.type));
    filteredQueue.push({
      ...mutation,
      timestamp: Date.now()
    });

    try {
      localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(filteredQueue));
    } catch (e) {
      console.error('[TaskCache] Failed to persist offline queue:', e);
    }
  }

  /**
   * Gets all offline pending queue operations.
   */
  getOfflinePendingQueue(): Array<{ id: string; type: 'submission' | 'creation' | 'update'; payload: any; timestamp: number }> {
    try {
      const stored = localStorage.getItem(this.OFFLINE_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('[TaskCache] Error parsing offline pending queue:', e);
      return [];
    }
  }

  /**
   * Clears completed items from the offline pending queue.
   */
  clearOfflinePendingQueue(): void {
    try {
      localStorage.removeItem(this.OFFLINE_QUEUE_KEY);
    } catch (e) {
      console.error('[TaskCache] Error clearing offline pending queue:', e);
    }
  }

  /**
   * Removes a specific transaction from the offline queue.
   */
  dequeueOfflineMutation(id: string, type: 'submission' | 'creation' | 'update'): void {
    const queue = this.getOfflinePendingQueue();
    const updated = queue.filter(item => !(item.id === id && item.type === type));
    try {
      localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[TaskCache] Error updating offline queue:', e);
    }
  }
}

export const TaskCache = new CoreTaskCache();
