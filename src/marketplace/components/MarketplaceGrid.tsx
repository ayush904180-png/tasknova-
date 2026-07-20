/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { GlobalMatchingEngineService } from '../services/MatchingEngineService';
import { 
  Bookmark, Award, Clock, Shield, Coins, AlertCircle, 
  MapPin, Globe, ArrowRight, EyeOff, LayoutGrid, ChevronLeft, ChevronRight, HelpCircle 
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { formatDuration } from '../utils/marketplaceUtils';
import { Task, TaskDifficulty, TaskPriority } from '../../types/tasks';

interface MarketplaceGridProps {
  onSelectTask: (taskId: string) => void;
}

export function MarketplaceGrid({ onSelectTask }: MarketplaceGridProps) {
  const { 
    tasks, 
    profile, 
    preferences, 
    toggleBookmark, 
    hideTask, 
    isLoading 
  } = useMarketplace();

  // Selected tab for predefined categories
  const [activeTab, setActiveTab] = useState<'All' | 'Recommended' | 'High Reward' | 'Quick' | 'Premium' | 'Trending' | 'Recently Published'>('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Tabs definitions
  const tabs = [
    { id: 'All', label: 'All Live Tasks' },
    { id: 'Recommended', label: 'Smart Matches' },
    { id: 'High Reward', label: 'High Reward (25+)' },
    { id: 'Quick', label: 'Quick Work (≤45s)' },
    { id: 'Premium', label: 'Premium (Trust ≥80)' },
    { id: 'Recently Published', label: 'Recently Published' }
  ] as const;

  // Filter tasks based on selected tab
  const filteredTasks = useMemo(() => {
    if (!profile) return tasks;

    switch (activeTab) {
      case 'Recommended':
        return tasks.filter(task => {
          const match = GlobalMatchingEngineService.calculateMatch(task, profile);
          return match.compatibilityScore >= 75;
        });
      case 'High Reward':
        return tasks.filter(task => task.rewardCoins >= 25);
      case 'Quick':
        return tasks.filter(task => task.estimatedCompletionTime <= 45);
      case 'Premium':
        return tasks.filter(task => (task.requiredTrustScore || 0) >= 80);
      case 'Recently Published':
        return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return tasks;
    }
  }, [tasks, activeTab, profile]);

  // Handle resetting pagination when active tab changes
  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTasks, currentPage]);

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-slate-500">Retrieving secure campaign ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Tabs list */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-1 overflow-x-auto scrollbar-none">
        <div className="flex gap-1.5 whitespace-nowrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                  : 'bg-transparent border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] font-mono px-1 bg-slate-950/60 text-slate-500 rounded border border-slate-800/40">
                {activeTab === tab.id ? filteredTasks.length : tasks.filter(t => {
                  if (!profile) return true;
                  if (tab.id === 'Recommended') return GlobalMatchingEngineService.calculateMatch(t, profile).compatibilityScore >= 75;
                  if (tab.id === 'High Reward') return t.rewardCoins >= 25;
                  if (tab.id === 'Quick') return t.estimatedCompletionTime <= 45;
                  if (tab.id === 'Premium') return (t.requiredTrustScore || 0) >= 80;
                  return true;
                }).length}
              </span>
            </button>
          ))}
        </div>

        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider hidden lg:block">
          Active Node Ledgers
        </span>
      </div>

      {/* Primary Tasks Grid */}
      {paginatedTasks.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2.5" />
          <h3 className="text-sm font-bold text-slate-300">No Eligible Tasks Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try resetting your search filters, adjusting difficulty parameters, or switching tabs to display additional campaigns.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTasks.map(task => {
            if (!profile) return null;
            const match = GlobalMatchingEngineService.calculateMatch(task, profile);
            const isBookmarked = preferences?.bookmarkedTaskIds.includes(task.id);
            const isPriorityCritical = task.priority === TaskPriority.CRITICAL || task.priority === TaskPriority.HIGH;

            return (
              <div
                key={`grid_${task.id}`}
                className="bg-slate-900/10 border border-slate-800/60 hover:border-slate-800/90 rounded-xl p-5 flex flex-col justify-between hover:bg-slate-900/[0.15] hover:-translate-y-0.5 transition-all duration-300 group relative"
              >
                {/* Critical Priority indicator */}
                {isPriorityCritical && (
                  <div className="absolute top-0 right-12 px-2 py-0.5 bg-red-500/10 text-red-400 border border-t-0 border-red-500/20 rounded-b text-[9px] font-mono uppercase tracking-wider">
                    High Priority
                  </div>
                )}

                <div>
                  {/* Top Line: Category & Bookmark Toggle */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Badge className="bg-slate-950/60 text-slate-400 border border-slate-800/40 text-[9px] font-mono">
                        {task.category}
                      </Badge>
                      {task.country !== 'ALL' && (
                        <Badge className="bg-slate-950/60 text-slate-400 border border-slate-800/40 text-[9px] font-mono flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-500" />
                          <span>{task.country}</span>
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      {/* Hide action */}
                      <button
                        onClick={() => hideTask(task.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Hide Task"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                      
                      {/* Bookmark toggle */}
                      <button
                        onClick={() => toggleBookmark(task.id)}
                        className={`p-1 transition-all ${
                          isBookmarked 
                            ? 'text-amber-400 scale-110' 
                            : 'text-slate-500 hover:text-amber-400'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Task'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400/20' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Trust Score & Matching Affinity */}
                  <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                    <div className="flex items-center space-x-1 font-mono text-[10px]">
                      <span className="text-slate-500">Requires Trust:</span>
                      <span className={`font-bold ${profile.trustScore >= task.requiredTrustScore ? 'text-teal-400' : 'text-red-400'}`}>
                        {task.requiredTrustScore}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-500">Affinity:</span>
                      <span className={`text-xs font-mono font-bold ${
                        match.compatibilityScore >= 90 ? 'text-teal-400' : match.compatibilityScore >= 75 ? 'text-purple-400' : 'text-slate-400'
                      }`}>
                        {match.compatibilityScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer specs & Select workspace button */}
                <div className="mt-5 pt-4 border-t border-slate-900/80 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 text-slate-400 font-mono text-[10px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatDuration(task.estimatedCompletionTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-500" />
                      <span className={
                        task.difficulty === TaskDifficulty.HARD ? 'text-orange-400' : task.difficulty === TaskDifficulty.MEDIUM ? 'text-amber-400' : 'text-emerald-400'
                      }>
                        {task.difficulty}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTask(task.id)}
                    className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white hover:border-transparent text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800/40 pt-4 mt-2">
          <span className="text-[10px] font-mono text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length} matching campaigns
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-3 text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
