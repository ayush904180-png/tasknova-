/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationRecord, ValidationFilterOptions, HumanReviewItem } from '../../types/validation';
import { GlobalValidationCache } from '../utils/ValidationCache';
import { ValidationQueryBuilder } from '../utils/ValidationQueryBuilder';
import { ValidationValidator } from '../utils/ValidationValidator';

/**
 * Enterprise Validation & Human Review Repository.
 * Isolates data storage layers, supporting in-memory caching and disk persistency.
 * UI components must consume records through this repository to maintain consistency.
 */
export class ValidationRepository {
  private static VALIDATIONS_KEY = 'tasknova_validations_db';
  private static REVIEWS_KEY = 'tasknova_human_reviews_db';

  private validationSubscribers: Array<(records: ValidationRecord[]) => void> = [];
  private reviewSubscribers: Array<(reviews: HumanReviewItem[]) => void> = [];

  constructor() {
    this.initializeLocalStorage();
  }

  private initializeLocalStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const storedVal = localStorage.getItem(ValidationRepository.VALIDATIONS_KEY);
        if (!storedVal) {
          localStorage.setItem(ValidationRepository.VALIDATIONS_KEY, JSON.stringify([]));
        } else {
          // Hydrate the Global Cache with non-expired items
          const list: ValidationRecord[] = JSON.parse(storedVal);
          GlobalValidationCache.setBatch(list);
        }

        const storedRev = localStorage.getItem(ValidationRepository.REVIEWS_KEY);
        if (!storedRev) {
          localStorage.setItem(ValidationRepository.REVIEWS_KEY, JSON.stringify([]));
        }
      }
    } catch (e) {
      console.error('[ValidationRepository] Failed to initialize local storage:', e);
    }
  }

  // ==========================================
  // VALIDATION RECORDS APIS
  // ==========================================

  /**
   * Retrieves a Validation Record by its validationId.
   */
  async getById(id: string): Promise<ValidationRecord | null> {
    // 1. Try Cache hit
    const cached = GlobalValidationCache.get(id);
    if (cached) return cached;

    // 2. Fallback to Disk read
    const list = this.loadAllValidationsFromDisk();
    const found = list.find(r => r.validationId === id) || null;

    if (found) {
      GlobalValidationCache.set(id, found);
    }
    return found;
  }

  /**
   * Lists validation records with filtered criteria.
   */
  async list(options: ValidationFilterOptions): Promise<ValidationRecord[]> {
    const list = this.loadAllValidationsFromDisk();
    const query = new ValidationQueryBuilder(list);
    return query.execute(options);
  }

  /**
   * Commits a ValidationRecord to the local disk and cache.
   */
  async save(record: ValidationRecord): Promise<void> {
    const now = new Date().toISOString();
    
    // 1. Compute and seal signature block for security checks
    const sealedRecord: ValidationRecord = {
      ...record,
      signature: ValidationValidator.computeSignature(record),
      completedAt: record.completedAt || now,
    };

    // 2. Perform security & format audit trail validations
    const audit = ValidationValidator.auditRecord(sealedRecord);
    if (!audit.isValid) {
      throw new Error(`[ValidationRepository] Block Security Audit Failed! Reason: ${audit.error}`);
    }

    // 3. Write to cache & disk
    GlobalValidationCache.set(sealedRecord.validationId, sealedRecord);
    this.persistValidationToDisk(sealedRecord);
  }

  /**
   * Deletes a record from storage. Terminal records are protected.
   */
  async delete(id: string): Promise<void> {
    const list = this.loadAllValidationsFromDisk();
    const filtered = list.filter(r => r.validationId !== id);
    
    GlobalValidationCache.invalidate(id);
    localStorage.setItem(ValidationRepository.VALIDATIONS_KEY, JSON.stringify(filtered));
    this.triggerValidationSubscribers(filtered);
  }

  /**
   * Standard React reactive subscriber.
   */
  subscribe(callback: (records: ValidationRecord[]) => void): () => void {
    this.validationSubscribers.push(callback);
    callback(this.loadAllValidationsFromDisk());
    return () => {
      this.validationSubscribers = this.validationSubscribers.filter(cb => cb !== callback);
    };
  }

  // ==========================================
  // HUMAN REVIEW QUEUE APIS
  // ==========================================

  /**
   * Retrieves a Human Review record.
   */
  async getReviewById(id: string): Promise<HumanReviewItem | null> {
    const list = this.loadAllReviewsFromDisk();
    return list.find(r => r.reviewId === id) || null;
  }

  /**
   * Lists all active or historical human review assignments.
   */
  async listReviews(): Promise<HumanReviewItem[]> {
    return this.loadAllReviewsFromDisk();
  }

  /**
   * Commits a HumanReviewItem block to local storage.
   */
  async saveReview(review: HumanReviewItem): Promise<void> {
    const list = this.loadAllReviewsFromDisk();
    const idx = list.findIndex(r => r.reviewId === review.reviewId);
    
    if (idx !== -1) {
      list[idx] = review;
    } else {
      list.push(review);
    }

    localStorage.setItem(ValidationRepository.REVIEWS_KEY, JSON.stringify(list));
    this.triggerReviewSubscribers(list);
  }

  /**
   * Subscribes to changes in human review items.
   */
  subscribeReviews(callback: (reviews: HumanReviewItem[]) => void): () => void {
    this.reviewSubscribers.push(callback);
    callback(this.loadAllReviewsFromDisk());
    return () => {
      this.reviewSubscribers = this.reviewSubscribers.filter(cb => cb !== callback);
    };
  }

  // ==========================================
  // INTERNAL PERSISTENCE READ/WRITES
  // ==========================================

  private loadAllValidationsFromDisk(): ValidationRecord[] {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(ValidationRepository.VALIDATIONS_KEY);
        return stored ? JSON.parse(stored) : [];
      }
    } catch {
      // Return empty array on failure
    }
    return [];
  }

  private persistValidationToDisk(record: ValidationRecord): void {
    const list = this.loadAllValidationsFromDisk();
    const idx = list.findIndex(r => r.validationId === record.validationId);
    
    if (idx !== -1) {
      list[idx] = record;
    } else {
      list.push(record);
    }

    localStorage.setItem(ValidationRepository.VALIDATIONS_KEY, JSON.stringify(list));
    this.triggerValidationSubscribers(list);
  }

  private loadAllReviewsFromDisk(): HumanReviewItem[] {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(ValidationRepository.REVIEWS_KEY);
        return stored ? JSON.parse(stored) : [];
      }
    } catch {
      // Handled
    }
    return [];
  }

  private triggerValidationSubscribers(records: ValidationRecord[]): void {
    this.validationSubscribers.forEach(cb => {
      try { cb(records); } catch (e) { console.error('[ValidationRepository] Val subscriber fail:', e); }
    });
  }

  private triggerReviewSubscribers(reviews: HumanReviewItem[]): void {
    this.reviewSubscribers.forEach(cb => {
      try { cb(reviews); } catch (e) { console.error('[ValidationRepository] Rev subscriber fail:', e); }
    });
  }
}

export const GlobalValidationRepository = new ValidationRepository();
export default GlobalValidationRepository;
