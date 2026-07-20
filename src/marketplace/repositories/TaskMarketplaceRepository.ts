/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskStatus } from '../../types/tasks';
import { GlobalTaskRepository } from '../../tasks/repositories/TaskRepository';
import { ContributorProfile, UserPreferences, TaskReservation } from '../types';
import { MarketplaceMapper } from '../mappers/MarketplaceMapper';
import { GlobalFirestoreAdapter } from '../adapters/FirestoreAdapter';

/**
 * Repository layer for the Marketplace module.
 * Coordinates profile preferences, bookmarks, and links cleanly with core Task data.
 */
export class TaskMarketplaceRepository {
  private static PREFS_KEY = 'tasknova_contributor_preferences';
  private static PROFILE_KEY = 'tasknova_contributor_profile';

  constructor() {
    this.initializeProfileIfNeeded();
    this.initializePrefsIfNeeded();
  }

  /**
   * Loads the contributor profile from LocalStorage or Firestore.
   */
  public async getProfile(userId: string): Promise<ContributorProfile> {
    try {
      const stored = localStorage.getItem(TaskMarketplaceRepository.PROFILE_KEY);
      if (stored) {
        return MarketplaceMapper.mapToContributorProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('[TaskMarketplaceRepository] Error loading profile from storage, generating default', e);
    }
    
    // Default contributor profile fallback
    const defaultProfile: ContributorProfile = {
      id: userId,
      username: 'ayush_contributor',
      skills: ['RLHF', 'Translation', 'Prompt Evaluation', 'Safety Evaluation', 'Semantic Tagging'],
      trustScore: 94,
      accuracy: 96.5,
      languages: ['en-US', 'es-ES', 'hi-IN'],
      country: 'US',
      deviceCapabilities: ['Desktop', 'Mobile', 'High-Mem'],
      taskHistory: {
        completedCount: 24,
        approvedCount: 23,
        rejectedCount: 1,
        streakDays: 4
      },
      rewardPreference: 'Mixed',
      difficultyPreference: 'All',
      availabilityHoursPerWeek: 15,
      xpProgress: 680,
      xpRequiredForNextLevel: 1000,
      level: 3,
      leaderboardRank: 12,
      completedTodayCount: 3,
      coinsEarnedToday: 45,
      pendingValidationCount: 4
    };

    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  /**
   * Persists contributor profile changes.
   */
  public async saveProfile(profile: ContributorProfile): Promise<void> {
    try {
      localStorage.setItem(TaskMarketplaceRepository.PROFILE_KEY, JSON.stringify(profile));
      await GlobalFirestoreAdapter.saveProfile(profile);
    } catch (e) {
      console.error('[TaskMarketplaceRepository] Error saving profile:', e);
    }
  }

  /**
   * Loads user-specific preferences (bookmarks, hidden, ignored, saved filters).
   */
  public getPreferences(userId: string): UserPreferences {
    try {
      const stored = localStorage.getItem(TaskMarketplaceRepository.PREFS_KEY);
      if (stored) {
        return MarketplaceMapper.mapToUserPreferences(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('[TaskMarketplaceRepository] Error loading preferences from storage', e);
    }

    const defaultPrefs: UserPreferences = {
      userId,
      bookmarkedTaskIds: [],
      recentlyViewedTaskIds: [],
      hiddenTaskIds: [],
      ignoredCategories: [],
      favoriteBusinesses: [],
      savedFilters: []
    };
    this.savePreferences(defaultPrefs);
    return defaultPrefs;
  }

  /**
   * Persists user preferences.
   */
  public savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(TaskMarketplaceRepository.PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error('[TaskMarketplaceRepository] Error saving preferences:', e);
    }
  }

  /**
   * Fetches all available micro tasks from the core TaskRepository.
   */
  public async getAllTasks(): Promise<Task[]> {
    // Coordinate with core TaskRepository to get real micro tasks
    return new Promise((resolve) => {
      const unsubscribe = GlobalTaskRepository.subscribeToTasks((tasks) => {
        unsubscribe();
        resolve(tasks);
      });
    });
  }

  /**
   * Subscribes to updates in core Task database.
   */
  public subscribeToCoreTasks(callback: (tasks: Task[]) => void): () => void {
    return GlobalTaskRepository.subscribeToTasks(callback);
  }

  /**
   * Initialize mock data if empty.
   */
  private initializeProfileIfNeeded(): void {
    const stored = localStorage.getItem(TaskMarketplaceRepository.PROFILE_KEY);
    if (!stored) {
      this.getProfile('ayush_contributor');
    }
  }

  private initializePrefsIfNeeded(): void {
    const stored = localStorage.getItem(TaskMarketplaceRepository.PREFS_KEY);
    if (!stored) {
      this.getPreferences('ayush_contributor');
    }
  }
}

export const GlobalTaskMarketplaceRepository = new TaskMarketplaceRepository();
