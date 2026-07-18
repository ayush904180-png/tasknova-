/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemoryDatabase } from '../repositories/FirestoreRepository';
import { DriveStorageService } from '../services/WorkspaceServices';
import { FirestoreCollection } from '../firebase/types';

/**
 * Orchestrates cold-storage automated backups, recovery rollbacks, and recovery checkpoints.
 */
export class BackupService {
  private driveService = new DriveStorageService();

  /**
   * Performs an automated backup of a target Firestore collection, uploading it as cold JSON inside Google Drive.
   */
  async runCollectionBackup(collectionName: FirestoreCollection): Promise<{ success: boolean; backupFileId?: string; error?: string }> {
    try {
      console.log(`[BackupService] Fetching all records for backup: ${collectionName}...`);
      const data = MemoryDatabase.list(collectionName);

      if (data.length === 0) {
        console.log(`[BackupService] Collection "${collectionName}" is empty. Skipping upload.`);
        return { success: true };
      }

      const res = await this.driveService.uploadDatabaseBackup(collectionName, data);

      if (res.success) {
        console.log(`[BackupService] Successfully completed backup of "${collectionName}". File ID: ${res.driveFileId}`);
        return { success: true, backupFileId: res.driveFileId };
      } else {
        return { success: false, error: 'Google Drive bucket is not configured.' };
      }
    } catch (e: any) {
      console.error(`[BackupService] Critical backup failure on "${collectionName}":`, e);
      return { success: false, error: e.message || String(e) };
    }
  }

  /**
   * Triggers a full automated sweep backup for all 22 collections.
   */
  async runFullGlobalBackup(): Promise<{ successCount: number; failedCount: number; logs: string[] }> {
    const collections = Object.values(FirestoreCollection);
    const logs: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    for (const coll of collections) {
      const res = await this.runCollectionBackup(coll);
      if (res.success) {
        successCount++;
        logs.push(`SUCCESS: Backup completed for ${coll}`);
      } else {
        failedCount++;
        logs.push(`FAILED: Backup failed for ${coll} - Reason: ${res.error}`);
      }
    }

    return { successCount, failedCount, logs };
  }

  /**
   * Simulates an Emergency Restore flow. Overwrites/restores collection items using a specific snapshot JSON array.
   */
  async emergencyRestoreCollection(collectionName: FirestoreCollection, snapshotData: Record<string, any>[]): Promise<void> {
    console.warn(`[BackupService] WARNING: CRITICAL EMERGENCY RESTORE INIT. RE-WRITING ${collectionName}!`);

    // 1. Purge current database
    const current = MemoryDatabase.list(collectionName);
    current.forEach(item => {
      MemoryDatabase.delete(collectionName, item.id);
    });

    // 2. Hydrate from historical snapshot
    snapshotData.forEach(item => {
      if (item.id) {
        MemoryDatabase.set(collectionName, item.id, item);
      }
    });

    console.log(`[BackupService] EMERGENCY RESTORE COMPLETED. Repopulated ${snapshotData.length} records into "${collectionName}".`);
  }
}
