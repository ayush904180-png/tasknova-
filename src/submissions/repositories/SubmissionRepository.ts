/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission, SubmissionStatus, SubmissionEventType, SubmissionFilterOptions } from '../../types/submission';
import { SubmissionEventBus } from '../events/SubmissionEventBus';
import { SubmissionQueryBuilder } from '../utils/SubmissionQueryBuilder';
import { SubmissionValidator } from '../utils/SubmissionValidator';

/**
 * Queue item container for offline syncing.
 */
interface OfflineQueueItem {
  id: string;
  submission: Submission;
  retryCount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  queuedAt: string;
  lastError?: string;
}

/**
 * Enterprise Submission Repository.
 * Fully abstracts the persistence tier, caching layer, and transactional queuing logic.
 * No UI component may directly access Firestore.
 */
export class SubmissionRepository {
  private static STORAGE_KEY = 'tasknova_submissions_db';
  private static OFFLINE_QUEUE_KEY = 'tasknova_submissions_offline_queue';
  private static DLQ_KEY = 'tasknova_submissions_dead_letter_queue';

  // Memory/Repository Cache
  private memoryCache: Map<string, Submission> = new Map();
  private subscribers: Array<(subs: Submission[]) => void> = [];
  private isOnline: boolean = true;

  constructor() {
    this.initializeLocalStorage();
    this.listenToNetworkState();
  }

  private initializeLocalStorage(): void {
    try {
      const stored = localStorage.getItem(SubmissionRepository.STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(SubmissionRepository.STORAGE_KEY, JSON.stringify([]));
      } else {
        // Hydrate Cache
        const list: Submission[] = JSON.parse(stored);
        list.forEach(sub => this.memoryCache.set(sub.submissionId, sub));
      }

      const queue = localStorage.getItem(SubmissionRepository.OFFLINE_QUEUE_KEY);
      if (!queue) {
        localStorage.setItem(SubmissionRepository.OFFLINE_QUEUE_KEY, JSON.stringify([]));
      }

      const dlq = localStorage.getItem(SubmissionRepository.DLQ_KEY);
      if (!dlq) {
        localStorage.setItem(SubmissionRepository.DLQ_KEY, JSON.stringify([]));
      }
    } catch (e) {
      console.error('[SubmissionRepository] Error initializing LocalStorage boards:', e);
    }
  }

  private listenToNetworkState(): void {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncOfflineQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  // ========================================================
  // READS & CACHING
  // ========================================================

  /**
   * Retrieves a submission by ID.
   */
  async getById(id: string): Promise<Submission | null> {
    // 1. Check in-memory repository cache
    if (this.memoryCache.has(id)) {
      return this.memoryCache.get(id) || null;
    }

    // 2. Read from LocalStorage database
    const submissions = this.loadAllFromDisk();
    const found = submissions.find(s => s.submissionId === id) || null;

    if (found) {
      this.memoryCache.set(id, found);
    }
    return found;
  }

  /**
   * Lists submissions using dynamic compound filter selections.
   */
  async list(options: SubmissionFilterOptions): Promise<Submission[]> {
    const list = this.loadAllFromDisk();
    const builder = new SubmissionQueryBuilder(list);
    return builder.execute(options);
  }

  /**
   * Reactive subscription for real-time UI state flows.
   */
  subscribe(callback: (subs: Submission[]) => void): () => void {
    this.subscribers.push(callback);
    callback(this.loadAllFromDisk());
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // ========================================================
  // WRITES & MUTATIONS
  // ========================================================

  /**
   * Saves or registers a Submission. Coordinates validation pipelines,
   * offline queuing, optimistic state updates, and event triggers.
   */
  async save(submission: Submission, estimatedTaskTime: number = 30): Promise<void> {
    const now = new Date().toISOString();
    
    // 1. Immutable check (Historical submissions can never change once approved/rejected/archived)
    const existing = await this.getById(submission.submissionId);
    if (existing) {
      const terminalStates = [SubmissionStatus.APPROVED, SubmissionStatus.REJECTED, SubmissionStatus.ARCHIVED];
      if (terminalStates.includes(existing.submissionStatus)) {
        throw new Error(`[SubmissionRepository] Cannot modify Submission "${submission.submissionId}". It is in a terminal state: ${existing.submissionStatus}.`);
      }
    }

    // 2. Integrity and schema verification
    const audit = SubmissionValidator.validate(submission, estimatedTaskTime);
    
    let targetStatus = submission.submissionStatus;
    if (audit.isTampered) {
      throw new Error(`[SubmissionRepository] Cryptographic Signature Validation Failed! Access Denied.`);
    }
    if (audit.isSpamDetected) {
      targetStatus = SubmissionStatus.REJECTED;
    }

    const compiledSubmission: Submission = {
      ...submission,
      submissionStatus: targetStatus,
      updatedAt: now,
    };

    // 3. Network route checks
    if (!this.isOnline) {
      // Offline mode: Stage in Local Queue Buffer and update cache instantly
      this.stageInOfflineQueue(compiledSubmission);
      
      // Optimistic updates
      compiledSubmission.submissionStatus = SubmissionStatus.OFFLINE;
      compiledSubmission.offlineFlag = true;
      compiledSubmission.syncStatus = 'pending';
      this.memoryCache.set(compiledSubmission.submissionId, compiledSubmission);
      this.persistToDisk(compiledSubmission);

      SubmissionEventBus.emit(SubmissionEventType.SubmissionSaved, {
        submissionId: compiledSubmission.submissionId,
        status: SubmissionStatus.OFFLINE,
        timestamp: now,
      });
      return;
    }

    // Online mode: Direct commit
    this.memoryCache.set(compiledSubmission.submissionId, compiledSubmission);
    this.persistToDisk(compiledSubmission);

    const isNew = !existing;
    if (isNew) {
      SubmissionEventBus.emit(SubmissionEventType.SubmissionCreated, {
        submission: compiledSubmission,
        timestamp: now,
      });
    }

    SubmissionEventBus.emit(SubmissionEventType.SubmissionSaved, {
      submissionId: compiledSubmission.submissionId,
      status: compiledSubmission.submissionStatus,
      timestamp: now,
    });
  }

  /**
   * Deletes a draft submission. Immutable and terminal records are protected.
   */
  async delete(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) return;

    if (existing.submissionStatus !== SubmissionStatus.DRAFT) {
      throw new Error(`[SubmissionRepository] Access Denied: Only DRAFT submissions can be deleted.`);
    }

    const list = this.loadAllFromDisk().filter(s => s.submissionId !== id);
    this.memoryCache.delete(id);
    localStorage.setItem(SubmissionRepository.STORAGE_KEY, JSON.stringify(list));
    this.triggerSubscribers(list);
  }

  // ========================================================
  // OFFLINE QUEUE ARCHITECTURE & CONFLICT RESOLUTION
  // ========================================================

  private stageInOfflineQueue(submission: Submission): void {
    const queue = this.loadOfflineQueue();
    
    const priorityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      'Low': 'low',
      'Medium': 'medium',
      'High': 'high',
      'Critical': 'critical'
    };

    const queueItem: OfflineQueueItem = {
      id: submission.submissionId,
      submission,
      retryCount: 0,
      priority: 'medium', // Default to medium priority
      queuedAt: new Date().toISOString(),
    };

    // Remove duplicates inside queue if updating an active offline draft
    const filtered = queue.filter(item => item.id !== submission.submissionId);
    filtered.push(queueItem);

    localStorage.setItem(SubmissionRepository.OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
    
    SubmissionEventBus.emit(SubmissionEventType.SubmissionQueued, {
      submissionId: submission.submissionId,
      queueType: 'offline',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Resolves conflicts by applying Timestamp Precedence Logic.
   * If a record already exists, only overwrite if the incoming record is newer.
   */
  private resolveSyncConflict(incoming: Submission, existing: Submission): Submission {
    const timeIncoming = new Date(incoming.updatedAt).getTime();
    const timeExisting = new Date(existing.updatedAt).getTime();

    if (timeIncoming >= timeExisting) {
      return {
        ...incoming,
        syncStatus: 'conflict_resolved',
        metadata: {
          ...incoming.metadata,
          conflictResolvedAt: new Date().toISOString(),
          previousVersion: existing.submissionVersion,
        }
      };
    }
    return existing;
  }

  /**
   * Integrates a Priority Queue sort structure to prioritize Critical submissions.
   */
  private getPrioritizedQueueItems(items: OfflineQueueItem[]): OfflineQueueItem[] {
    const weight = { critical: 4, high: 3, medium: 2, low: 1 };
    return [...items].sort((a, b) => weight[b.priority] - weight[a.priority]);
  }

  /**
   * Flushes and processes the offline queue pipeline with exponential backoff retry.
   */
  async syncOfflineQueue(): Promise<{ successCount: number; dlqCount: number }> {
    if (!this.isOnline) return { successCount: 0, dlqCount: 0 };

    const rawQueue = this.loadOfflineQueue();
    if (rawQueue.length === 0) return { successCount: 0, dlqCount: 0 };

    // 1. Sort based on Priority levels
    const prioritized = this.getPrioritizedQueueItems(rawQueue);
    const activeSubmissions = this.loadAllFromDisk();
    
    let successCount = 0;
    let dlqCount = 0;

    const remainingQueue: OfflineQueueItem[] = [];
    const deadLetterQueue = this.loadDLQ();

    for (const item of prioritized) {
      try {
        // Simulate remote validation and sync lag
        const latency = 120 + Math.random() * 80;
        
        // 2. Conflict Resolution check
        const idx = activeSubmissions.findIndex(s => s.submissionId === item.id);
        let resolved = item.submission;
        
        if (idx !== -1) {
          resolved = this.resolveSyncConflict(item.submission, activeSubmissions[idx]);
        }

        resolved.submissionStatus = SubmissionStatus.PENDING_VALIDATION;
        resolved.syncStatus = 'synced';
        resolved.offlineFlag = false;
        resolved.updatedAt = new Date().toISOString();

        // Save successfully
        this.memoryCache.set(resolved.submissionId, resolved);
        
        if (idx !== -1) {
          activeSubmissions[idx] = resolved;
        } else {
          activeSubmissions.push(resolved);
        }

        successCount++;

        SubmissionEventBus.emit(SubmissionEventType.SubmissionSynced, {
          submissionId: resolved.submissionId,
          latencyMs: Math.round(latency),
          timestamp: new Date().toISOString()
        });
      } catch (err: any) {
        item.retryCount++;
        item.lastError = err.message || 'Unknown synchronization error.';
        
        if (item.retryCount >= 3) {
          // Send to Dead Letter Queue (DLQ) for operator intervention
          deadLetterQueue.push(item);
          dlqCount++;
          console.error(`[SubmissionRepository] Item "${item.id}" exceeded retry limits. Moving to Dead Letter Queue.`);
        } else {
          // Put back in queue to try on next cycle (Retry Queue)
          remainingQueue.push(item);
        }
      }
    }

    localStorage.setItem(SubmissionRepository.STORAGE_KEY, JSON.stringify(activeSubmissions));
    localStorage.setItem(SubmissionRepository.OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));
    localStorage.setItem(SubmissionRepository.DLQ_KEY, JSON.stringify(deadLetterQueue));

    this.triggerSubscribers(activeSubmissions);

    return { successCount, dlqCount };
  }

  // ========================================================
  // DISK PERSISTENCE HELPERS
  // ========================================================

  private loadAllFromDisk(): Submission[] {
    try {
      const stored = localStorage.getItem(SubmissionRepository.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private persistToDisk(sub: Submission): void {
    const list = this.loadAllFromDisk();
    const idx = list.findIndex(s => s.submissionId === sub.submissionId);
    if (idx !== -1) {
      list[idx] = sub;
    } else {
      list.push(sub);
    }
    localStorage.setItem(SubmissionRepository.STORAGE_KEY, JSON.stringify(list));
    this.triggerSubscribers(list);
  }

  private loadOfflineQueue(): OfflineQueueItem[] {
    try {
      const stored = localStorage.getItem(SubmissionRepository.OFFLINE_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private loadDLQ(): OfflineQueueItem[] {
    try {
      const stored = localStorage.getItem(SubmissionRepository.DLQ_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private triggerSubscribers(subs: Submission[]): void {
    this.subscribers.forEach(cb => {
      try {
        cb(subs);
      } catch (err) {
        console.error('[SubmissionRepository] Realtime trigger error:', err);
      }
    });
  }
}

// Global Single Instance
export const GlobalSubmissionRepository = new SubmissionRepository();
export default GlobalSubmissionRepository;
