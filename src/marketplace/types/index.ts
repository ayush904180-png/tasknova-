/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from '../../types/tasks';

/**
 * Contributor Profile capturing skills, trust scoring, accuracy, preferences, and performance telemetry.
 */
export interface ContributorProfile {
  id: string;
  username: string;
  skills: string[];
  trustScore: number;           // Trust Score metric (0-100)
  accuracy: number;             // Historic validation accuracy (%)
  languages: string[];          // ISO-639 codes (e.g., ['en-US', 'es-ES'])
  country: string;              // ISO country code (e.g., 'US', 'ES', 'IN')
  deviceCapabilities: string[]; // ['Desktop', 'Mobile', 'High-Mem', 'GPU', 'Camera', 'Microphone']
  taskHistory: {
    completedCount: number;
    approvedCount: number;
    rejectedCount: number;
    streakDays: number;
  };
  rewardPreference: 'Coins' | 'XP' | 'Mixed';
  difficultyPreference: 'Easy' | 'Medium' | 'Hard' | 'All';
  availabilityHoursPerWeek: number;
  xpProgress: number;           // Experience progress (e.g. 1540 for current level)
  xpRequiredForNextLevel: number; // XP requirement for next tier (e.g. 2000)
  level: number;                // Current level
  leaderboardRank: number;      // Current rank position
  completedTodayCount: number;  // Telemetry metric
  coinsEarnedToday: number;     // Coins logged today
  pendingValidationCount: number; // Tasks awaiting validator consensus
}

/**
 * Results from the Smart Matching Engine's calculations.
 */
export interface SmartMatchingResult {
  taskId: string;
  compatibilityScore: number;          // Compound matching score (0-100)
  expectedSuccessRate: number;         // Predictive accuracy (%)
  expectedCompletionTimeSeconds: number; // Custom completion projection
  estimatedEarningsCoins: number;      // Adjusts base rewards with multipliers
  skillMatchPercentage: number;        // Direct skills intersection %
  matchedSkills: string[];             // Subset of matching skills
  recommendationConfidence: 'Low' | 'Medium' | 'High';
  matchingReasons: string[];           // Human-readable justifications
}

/**
 * Live Task Reservation details.
 */
export interface TaskReservation {
  id: string;
  taskId: string;
  userId: string;
  reservedAt: string;                // ISO datetime string
  expiresAt: string;                 // ISO datetime string
  status: 'Active' | 'Released' | 'Expired' | 'Completed';
  timeRemainingSeconds: number;      // Countdown state
}

/**
 * Contributor specific UI settings and bookmark preferences.
 */
export interface UserPreferences {
  userId: string;
  bookmarkedTaskIds: string[];
  recentlyViewedTaskIds: string[];
  hiddenTaskIds: string[];
  ignoredCategories: string[];
  favoriteBusinesses: string[];
  savedFilters: Array<{
    id: string;
    name: string;
    filters: Record<string, any>;
  }>;
}

/**
 * Marketplace Health, Capacity, and Recommendation performance metrics.
 */
export interface MarketplaceAnalytics {
  marketplaceHealthScore: number;      // Compound index (0-100)
  totalAvailableTasks: number;         // Total active uncompleted tasks
  recommendationAccuracyRate: number;  // Alignment coefficient (%)
  acceptanceRate: number;              // Reservation-to-Start percentage
  reservationSuccessRate: number;      // Successful completes vs expired/released %
  completionRate: number;              // Submissions vs reservations %
  dropRate: number;                    // Released or expired reservations %
  averageEarningsCoins: number;        // Median earning per hour of work
  activeReservationsCount: number;     // Live locked tasks right now
  tasksByCategory: Record<string, number>; // Capacity allocations
  tasksByDifficulty: Record<string, number>; // Difficulty distribution
}

/**
 * Event taxonomy used in the decoupling event bus.
 */
export enum MarketplaceEventType {
  MarketplaceLoaded = 'MarketplaceLoaded',
  TaskRecommended = 'TaskRecommended',
  TaskReserved = 'TaskReserved',
  ReservationExpired = 'ReservationExpired',
  TaskStarted = 'TaskStarted',
  TaskCompleted = 'TaskCompleted',
  TaskReleased = 'TaskReleased',
  FavoriteAdded = 'FavoriteAdded',
  FavoriteRemoved = 'FavoriteRemoved',
  FilterSaved = 'FilterSaved'
}

/**
 * Generic Event structure emitted via the Event Bus.
 */
export interface MarketplaceEvent {
  type: MarketplaceEventType;
  userId: string;
  timestamp: string;
  payload: Record<string, any>;
}

/**
 * Offline sync item for reservation queuing when in offline mode.
 */
export interface QueuedReservationAction {
  id: string;
  taskId: string;
  action: 'reserve' | 'release';
  timestamp: string;
  ttl: number; // TTL in epoch time
}
