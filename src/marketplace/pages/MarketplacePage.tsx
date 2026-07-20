/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { LiveStatistics } from '../components/LiveStatistics';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { RecommendationFeed } from '../components/RecommendationFeed';
import { MarketplaceGrid } from '../components/MarketplaceGrid';
import { TaskDetailsDrawer } from '../components/TaskDetailsDrawer';
import { ReservationPanel } from '../components/ReservationPanel';
import { FavoritesView } from '../components/FavoritesView';
import { ActivityFeed } from '../components/ActivityFeed';
import { QuickActions } from '../components/QuickActions';
import { Compass, Sparkles, AlertCircle, ShoppingBag, Radio } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function MarketplacePage() {
  const { isOnline } = useMarketplace();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseDrawer = () => {
    setSelectedTaskId(null);
  };

  return (
    <div id="marketplace-page-root" className="space-y-6 max-w-7xl mx-auto p-1 animate-fade-in pb-16">
      {/* Dynamic Network / Warning Toast */}
      {!isOnline && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0" />
            <span className="font-bold">Offline Caching Mode Engaged</span>
            <span className="hidden md:inline text-slate-400">| Queued operations will auto-sync on recovery.</span>
          </div>
          <Badge className="bg-red-500/15 text-red-400 border border-red-500/20 text-[9px]">
            SQLite Buffers Active
          </Badge>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/10 border border-slate-800/60 p-5 rounded-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600/20 to-purple-400/20 border border-purple-500/30 text-purple-400 rounded-xl">
            <ShoppingBag className="w-5 h-5 fill-purple-400/10" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Contributor Marketplace
            </h1>
            <p className="text-xs text-slate-400">Discover campaigns, lock leases, submit responses, and scale your global trust rating.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
          <span>Active Server Consensus:</span>
          <span className="font-bold text-teal-400 flex items-center">
            <Radio className="w-3.5 h-3.5 mr-0.5 text-teal-400 animate-pulse" />
            LIVE_ROUTER_99
          </span>
        </div>
      </div>

      {/* 1. Bento Dashboard Metrics Row */}
      <LiveStatistics />

      {/* 2. Main Double-Column Workplace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8/12 width) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Advanced Search Queries & Filters */}
          <AdvancedFilters />

          {/* AI Recommended Tasks discovery feed */}
          <RecommendationFeed onSelectTask={handleSelectTask} />

          {/* Core Marketplace Grid */}
          <div className="bg-slate-900/10 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Live Campaign Catalog
              </h2>
              <span className="text-[10px] font-mono text-slate-500">
                Secured via distributed consensus validators
              </span>
            </div>
            
            <MarketplaceGrid onSelectTask={handleSelectTask} />
          </div>
        </div>

        {/* Right Column (4/12 width) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Reservation Timer & Active Workspace Leases */}
          <ReservationPanel onSelectTask={handleSelectTask} />

          {/* Favorites, Ignores and Bookmarked filters */}
          <FavoritesView onSelectTask={handleSelectTask} />

          {/* Sandbox developer triggers */}
          <QuickActions />

          {/* Decoupled Event Bus Real-time audit log */}
          <ActivityFeed />
        </div>
      </div>

      {/* Sliding Overlay Drawer for Active Task Details */}
      {selectedTaskId && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300"
          onClick={handleCloseDrawer}
        >
          <div 
            className="w-full max-w-xl h-full p-4 animate-slide-in"
            onClick={(e) => e.stopPropagation()} // Stop propagation from closing
          >
            <TaskDetailsDrawer taskId={selectedTaskId} onClose={handleCloseDrawer} />
          </div>
        </div>
      )}
    </div>
  );
}
