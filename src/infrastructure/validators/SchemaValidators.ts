/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FirestoreUser,
  FirestoreProfile,
  FirestoreTask,
  FirestoreTransaction,
  FirestoreWallet,
  FirestoreCampaign,
  FirestoreFeedback,
  FirestoreAuditLog,
} from '../firebase/types';

/**
 * Validates document ID formatting and length to prevent ID poisoning and Denial of Wallet attacks.
 * Standardizes security rules ID constraints: alphanumeric, underscore, hyphen.
 */
export function isValidId(id: string): boolean {
  if (typeof id !== 'string') return false;
  if (id.length < 1 || id.length > 128) return false;
  const regex = /^[a-zA-Z0-9_\-]+$/;
  return regex.test(id);
}

/**
 * Validation schema errors.
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Result of a structural validation.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a Profile payload before committing to DB.
 */
export function validateProfile(data: Partial<FirestoreProfile>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.id || !isValidId(data.id)) {
    errors.push({ field: 'id', message: 'Invalid or missing unique profile/user ID.' });
  }

  if (!data.username || data.username.length < 3 || data.username.length > 25) {
    errors.push({ field: 'username', message: 'Username must be between 3 and 25 characters.' });
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.push({ field: 'username', message: 'Username can only contain alphanumeric characters and underscores.' });
  }

  if (!data.role || !['contributor', 'creator', 'business', 'admin'].includes(data.role)) {
    errors.push({ field: 'role', message: 'Invalid role assignment.' });
  }

  if (!data.displayName || data.displayName.length < 1 || data.displayName.length > 50) {
    errors.push({ field: 'displayName', message: 'Display Name must be between 1 and 50 characters.' });
  }

  if (data.bio && data.bio.length > 300) {
    errors.push({ field: 'bio', message: 'Bio cannot exceed 300 characters.' });
  }

  if (typeof data.level !== 'number' || data.level < 1) {
    errors.push({ field: 'level', message: 'Level must be a positive integer.' });
  }

  if (typeof data.xp !== 'number' || data.xp < 0) {
    errors.push({ field: 'xp', message: 'XP cannot be negative.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a Micro Task payload prior to publication.
 */
export function validateTask(data: Partial<FirestoreTask>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.id || !isValidId(data.id)) {
    errors.push({ field: 'id', message: 'Invalid or missing unique task ID.' });
  }

  if (!data.title || data.title.length < 5 || data.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must be between 5 and 100 characters.' });
  }

  if (!data.description || data.description.length < 10 || data.description.length > 1000) {
    errors.push({ field: 'description', message: 'Description must be between 10 and 1000 characters.' });
  }

  if (!data.categoryId || !isValidId(data.categoryId)) {
    errors.push({ field: 'categoryId', message: 'Invalid category association.' });
  }

  if (!data.creatorId || !isValidId(data.creatorId)) {
    errors.push({ field: 'creatorId', message: 'Invalid creator association.' });
  }

  if (typeof data.rewardCoins !== 'number' || data.rewardCoins <= 0 || data.rewardCoins > 10000) {
    errors.push({ field: 'rewardCoins', message: 'Reward must be between 1 and 10,000 Coins.' });
  }

  if (typeof data.estimatedSeconds !== 'number' || data.estimatedSeconds < 5) {
    errors.push({ field: 'estimatedSeconds', message: 'Estimated duration must be at least 5 seconds.' });
  }

  if (!data.instructions || !Array.isArray(data.instructions) || data.instructions.length === 0) {
    errors.push({ field: 'instructions', message: 'At least one validation instruction is required.' });
  } else if (data.instructions.length > 20) {
    errors.push({ field: 'instructions', message: 'Instructions cannot exceed 20 points.' });
  }

  if (!data.status || !['draft', 'active', 'paused', 'completed', 'cancelled'].includes(data.status)) {
    errors.push({ field: 'status', message: 'Invalid task lifecycle state.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a Transaction payload to block race conditions.
 */
export function validateTransaction(data: Partial<FirestoreTransaction>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.id || !isValidId(data.id)) {
    errors.push({ field: 'id', message: 'Invalid transaction tracking ID.' });
  }

  if (!data.walletId || !isValidId(data.walletId)) {
    errors.push({ field: 'walletId', message: 'Wallet registration association missing.' });
  }

  if (typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push({ field: 'amount', message: 'Transaction amount must be strictly positive.' });
  }

  if (!data.type || !['credit', 'debit'].includes(data.type)) {
    errors.push({ field: 'type', message: 'Transaction operation must be credit or debit.' });
  }

  if (!data.purpose || !['reward', 'payout', 'deposit', 'purchase', 'refund'].includes(data.purpose)) {
    errors.push({ field: 'purpose', message: 'Invalid transaction business purpose.' });
  }

  if (!data.status || !['pending', 'completed', 'failed'].includes(data.status)) {
    errors.push({ field: 'status', message: 'Invalid transaction flow status.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
