/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  bootstrapWidgets 
} from '../registry/bootstrap';
import { WidgetRegistry } from '../registry/WidgetRegistry';
import { useDashboard, DashboardProvider } from '../context/DashboardContext';
import { EventBus, DashboardEventType } from '../events/EventBus';
import { UserRole } from '../../auth/types';
import { WidgetSize } from '../types/widgets';
import { 
  SlidersHorizontal, Sliders, WifiOff, RefreshCw, LayoutGrid, 
  Settings, Layers, Radio, PlayCircle, ToggleLeft, ShieldAlert, Zap, Globe, Sparkles, Activity
} from 'lucide-react';

// Bootstrap once on module import
bootstrapWidgets();

export const DashboardShellInner: React.FC = () => {
  const {
    uiState,
    widgetConfigs,
    loadingState,
    realtimeState,
    offlineState,
    developerState,
    resetWidgetLayout,
    toggleWidgetVisibility,
  } = useDashboard();

  const [eventLogs, setEventLogs] = useState<Array<{ id: string; name: string; time: string; details: string }>>([]);
  const [showDevPanel, setShowDevPanel] = useState(false);

  // Monitor the Global Event Bus to print real-time audits
  useEffect(() => {
    const unsubscribes: Array<() => void> = [];

    // Log all main events
    Object.values(DashboardEventType).forEach(evName => {
      const unsub = EventBus.on(evName as any, (payload: any) => {
        setEventLogs(prev => [
          {
            id: Math.random().toString(),
            name: evName,
            time: new Date().toLocaleTimeString(),
            details: JSON.stringify(payload),
          },
          ...prev.slice(0, 9),
        ]);
      });
      unsubscribes.push(unsub);
    });

    return () => {
      unsubscribes.forEach(fn => fn());
    };
  }, []);

  // Filter widgets to render based on permissions and visibility rules
  const visibleWidgets = WidgetRegistry.getAuthorizedWidgets(
    developerState.roleOverride,
    developerState.featureFlags
  ).filter(widget => {
    const config = widgetConfigs.find(c => c.id === widget.metadata.id);
    return config ? config.visible : true;
  });

  // Dynamic quick action trigger to emit test event
  const fireSimulatedEvent = (type: DashboardEventType, payload: any) => {
    EventBus.emit(type, payload);
    
    // Auto-create notice bulletin too
    if (type === DashboardEventType.TaskCompleted) {
      EventBus.emit(DashboardEventType.NotificationCreated, {
        id: `nt-${Date.now()}`,
        userId: 'session-user',
        title: 'Task Successfully Transmitted',
        category: 'task'
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans space-y-6" id="dashboard-engine-root">
      
      {/* Offline sync warnings and banners */}
      <AnimatePresence>
        {offlineState.isOffline && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 animate-pulse text-amber-500" />
              <span>
                <strong>Offline Cached Mode Active.</strong> Readings resolved directly via read-through LocalCache. {offlineState.pendingSyncQueue.length} payload in queue.
              </span>
            </div>
            {offlineState.pendingSyncQueue.length > 0 && (
              <button
                onClick={offlineState.triggerSync}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-mono rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                disabled={loadingState.isSyncing}
              >
                {loadingState.isSyncing ? 'Reconciling Ledger...' : 'Flush Sync Queue'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page title and high fidelity status badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/30 px-2 py-1 rounded">
            Dashboard System v1.0 • Enterprise Foundations
          </span>
          <h1 className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white mt-2">
            Dynamic Control Console
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl font-light">
            Decoupled real-time widgets powered by standard repository contracts, unified caching schemas, and event orchestration.
          </p>
        </div>

        {/* Console control header */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Customization Toggle */}
          <button
            onClick={() => uiState.setCustomizationMode(!uiState.customizationMode)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              uiState.customizationMode 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400' 
                : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-white/5 dark:border-white/5 dark:text-zinc-300 dark:hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {uiState.customizationMode ? 'Lock Layout' : 'Arrange Bento'}
          </button>

          {/* Developer Options Toggle */}
          <button
            onClick={() => setShowDevPanel(!showDevPanel)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showDevPanel 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 font-bold' 
                : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-white/5 dark:border-white/5 dark:text-zinc-300 dark:hover:bg-white/10'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Dev Controls
          </button>

          {/* Reset Layout */}
          {uiState.customizationMode && (
            <button
              onClick={resetWidgetLayout}
              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Bento
            </button>
          )}
        </div>
      </div>

      {/* Grid customization drawer / Dev panel */}
      <AnimatePresence>
        {showDevPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#08080a] rounded-xl p-4 md:p-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              {/* Role Simulation matrix */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-500" />
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                    Identity Role Simulator
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 font-light">
                  Overrides active context permissions matrix. Filtering which widgets compile in bento grid.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(['contributor', 'creator', 'business', 'admin', 'developer'] as Array<UserRole | 'developer'>).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        developerState.setRoleOverride(r);
                        fireSimulatedEvent(DashboardEventType.DeveloperModeChanged, { enabled: r === 'developer' });
                      }}
                      className={`px-2.5 py-1 rounded font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                        developerState.roleOverride === r
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-white/5 dark:border-white/5 dark:text-zinc-400 dark:hover:bg-white/10'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Gating Flags switches */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-pink-500" />
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                    Dynamic Feature Flags
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 font-light">
                  Injectable canary flags toggling features. Invisible widgets automatically skip render loops.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px] text-slate-500">
                  {Object.entries(developerState.featureFlags).map(([flag, val]) => (
                    <button
                      key={flag}
                      onClick={() => developerState.setFeatureFlag(flag, !val)}
                      className={`p-1.5 border rounded-md flex items-center justify-between text-left cursor-pointer transition-all ${
                        val 
                          ? 'bg-emerald-50/20 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-white border-slate-200 text-slate-400 dark:bg-white/5 dark:border-white/5'
                      }`}
                    >
                      <span className="truncate pr-1">{flag}</span>
                      <span className="font-bold text-[8px] uppercase">{val ? 'ON' : 'OFF'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Connectivity & Pipeline controls */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-teal-500" />
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                    Realtime & Cache Toggles
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 font-light font-sans">
                  Simulate network state shifts. Test read-through LocalCache and offline resilience mechanics.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => offlineState.setOffline(!offlineState.isOffline)}
                    className={`p-2 border rounded-xl flex flex-col justify-between text-left cursor-pointer transition-all ${
                      offlineState.isOffline 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                        : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/5 text-slate-500'
                    }`}
                  >
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">Offline Mode</span>
                    <span className="font-bold text-xs mt-1">{offlineState.isOffline ? 'ACTIVE' : 'INACTIVE'}</span>
                  </button>

                  <button
                    onClick={() => {
                      realtimeState.setRealtime(!realtimeState.isRealtime);
                      fireSimulatedEvent(DashboardEventType.LeaderboardChanged, { period: 'weekly', rankingsCount: 3 });
                    }}
                    className={`p-2 border rounded-xl flex flex-col justify-between text-left cursor-pointer transition-all ${
                      realtimeState.isRealtime 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' 
                        : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/5 text-slate-500'
                    }`}
                  >
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">Live Handshake</span>
                    <span className="font-bold text-xs mt-1">{realtimeState.isRealtime ? 'STREAMING' : 'STATIC'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Actions Emulator Row */}
            <div className="border-t border-slate-200 dark:border-white/5 mt-4 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
              <div>
                <h5 className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  ⚡ Global Event Bus Simulator
                </h5>
                <p className="text-[9px] text-slate-400 font-light mt-0.5">
                  Emit events across the pipeline to test fully decoupled event-driven updates.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => fireSimulatedEvent(DashboardEventType.TaskCompleted, { taskId: 'task-101', userId: 'usr-ayush', rewardCoins: 250, difficulty: 'medium' })}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-zinc-300 text-[10px] font-mono rounded cursor-pointer"
                >
                  Trigger: TaskCompleted (+250)
                </button>
                <button
                  onClick={() => fireSimulatedEvent(DashboardEventType.WalletUpdated, { walletId: 'wallet-ayush', balanceCoins: 4570, pendingCoins: 1250 })}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-zinc-300 text-[10px] font-mono rounded cursor-pointer"
                >
                  Trigger: WalletUpdated
                </button>
                <button
                  onClick={() => fireSimulatedEvent(DashboardEventType.BadgeUnlocked, { badgeId: 'badge-speed', badgeName: 'Speed Demon', userId: 'usr-ayush' })}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-zinc-300 text-[10px] font-mono rounded cursor-pointer"
                >
                  Trigger: BadgeUnlocked
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid section and Sidebar telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Bento Grid layout */}
        <div className="lg:col-span-3">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            layout
          >
            {visibleWidgets.length > 0 ? (
              visibleWidgets.map(widget => {
                const config = widgetConfigs.find(c => c.id === widget.metadata.id) || {
                  size: widget.metadata.defaultSize
                };
                const WidgetComponent = widget.component;
                return (
                  <WidgetComponent 
                    key={widget.metadata.id}
                    size={config.size}
                    isOffline={offlineState.isOffline}
                    isRealtime={realtimeState.isRealtime}
                    featureFlags={developerState.featureFlags}
                    onEventTrigger={(name, payload) => fireSimulatedEvent(name as any, payload)}
                  />
                );
              })
            ) : (
              <div className="col-span-4 py-24 text-center text-slate-400 bg-white border border-slate-200 rounded-xl dark:bg-[#0a0a0c] dark:border-white/5 space-y-3">
                <LayoutGrid className="h-10 w-10 mx-auto stroke-[1.2] text-slate-300 dark:text-zinc-700" />
                <h3 className="font-semibold text-slate-800 dark:text-zinc-200">Bento Grid is Empty</h3>
                <p className="text-xs max-w-sm mx-auto font-light leading-relaxed">
                  The active role configuration and feature flags filtered out all widgets. Increase permissions to restore elements.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Telemetry log audits (Right Sidebar) */}
        <div className="space-y-5 text-left">
          
          {/* Active Streams Status */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-white/5 dark:bg-[#0a0a0c]">
            <h3 className="font-display font-semibold text-xs text-slate-900 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
              <Radio className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              Listener Snapshot Registry
            </h3>
            <div className="space-y-1.5 mt-3 font-mono text-[10px]">
              {realtimeState.activeListeners.length > 0 ? (
                realtimeState.activeListeners.map(l => (
                  <div key={l} className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                    <span>● {l}</span>
                    <span className="text-[8px] uppercase font-bold tracking-wide text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-1 py-0.5 rounded">Active</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 py-1 font-sans">
                  Websocket listeners unmounted. Static pooling active.
                </div>
              )}
            </div>
          </div>

          {/* Realtime Event Logs Audit trail */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-white/5 dark:bg-[#0a0a0c] flex flex-col justify-between min-h-[320px]">
            <div>
              <h3 className="font-display font-semibold text-xs text-slate-900 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                <PlayCircle className="h-3.5 w-3.5 text-pink-500" />
                Global Audit Pipeline
              </h3>
              
              <div className="space-y-3.5 mt-4 max-h-[300px] overflow-y-auto pr-1">
                {eventLogs.length > 0 ? (
                  eventLogs.map((log) => (
                    <div key={log.id} className="text-left font-mono text-[9px] border-b border-slate-50 dark:border-white/1 pb-2">
                      <div className="flex justify-between text-[8px] text-slate-400">
                        <span className="font-bold text-pink-500">{log.name}</span>
                        <span>{log.time}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 dark:text-zinc-400 mt-1 break-all bg-slate-50 dark:bg-black/40 p-1 rounded-sm leading-normal">
                        {log.details}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 py-12 text-center font-sans space-y-1.5">
                    <Activity className="h-7 w-7 mx-auto stroke-[1.2] text-slate-300 dark:text-zinc-700" />
                    <p className="text-xs font-light">Zero events dispatched since console mount.</p>
                  </div>
                )}
              </div>
            </div>

            {eventLogs.length > 0 && (
              <button 
                onClick={() => setEventLogs([])}
                className="w-full mt-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-zinc-300 text-[10px] font-mono rounded cursor-pointer transition-colors"
              >
                Clear Audit Trail
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export const DashboardShell: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardShellInner />
    </DashboardProvider>
  );
};
