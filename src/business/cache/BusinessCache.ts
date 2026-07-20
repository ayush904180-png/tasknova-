/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class BusinessCache {
  private static cachePrefix = 'tasknova_business_cache_';

  static get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(this.cachePrefix + key);
      return data ? JSON.parse(data) as T : null;
    } catch {
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.cachePrefix + key, JSON.stringify(value));
    } catch {
      // Fail-silent in isolated iframe environments
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.cachePrefix + key);
    } catch {
      // Fail-silent
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((k) => {
        if (k.startsWith(this.cachePrefix)) {
          localStorage.removeItem(k);
        }
      });
    } catch {
      // Fail-silent
    }
  }
}
