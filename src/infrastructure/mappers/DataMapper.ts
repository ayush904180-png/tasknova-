/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FirestoreProfile,
  FirestoreTask,
  FirestoreTransaction,
} from '../firebase/types';
import {
  UserProfile,
  MicroTask,
  CoinTransaction,
  TaskCategory,
  TaskDifficulty,
} from '../../types';

/**
 * Generic Mapper interface.
 */
export interface Mapper<Domain, FirestoreType> {
  toDomain(raw: FirestoreType): Domain;
  toFirestore(domain: Domain): FirestoreType;
}

/**
 * Profile Mapper: Translates between domain UserProfile and firestore FirestoreProfile.
 */
export class ProfileMapper implements Mapper<UserProfile, FirestoreProfile> {
  toDomain(raw: FirestoreProfile): UserProfile {
    return {
      id: raw.id,
      username: raw.username,
      role: raw.role === 'admin' ? 'admin' : raw.role === 'creator' ? 'creator' : 'contributor',
      totalCoins: raw.totalCoinsEarned,
      completedCount: Math.floor(raw.xp / 10), // Example calculated count based on XP
      joinedAt: raw.createdAt,
    };
  }

  toFirestore(domain: UserProfile): FirestoreProfile {
    return {
      id: domain.id,
      username: domain.username,
      role: domain.role === 'admin' ? 'admin' : domain.role === 'creator' ? 'creator' : 'contributor',
      displayName: domain.username,
      country: 'US', // Default metadata
      skills: [],
      level: Math.floor(domain.completedCount / 10) + 1,
      xp: domain.completedCount * 10,
      totalCoinsEarned: domain.totalCoins,
      createdAt: domain.joinedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Task Mapper: Translates between domain MicroTask and firestore FirestoreTask.
 */
export class TaskMapper implements Mapper<MicroTask, FirestoreTask> {
  toDomain(raw: FirestoreTask): MicroTask {
    // Map Firestore Category to UI TaskCategory
    let category: TaskCategory = TaskCategory.RLHF;
    if (raw.categoryId === 'prompt_evaluation') category = TaskCategory.PROMPT_EVAL;
    else if (raw.categoryId === 'translation_validation') category = TaskCategory.TRANSLATION;
    else if (raw.categoryId === 'semantic_tagging') category = TaskCategory.CATEGORIZATION;

    // Map difficulty
    let difficulty: TaskDifficulty = TaskDifficulty.MEDIUM;
    if (raw.difficulty === 'easy') difficulty = TaskDifficulty.EASY;
    else if (raw.difficulty === 'hard') difficulty = TaskDifficulty.HARD;

    return {
      id: raw.id,
      category,
      difficulty,
      title: raw.title,
      description: raw.description,
      rewardCoins: raw.rewardCoins,
      estimatedSeconds: raw.estimatedSeconds,
      instructions: raw.instructions,
      payload: raw.payloadTemplate,
    };
  }

  toFirestore(domain: MicroTask): FirestoreTask {
    // Inverse category mapping
    let categoryId = 'rlhf';
    if (domain.category === TaskCategory.PROMPT_EVAL) categoryId = 'prompt_evaluation';
    else if (domain.category === TaskCategory.TRANSLATION) categoryId = 'translation_validation';
    else if (domain.category === TaskCategory.CATEGORIZATION) categoryId = 'semantic_tagging';

    return {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      categoryId,
      creatorId: 'system_admin',
      difficulty: domain.difficulty === TaskDifficulty.EASY ? 'easy' : domain.difficulty === TaskDifficulty.HARD ? 'hard' : 'medium',
      rewardCoins: domain.rewardCoins,
      estimatedSeconds: domain.estimatedSeconds,
      instructions: domain.instructions,
      payloadTemplate: domain.payload,
      maxSubmissionsAllowed: 1000,
      submissionCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Transaction Mapper: Translates between domain CoinTransaction and firestore FirestoreTransaction.
 */
export class TransactionMapper implements Mapper<CoinTransaction, FirestoreTransaction> {
  toDomain(raw: FirestoreTransaction): CoinTransaction {
    return {
      id: raw.id,
      amount: raw.amount,
      type: raw.type,
      reason: raw.purpose.toUpperCase() + (raw.referenceId ? ` (${raw.referenceId})` : ''),
      timestamp: raw.createdAt,
    };
  }

  toFirestore(domain: CoinTransaction): FirestoreTransaction {
    return {
      id: domain.id,
      walletId: 'default_wallet',
      amount: domain.amount,
      type: domain.type,
      purpose: domain.reason.toLowerCase().includes('reward') ? 'reward' : 'payout',
      status: 'completed',
      createdAt: domain.timestamp,
    };
  }
}
