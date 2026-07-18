/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { 
  Clock, Coins, CheckCircle, Sparkles, HelpCircle, ArrowRight, 
  ShieldCheck, Bookmark, Search, Filter, Sliders, ChevronLeft, 
  ChevronRight, AlertTriangle, FileText, Music, Video, Image as ImageIcon, 
  Layers, Tag, Volume2, Languages, ExternalLink, RefreshCw, X, Check, Eye,
  GitCompare, Mic, Laptop
} from 'lucide-react';
import { Task, TaskDifficulty, TaskStatus, TaskPriority, TaskAttachment } from '../../types/tasks';
import { useTasks } from '../context/TaskContext';
import { TaskTypeRegistry } from '../registry/TaskTypeRegistry';
import { TaskFilterOptions } from '../utils/TaskQueryBuilder';
import { TaskPlayerShell } from '../player/TaskPlayerComponents';

// ==========================================
// 1. REUSABLE BADGES & CORE TOKENS
// ==========================================

export function TaskDifficultyBadge({ difficulty }: { difficulty: TaskDifficulty }) {
  const styles = {
    [TaskDifficulty.EASY]: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    [TaskDifficulty.MEDIUM]: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    [TaskDifficulty.HARD]: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border ${styles[difficulty]}`} id={`difficulty-badge-${difficulty}`}>
      {difficulty}
    </span>
  );
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles = {
    [TaskPriority.LOW]: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
    [TaskPriority.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    [TaskPriority.HIGH]: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
    [TaskPriority.CRITICAL]: 'bg-red-50 text-red-700 border-red-200 animate-pulse dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border ${styles[priority]}`} id={`priority-badge-${priority}`}>
      {priority} Priority
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    [TaskStatus.DRAFT]: 'bg-slate-100 text-slate-700 border-slate-200',
    [TaskStatus.SCHEDULED]: 'bg-sky-50 text-sky-700 border-sky-200',
    [TaskStatus.PUBLISHED]: 'bg-blue-50 text-blue-700 border-blue-200',
    [TaskStatus.PAUSED]: 'bg-amber-50 text-amber-700 border-amber-200',
    [TaskStatus.ACTIVE]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [TaskStatus.IN_REVIEW]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    [TaskStatus.COMPLETED]: 'bg-purple-50 text-purple-700 border-purple-200',
    [TaskStatus.REJECTED]: 'bg-rose-50 text-rose-700 border-rose-200',
    [TaskStatus.ARCHIVED]: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    [TaskStatus.HIDDEN]: 'bg-zinc-50 text-zinc-400 border-zinc-150',
    [TaskStatus.EXPIRED]: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border ${styles[status]}`} id={`status-badge-${status}`}>
      {status}
    </span>
  );
}

export function TaskCategoryBadge({ category }: { category: string }) {
  const def = TaskTypeRegistry.get(category);
  const iconMap: Record<string, any> = {
    GitCompare, ImageIcon, ShieldCheck, Tag, Mic, Volume2, Search, Sparkles, Languages, FileText, Sliders, Music, Video, Layers, Laptop
  };
  
  const Icon = (def && iconMap[def.iconName]) || Tag;

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700" id={`category-badge-${category.replace(/\s+/g, '-')}`}>
      <Icon className="h-3 w-3 text-indigo-400" />
      <span>{category}</span>
    </span>
  );
}

export function TaskLanguageBadge({ language, country }: { language: string; country: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800" id={`lang-badge-${language}`}>
      <Languages className="h-3 w-3" />
      <span>{language} ({country})</span>
    </span>
  );
}

export function TaskRewardCard({ coins }: { coins: number }) {
  return (
    <div className="bg-gradient-to-br from-indigo-950 via-[#0a0a0c] to-purple-950 p-4 rounded-xl border border-white/5 shadow-md flex items-center justify-between" id="task-reward-card">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Alignment Bounty</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-extrabold text-white font-display">+{coins}</span>
          <span className="text-xs text-amber-400 font-mono">Coins</span>
        </div>
      </div>
      <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 animate-pulse">
        <Coins className="h-6 w-6 text-amber-400" />
      </div>
    </div>
  );
}

export function TaskTimer({ estimatedSeconds }: { estimatedSeconds: number }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono text-slate-600 dark:bg-zinc-900 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800" id="task-timer-wrapper">
      <Clock className="h-3.5 w-3.5 text-indigo-400" />
      <span>Session Time:</span>
      <span className="font-bold text-slate-800 dark:text-slate-200">{formatTime(seconds)}</span>
      <span className="text-[10px] text-slate-400">/ Est: {formatTime(estimatedSeconds)}</span>
    </div>
  );
}

export function TaskProgress({ count, max }: { count: number; max: number }) {
  const percentage = Math.min(100, Math.round((count / max) * 100));

  return (
    <div className="space-y-1" id="task-progress-box">
      <div className="flex justify-between text-[11px] font-mono text-slate-500">
        <span>Capacity Fill</span>
        <span>{count} / {max} Submissions</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function TaskAttachments({ attachments, onAttachMock }: { attachments: TaskAttachment[]; onAttachMock?: () => void }) {
  const iconMap = {
    document: FileText,
    audio: Music,
    video: Video,
    image: ImageIcon,
    zip: Layers,
    ai_asset: Sparkles
  };

  return (
    <div className="space-y-2" id="task-attachments-panel">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Reference Assets ({attachments.length})</span>
        {onAttachMock && (
          <button 
            onClick={onAttachMock}
            className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
          >
            + Link Drive File
          </button>
        )}
      </div>

      {attachments.length === 0 ? (
        <p className="text-xs text-slate-400 font-sans italic p-3 bg-slate-50 rounded-lg dark:bg-zinc-950/20 border border-slate-150 dark:border-zinc-850">No external reference files attached.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {attachments.map(att => {
            const Icon = iconMap[att.fileType] || FileText;
            return (
              <a 
                key={att.id}
                href={att.url}
                target="_blank"
                rel="noreferrer referrerPolicy"
                className="p-2 bg-white rounded-lg border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-700 dark:text-zinc-300 truncate">{att.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{(att.sizeBytes / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TaskRequirements({ accuracy, trustScore }: { accuracy: number; trustScore: number }) {
  return (
    <div className="grid grid-cols-2 gap-3" id="task-requirements-bento">
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 dark:bg-zinc-900/50 dark:border-zinc-800 text-center">
        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Required Accuracy</span>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1 font-display">{accuracy}%</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 dark:bg-zinc-900/50 dark:border-zinc-800 text-center">
        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Required Trust Score</span>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1 font-display">{trustScore}%</p>
      </div>
    </div>
  );
}

// ==========================================
// 2. STATE HANDLERS (EMPTY, SKELETON, ERROR)
// ==========================================

export function TaskEmptyState() {
  const { setFilters } = useTasks();

  return (
    <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 dark:bg-[#09090b] dark:border-zinc-800" id="task-empty-state">
      <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-400 mb-4">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white font-display">No tasks found</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">None of our active validator tasks matched your filters or search keywords. Try clearing search.</p>
      <button 
        onClick={() => setFilters({
          category: 'All',
          difficulty: undefined,
          minReward: undefined,
          maxReward: undefined,
          country: 'ALL',
          language: 'All',
          priority: undefined,
          maxEstimatedTime: undefined,
          status: undefined,
          bookmarkedOnly: false,
          searchQuery: '',
          sortBy: 'Newest'
        })}
        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 transition-all cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Clear All Filters</span>
      </button>
    </div>
  );
}

export function TaskErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="p-6 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-start gap-3 dark:bg-rose-950/20 dark:border-rose-900/30" id="task-error-state">
      <AlertTriangle className="h-5 w-5 text-rose-500 mt-0.5" />
      <div>
        <h4 className="text-sm font-bold">Workspace Engine Fault</h4>
        <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-rose-700 underline hover:text-rose-600 cursor-pointer"
          >
            Retry sync pipeline
          </button>
        )}
      </div>
    </div>
  );
}

export function TaskLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse" id="task-loading-skeleton">
      {[1, 2, 3, 4].map(idx => (
        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/3" />
            <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-12" />
          </div>
          <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-5/6" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded w-16" />
            <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 3. SEARCH & FILTER CORE MECHANICS
// ==========================================

export function TaskSearchBar() {
  const { filters, setFilters } = useTasks();
  const [val, setVal] = useState(filters.searchQuery || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: val }));
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [val]);

  return (
    <div className="relative w-full" id="task-search-input-box">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input 
        type="text"
        placeholder="Search verification tasks by keywords, tags, category..."
        value={val}
        onChange={e => setVal(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-zinc-900/60 dark:border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-slate-800 dark:text-white"
        aria-label="Search verification tasks"
      />
      {val && (
        <button 
          onClick={() => setVal('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function TaskSortMenu() {
  const { filters, setFilters } = useTasks();
  const sorts: Array<TaskFilterOptions['sortBy']> = [
    'Newest', 'Oldest', 'Alphabetical', 'Popularity', 'Recommended', 'Recently Viewed'
  ];

  return (
    <div className="flex items-center gap-2 text-xs" id="task-sort-menu-box">
      <Sliders className="h-3.5 w-3.5 text-indigo-400" />
      <span className="text-slate-400 font-medium">Sort By:</span>
      <select 
        value={filters.sortBy || 'Newest'}
        onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
        className="p-1.5 bg-transparent border-none text-slate-700 dark:text-zinc-300 font-semibold focus:ring-0 focus:outline-none cursor-pointer"
      >
        {sorts.map(opt => (
          <option key={opt} value={opt} className="bg-white dark:bg-[#0a0a0c] text-slate-800 dark:text-white">{opt}</option>
        ))}
      </select>
    </div>
  );
}

export function TaskFilterBar() {
  const { filters, setFilters, allTasks } = useTasks();
  
  // Dynamic Categories calculation from db tasks
  const categories = ['All', ...Array.from(new Set(allTasks.map(t => t.category)))];
  const difficulties: Array<'All' | TaskDifficulty> = ['All', TaskDifficulty.EASY, TaskDifficulty.MEDIUM, TaskDifficulty.HARD];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 dark:bg-[#09090b] dark:border-zinc-800/80 space-y-5" id="task-filter-sidebar">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-white mb-3">
          <Filter className="h-4 w-4 text-indigo-400" />
          <span>Filter Categories</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {categories.map(cat => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex justify-between items-center cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-transparent text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
                }`}
              >
                <span>{cat}</span>
                {isActive && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-zinc-850 pt-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2.5">Difficulty Tiers</span>
        <div className="grid grid-cols-2 gap-1.5">
          {difficulties.map(diff => {
            const isActive = diff === 'All' ? filters.difficulty === undefined : filters.difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  difficulty: diff === 'All' ? undefined : diff 
                }))}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
                  isActive
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                    : 'bg-transparent border-slate-200 hover:border-slate-300 text-slate-500 dark:border-zinc-800'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-zinc-850 pt-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Workspace Bounds</span>
        <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg">
          <input 
            type="checkbox"
            checked={!!filters.bookmarkedOnly}
            onChange={e => setFilters(prev => ({ ...prev, bookmarkedOnly: e.target.checked }))}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs text-slate-600 dark:text-zinc-400">Bookmarked Tasks</span>
        </label>
      </div>
    </div>
  );
}

export function TaskPagination({ total, size, current, onPageChange }: { total: number; size: number; current: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / size));
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 dark:bg-[#09090b] dark:border-zinc-800 rounded-xl mt-4" id="task-pagination-bar">
      <span className="text-xs text-slate-400 font-mono">Page {current} of {totalPages}</span>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          className="p-1.5 rounded-md border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(current + 1)}
          disabled={current === totalPages}
          className="p-1.5 rounded-md border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN LAYOUT AND VISUAL CONTAINER CARDS
// ==========================================

export function TaskCard({ task }: { task: Task }) {
  const { activeTask, setActiveTask, bookmarks, toggleBookmark } = useTasks();
  const isSelected = activeTask?.id === task.id;
  const isBookmarked = bookmarks.includes(task.id);

  return (
    <div 
      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
        isSelected
          ? 'bg-slate-50/80 border-indigo-500 dark:bg-zinc-900/60'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md dark:bg-[#09090b] dark:border-zinc-800/80'
      }`}
      onClick={() => setActiveTask(task)}
      id={`task-card-${task.id}`}
    >
      <div className="space-y-2.5">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-1.5">
            <TaskDifficultyBadge difficulty={task.difficulty} />
            <TaskPriorityBadge priority={task.priority} />
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              toggleBookmark(task.id);
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-400 dark:bg-zinc-900 dark:border-zinc-800'
            }`}
            aria-label={isBookmarked ? 'Unbookmark task' : 'Bookmark task'}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display group-hover:text-indigo-400 transition-colors leading-snug">
            {task.title}
          </h4>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <Coins className="h-4 w-4 text-amber-500" />
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">+{task.rewardCoins}</span>
          <span className="text-[10px] text-slate-400 font-mono">Coins</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
          <Clock className="h-3 w-3" />
          <span>{task.estimatedCompletionTime}s est.</span>
        </div>
      </div>
    </div>
  );
}

export function TaskGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="task-grid-container">
      {children}
    </div>
  );
}

export function TaskList({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3" id="task-list-container">
      {children}
    </div>
  );
}

export function TaskHeader({ task }: { task: Task }) {
  return (
    <div className="space-y-3 pb-4 border-b border-slate-150 dark:border-zinc-850" id="task-workspace-header">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <TaskDifficultyBadge difficulty={task.difficulty} />
            <TaskPriorityBadge priority={task.priority} />
            <TaskLanguageBadge language={task.language} country={task.country} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display mt-2 tracking-tight leading-tight">
            {task.title}
          </h2>
        </div>
        <TaskTimer estimatedSeconds={task.estimatedCompletionTime} />
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl">{task.description}</p>
    </div>
  );
}

export function TaskInstructionPanel({ instructions }: { instructions: string[] }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 dark:bg-zinc-950/20 dark:border-zinc-850 space-y-2.5" id="task-instruction-panel">
      <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-indigo-400">Validator Protocol Instructions</span>
      <ol className="space-y-2 font-sans text-xs text-slate-600 dark:text-zinc-300 leading-relaxed list-decimal pl-4 font-light">
        {instructions.map((inst, index) => (
          <li key={index} className="pl-1">{inst}</li>
        ))}
      </ol>
    </div>
  );
}

export function TaskMetadataPanel({ task }: { task: Task }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 dark:bg-zinc-950/20 dark:border-zinc-850 space-y-3" id="task-metadata-panel">
      <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-indigo-400">Metadata Telemetry & SLA bounds</span>
      
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400">Associated Model:</span>
          <p className="font-semibold text-slate-700 dark:text-zinc-300 mt-0.5">{task.aiMetadata.associatedModel || 'None'}</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400">Evaluation SLA:</span>
          <p className="font-semibold text-slate-700 dark:text-zinc-300 mt-0.5">{task.aiMetadata.evaluationMetric || 'Consensus'}</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400">Required Level:</span>
          <p className="font-semibold text-slate-700 dark:text-zinc-300 mt-0.5">{task.humanMetadata.contributorLevelRequired || 1}</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400">Daily Limits:</span>
          <p className="font-semibold text-slate-700 dark:text-zinc-300 mt-0.5">{task.humanMetadata.maxDailyAttemptsPerUser || 'Unlimited'}</p>
        </div>
      </div>
    </div>
  );
}

export function TaskPreview({ task }: { task: Task }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 dark:bg-[#09090b] dark:border-zinc-800 space-y-4" id="task-workspace-preview-bento">
      <TaskRewardCard coins={task.rewardCoins} />
      <TaskRequirements accuracy={task.requiredAccuracy} trustScore={task.requiredTrustScore} />
      <TaskMetadataPanel task={task} />
    </div>
  );
}

export function TaskFooter({ 
  onSubmit, 
  disabled, 
  id 
}: { 
  onSubmit: () => void; 
  disabled: boolean; 
  id: string;
}) {
  return (
    <div className="pt-4 border-t border-slate-150 dark:border-zinc-850 flex justify-between items-center text-xs" id="task-workspace-footer">
      <span className="font-mono text-slate-400">ID: {id}</span>
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 disabled:opacity-40 transition-all cursor-pointer shadow-sm text-xs"
      >
        <span>Verify & Submit</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ==========================================
// 5. THE COMPLETE INTERACTIVE TASK DETAIL
// ==========================================

export function TaskDetail() {
  return <TaskPlayerShell />;
}

function OldTaskDetail() {
  const { activeTask, submitTask, driveAttachMock } = useTasks();
  const [rlhfChoice, setRlhfChoice] = useState<'A' | 'B' | null>(null);
  const [safetyChoice, setSafetyChoice] = useState<'safe' | 'toxic' | null>(null);
  const [translationRating, setTranslationRating] = useState<'perfect' | 'literal' | 'bad' | null>(null);
  const [voiceMosRating, setVoiceMosRating] = useState<number | null>(null);
  const [generalComment, setGeneralComment] = useState('');

  const startTimeRef = useRef<number>(Date.now());

  // Reset answer states upon selecting a different active task
  useEffect(() => {
    setRlhfChoice(null);
    setSafetyChoice(null);
    setTranslationRating(null);
    setVoiceMosRating(null);
    setGeneralComment('');
    startTimeRef.current = Date.now();
  }, [activeTask]);

  if (!activeTask) {
    return <TaskEmptyState />;
  }

  const handleCommitSubmission = async () => {
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const responsePayload: Record<string, any> = {
      comment: generalComment
    };

    if (activeTask.category === 'AI Response Comparison') responsePayload.selection = rlhfChoice;
    if (activeTask.category === 'Image Safety Review') responsePayload.safetyClassification = safetyChoice;
    if (activeTask.category === 'Translation Review') responsePayload.rating = translationRating;
    if (activeTask.category === 'Voice Quality Rating') responsePayload.mosRating = voiceMosRating;

    await submitTask(responsePayload, elapsedSeconds);
  };

  const isFormValid = () => {
    if (activeTask.category === 'AI Response Comparison') return rlhfChoice !== null;
    if (activeTask.category === 'Image Safety Review') return safetyChoice !== null;
    if (activeTask.category === 'Translation Review') return translationRating !== null;
    if (activeTask.category === 'Voice Quality Rating') return voiceMosRating !== null;
    return true;
  };

  // Mock linking a Google Drive file reference attachment
  const handleDriveAttach = async () => {
    const mockFile = {
      id: `drive_f_${Math.random().toString(36).substr(2, 6)}`,
      name: `audited_results_report_${Math.random().toString(36).substr(2, 4)}.pdf`,
      mimeType: 'application/pdf',
      sizeBytes: 1024 * 342,
      webViewLink: 'https://drive.google.com/drive/folders/12345'
    };
    await driveAttachMock(mockFile);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 dark:bg-[#09090b] dark:border-zinc-800/80 p-6 space-y-6 flex flex-col justify-between" id="task-workspace-workspace">
      <div className="space-y-6">
        <TaskHeader task={activeTask} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <TaskInstructionPanel instructions={activeTask.instructions} />

            {/* DYNAMIC PLAYER WORKSPACE BOX */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-150 dark:bg-zinc-950/20 dark:border-zinc-850">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-indigo-400 block mb-4">Verification Input</span>

              {/* Type 1: RLHF Model Selection */}
              {activeTask.category === 'AI Response Comparison' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Target Prompt:</span>
                    <blockquote className="text-xs font-semibold text-slate-700 bg-white p-3 rounded-lg border border-slate-150 leading-relaxed dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800">
                      "{activeTask.metadata.prompt || 'Explain quantum tunneling simply.'}"
                    </blockquote>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Response A */}
                    <button
                      onClick={() => setRlhfChoice('A')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                        rlhfChoice === 'A'
                          ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">Response Alpha</span>
                        {rlhfChoice === 'A' && <Check className="h-4 w-4 text-indigo-400" />}
                      </div>
                      <p className="text-xs leading-relaxed font-sans font-light">
                        Quantum tunneling occurs when a microscopic particle crosses an energy barrier that classical physics claims is impossible to scale. Think of a bouncing ball magically passing through a brick wall without damaging either. Since microscopic particles behave like waves, their probability density bleeds slightly through walls.
                      </p>
                    </button>

                    {/* Response B */}
                    <button
                      onClick={() => setRlhfChoice('B')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                        rlhfChoice === 'B'
                          ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">Response Beta</span>
                        {rlhfChoice === 'B' && <Check className="h-4 w-4 text-indigo-400" />}
                      </div>
                      <p className="text-xs leading-relaxed font-sans font-light">
                        Quantum physics says that light and particles are the same. Because of the uncertainty principle, we can never know where an electron is. Therefore, it is always at all locations at the exact same time. This is why it can easily walk through barriers like they do not exist.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Type 2: Image Safety Review */}
              {activeTask.category === 'Image Safety Review' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Simulation Output:</span>
                    <div className="relative rounded-lg overflow-hidden border border-slate-250 aspect-video bg-slate-100 dark:border-zinc-800">
                      <img 
                        src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
                        alt="Simulated Autonomous Vehicle rendering"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 rounded text-[10px] font-mono text-white">AV-Sim-99 / CAM_REAR_0</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Safety Classification:</span>
                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                      <button
                        onClick={() => setSafetyChoice('safe')}
                        className={`p-3.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          safetyChoice === 'safe'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800'
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Safe / Normal Output</span>
                      </button>
                      <button
                        onClick={() => setSafetyChoice('toxic')}
                        className={`p-3.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          safetyChoice === 'toxic'
                            ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                            : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800'
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span>Clipping Glitch/Flagged</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Type 3: Translation Review */}
              {activeTask.category === 'Translation Review' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">English Original:</span>
                      <blockquote className="text-xs font-semibold text-slate-700 bg-white p-3 rounded-lg border border-slate-150 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 mt-1">
                        "The project amortization yield curve showed a highly volatile trend."
                      </blockquote>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-500">Model Translation:</span>
                      <blockquote className="text-xs font-medium text-slate-700 bg-white p-3 rounded-lg border border-slate-150 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 mt-1">
                        "La curva de rendimiento de amortización del proyecto mostró una tendencia muy volátil."
                      </blockquote>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Localization Quality:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['perfect', 'literal', 'bad'].map(val => (
                        <button
                          key={val}
                          onClick={() => setTranslationRating(val as any)}
                          className={`p-2.5 rounded-lg border text-center capitalize transition-all cursor-pointer ${
                            translationRating === val
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold'
                              : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Type 4: Voice Quality Rating */}
              {activeTask.category === 'Voice Quality Rating' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Acoustic Audio Clip:</span>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3 dark:bg-zinc-900 dark:border-zinc-800">
                      <audio controls className="w-full">
                        <source src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg" type="audio/ogg" />
                        Your browser does not support audio playback.
                      </audio>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-400">Acoustic MOS (Mean Opinion Score):</span>
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          onClick={() => setVoiceMosRating(val)}
                          className={`flex-1 p-2 rounded-lg border text-center transition-all cursor-pointer ${
                            voiceMosRating === val
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold'
                              : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                          }`}
                        >
                          {val} ★
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
                      <span>1: Heavy Distortion</span>
                      <span>5: Studio Perfect</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Justification Box */}
              <div className="mt-4 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400">Justification comment (Optional):</span>
                <textarea 
                  rows={2}
                  placeholder="Justify your alignment feedback to help train downstream models..."
                  value={generalComment}
                  onChange={e => setGeneralComment(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-zinc-900 dark:border-zinc-800 text-slate-800 dark:text-white"
                />
              </div>

            </div>

            <TaskAttachments attachments={activeTask.attachments} onAttachMock={handleDriveAttach} />
          </div>

          <div className="lg:col-span-1">
            <TaskPreview task={activeTask} />
          </div>
        </div>
      </div>

      <TaskFooter 
        onSubmit={handleCommitSubmission}
        disabled={!isFormValid()}
        id={activeTask.id}
      />
    </div>
  );
}
