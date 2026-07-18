/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskDifficulty } from './index';

/**
 * Enumeration of transactional categories for reward ledger entries.
 */
export enum RewardTransactionType {
  CREDIT = 'Credit',
  DEBIT = 'Debit',
  ADJUSTMENT = 'Adjustment',
  BONUS = 'Bonus',
  PENALTY = 'Penalty',
  CAMPAIGN = 'Campaign',
  REFERRAL = 'Referral',
  MANUAL = 'Manual',
  CORRECTION = 'Correction',
  EXPIRED = 'Expired',
  REVERSED = 'Reversed'
}

/**
 * Immutable ledger entry structure for coin transactions.
 */
export interface CoinLedgerEntry {
  id: string;
  userId: string;
  timestamp: string;
  type: RewardTransactionType;
  amount: number; // positive or negative
  reason: string;
  referenceId: string; // e.g. Payment cycle or adjustment batch
  taskId?: string;
  submissionId?: string;
  validationId?: string;
  ruleVersion?: string;
  cryptographicSignature: string; // Anti-tamper simulation hash
  isTampered?: boolean;
}

/**
 * Base Reward evaluation components representation.
 */
export interface BaseRewardModel {
  baseRewardCoins: number;
  taskDifficulty: TaskDifficulty;
  difficultyMultiplier: number;
  taskPriority: 'Low' | 'Medium' | 'High' | 'Critical';
  priorityMultiplier: number;
  qualityScore: number; // 0 to 100
  qualityMultiplier: number;
  confidenceScore: number; // 0 to 100
  confidenceMultiplier: number;
  trustScore: number; // 0 to 100
  trustMultiplier: number;
  accuracyModifier: number; // e.g. 0.8 to 1.2
  businessCampaignMultiplier: number; // e.g. 1.0 or 1.5
  dailyBonusCoins: number;
  weeklyBonusCoins: number;
  seasonalEventBonusCoins: number;
  specialChallengeBonusCoins: number;
}

/**
 * Full calculated reward package output.
 */
export interface CalculatedRewardResult {
  isEligible: boolean;
  baseRewardDetails: BaseRewardModel;
  multipliersApplied: Record<string, number>;
  bonusesApplied: Record<string, number>;
  finalCoins: number;
  xpAwarded: number;
  ruleVersionMatched: string;
  antiFraudPassed: boolean;
  fraudAlerts: string[];
}

/**
 * Extensible rule node structure.
 */
export interface RewardRule {
  id: string;
  name: string;
  version: string;
  priority: number;
  status: 'Active' | 'Draft' | 'Inactive';
  effectiveDate: string;
  expiryDate?: string;
  conditionFormula: string; // Pseudocode representing IF condition
  actionFormula: string; // Pseudocode representing THEN action
  elseFormula?: string; // Pseudocode representing ELSE action
}

/**
 * Experience & Progression model state.
 */
export interface XpProfile {
  userId: string;
  currentXp: number;
  currentLevel: number;
  xpForNextLevel: number;
  contributorRank: string;
  milestonesReached: { milestoneId: string; dateReached: string }[];
}

/**
 * Extensible Achievement plugin structure.
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  badgeIcon: string; // Name of icon
  unlockedAt?: string;
  criteriaDescription: string;
  category: 'accuracy' | 'volume' | 'social' | 'special';
}

/**
 * Event payloads dispatched by the Reward Intelligence Engine.
 */
export interface RewardCalculatedEvent {
  submissionId: string;
  userId: string;
  calculatedCoins: number;
  xpAwarded: number;
  ruleVersionMatched: string;
  timestamp: string;
}

export interface RewardGrantedEvent {
  transactionId: string;
  userId: string;
  coinsGranted: number;
  timestamp: string;
}

export interface RewardRejectedEvent {
  submissionId: string;
  userId: string;
  reason: string;
  timestamp: string;
}

export interface RewardAdjustedEvent {
  transactionId: string;
  userId: string;
  previousAmount: number;
  newAmount: number;
  reason: string;
  timestamp: string;
}

export interface XPGrantedEvent {
  userId: string;
  xpAwarded: number;
  newTotalXp: number;
  levelUpTriggered: boolean;
  timestamp: string;
}

export interface AchievementUnlockedEvent {
  userId: string;
  achievementId: string;
  achievementName: string;
  timestamp: string;
}

/**
 * Workspace integrations exports metadata schemas.
 */
export interface WorkspaceExportSummary {
  spreadsheetId?: string;
  folderId?: string;
  exportTimestamp: string;
  recordCount: number;
  exportedByType: 'RewardLedger' | 'XPReport' | 'AchievementAsset' | 'AuditReport';
  checksum: string;
}

/**
 * Unified Reward Analytics and Telemetry KPIs.
 */
export interface RewardTelemetryKPIs {
  averageRewardCoins: number;
  highestRewardCoins: number;
  totalRewardsDistributed: number;
  bonusUsageCount: number;
  ruleMatchPercentages: Record<string, number>;
  xpDistributionAverage: number;
  achievementUnlockPercentage: number;
  rejectedRewardRate: number; // percent
}
