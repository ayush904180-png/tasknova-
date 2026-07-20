/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneratedTaskEntity, TaskGenPipeline } from '../types';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export interface OfflineQueueItem {
  id: string;
  type: 'pipeline_create' | 'task_update' | 'task_bulk_publish';
  payload: any;
  retryCount: number;
  lastAttempt?: number;
  error?: string;
  timestamp: number;
}

class CoreTaskGenerationCache {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 10 * 60 * 1000; // 10 minutes default
  private CACHE_PREFIX = 'tasknova_gen_cache_';
  private OFFLINE_QUEUE_KEY = 'tasknova_gen_offline_queue';
  private RETRY_QUEUE_KEY = 'tasknova_gen_retry_queue';

  set<T>(key: string, data: T, ttlMs: number = this.defaultTTL): void {
    const entry: CacheEntry<T> = {
      data,
      expiry: Date.now() + ttlMs,
    };
    this.memoryCache.set(key, entry);

    try {
      localStorage.setItem(`${this.CACHE_PREFIX}${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('[TaskGenerationCache] LocalStorage size exceeded.', e);
    }
  }

  get<T>(key: string): T | null {
    // Check Memory
    let entry = this.memoryCache.get(key);

    // Check LocalStorage
    if (!entry) {
      try {
        const stored = localStorage.getItem(`${this.CACHE_PREFIX}${key}`);
        if (stored) {
          entry = JSON.parse(stored);
          if (entry) {
            this.memoryCache.set(key, entry);
          }
        }
      } catch (e) {
        console.error('[TaskGenerationCache] Parse error for key:', key, e);
      }
    }

    if (entry) {
      if (Date.now() < entry.expiry) {
        return entry.data as T;
      } else {
        this.invalidate(key);
      }
    }
    return null;
  }

  invalidate(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
    } catch (e) {
      console.error('[TaskGenerationCache] Invalidation error:', e);
    }
  }

  clear(): void {
    this.memoryCache.clear();
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.CACHE_PREFIX)) {
          keys.push(k);
        }
      }
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error('[TaskGenerationCache] Clear cache error:', e);
    }
  }

  // Offline Pending Operations
  getOfflineQueue(): OfflineQueueItem[] {
    try {
      const stored = localStorage.getItem(this.OFFLINE_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveOfflineQueue(queue: OfflineQueueItem[]): void {
    try {
      localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('[TaskGenerationCache] Save offline queue error:', e);
    }
  }

  enqueueOffline(item: Omit<OfflineQueueItem, 'timestamp' | 'retryCount'>): void {
    const queue = this.getOfflineQueue();
    // Prevent duplicate entries for identical mutations
    const filtered = queue.filter(q => !(q.id === item.id && q.type === item.type));
    filtered.push({
      ...item,
      retryCount: 0,
      timestamp: Date.now()
    });
    this.saveOfflineQueue(filtered);
  }

  dequeueOffline(id: string, type: OfflineQueueItem['type']): void {
    const queue = this.getOfflineQueue();
    const filtered = queue.filter(q => !(q.id === id && q.type === type));
    this.saveOfflineQueue(filtered);
  }

  // Retry Queue Operations for failed background synchronizations
  getRetryQueue(): OfflineQueueItem[] {
    try {
      const stored = localStorage.getItem(this.RETRY_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveRetryQueue(queue: OfflineQueueItem[]): void {
    try {
      localStorage.setItem(this.RETRY_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('[TaskGenerationCache] Save retry queue error:', e);
    }
  }

  enqueueRetry(item: OfflineQueueItem): void {
    const queue = this.getRetryQueue();
    const filtered = queue.filter(q => !(q.id === item.id && q.type === item.type));
    filtered.push({
      ...item,
      retryCount: item.retryCount + 1,
      lastAttempt: Date.now(),
    });
    this.saveRetryQueue(filtered);
  }

  dequeueRetry(id: string, type: OfflineQueueItem['type']): void {
    const queue = this.getRetryQueue();
    const filtered = queue.filter(q => !(q.id === id && q.type === type));
    this.saveRetryQueue(filtered);
  }
}

export const TaskGenerationCache = new CoreTaskGenerationCache();
