/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueuedReservationAction } from '../types';

interface CacheEntry<T> {
  value: T;
  expiresAt: number; // Epoch timestamp
}

/**
 * Enterprise Caching System with Time-To-Live (TTL) controls and offline-support queue backing.
 */
export class MarketplaceCache {
  private static CACHE_PREFIX = 'tasknova_marketplace_cache:';
  private static RESERVATION_QUEUE_KEY = 'tasknova_offline_reservations';
  private static RETRY_QUEUE_KEY = 'tasknova_retry_queue';

  /**
   * Sets a key in cache with a custom TTL in seconds.
   */
  public static set<T>(key: string, value: T, ttlSeconds: number): void {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    };
    try {
      localStorage.setItem(`${this.CACHE_PREFIX}${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('[MarketplaceCache] Storage full or disabled, bypassing cache write', e);
    }
  }

  /**
   * Retrieves a key from cache, checking if TTL is valid. Automatically purges if expired.
   */
  public static get<T>(key: string): T | null {
    const fullKey = `${this.CACHE_PREFIX}${key}`;
    try {
      const stored = localStorage.getItem(fullKey);
      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(fullKey); // Expired
        return null;
      }
      return entry.value;
    } catch {
      return null;
    }
  }

  /**
   * Cleans up expired cache items.
   */
  public static purgeExpired(): void {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const entry = JSON.parse(stored);
              if (now > entry.expiresAt) {
                localStorage.removeItem(key);
              }
            } catch {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (e) {
      console.error('[MarketplaceCache] Error purging expired items:', e);
    }
  }

  /**
   * Queue a reservation action to be executed when the network recovers.
   */
  public static queueReservation(taskId: string, action: 'reserve' | 'release', userId: string): void {
    try {
      const currentQueue = this.getQueuedReservations();
      const newAction: QueuedReservationAction = {
        id: `offline_res_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        taskId,
        action,
        timestamp: new Date().toISOString(),
        ttl: Date.now() + 2 * 3600 * 1000 // 2 hours TTL for pending queue
      };

      // Filter out redundant actions for the same task
      const filtered = currentQueue.filter(item => item.taskId !== taskId);
      filtered.push(newAction);

      localStorage.setItem(this.RESERVATION_QUEUE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('[MarketplaceCache] Error queuing reservation:', e);
    }
  }

  /**
   * Retrieves all currently queued reservation actions.
   */
  public static getQueuedReservations(): QueuedReservationAction[] {
    try {
      const stored = localStorage.getItem(this.RESERVATION_QUEUE_KEY);
      if (!stored) return [];
      const rawQueue: QueuedReservationAction[] = JSON.parse(stored);
      const now = Date.now();
      // Remove items whose TTL has expired
      return rawQueue.filter(item => now < item.ttl);
    } catch {
      return [];
    }
  }

  /**
   * Remove a completed or stale action from the reservation queue.
   */
  public static dequeueReservation(id: string): void {
    try {
      const queue = this.getQueuedReservations();
      const updated = queue.filter(item => item.id !== id);
      localStorage.setItem(this.RESERVATION_QUEUE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[MarketplaceCache] Error dequeuing reservation:', e);
    }
  }

  /**
   * Clears the entire offline reservation queue.
   */
  public static clearReservationQueue(): void {
    localStorage.removeItem(this.RESERVATION_QUEUE_KEY);
  }

  /**
   * Adds an action to the Retry Queue.
   */
  public static addToRetryQueue(key: string, payload: any, retryLimit = 3): void {
    try {
      const queue = this.getRetryQueue();
      const existing = queue.find(item => item.key === key);
      if (existing) {
        existing.attempts += 1;
        existing.lastAttempt = Date.now();
      } else {
        queue.push({
          key,
          payload,
          attempts: 1,
          maxAttempts: retryLimit,
          lastAttempt: Date.now()
        });
      }
      localStorage.setItem(this.RETRY_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('[MarketplaceCache] Error adding to retry queue:', e);
    }
  }

  /**
   * Retrieves items in the retry queue.
   */
  public static getRetryQueue(): Array<{
    key: string;
    payload: any;
    attempts: number;
    maxAttempts: number;
    lastAttempt: number;
  }> {
    try {
      const stored = localStorage.getItem(this.RETRY_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Remove an item from the retry queue.
   */
  public static removeFromRetryQueue(key: string): void {
    try {
      const queue = this.getRetryQueue();
      const updated = queue.filter(item => item.key !== key);
      localStorage.setItem(this.RETRY_QUEUE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[MarketplaceCache] Error removing from retry queue:', e);
    }
  }
}
