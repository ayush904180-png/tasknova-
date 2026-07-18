/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationRecord } from '../../types/validation';

/**
 * Enterprise Validation Cache.
 * Prevents redundant read operations by holding a high-performance memory cache.
 * Supports TTL constraints, batch key hydration, and manual flushes.
 */
export class ValidationCache {
  private cache: Map<string, { record: ValidationRecord; expiresAt: number }> = new Map();
  private defaultTTLMs: number = 300000; // 5 minutes default TTL

  /**
   * Retrieves a Validation Record by validationId.
   */
  get(validationId: string): ValidationRecord | null {
    const entry = this.cache.get(validationId);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(validationId);
      return null;
    }

    return entry.record;
  }

  /**
   * Caches a Validation Record with an optional custom TTL in milliseconds.
   */
  set(validationId: string, record: ValidationRecord, ttlMs: number = this.defaultTTLMs): void {
    this.cache.set(validationId, {
      record,
      expiresAt: Date.now() + ttlMs
    });
  }

  /**
   * Invalidates a single item from the cache.
   */
  invalidate(validationId: string): void {
    this.cache.delete(validationId);
  }

  /**
   * Caches a collection of records. Useful for batch validation preloading.
   */
  setBatch(records: ValidationRecord[], ttlMs: number = this.defaultTTLMs): void {
    records.forEach(rec => this.set(rec.validationId, rec, ttlMs));
  }

  /**
   * Completely flushes the in-memory cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Retrieves all non-expired cached records.
   */
  getAllActive(): ValidationRecord[] {
    const now = Date.now();
    const active: ValidationRecord[] = [];
    
    for (const [id, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(id);
      } else {
        active.push(entry.record);
      }
    }
    
    return active;
  }
}

export const GlobalValidationCache = new ValidationCache();
export default GlobalValidationCache;
