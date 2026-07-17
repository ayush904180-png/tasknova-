/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Enumeration of available visual views/routes within the TaskNova AI MVP context.
 */
export enum AppRoute {
  HOME = 'home',
  SANDBOX = 'sandbox',
  BLUEPRINT = 'blueprint',
  DESIGN_SYSTEM = 'design-system'
}

/**
 * Task Categories for micro tasks.
 */
export enum TaskCategory {
  RLHF = 'RLHF',
  PROMPT_EVAL = 'Prompt Evaluation',
  TRANSLATION = 'Translation Validation',
  CATEGORIZATION = 'Semantic Tagging'
}

/**
 * Difficulty levels for human intelligence tasks (HITs).
 */
export enum TaskDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

/**
 * Represents a Human Intelligence Micro-Task structure (SaaS model data layout).
 */
export interface MicroTask {
  id: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  title: string;
  description: string;
  rewardCoins: number;
  estimatedSeconds: number;
  instructions: string[];
  payload: Record<string, any>;
}

/**
 * Represents user interaction/completion payload of a micro-task.
 */
export interface TaskSubmission {
  taskId: string;
  completedAt: string;
  durationSeconds: number;
  userId: string;
  rewardEarned: number;
  responsePayload: Record<string, any>;
}

/**
 * Coin transaction log item for user wallets (placeholder state tracking).
 */
export interface CoinTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  timestamp: string;
}

/**
 * Core User profile placeholder configuration.
 */
export interface UserProfile {
  id: string;
  username: string;
  role: 'contributor' | 'creator' | 'admin';
  totalCoins: number;
  completedCount: number;
  joinedAt: string;
}
