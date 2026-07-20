/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMarketplace } from '../context/MarketplaceContext';
import { Bookmark, EyeOff, ShieldCheck, HelpCircle, Star, Sparkles, FolderX, Check } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface FavoritesViewProps {
  onSelectTask: (taskId: string) => void;
}

export function FavoritesView({ onSelectTask }: FavoritesViewProps) {
  const { 
    allTasks, 
    preferences, 
    toggleBookmark, 
    toggleIgnoreCategory, 
    toggleFavoriteBusiness 
  } = useMarketplace();

  if (!preferences) return null;

  // Filter bookmarked tasks
  const bookmarkedTasks = allTasks.filter(t => preferences.bookmarkedTaskIds.includes(t.id));

  // Dynamic extracted categories to let users toggle ignore states
  const availableCategories = ['AI Response Comparison', 'Image Safety Review', 'Translation Review', 'Semantic Tagging', 'Data Annotation', 'Prompt Engineering'];
  
  // Dynamic list of business campaign creators
  const availableBusinesses = ['campaign_quantum', 'campaign_av_safety', 'campaign_es_audit', 'sys_admin', 'av_simulations_corp'];

  return (
    <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm space-y-4">
      {/* 1. Bookmarks */}
      <div>
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/15" />
          Saved Bookmarks ({bookmarkedTasks.length})
        </h3>

        {bookmarkedTasks.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic py-2">
            No bookmarked tasks. Press the bookmark icon on any campaign.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {bookmarkedTasks.map(task => (
              <div 
                key={`fav_${task.id}`}
                className="bg-slate-950/40 border border-slate-900 rounded p-2 flex items-center justify-between text-xs"
              >
                <div 
                  onClick={() => onSelectTask(task.id)}
                  className="truncate font-medium text-slate-300 hover:text-white cursor-pointer hover:underline"
                >
                  {task.title}
                </div>
                <button
                  onClick={() => toggleBookmark(task.id)}
                  className="text-amber-400 hover:text-slate-500 font-mono text-[10px]"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Ignored Categories */}
      <div className="border-t border-slate-800/60 pt-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FolderX className="w-3.5 h-3.5 text-red-400" />
          Category Filters (Ignored: {preferences.ignoredCategories.length})
        </h3>
        <p className="text-[10px] text-slate-500 mb-2">Toggle categories to hide them entirely from your marketplace search feed.</p>
        <div className="flex flex-wrap gap-1">
          {availableCategories.map(cat => {
            const isIgnored = preferences.ignoredCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleIgnoreCategory(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                  isIgnored 
                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                    : 'bg-slate-950 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-slate-300'
                }`}
              >
                {isIgnored ? `Ignored: ${cat}` : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Favorite Businesses */}
      <div className="border-t border-slate-800/60 pt-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          Favored Sponsors ({preferences.favoriteBusinesses.length})
        </h3>
        <div className="flex flex-wrap gap-1">
          {availableBusinesses.map(biz => {
            const isFav = preferences.favoriteBusinesses.includes(biz);
            return (
              <button
                key={biz}
                onClick={() => toggleFavoriteBusiness(biz)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all flex items-center gap-1 ${
                  isFav 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold' 
                    : 'bg-slate-950 text-slate-400 border-slate-900 hover:border-slate-800'
                }`}
              >
                {isFav && <Check className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
                <span>{biz}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
