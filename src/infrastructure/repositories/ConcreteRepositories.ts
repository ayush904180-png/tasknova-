/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FirestoreRepository, MemoryDatabase } from './FirestoreRepository';
import {
  UserRepository,
  ProfileRepository,
  TaskRepository,
  TaskSubmissionRepository,
  WalletRepository,
  TransactionRepository,
  CampaignRepository,
  AuditLogRepository,
} from './RepositoryInterfaces';
import {
  FirestoreUser,
  FirestoreProfile,
  FirestoreTask,
  FirestoreTaskSubmission,
  FirestoreWallet,
  FirestoreTransaction,
  FirestoreCampaign,
  FirestoreAuditLog,
  FirestoreCollection,
} from '../firebase/types';

/**
 * Concrete implementation of the UserRepository.
 */
export class ConcreteUserRepository extends FirestoreRepository<FirestoreUser> implements UserRepository {
  constructor() {
    super(FirestoreCollection.USERS);
  }

  async getByEmail(email: string): Promise<FirestoreUser | null> {
    const list = await this.list({ email });
    return list.length > 0 ? list[0] : null;
  }

  async updateSessionActivity(userId: string): Promise<void> {
    await this.update(userId, { lastActiveAt: new Date().toISOString() });
  }
}

/**
 * Concrete implementation of the ProfileRepository.
 */
export class ConcreteProfileRepository extends FirestoreRepository<FirestoreProfile> implements ProfileRepository {
  constructor() {
    super(FirestoreCollection.PROFILES);
  }

  async getByUsername(username: string): Promise<FirestoreProfile | null> {
    const list = await this.list({ username });
    return list.length > 0 ? list[0] : null;
  }

  async incrementXP(userId: string, xpAmount: number): Promise<void> {
    const profile = await this.getById(userId);
    if (profile) {
      const newXp = profile.xp + xpAmount;
      const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level
      await this.update(userId, { xp: newXp, level: newLevel });
    }
  }

  async incrementCoins(userId: string, coinAmount: number): Promise<void> {
    const profile = await this.getById(userId);
    if (profile) {
      await this.update(userId, {
        totalCoinsEarned: profile.totalCoinsEarned + coinAmount,
      });
    }
  }
}

/**
 * Concrete implementation of the TaskRepository.
 */
export class ConcreteTaskRepository extends FirestoreRepository<FirestoreTask> implements TaskRepository {
  constructor() {
    super(FirestoreCollection.TASKS);
  }

  async getActiveTasks(): Promise<FirestoreTask[]> {
    return this.list({ status: 'active' });
  }

  async getTasksByCategory(categoryId: string): Promise<FirestoreTask[]> {
    return this.list({ categoryId });
  }

  async incrementSubmissionCount(taskId: string): Promise<void> {
    const task = await this.getById(taskId);
    if (task) {
      await this.update(taskId, { submissionCount: task.submissionCount + 1 });
    }
  }
}

/**
 * Concrete implementation of the TaskSubmissionRepository.
 */
export class ConcreteTaskSubmissionRepository extends FirestoreRepository<FirestoreTaskSubmission> implements TaskSubmissionRepository {
  constructor() {
    super(FirestoreCollection.TASK_SUBMISSIONS);
  }

  async getSubmissionsByUser(userId: string): Promise<FirestoreTaskSubmission[]> {
    return this.list({ userId });
  }

  async getSubmissionsByTask(taskId: string): Promise<FirestoreTaskSubmission[]> {
    return this.list({ taskId });
  }

  async updateSubmissionStatus(id: string, status: 'approved' | 'rejected', reviewerId: string, feedback?: string): Promise<void> {
    await this.update(id, {
      status,
      reviewerFeedback: feedback,
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
    });
  }
}

/**
 * Concrete implementation of the WalletRepository.
 */
export class ConcreteWalletRepository extends FirestoreRepository<FirestoreWallet> implements WalletRepository {
  constructor() {
    super(FirestoreCollection.WALLETS);
  }

  async getWalletByOwner(ownerId: string): Promise<FirestoreWallet | null> {
    const list = await this.list({ ownerId });
    return list.length > 0 ? list[0] : null;
  }

  async adjustBalance(walletId: string, deltaCoins: number, isPending: boolean = false): Promise<void> {
    const wallet = await this.getById(walletId);
    if (wallet) {
      if (isPending) {
        await this.update(walletId, { pendingCoins: wallet.pendingCoins + deltaCoins });
      } else {
        await this.update(walletId, { balanceCoins: wallet.balanceCoins + deltaCoins });
      }
    }
  }
}

/**
 * Concrete implementation of the TransactionRepository.
 */
export class ConcreteTransactionRepository extends FirestoreRepository<FirestoreTransaction> implements TransactionRepository {
  constructor() {
    super(FirestoreCollection.TRANSACTIONS);
  }

  async getTransactionsByWallet(walletId: string): Promise<FirestoreTransaction[]> {
    return this.list({ walletId });
  }

  async getPendingTransactions(): Promise<FirestoreTransaction[]> {
    return this.list({ status: 'pending' });
  }
}

/**
 * Concrete implementation of the CampaignRepository.
 */
export class ConcreteCampaignRepository extends FirestoreRepository<FirestoreCampaign> implements CampaignRepository {
  constructor() {
    super(FirestoreCollection.CAMPAIGNS);
  }

  async getCampaignsByBusiness(businessId: string): Promise<FirestoreCampaign[]> {
    return this.list({ businessId });
  }

  async getActiveCampaigns(): Promise<FirestoreCampaign[]> {
    return this.list({ status: 'active' });
  }
}

/**
 * Concrete implementation of the AuditLogRepository.
 */
export class ConcreteAuditLogRepository implements AuditLogRepository {
  private collectionName = FirestoreCollection.AUDIT_LOGS;

  async logAction(log: Omit<FirestoreAuditLog, 'id' | 'timestamp'>): Promise<void> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullLog: FirestoreAuditLog = {
      ...log,
      id,
      timestamp: new Date().toISOString(),
    };
    MemoryDatabase.set(this.collectionName, id, fullLog);
  }

  async getLogsByResource(resourceType: string, resourceId: string): Promise<FirestoreAuditLog[]> {
    const all = MemoryDatabase.list(this.collectionName);
    return all.filter(item => item.resourceType === resourceType && item.resourceId === resourceId) as FirestoreAuditLog[];
  }

  async getLogsByActor(actorId: string): Promise<FirestoreAuditLog[]> {
    const all = MemoryDatabase.list(this.collectionName);
    return all.filter(item => item.actorId === actorId) as FirestoreAuditLog[];
  }
}
