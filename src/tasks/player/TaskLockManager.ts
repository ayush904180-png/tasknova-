/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Task Reservation Lease details representing task locks before work begins.
 */
export interface TaskLock {
  taskId: string;
  userId: string;
  lockedAt: string;       // ISO 8601 string
  expiresAt: string;      // ISO 8601 string
  lockToken: string;      // Unique client cryptographic token
  released: boolean;
}

/**
 * Registry to simulate, reserve, and manage transactional safety locks 
 * prevent multiple concurrent submissions of identical task segments.
 */
export class TaskLockManager {
  private activeLocks: Map<string, TaskLock> = new Map();
  private leaseDurationMs = 15 * 60 * 1000; // 15-minute lease standard

  /**
   * Attempts to reserve and lock a specific micro-task for a validator.
   */
  async acquireLock(taskId: string, userId: string): Promise<{ success: boolean; lock?: TaskLock; reason?: string }> {
    const existing = this.activeLocks.get(taskId);
    const now = Date.now();

    if (existing && !existing.released && new Date(existing.expiresAt).getTime() > now) {
      if (existing.userId === userId) {
        // Extend lease
        return { success: true, lock: this.extendLease(taskId) };
      }
      return { 
        success: false, 
        reason: `Task is currently locked by another validator until ${existing.expiresAt}.` 
      };
    }

    // Provision new lease lock
    const lockedAt = new Date().toISOString();
    const expiresAt = new Date(now + this.leaseDurationMs).toISOString();
    const lockToken = `LOCK-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    const newLock: TaskLock = {
      taskId,
      userId,
      lockedAt,
      expiresAt,
      lockToken,
      released: false
    };

    this.activeLocks.set(taskId, newLock);
    return { success: true, lock: newLock };
  }

  /**
   * Releases an active task lock, returning the task back to the global queue pool.
   */
  async releaseLock(taskId: string, lockToken: string): Promise<boolean> {
    const lock = this.activeLocks.get(taskId);
    if (!lock || lock.lockToken !== lockToken || lock.released) {
      return false;
    }

    lock.released = true;
    this.activeLocks.delete(taskId);
    return true;
  }

  /**
   * Checks if a task is currently locked and un-resigned by any user.
   */
  isLocked(taskId: string): boolean {
    const lock = this.activeLocks.get(taskId);
    if (!lock || lock.released) return false;
    return new Date(lock.expiresAt).getTime() > Date.now();
  }

  private extendLease(taskId: string): TaskLock {
    const lock = this.activeLocks.get(taskId)!;
    lock.expiresAt = new Date(Date.now() + this.leaseDurationMs).toISOString();
    this.activeLocks.set(taskId, lock);
    return lock;
  }
}

export const GlobalTaskLockManager = new TaskLockManager();
export default GlobalTaskLockManager;
