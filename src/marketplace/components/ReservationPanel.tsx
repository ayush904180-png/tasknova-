/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMarketplace } from '../context/MarketplaceContext';
import { Clock, Shield, Award, AlertTriangle, ArrowRight, Hourglass, Trash2 } from 'lucide-react';
import { formatCountdown } from '../utils/marketplaceUtils';

interface ReservationPanelProps {
  onSelectTask: (taskId: string) => void;
}

export function ReservationPanel({ onSelectTask }: ReservationPanelProps) {
  const { reservations, allTasks, releaseReservation } = useMarketplace();

  const activeReservations = reservations.filter(res => res.status === 'Active');

  return (
    <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Hourglass className="w-3.5 h-3.5 text-purple-400" />
          Active Reservations ({activeReservations.length}/3)
        </h3>
        
        {activeReservations.length > 0 && (
          <span className="text-[9px] font-mono text-amber-400 animate-pulse bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            Lease locks active
          </span>
        )}
      </div>

      {activeReservations.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center italic">
          No active task reservations. Select a campaign from the grid to lock a workspace.
        </p>
      ) : (
        <div className="space-y-2">
          {activeReservations.map(res => {
            const task = allTasks.find(t => t.id === res.taskId);
            if (!task) return null;

            const isUrgent = res.timeRemainingSeconds < 300; // Under 5 minutes

            return (
              <div 
                key={res.id}
                className={`p-3 rounded-lg border transition-all ${
                  isUrgent 
                    ? 'bg-red-500/[0.02] border-red-500/30' 
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] font-mono text-purple-400 font-bold block">
                      {task.id}
                    </span>
                    <span 
                      onClick={() => onSelectTask(task.id)}
                      className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer hover:underline block truncate"
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Timer */}
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                    isUrgent ? 'bg-red-500/10 text-red-400 animate-pulse' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatCountdown(res.timeRemainingSeconds)}</span>
                  </div>
                </div>

                {isUrgent && (
                  <div className="mt-2 flex items-center text-[9px] font-mono text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    <span>Critical threshold! Task release imminent.</span>
                  </div>
                )}

                <div className="mt-2.5 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[10px]">
                  <button
                    onClick={() => releaseReservation(res.id)}
                    className="text-slate-500 hover:text-red-400 font-mono flex items-center gap-0.5 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Release</span>
                  </button>

                  <button
                    onClick={() => onSelectTask(task.id)}
                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-0.5 transition-colors"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
