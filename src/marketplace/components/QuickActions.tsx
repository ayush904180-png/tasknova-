/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Wrench, RefreshCw, Power, AlertCircle, Trash2, 
  Sparkles, ShieldAlert, Cpu, Heart 
} from 'lucide-react';
import { GlobalReservationService } from '../services/ReservationService';

export function QuickActions() {
  const { 
    isOnline, 
    syncOfflineQueue, 
    resetProfile, 
    profile, 
    setFilters 
  } = useMarketplace();

  const handleSimulateExpiredLease = () => {
    // Modify active reservations locally to set them expired immediately
    const res = GlobalReservationService.getReservations();
    const updated = res.map(item => {
      if (item.status === 'Active') {
        item.expiresAt = new Date(Date.now() - 1000).toISOString(); // Backdate
      }
      return item;
    });
    localStorage.setItem('tasknova_reservations_db', JSON.stringify(updated));
    // Trigger tick
    GlobalReservationService.evaluateExpirations();
  };

  const handleLevelUpMock = () => {
    if (!profile) return;
    const updated = { ...profile };
    updated.xpProgress = updated.xpRequiredForNextLevel;
    updated.totalCoins = (updated.totalCoins || 0) + 100;
    updated.coinsEarnedToday += 100;
    // Save
    localStorage.setItem('tasknova_contributor_profile', JSON.stringify(updated));
    window.location.reload();
  };

  const handleAddCustomSkills = () => {
    if (!profile) return;
    const updated = { ...profile };
    updated.skills = [...new Set([...updated.skills, 'Quantum Mechanics', 'Autonomous Cars', 'Financial Terminology', 'Safety'])];
    updated.trustScore = Math.min(100, updated.trustScore + 3);
    updated.accuracy = Math.min(100, updated.accuracy + 2);
    localStorage.setItem('tasknova_contributor_profile', JSON.stringify(updated));
    window.location.reload();
  };

  return (
    <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm space-y-3">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
        <Wrench className="w-3.5 h-3.5 text-purple-400" />
        SaaS Sandbox Controller
      </h3>

      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
        {/* Toggle offline simulation */}
        <div className="col-span-2 bg-slate-950/60 p-2.5 rounded border border-slate-900 text-slate-400">
          <span className="block mb-1.5 font-semibold text-slate-300">Offline Queue Testing</span>
          <p className="text-[9px] text-slate-500 leading-normal mb-2">
            Disconnecting network simulates local SQLite/indexed buffers, queueing reservations and syncing on recovery.
          </p>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Mock Mode:</span>
            <span className={isOnline ? 'text-teal-400' : 'text-red-400'}>
              {isOnline ? 'Network Connected' : 'Network Disconnected'}
            </span>
          </div>
        </div>

        {/* Action Triggers */}
        <button
          onClick={handleSimulateExpiredLease}
          className="p-2 bg-slate-950/40 hover:bg-slate-900/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded flex flex-col items-center justify-center text-center transition-colors"
          title="Simulate Expiration"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400/80 mb-1" />
          <span>Expire Leases</span>
        </button>

        <button
          onClick={syncOfflineQueue}
          disabled={!isOnline}
          className="p-2 bg-slate-950/40 hover:bg-slate-900/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded flex flex-col items-center justify-center text-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Sync Pending Tasks"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400/80 mb-1" />
          <span>Force Sync Queue</span>
        </button>

        <button
          onClick={handleLevelUpMock}
          className="p-2 bg-slate-950/40 hover:bg-slate-900/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded flex flex-col items-center justify-center text-center transition-colors"
          title="Recalibrate Stats"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400/80 mb-1" />
          <span>Mock Level Up</span>
        </button>

        <button
          onClick={handleAddCustomSkills}
          className="p-2 bg-slate-950/40 hover:bg-slate-900/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded flex flex-col items-center justify-center text-center transition-colors"
          title="Acquire verified skillset matching key microtasks"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400/80 mb-1" />
          <span>Inject Skills</span>
        </button>

        <button
          onClick={resetProfile}
          className="col-span-2 p-2 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-400 rounded flex items-center justify-center gap-1.5 transition-colors font-bold"
          title="Reset preferences and tasks caches"
        >
          <Trash2 className="w-3.5 h-3.5 shrink-0" />
          <span>Reset All Profile Caches</span>
        </button>
      </div>
    </div>
  );
}
