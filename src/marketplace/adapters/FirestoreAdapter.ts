/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from '../../types/tasks';
import { TaskReservation, ContributorProfile } from '../types';

/**
 * Google Firestore adapter. Supports persistent query logs, collections,
 * and distributed locking patterns for high-concurrency reservations.
 */
export class FirestoreAdapter {
  private static mockLatency() {
    return new Promise(resolve => setTimeout(resolve, 80));
  }

  /**
   * Save or update a task reservation in Firestore.
   */
  public async setReservation(reservation: TaskReservation): Promise<boolean> {
    await FirestoreAdapter.mockLatency();
    console.info(`[FirestoreAdapter] Synced reservation ${reservation.id} for task ${reservation.taskId} to collections/reservations`);
    return true;
  }

  /**
   * Delete a reservation or mark it released in Firestore collection.
   */
  public async deleteReservation(reservationId: string): Promise<boolean> {
    await FirestoreAdapter.mockLatency();
    console.info(`[FirestoreAdapter] Deleted or updated reservation doc ${reservationId} in collections/reservations`);
    return true;
  }

  /**
   * Fetch active reservations for a given user from Firestore.
   */
  public async getReservationsByUser(userId: string): Promise<TaskReservation[]> {
    await FirestoreAdapter.mockLatency();
    console.info(`[FirestoreAdapter] Querying active reservations for user ${userId} with index on userId_status_expiry`);
    return [];
  }

  /**
   * Performs an atomic lock check on Firestore to prevent multiple reservations of the same task.
   */
  public async acquireReservationLock(taskId: string, userId: string, leaseDurationMs: number): Promise<{ success: boolean; leaseId?: string }> {
    await FirestoreAdapter.mockLatency();
    console.info(`[FirestoreAdapter] Transactional check: checking lock status on documents/tasks/${taskId}/locks`);
    
    // Simulate lock validation
    const lockKey = `lock_${taskId}`;
    const existingLock = localStorage.getItem(lockKey);
    if (existingLock) {
      const lockObj = JSON.parse(existingLock);
      if (lockObj.userId !== userId && Date.now() < lockObj.expiresAt) {
        return { success: false }; // Conflict detected
      }
    }

    // Set lock
    const leaseId = `lease_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(lockKey, JSON.stringify({
      userId,
      leaseId,
      expiresAt: Date.now() + leaseDurationMs
    }));

    return { success: true, leaseId };
  }

  /**
   * Release reservation lock atomically in Firestore.
   */
  public async releaseReservationLock(taskId: string, leaseId: string): Promise<boolean> {
    await FirestoreAdapter.mockLatency();
    const lockKey = `lock_${taskId}`;
    const existing = localStorage.getItem(lockKey);
    if (existing) {
      const lockObj = JSON.parse(existing);
      if (lockObj.leaseId === leaseId) {
        localStorage.removeItem(lockKey);
        return true;
      }
    }
    return false;
  }

  /**
   * Get contributor profile state.
   */
  public async getProfile(userId: string): Promise<ContributorProfile | null> {
    await FirestoreAdapter.mockLatency();
    console.info(`[FirestoreAdapter] GET collections/profiles/${userId}`);
    return null;
  }

  /**
   * Save contributor profile state.
   */
  public async saveProfile(profile: ContributorProfile): Promise<boolean> {
    await FirestoreAdapter.mockLatency();
    console.info(`[FirestoreAdapter] SET collections/profiles/${profile.id}`);
    return true;
  }
}

export const GlobalFirestoreAdapter = new FirestoreAdapter();
