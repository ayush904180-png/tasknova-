/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FirestoreUser,
  FirestoreProfile,
  FirestoreTask,
  FirestoreTaskSubmission,
  FirestoreWallet,
  FirestoreTransaction,
  FirestoreCampaign,
  FirestoreFeedback,
  FirestoreAuditLog,
} from '../firebase/types';

/**
 * Generic Base Repository representing standard CRUD operations.
 */
export interface BaseRepository<T> {
  getById(id: string): Promise<T | null>;
  create(id: string, data: T): Promise<void>;
  update(id: string, data: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  list(filters?: Record<string, any>, limit?: number, startAfterId?: string): Promise<T[]>;
}

/**
 * Repository interface for Users.
 */
export interface UserRepository extends BaseRepository<FirestoreUser> {
  getByEmail(email: string): Promise<FirestoreUser | null>;
  updateSessionActivity(userId: string): Promise<void>;
}

/**
 * Repository interface for Profiles.
 */
export interface ProfileRepository extends BaseRepository<FirestoreProfile> {
  getByUsername(username: string): Promise<FirestoreProfile | null>;
  incrementXP(userId: string, xpAmount: number): Promise<void>;
  incrementCoins(userId: string, coinAmount: number): Promise<void>;
}

/**
 * Repository interface for Micro-Tasks.
 */
export interface TaskRepository extends BaseRepository<FirestoreTask> {
  getActiveTasks(): Promise<FirestoreTask[]>;
  getTasksByCategory(categoryId: string): Promise<FirestoreTask[]>;
  incrementSubmissionCount(taskId: string): Promise<void>;
}

/**
 * Repository interface for Task Submissions.
 */
export interface TaskSubmissionRepository extends BaseRepository<FirestoreTaskSubmission> {
  getSubmissionsByUser(userId: string): Promise<FirestoreTaskSubmission[]>;
  getSubmissionsByTask(taskId: string): Promise<FirestoreTaskSubmission[]>;
  updateSubmissionStatus(id: string, status: 'approved' | 'rejected', reviewerId: string, feedback?: string): Promise<void>;
}

/**
 * Repository interface for Wallets.
 */
export interface WalletRepository extends BaseRepository<FirestoreWallet> {
  getWalletByOwner(ownerId: string): Promise<FirestoreWallet | null>;
  adjustBalance(walletId: string, deltaCoins: number, isPending?: boolean): Promise<void>;
}

/**
 * Repository interface for Transactions.
 */
export interface TransactionRepository extends BaseRepository<FirestoreTransaction> {
  getTransactionsByWallet(walletId: string): Promise<FirestoreTransaction[]>;
  getPendingTransactions(): Promise<FirestoreTransaction[]>;
}

/**
 * Repository interface for Campaigns.
 */
export interface CampaignRepository extends BaseRepository<FirestoreCampaign> {
  getCampaignsByBusiness(businessId: string): Promise<FirestoreCampaign[]>;
  getActiveCampaigns(): Promise<FirestoreCampaign[]>;
}

/**
 * Repository interface for Audit Logs.
 */
export interface AuditLogRepository {
  logAction(log: Omit<FirestoreAuditLog, 'id' | 'timestamp'>): Promise<void>;
  getLogsByResource(resourceType: string, resourceId: string): Promise<FirestoreAuditLog[]>;
  getLogsByActor(actorId: string): Promise<FirestoreAuditLog[]>;
}
