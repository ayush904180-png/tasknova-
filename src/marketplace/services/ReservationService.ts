/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskReservation, MarketplaceEventType } from '../types';
import { GlobalFirestoreAdapter } from '../adapters/FirestoreAdapter';
import { MarketplaceCache } from '../cache/MarketplaceCache';
import { MarketplaceEventBus } from '../events/MarketplaceEventBus';

/**
 * Service to manage contributor task reservations and distributed locking mechanics.
 */
export class ReservationService {
  private static RESERVATIONS_STORAGE_KEY = 'tasknova_reservations_db';
  private expirationInterval: any = null;

  constructor() {
    this.startExpirationMonitor();
  }

  /**
   * Loads all active or expired reservations from local storage database.
   */
  public getReservations(): TaskReservation[] {
    try {
      const stored = localStorage.getItem(ReservationService.RESERVATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get active reservations for a specific user.
   */
  public getActiveReservationsForUser(userId: string): TaskReservation[] {
    const now = new Date().toISOString();
    return this.getReservations().filter(res => 
      res.userId === userId && 
      res.status === 'Active' && 
      res.expiresAt > now
    );
  }

  /**
   * Reserves a task for a contributor. Prevents duplicate reservation and conflict collisions.
   */
  public async reserveTask(
    taskId: string,
    userId: string,
    isOnline = true,
    durationSeconds = 1800 // Default 30 mins
  ): Promise<{ success: boolean; reservation?: TaskReservation; error?: string }> {
    // 1. Check for Duplicate Reservation (same user, same active task)
    const activeReservations = this.getActiveReservationsForUser(userId);
    const existing = activeReservations.find(res => res.taskId === taskId);
    if (existing) {
      return { success: false, error: 'You already have an active reservation for this task.' };
    }

    // 2. Limit maximum active reservations to 3 to prevent hoarding
    if (activeReservations.length >= 3) {
      return { success: false, error: 'Maximum reservation limit reached (3 active tasks). Complete or release one before reserving more.' };
    }

    const reservedAt = new Date();
    const expiresAt = new Date(reservedAt.getTime() + durationSeconds * 1000);

    const reservation: TaskReservation = {
      id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      taskId,
      userId,
      reservedAt: reservedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'Active',
      timeRemainingSeconds: durationSeconds
    };

    // 3. OFFLINE QUEUEING
    if (!isOnline) {
      MarketplaceCache.queueReservation(taskId, 'reserve', userId);
      // Save locally as temporary reservation so user feels it's reserved
      this.saveReservationLocally(reservation);
      MarketplaceEventBus.emit(MarketplaceEventType.TaskReserved, userId, { taskId, reservationId: reservation.id, offline: true });
      return { success: true, reservation, error: 'Offline mode: Reservation queued for synchronization.' };
    }

    // 4. ONLINE LOCK ACQUISITION (Google Cloud / Distributed Firestore Lock)
    try {
      const lockAcquired = await GlobalFirestoreAdapter.acquireReservationLock(taskId, userId, durationSeconds * 1000);
      if (!lockAcquired.success) {
        return { success: false, error: 'Conflict detected: This task is currently reserved by another contributor.' };
      }

      // Save reservation to persistent store (Firestore) and locally
      await GlobalFirestoreAdapter.setReservation(reservation);
      this.saveReservationLocally(reservation);

      MarketplaceEventBus.emit(MarketplaceEventType.TaskReserved, userId, { taskId, reservationId: reservation.id, leaseId: lockAcquired.leaseId });
      return { success: true, reservation };
    } catch (err) {
      console.error('[ReservationService] Firestore error acquiring lock, falling back to local fallback:', err);
      this.saveReservationLocally(reservation);
      return { success: true, reservation };
    }
  }

  /**
   * Releases/cancels a reservation early.
   */
  public async releaseReservation(
    reservationId: string,
    userId: string,
    isOnline = true
  ): Promise<boolean> {
    const reservations = this.getReservations();
    const targetIdx = reservations.findIndex(res => res.id === reservationId && res.userId === userId);

    if (targetIdx === -1) return false;

    const target = reservations[targetIdx];
    target.status = 'Released';
    target.timeRemainingSeconds = 0;
    
    // Save state
    reservations[targetIdx] = target;
    localStorage.setItem(ReservationService.RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));

    if (!isOnline) {
      MarketplaceCache.queueReservation(target.taskId, 'release', userId);
      MarketplaceEventBus.emit(MarketplaceEventType.TaskReleased, userId, { taskId: target.taskId, reservationId, offline: true });
      return true;
    }

    try {
      await GlobalFirestoreAdapter.deleteReservation(reservationId);
      // Release distributed lock if exists
      const lockKey = `lock_${target.taskId}`;
      const storedLock = localStorage.getItem(lockKey);
      if (storedLock) {
        const lockObj = JSON.parse(storedLock);
        await GlobalFirestoreAdapter.releaseReservationLock(target.taskId, lockObj.leaseId);
      }
    } catch (e) {
      console.warn('[ReservationService] GCS/Firestore release connection failed', e);
    }

    MarketplaceEventBus.emit(MarketplaceEventType.TaskReleased, userId, { taskId: target.taskId, reservationId });
    return true;
  }

  /**
   * Helper to write reservation to local database array.
   */
  private saveReservationLocally(res: TaskReservation): void {
    const db = this.getReservations();
    // Overwrite if exists, otherwise append
    const idx = db.findIndex(item => item.id === res.id);
    if (idx !== -1) {
      db[idx] = res;
    } else {
      db.push(res);
    }
    localStorage.setItem(ReservationService.RESERVATIONS_STORAGE_KEY, JSON.stringify(db));
  }

  /**
   * Periodic interval checking for expired leases, releasing them and raising alerts.
   */
  private startExpirationMonitor(): void {
    if (typeof window === 'undefined') return;

    this.expirationInterval = setInterval(() => {
      this.evaluateExpirations();
    }, 5000); // Check every 5 seconds
  }

  /**
   * Evaluate and flag expired reservations.
   */
  public evaluateExpirations(): void {
    const reservations = this.getReservations();
    const now = Date.now();
    let hasChanges = false;

    const updated = reservations.map(res => {
      if (res.status === 'Active') {
        const expiresTime = new Date(res.expiresAt).getTime();
        const diffSeconds = Math.max(0, Math.round((expiresTime - now) / 1000));
        
        if (diffSeconds <= 0) {
          res.status = 'Expired';
          res.timeRemainingSeconds = 0;
          hasChanges = true;
          MarketplaceEventBus.emit(MarketplaceEventType.ReservationExpired, res.userId, { taskId: res.taskId, reservationId: res.id });
          
          // Clear lock
          localStorage.removeItem(`lock_${res.taskId}`);
        } else {
          res.timeRemainingSeconds = diffSeconds;
        }
      }
      return res;
    });

    if (hasChanges || updated.some((res, idx) => res.timeRemainingSeconds !== reservations[idx].timeRemainingSeconds)) {
      localStorage.setItem(ReservationService.RESERVATIONS_STORAGE_KEY, JSON.stringify(updated));
    }
  }

  /**
   * Synchronize any reservations queued during offline sessions.
   */
  public async syncOfflineQueue(userId: string): Promise<number> {
    const queuedActions = MarketplaceCache.getQueuedReservations();
    if (queuedActions.length === 0) return 0;

    let syncCount = 0;
    for (const actionItem of queuedActions) {
      try {
        if (actionItem.action === 'reserve') {
          await this.reserveTask(actionItem.taskId, userId, true);
        } else {
          // Find the active reservation local to this task
          const localRes = this.getReservations().find(r => r.taskId === actionItem.taskId && r.userId === userId && r.status === 'Active');
          if (localRes) {
            await this.releaseReservation(localRes.id, userId, true);
          }
        }
        MarketplaceCache.dequeueReservation(actionItem.id);
        syncCount++;
      } catch (err) {
        console.error(`[ReservationService] Staggered Sync failed for action item ${actionItem.id}:`, err);
        // Retry logic back-off
        MarketplaceCache.addToRetryQueue(actionItem.id, actionItem);
      }
    }
    return syncCount;
  }

  /**
   * Destroys active timeouts.
   */
  public destroy(): void {
    if (this.expirationInterval) {
      clearInterval(this.expirationInterval);
    }
  }
}

export const GlobalReservationService = new ReservationService();
