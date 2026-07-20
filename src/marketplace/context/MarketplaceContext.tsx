/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Task, TaskStatus } from '../../types/tasks';
import { ContributorProfile, UserPreferences, TaskReservation, MarketplaceAnalytics, MarketplaceEventType, MarketplaceEvent } from '../types';
import { GlobalTaskMarketplaceRepository } from '../repositories/TaskMarketplaceRepository';
import { GlobalReservationService } from '../services/ReservationService';
import { GlobalMatchingEngineService } from '../services/MatchingEngineService';
import { MarketplaceAnalyticsEngine } from '../analytics/MarketplaceAnalyticsEngine';
import { MarketplaceEventBus } from '../events/MarketplaceEventBus';
import { MarketplaceValidator } from '../validators/MarketplaceValidator';

interface MarketplaceContextType {
  tasks: Task[];
  allTasks: Task[];
  profile: ContributorProfile | null;
  preferences: UserPreferences | null;
  reservations: TaskReservation[];
  analytics: MarketplaceAnalytics | null;
  filters: {
    searchQuery: string;
    category: string;
    difficulty: string;
    minReward: number;
    maxReward: number;
    country: string;
    language: string;
    business: string;
    campaign: string;
    taskType: string;
    maxEstimatedTime: number;
    minTrustRequirement: number;
    status: string;
    sortBy: string;
  };
  setFilters: (update: any) => void;
  isLoading: boolean;
  isOnline: boolean;
  activityFeed: string[];
  
  // Core operational routines
  reserveTask: (taskId: string) => Promise<{ success: boolean; error?: string }>;
  releaseReservation: (reservationId: string) => Promise<boolean>;
  completeReservedTask: (reservationId: string, rewardCoinsEarned: number) => Promise<void>;
  toggleBookmark: (taskId: string) => void;
  hideTask: (taskId: string) => void;
  trackRecentlyViewed: (taskId: string) => void;
  toggleFavoriteBusiness: (business: string) => void;
  toggleIgnoreCategory: (category: string) => void;
  saveCurrentFilter: (name: string) => { success: boolean; error?: string };
  loadSavedFilter: (filterId: string) => void;
  deleteSavedFilter: (filterId: string) => void;
  syncOfflineQueue: () => Promise<void>;
  resetProfile: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<ContributorProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [reservations, setReservations] = useState<TaskReservation[]>([]);
  const [analytics, setAnalytics] = useState<MarketplaceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [activityFeed, setActivityFeed] = useState<string[]>([]);

  // Filtering configuration
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'All',
    difficulty: 'All',
    minReward: 0,
    maxReward: 100,
    country: 'All',
    language: 'All',
    business: 'All',
    campaign: 'All',
    taskType: 'All',
    maxEstimatedTime: 300,
    minTrustRequirement: 0,
    status: 'All',
    sortBy: 'Highest Match'
  });

  const userId = 'ayush_contributor';
  const hasLoadedRef = useRef(false);

  // Monitor network status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => {
        setIsOnline(true);
        addActivity('Network connection restored. Syncing offline changes...');
        syncOfflineQueue();
      };
      const handleOffline = () => {
        setIsOnline(false);
        addActivity('Network connection lost. Running in Offline Caching mode.');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const addActivity = (msg: string) => {
    setActivityFeed(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 19) // Keep last 20 events
    ]);
  };

  // Register Event Bus triggers
  useEffect(() => {
    const unsubAll = MarketplaceEventBus.subscribeAll((event: MarketplaceEvent) => {
      let logMsg = '';
      switch (event.type) {
        case MarketplaceEventType.TaskReserved:
          logMsg = `Reserved task ID ${event.payload.taskId} ${event.payload.offline ? '(queued offline)' : ''}`;
          break;
        case MarketplaceEventType.TaskReleased:
          logMsg = `Released reservation for task ${event.payload.taskId}`;
          break;
        case MarketplaceEventType.ReservationExpired:
          logMsg = `🔴 Reservation expired for task ${event.payload.taskId}`;
          break;
        case MarketplaceEventType.TaskCompleted:
          logMsg = `🎉 Completed task ${event.payload.taskId} earning +${event.payload.earnings} Coins`;
          break;
        case MarketplaceEventType.FavoriteAdded:
          logMsg = `Bookmarked task ${event.payload.taskId}`;
          break;
        case MarketplaceEventType.FavoriteRemoved:
          logMsg = `Removed bookmark for task ${event.payload.taskId}`;
          break;
        case MarketplaceEventType.FilterSaved:
          logMsg = `Saved search filter "${event.payload.name}"`;
          break;
        default:
          return;
      }
      addActivity(logMsg);
    });

    return () => {
      unsubAll();
    };
  }, []);

  // Initialize data subscription
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const loadedProfile = await GlobalTaskMarketplaceRepository.getProfile(userId);
      const loadedPrefs = GlobalTaskMarketplaceRepository.getPreferences(userId);
      const loadedReservations = GlobalReservationService.getReservations();

      setProfile(loadedProfile);
      setPreferences(loadedPrefs);
      setReservations(loadedReservations);

      if (!hasLoadedRef.current) {
        MarketplaceEventBus.emit(MarketplaceEventType.MarketplaceLoaded, userId, { activeCount: loadedReservations.length });
        addActivity('Marketplace session calibrated and loaded successfully.');
        hasLoadedRef.current = true;
      }

      setIsLoading(false);
    };

    loadData();

    // Subscribe to tasks changes
    const unsubscribeCore = GlobalTaskMarketplaceRepository.subscribeToCoreTasks((tasksData) => {
      setAllTasks(tasksData);
    });

    return () => {
      unsubscribeCore();
    };
  }, []);

  // Poller to update reservations remaining times
  useEffect(() => {
    const timer = setInterval(() => {
      const activeReservations = GlobalReservationService.getReservations();
      setReservations(activeReservations);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Compute analytics and filter task selections
  useEffect(() => {
    if (allTasks.length === 0) return;

    // Compile analytics
    const newMetrics = MarketplaceAnalyticsEngine.generateMetrics(allTasks, reservations);
    setAnalytics(newMetrics);

    // Apply filtering
    let processed = allTasks.filter(task => {
      // 1. Skip if hidden
      if (preferences?.hiddenTaskIds.includes(task.id)) return false;

      // 2. Skip if category ignored
      if (preferences?.ignoredCategories.some(cat => cat.toLowerCase() === task.category.toLowerCase())) return false;

      // 3. Search query keyword
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesText = 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.id.toLowerCase().includes(query) ||
          (task.tags || []).some(t => t.toLowerCase().includes(query));
        if (!matchesText) return false;
      }

      // 4. Category
      if (filters.category !== 'All' && task.category !== filters.category) return false;

      // 5. Difficulty
      if (filters.difficulty !== 'All' && task.difficulty !== filters.difficulty) return false;

      // 6. Reward range
      if (task.rewardCoins < filters.minReward || task.rewardCoins > filters.maxReward) return false;

      // 7. Country constraint
      if (filters.country !== 'All' && task.country !== 'ALL' && task.country !== filters.country) return false;

      // 8. Language constraint
      if (filters.language !== 'All' && task.language !== 'ALL' && task.language !== filters.language) return false;

      // 9. Business & Campaign
      if (filters.business !== 'All' && task.business !== filters.business) return false;
      if (filters.campaign !== 'All' && task.metadata?.campaignId !== filters.campaign && task.business !== filters.campaign) return false;

      // 10. Task Type
      if (filters.taskType !== 'All' && task.taskType !== filters.taskType) return false;

      // 11. Estimated completion time
      if (task.estimatedCompletionTime > filters.maxEstimatedTime) return false;

      // 12. Trust Score requirements
      if (task.requiredTrustScore < filters.minTrustRequirement) return false;

      // 13. Status filter
      if (filters.status !== 'All' && task.currentStatus !== filters.status) return false;

      return true;
    });

    // Handle Sorting
    if (profile) {
      processed = processed.sort((a, b) => {
        if (filters.sortBy === 'Highest Match') {
          const matchA = GlobalMatchingEngineService.calculateMatch(a, profile).compatibilityScore;
          const matchB = GlobalMatchingEngineService.calculateMatch(b, profile).compatibilityScore;
          return matchB - matchA;
        }
        if (filters.sortBy === 'Reward (High to Low)') {
          return b.rewardCoins - a.rewardCoins;
        }
        if (filters.sortBy === 'Reward (Low to High)') {
          return a.rewardCoins - b.rewardCoins;
        }
        if (filters.sortBy === 'Estimated Time (Fastest)') {
          return a.estimatedCompletionTime - b.estimatedCompletionTime;
        }
        if (filters.sortBy === 'Required Trust (Lowest)') {
          return a.requiredTrustScore - b.requiredTrustScore;
        }
        if (filters.sortBy === 'Recently Published') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
    }

    setTasks(processed);
  }, [allTasks, reservations, preferences, filters, profile]);

  // Operational routine: Reserve Task
  const reserveTask = async (taskId: string): Promise<{ success: boolean; error?: string }> => {
    if (!profile) return { success: false, error: 'Contributor profile offline' };

    const task = allTasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Task entity not located' };

    // Run structural validators
    const eligibility = MarketplaceValidator.validateContributorEligibility(profile, task);
    if (!eligibility.eligible) {
      return { success: false, error: eligibility.error };
    }

    const resResult = await GlobalReservationService.reserveTask(taskId, profile.id, isOnline);
    if (resResult.success) {
      setReservations(GlobalReservationService.getReservations());
    }
    return resResult;
  };

  // Operational routine: Release Reservation
  const releaseReservation = async (reservationId: string): Promise<boolean> => {
    if (!profile) return false;
    const released = await GlobalReservationService.releaseReservation(reservationId, profile.id, isOnline);
    if (released) {
      setReservations(GlobalReservationService.getReservations());
    }
    return released;
  };

  // Operational routine: Complete Task
  const completeReservedTask = async (reservationId: string, rewardCoinsEarned: number): Promise<void> => {
    if (!profile || !preferences) return;

    const resList = GlobalReservationService.getReservations();
    const idx = resList.findIndex(r => r.id === reservationId);
    if (idx === -1) return;

    const reservation = resList[idx];
    reservation.status = 'Completed';
    reservation.timeRemainingSeconds = 0;
    resList[idx] = reservation;

    localStorage.setItem('tasknova_reservations_db', JSON.stringify(resList));
    setReservations(resList);

    // Update profile stats (XP, level, Streak, Coin balances)
    const updatedProfile = { ...profile };
    updatedProfile.taskHistory.completedCount += 1;
    updatedProfile.taskHistory.approvedCount += 1;
    updatedProfile.completedTodayCount += 1;
    updatedProfile.coinsEarnedToday += rewardCoinsEarned;
    updatedProfile.totalCoins = (updatedProfile.totalCoins || 0) + rewardCoinsEarned;

    // Process XP and Tier leveling
    const xpGained = rewardCoinsEarned * 10;
    let currentXP = updatedProfile.xpProgress + xpGained;
    let currentLevel = updatedProfile.level;
    const xpNeeded = updatedProfile.xpRequiredForNextLevel;

    if (currentXP >= xpNeeded) {
      currentXP -= xpNeeded;
      currentLevel += 1;
      addActivity(`🎉 LEVEL UP! You have reached level ${currentLevel}!`);
    }
    updatedProfile.xpProgress = currentXP;
    updatedProfile.level = currentLevel;

    setProfile(updatedProfile);
    GlobalTaskMarketplaceRepository.saveProfile(updatedProfile);

    // Emit event
    MarketplaceEventBus.emit(MarketplaceEventType.TaskCompleted, profile.id, {
      taskId: reservation.taskId,
      reservationId,
      earnings: rewardCoinsEarned,
      xpGained
    });
  };

  // Bookmark management
  const toggleBookmark = (taskId: string) => {
    if (!preferences || !profile) return;
    const updated = { ...preferences };
    const idx = updated.bookmarkedTaskIds.indexOf(taskId);
    if (idx !== -1) {
      updated.bookmarkedTaskIds.splice(idx, 1);
      setPreferences(updated);
      GlobalTaskMarketplaceRepository.savePreferences(updated);
      MarketplaceEventBus.emit(MarketplaceEventType.FavoriteRemoved, profile.id, { taskId });
    } else {
      updated.bookmarkedTaskIds.push(taskId);
      setPreferences(updated);
      GlobalTaskMarketplaceRepository.savePreferences(updated);
      MarketplaceEventBus.emit(MarketplaceEventType.FavoriteAdded, profile.id, { taskId });
    }
  };

  // Ignored / Hidden Tasks
  const hideTask = (taskId: string) => {
    if (!preferences) return;
    const updated = { ...preferences };
    if (!updated.hiddenTaskIds.includes(taskId)) {
      updated.hiddenTaskIds.push(taskId);
      setPreferences(updated);
      GlobalTaskMarketplaceRepository.savePreferences(updated);
      addActivity(`Hid task ${taskId} from feed.`);
    }
  };

  const trackRecentlyViewed = (taskId: string) => {
    if (!preferences) return;
    const updated = { ...preferences };
    const filtered = updated.recentlyViewedTaskIds.filter(id => id !== taskId);
    filtered.unshift(taskId);
    updated.recentlyViewedTaskIds = filtered.slice(0, 10); // Keep last 10
    setPreferences(updated);
    GlobalTaskMarketplaceRepository.savePreferences(updated);
  };

  const toggleFavoriteBusiness = (business: string) => {
    if (!preferences) return;
    const updated = { ...preferences };
    const idx = updated.favoriteBusinesses.indexOf(business);
    if (idx !== -1) {
      updated.favoriteBusinesses.splice(idx, 1);
      addActivity(`Removed ${business} from favorite businesses.`);
    } else {
      updated.favoriteBusinesses.push(business);
      addActivity(`Added ${business} to favorite businesses!`);
    }
    setPreferences(updated);
    GlobalTaskMarketplaceRepository.savePreferences(updated);
  };

  const toggleIgnoreCategory = (category: string) => {
    if (!preferences) return;
    const updated = { ...preferences };
    const idx = updated.ignoredCategories.indexOf(category);
    if (idx !== -1) {
      updated.ignoredCategories.splice(idx, 1);
      addActivity(`Restored filter visibility for ${category}.`);
    } else {
      updated.ignoredCategories.push(category);
      addActivity(`Hiding all tasks under category: ${category}.`);
    }
    setPreferences(updated);
    GlobalTaskMarketplaceRepository.savePreferences(updated);
  };

  // Saved query utilities
  const saveCurrentFilter = (name: string): { success: boolean; error?: string } => {
    if (!preferences || !profile) return { success: false, error: 'Session preferences unavailable' };

    const validation = MarketplaceValidator.validateSavedFilter(name, filters);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const updated = { ...preferences };
    const filterId = `filter_${Date.now()}`;
    updated.savedFilters.push({
      id: filterId,
      name,
      filters: { ...filters }
    });

    setPreferences(updated);
    GlobalTaskMarketplaceRepository.savePreferences(updated);
    MarketplaceEventBus.emit(MarketplaceEventType.FilterSaved, profile.id, { name, filterId });
    return { success: true };
  };

  const loadSavedFilter = (filterId: string) => {
    if (!preferences) return;
    const match = preferences.savedFilters.find(f => f.id === filterId);
    if (match) {
      setFilters(match.filters as any);
      addActivity(`Loaded saved search filter "${match.name}".`);
    }
  };

  const deleteSavedFilter = (filterId: string) => {
    if (!preferences) return;
    const updated = { ...preferences };
    updated.savedFilters = updated.savedFilters.filter(f => f.id !== filterId);
    setPreferences(updated);
    GlobalTaskMarketplaceRepository.savePreferences(updated);
    addActivity('Removed saved filter configuration.');
  };

  // Sync offline queued actions
  const syncOfflineQueue = async (): Promise<void> => {
    if (!profile) return;
    addActivity('Beginning background sync for offline reservation items...');
    const count = await GlobalReservationService.syncOfflineQueue(profile.id);
    if (count > 0) {
      setReservations(GlobalReservationService.getReservations());
      addActivity(`Synced ${count} offline operations with Google Cloud database repository.`);
    } else {
      addActivity('Offline reservation queues verified. No pending synchronizations.');
    }
  };

  const resetProfile = () => {
    localStorage.removeItem('tasknova_contributor_profile');
    localStorage.removeItem('tasknova_contributor_preferences');
    localStorage.removeItem('tasknova_reservations_db');
    window.location.reload();
  };

  return (
    <MarketplaceContext.Provider value={{
      tasks,
      allTasks,
      profile,
      preferences,
      reservations,
      analytics,
      filters,
      setFilters,
      isLoading,
      isOnline,
      activityFeed,
      reserveTask,
      releaseReservation,
      completeReservedTask,
      toggleBookmark,
      hideTask,
      trackRecentlyViewed,
      toggleFavoriteBusiness,
      toggleIgnoreCategory,
      saveCurrentFilter,
      loadSavedFilter,
      deleteSavedFilter,
      syncOfflineQueue,
      resetProfile
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used inside a MarketplaceProvider');
  }
  return context;
}
