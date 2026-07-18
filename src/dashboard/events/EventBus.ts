/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Types of all dispatchable platform events in the TaskNova system.
 * Prevents tight-coupling of modules.
 */
export enum DashboardEventType {
  UserLoggedIn = 'UserLoggedIn',
  ProfileUpdated = 'ProfileUpdated',
  TaskCompleted = 'TaskCompleted',
  WalletUpdated = 'WalletUpdated',
  NotificationCreated = 'NotificationCreated',
  BadgeUnlocked = 'BadgeUnlocked',
  AchievementUnlocked = 'AchievementUnlocked',
  CampaignJoined = 'CampaignJoined',
  CampaignCompleted = 'CampaignCompleted',
  LeaderboardChanged = 'LeaderboardChanged',
  ThemeChanged = 'ThemeChanged',
  LanguageChanged = 'LanguageChanged',
  DeveloperModeChanged = 'DeveloperModeChanged',
}

export interface DashboardEventMap {
  [DashboardEventType.UserLoggedIn]: { userId: string; email: string; timestamp: string };
  [DashboardEventType.ProfileUpdated]: { userId: string; username: string; xp: number; level: number };
  [DashboardEventType.TaskCompleted]: { taskId: string; userId: string; rewardCoins: number; difficulty: string };
  [DashboardEventType.WalletUpdated]: { walletId: string; balanceCoins: number; pendingCoins: number };
  [DashboardEventType.NotificationCreated]: { id: string; userId: string; title: string; category: string };
  [DashboardEventType.BadgeUnlocked]: { badgeId: string; badgeName: string; userId: string };
  [DashboardEventType.AchievementUnlocked]: { achievementId: string; userId: string; title: string };
  [DashboardEventType.CampaignJoined]: { campaignId: string; userId: string };
  [DashboardEventType.CampaignCompleted]: { campaignId: string; businessId: string };
  [DashboardEventType.LeaderboardChanged]: { period: string; rankingsCount: number };
  [DashboardEventType.ThemeChanged]: { theme: 'light' | 'dark' | 'system' };
  [DashboardEventType.LanguageChanged]: { language: string };
  [DashboardEventType.DeveloperModeChanged]: { enabled: boolean };
}

type EventCallback<T extends DashboardEventType> = (payload: DashboardEventMap[T]) => void;

/**
 * Decentralized, high-performance Global Event Bus.
 * Standardizes communication between isolated dashboard modules and repositories.
 */
class GlobalEventBus {
  private listeners: { [K in DashboardEventType]?: Array<EventCallback<K>> } = {};

  /**
   * Registers a callback listener to a specific event type.
   */
  on<T extends DashboardEventType>(event: T, callback: EventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);

    // Return an unsubscribe/cleanup function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribes a callback listener.
   */
  off<T extends DashboardEventType>(event: T, callback: EventCallback<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback) as any;
  }

  /**
   * Synchronously dispatches an event across the event pipeline.
   */
  emit<T extends DashboardEventType>(event: T, payload: DashboardEventMap[T]): void {
    const eventListeners = this.listeners[event];
    if (!eventListeners) return;

    // Execute in isolation to prevent a single listener's error from breaking the chain
    eventListeners.forEach(listener => {
      try {
        listener(payload);
      } catch (err) {
        console.error(`[EventBus] Error executing listener for "${event}":`, err);
      }
    });
  }
}

export const EventBus = new GlobalEventBus();
