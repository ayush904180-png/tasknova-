/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Activity, ShieldAlert, Cpu, Sparkles, AlertCircle } from 'lucide-react';

export const LiveTelemetryStream: React.FC = () => {
  const { liveEvents } = useAnalytics();

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'task':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'submission':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'validation':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'reward':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'wallet':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'marketplace':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'billing':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'admin':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-white/5';
    }
  };

  const getRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    return `${Math.floor(diffSecs / 60)}m ago`;
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg" id="live-telemetry-stream">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Real-Time Ingress Telemetry</h3>
            <p className="text-[11px] text-slate-400">Live transaction streaming payload ledger.</p>
          </div>
        </div>
        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
          ● Live Link Connected
        </span>
      </div>

      {/* Events Stream Loop */}
      <div className="h-[300px] overflow-y-auto space-y-2 pr-1 select-none font-mono scrollbar-thin">
        {liveEvents.slice(0, 15).map((evt) => (
          <div 
            key={evt.id} 
            className="p-3 bg-slate-950/60 border border-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] hover:border-white/10 transition-colors animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div className="flex items-center gap-2.5">
              <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${getEventBadgeColor(evt.type)}`}>
                {evt.type}
              </span>
              <span className="text-slate-300 leading-normal">{evt.message}</span>
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 text-slate-500 text-[10px]">
              {evt.user && <span className="text-indigo-400 font-semibold font-sans">{evt.user}</span>}
              <span>{getRelativeTime(evt.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
