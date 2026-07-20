/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMarketplace } from '../context/MarketplaceContext';
import { Terminal, RefreshCw, Radio } from 'lucide-react';

export function ActivityFeed() {
  const { activityFeed, syncOfflineQueue, isOnline } = useMarketplace();

  return (
    <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          Real-time Event Bus Audit
        </h3>

        <div className="flex items-center space-x-2">
          {/* Online indicator */}
          <div className="flex items-center gap-1 font-mono text-[9px]">
            <Radio className={`w-3 h-3 ${isOnline ? 'text-teal-400 animate-pulse' : 'text-rose-500'}`} />
            <span className={isOnline ? 'text-teal-400' : 'text-rose-400'}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          <button
            onClick={syncOfflineQueue}
            disabled={!isOnline}
            className="p-1 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-500 hover:text-slate-300 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Force Sync Offline Mutation Cache"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-[10px] text-slate-400 scrollbar-thin">
        {activityFeed.length === 0 ? (
          <p className="text-slate-500 italic py-2">Listening to telemetry channels...</p>
        ) : (
          activityFeed.map((activity, idx) => (
            <div 
              key={idx} 
              className={`py-1 border-b border-slate-950/60 last:border-0 ${
                activity.includes('🔴') 
                  ? 'text-red-400/90' 
                  : activity.includes('🎉') 
                    ? 'text-teal-400/90 font-semibold' 
                    : 'text-slate-400'
              }`}
            >
              {activity}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
