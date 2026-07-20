/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class OfflineCache {
  private static PREFIX = 'tasknova_analytics_cache_';
  private static QUEUE_KEY = 'tasknova_analytics_offline_queue';

  /**
   * Sets cache entry with TTL
   */
  public static set<T>(key: string, data: T, ttlMs: number = 300000): void {
    const entry: CacheEntry<T> = {
      data,
      expiry: Date.now() + ttlMs
    };
    try {
      localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('OfflineCache write failed (storage limit or quota exceeded):', e);
    }
  }

  /**
   * Gets cached entry. Returns null if expired or not found.
   */
  public static get<T>(key: string): T | null {
    const raw = localStorage.getItem(`${this.PREFIX}${key}`);
    if (!raw) return null;

    try {
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() > entry.expiry) {
        // Clear expired
        localStorage.removeItem(`${this.PREFIX}${key}`);
        return null;
      }
      return entry.data;
    } catch (e) {
      return null;
    }
  }

  /**
   * Clears a cached key
   */
  public static clear(key: string): void {
    localStorage.removeItem(`${this.PREFIX}${key}`);
  }

  /**
   * Offline Action queue registration (with conflict resolution)
   */
  public static queueOfflineAction(actionType: string, payload: any): void {
    const queue = this.getOfflineQueue();
    // Simple conflict resolution: if we have a save/update action for the same ID, replace it
    const filtered = queue.filter(item => !(item.actionType === actionType && item.payload.id === payload.id));
    filtered.push({
      id: `${actionType}_${Date.now()}_${Math.random().toString(36).substring(4)}`,
      actionType,
      payload,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(filtered));
  }

  public static getOfflineQueue(): any[] {
    const raw = localStorage.getItem(this.QUEUE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  public static clearOfflineQueue(): void {
    localStorage.removeItem(this.QUEUE_KEY);
  }
}
