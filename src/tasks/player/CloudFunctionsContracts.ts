/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerSession } from '../../types/player';

/**
 * 1. ValidateSubmission Cloud Function Contract
 */
export interface ValidateSubmissionPayload {
  sessionId: string;
  userId: string;
  taskId: string;
  answers: Record<string, any>;
  durationSeconds: number;
  locale: string;
}

export interface ValidateSubmissionResponse {
  accepted: boolean;
  mismatchScore: number;         // Variance compared to consensus (%)
  trustScoreNew: number;
  unusualPatternFlagged: boolean;
  rejectionReason?: string;
}

/**
 * 2. CalculateReward Cloud Function Contract
 */
export interface CalculateRewardPayload {
  userId: string;
  taskId: string;
  sessionId: string;
  completionQualityScore: number; // Quality scale 0.0 - 1.0
  baseCoins: number;
  trustBonusMultiplier: number;  // Multiplier for top contributors
}

export interface CalculateRewardResponse {
  coinsAwarded: number;
  tokenEquivalentUsd: number;
  newBalanceCoins: number;
  transactionRef: string;
}

/**
 * 3. DetectSpam Cloud Function Contract
 */
export interface DetectSpamPayload {
  sessionId: string;
  userId: string;
  answers: Record<string, any>;
  durationSeconds: number;
  mouseMovementCount?: number;   // Human telemetry indicators
  keystrokeIntervalsMs?: number[];
}

export interface DetectSpamResponse {
  isSpam: boolean;
  spamConfidence: number;        // Confidence score 0.0 - 1.0
  botIndicatorMatched: string[];
  autoBlockUserTriggered: boolean;
}

/**
 * 4. GenerateAnalytics Cloud Function Contract
 */
export interface GenerateAnalyticsPayload {
  campaignId: string;
  taskType: string;
  startDateIso: string;
  endDateIso: string;
}

export interface GenerateAnalyticsResponse {
  conversionsCount: number;
  costIncurredCoins: number;
  averageAccuracy: number;       // (%)
  retentionRatio: number;
  throughputPerMinute: number;
}

/**
 * 5. UpdateLeaderboard Cloud Function Contract
 */
export interface UpdateLeaderboardPayload {
  userId: string;
  sessionId: string;
  coinsEarned: number;
  solvedCountIncrement: number;
}

export interface UpdateLeaderboardResponse {
  newGlobalRank: number;
  xpAwarded: number;
  weeklyStreakCount: number;
}

/**
 * 6. SendNotifications Cloud Function Contract
 */
export interface SendNotificationsPayload {
  userId: string;
  notificationType: 'reward_credited' | 'task_approved' | 'low_trust_warning' | 'campaign_funded';
  message: string;
  deliveryChannels: ('in_app' | 'email' | 'push')[];
}

export interface SendNotificationsResponse {
  delivered: boolean;
  messageId: string;
  channelsSuccess: string[];
}
