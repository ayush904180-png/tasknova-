/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useInfrastructure } from '../../infrastructure/providers/InfrastructureProvider';
import { useAuth } from '../../auth/providers/AuthProvider';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../auth/types';
import { WidgetSize, UserWidgetConfig } from '../types/widgets';
import { LocalCache } from '../../infrastructure/cache/LocalCache';
import { EventBus, DashboardEventType } from '../events/EventBus';

export interface DashboardContextProps {
  // 1. Centralized States
  uiState: {
    customizationMode: boolean;
    setCustomizationMode: (val: boolean) => void;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
  };
  widgetConfigs: UserWidgetConfig[];
  setWidgetConfigs: React.Dispatch<React.SetStateAction<UserWidgetConfig[]>>;
  
  loadingState: {
    isGlobalLoading: boolean;
    isSyncing: boolean;
    setGlobalLoading: (val: boolean) => void;
  };

  realtimeState: {
    isRealtime: boolean;
    setRealtime: (val: boolean) => void;
    activeListeners: string[];
  };

  offlineState: {
    isOffline: boolean;
    setOffline: (val: boolean) => void;
    pendingSyncQueue: Array<{ id: string; action: string; payload: any }>;
    triggerSync: () => Promise<void>;
  };

  developerState: {
    roleOverride: UserRole | 'developer';
    setRoleOverride: (val: UserRole | 'developer') => void;
    featureFlags: Record<string, boolean>;
    setFeatureFlag: (flag: string, value: boolean) => void;
  };

  // 2. Cache-integrated read pipeline
  fetchWithCache: <T>(cacheKey: string, fetchFn: () => Promise<T>, ttlMs?: number) => Promise<T>;
  
  // 3. Actions
  resetWidgetLayout: () => void;
  updateWidgetSize: (widgetId: string, size: WidgetSize) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

const DEFAULT_WIDGETS_CONFIG: UserWidgetConfig[] = [
  { id: 'profile-widget', size: WidgetSize.MEDIUM, order: 0, visible: true },
  { id: 'wallet-widget', size: WidgetSize.SMALL, order: 1, visible: true },
  { id: 'task-widget', size: WidgetSize.MEDIUM, order: 2, visible: true },
  { id: 'activity-widget', size: WidgetSize.MEDIUM, order: 3, visible: true },
  { id: 'notification-widget', size: WidgetSize.SMALL, order: 4, visible: true },
  { id: 'leaderboard-widget', size: WidgetSize.SMALL, order: 5, visible: true },
  { id: 'business-widget', size: WidgetSize.MEDIUM, order: 6, visible: true },
  { id: 'creator-widget', size: WidgetSize.MEDIUM, order: 7, visible: true },
  { id: 'analytics-widget', size: WidgetSize.FULL, order: 8, visible: true },
  { id: 'recommendation-widget', size: WidgetSize.MEDIUM, order: 9, visible: true },
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const infra = useInfrastructure();
  const { user } = useAuth();
  const { isDeveloperMode } = useApp();

  // --- UI STATE ---
  const [customizationMode, setCustomizationMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- WIDGET POSITION & SIZE CONFIG ---
  const [widgetConfigs, setWidgetConfigs] = useState<UserWidgetConfig[]>(() => {
    try {
      const stored = localStorage.getItem('tasknova_widget_configs');
      return stored ? JSON.parse(stored) : DEFAULT_WIDGETS_CONFIG;
    } catch {
      return DEFAULT_WIDGETS_CONFIG;
    }
  });

  // Save changes to localStorage on edit
  useEffect(() => {
    try {
      localStorage.setItem('tasknova_widget_configs', JSON.stringify(widgetConfigs));
    } catch {
      // Sandbox fallback
    }
  }, [widgetConfigs]);

  // --- LOADING STATES ---
  const [isGlobalLoading, setGlobalLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- REALTIME STATE ---
  const [isRealtime, setRealtime] = useState(true);
  const [activeListeners, setActiveListeners] = useState<string[]>([]);

  // Simulate active listener tracking for architecture visualization
  useEffect(() => {
    if (isRealtime) {
      setActiveListeners(['profiles_stream', 'wallets_stream', 'notifications_channel', 'global_timeline']);
    } else {
      setActiveListeners([]);
    }
  }, [isRealtime]);

  // --- OFFLINE STATE ---
  const [isOffline, setOffline] = useState(false);
  const [pendingSyncQueue, setPendingSyncQueue] = useState<Array<{ id: string; action: string; payload: any }>>([]);

  // Queue simulation when offline is triggered
  useEffect(() => {
    if (isOffline) {
      // Simulate queuing a task completion
      setPendingSyncQueue([
        { id: 'sync-1', action: 'SUBMIT_MICRO_TASK', payload: { taskId: 'task-102', response: 'Completed fine' } }
      ]);
    } else {
      setPendingSyncQueue([]);
    }
  }, [isOffline]);

  // Sync action trigger
  const triggerSync = async () => {
    if (pendingSyncQueue.length === 0) return;
    setIsSyncing(true);
    // Simulate back-sync delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPendingSyncQueue([]);
    setIsSyncing(false);
    
    // Dispatch system notice
    EventBus.emit(DashboardEventType.NotificationCreated, {
      id: 'sync-success',
      userId: user?.uid || 'guest',
      title: 'Offline Queue Synchronized Successfully',
      category: 'system'
    });
  };

  // --- FEATURE FLAGS & ROLES OVERRIDES (DEVELOPER PORTAL COUPLING) ---
  const [roleOverride, setRoleOverride] = useState<UserRole | 'developer'>(() => {
    return (user?.role as UserRole) || UserRole.CONTRIBUTOR;
  });

  // Auto-sync role when auth user changes
  useEffect(() => {
    if (user?.role) {
      setRoleOverride(user.role as UserRole);
    }
  }, [user]);

  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({
    'wallet.enabled': true,
    'leaderboard.enabled': true,
    'creator.enabled': true,
    'business.enabled': true,
    'analytics.enabled': true,
    'referrals.enabled': false, // canary default
    'aiInsights.enabled': true,
  });

  const setFeatureFlag = (flag: string, value: boolean) => {
    setFeatureFlags(prev => ({ ...prev, [flag]: value }));
  };

  // Listen to global developer mode toggle
  useEffect(() => {
    EventBus.emit(DashboardEventType.DeveloperModeChanged, { enabled: isDeveloperMode });
  }, [isDeveloperMode]);

  // --- CACHE-INTEGRATED READ PIPELINE ---
  const fetchWithCache = async <T,>(cacheKey: string, fetchFn: () => Promise<T>, ttlMs?: number): Promise<T> => {
    // If offline, default strictly to cache
    if (isOffline) {
      const cached = LocalCache.get<T>(cacheKey);
      if (cached !== null) {
        console.log(`[DashboardCache] Offline reading from LocalCache key: ${cacheKey}`);
        return cached;
      }
    }

    // Try reading cache pool first
    const cached = LocalCache.get<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Cache miss, trigger direct fetch
    const freshData = await fetchFn();
    LocalCache.set(cacheKey, freshData, { ttlMs, persistent: true });
    return freshData;
  };

  // --- LAYOUT INTERACTIONS ---
  const resetWidgetLayout = () => {
    setWidgetConfigs(DEFAULT_WIDGETS_CONFIG);
  };

  const updateWidgetSize = (widgetId: string, size: WidgetSize) => {
    setWidgetConfigs(prev =>
      prev.map(item => (item.id === widgetId ? { ...item, size } : item))
    );
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgetConfigs(prev =>
      prev.map(item => (item.id === widgetId ? { ...item, visible: !item.visible } : item))
    );
  };

  const contextValue = useMemo<DashboardContextProps>(() => {
    return {
      uiState: {
        customizationMode,
        setCustomizationMode,
        searchQuery,
        setSearchQuery,
      },
      widgetConfigs,
      setWidgetConfigs,
      loadingState: {
        isGlobalLoading,
        isSyncing,
        setGlobalLoading,
      },
      realtimeState: {
        isRealtime,
        setRealtime,
        activeListeners,
      },
      offlineState: {
        isOffline,
        setOffline,
        pendingSyncQueue,
        triggerSync,
      },
      developerState: {
        roleOverride,
        setRoleOverride,
        featureFlags,
        setFeatureFlag,
      },
      fetchWithCache,
      resetWidgetLayout,
      updateWidgetSize,
      toggleWidgetVisibility,
    };
  }, [
    customizationMode,
    searchQuery,
    widgetConfigs,
    isGlobalLoading,
    isSyncing,
    isRealtime,
    activeListeners,
    isOffline,
    pendingSyncQueue,
    roleOverride,
    featureFlags,
  ]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be run within a valid DashboardProvider block.');
  }
  return context;
};
