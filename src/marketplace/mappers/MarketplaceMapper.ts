/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from '../../types/tasks';
import { ContributorProfile, TaskReservation, UserPreferences } from '../types';

/**
 * Domain-to-Storage and Storage-to-Domain Mapper Layer for decoupling.
 */
export class MarketplaceMapper {
  /**
   * Maps raw database profiles into clean ContributorProfile domain structures.
   */
  public static mapToContributorProfile(raw: Record<string, any>): ContributorProfile {
    return {
      id: raw.id || raw.userId || 'contributor_unknown',
      username: raw.username || raw.displayName || 'Contributor Node',
      skills: Array.isArray(raw.skills) ? raw.skills : [],
      trustScore: typeof raw.trustScore === 'number' ? raw.trustScore : 80,
      accuracy: typeof raw.accuracy === 'number' ? raw.accuracy : 85,
      languages: Array.isArray(raw.languages) ? raw.languages : ['en-US'],
      country: raw.country || 'US',
      deviceCapabilities: Array.isArray(raw.deviceCapabilities) ? raw.deviceCapabilities : ['Desktop'],
      taskHistory: {
        completedCount: raw.taskHistory?.completedCount || 0,
        approvedCount: raw.taskHistory?.approvedCount || 0,
        rejectedCount: raw.taskHistory?.rejectedCount || 0,
        streakDays: raw.taskHistory?.streakDays || 0,
      },
      rewardPreference: raw.rewardPreference || 'Mixed',
      difficultyPreference: raw.difficultyPreference || 'All',
      availabilityHoursPerWeek: typeof raw.availabilityHoursPerWeek === 'number' ? raw.availabilityHoursPerWeek : 20,
      xpProgress: typeof raw.xpProgress === 'number' ? raw.xpProgress : 0,
      xpRequiredForNextLevel: typeof raw.xpRequiredForNextLevel === 'number' ? raw.xpRequiredForNextLevel : 1000,
      level: typeof raw.level === 'number' ? raw.level : 1,
      leaderboardRank: typeof raw.leaderboardRank === 'number' ? raw.leaderboardRank : 99,
      completedTodayCount: typeof raw.completedTodayCount === 'number' ? raw.completedTodayCount : 0,
      coinsEarnedToday: typeof raw.coinsEarnedToday === 'number' ? raw.coinsEarnedToday : 0,
      pendingValidationCount: typeof raw.pendingValidationCount === 'number' ? raw.pendingValidationCount : 0,
    };
  }

  /**
   * Maps raw reservation items to domain models.
   */
  public static mapToTaskReservation(raw: Record<string, any>): TaskReservation {
    return {
      id: raw.id || `res_${Math.random().toString(36).substr(2, 9)}`,
      taskId: raw.taskId || '',
      userId: raw.userId || '',
      reservedAt: raw.reservedAt || new Date().toISOString(),
      expiresAt: raw.expiresAt || new Date(Date.now() + 1800 * 1000).toISOString(),
      status: raw.status || 'Active',
      timeRemainingSeconds: typeof raw.timeRemainingSeconds === 'number' ? raw.timeRemainingSeconds : 1800,
    };
  }

  /**
   * Maps user preference data from local/remote sources.
   */
  public static mapToUserPreferences(raw: Record<string, any>): UserPreferences {
    return {
      userId: raw.userId || 'contributor_unknown',
      bookmarkedTaskIds: Array.isArray(raw.bookmarkedTaskIds) ? raw.bookmarkedTaskIds : [],
      recentlyViewedTaskIds: Array.isArray(raw.recentlyViewedTaskIds) ? raw.recentlyViewedTaskIds : [],
      hiddenTaskIds: Array.isArray(raw.hiddenTaskIds) ? raw.hiddenTaskIds : [],
      ignoredCategories: Array.isArray(raw.ignoredCategories) ? raw.ignoredCategories : [],
      favoriteBusinesses: Array.isArray(raw.favoriteBusinesses) ? raw.favoriteBusinesses : [],
      savedFilters: Array.isArray(raw.savedFilters) ? raw.savedFilters : [],
    };
  }
}
