/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Coins, Award, Flame, Trophy, Shield, CheckCircle2, 
  Hourglass, AlertCircle, Sparkles, TrendingUp 
} from 'lucide-react';

export function LiveStatistics() {
  const { profile, reservations } = useMarketplace();

  if (!profile) return null;

  const activeReservationsCount = reservations.filter(r => r.status === 'Active').length;
  
  // Calculate historical approval rate
  const totalSubmissions = profile.taskHistory.completedCount;
  const approvalRate = totalSubmissions > 0
    ? Math.round((profile.taskHistory.approvedCount / totalSubmissions) * 100)
    : 100;

  // XP level percentage calculation
  const xpPercent = Math.min(100, Math.round((profile.xpProgress / profile.xpRequiredForNextLevel) * 100));

  return (
    <div id="contributor-statistics-panel" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Trust & Accuracy Core Badge */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all duration-500" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Security Cleared</span>
          <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold tracking-tight text-white">{profile.trustScore}</span>
            <span className="text-sm font-semibold text-teal-400">%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Trust Score Level</p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">Accuracy:</span>
          <span className="text-emerald-400 font-bold">{profile.accuracy}%</span>
        </div>
      </div>

      {/* 2. Coins & Work Value */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Earnings Hub</span>
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold tracking-tight text-white">{profile.coinsEarnedToday}</span>
            <span className="text-xs font-mono text-amber-400 uppercase">Coins Today</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Cumulative Today</p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">All-time:</span>
          <span className="text-amber-400 font-bold">{profile.totalCoins || profile.coinsEarnedToday + 350}</span>
        </div>
      </div>

      {/* 3. XP Level & Rank Progress */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group md:col-span-2 lg:col-span-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-500" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Calibration Level</span>
          <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-white">Tier {profile.level}</span>
            <span className="text-xs text-purple-400">({profile.xpProgress} XP)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">Next Level:</span>
          <span className="text-slate-300 font-medium">{profile.xpRequiredForNextLevel - profile.xpProgress} XP to Level {profile.level + 1}</span>
        </div>
      </div>

      {/* 4. Active Stream Validation Queue */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all duration-500" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Validation Sync</span>
          <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
            <Hourglass className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold tracking-tight text-white">{profile.pendingValidationCount}</span>
            <span className="text-xs text-sky-400 font-mono uppercase">Pending</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Consensus Calculations</p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">Approved:</span>
          <span className="text-emerald-400 font-bold">{approvalRate}% rate</span>
        </div>
      </div>

      {/* 5. Rank and Streaks */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all duration-500" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Global Nodes</span>
          <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold tracking-tight text-white">#{profile.leaderboardRank}</span>
            <span className="text-xs text-slate-400 font-mono">Rank</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Platform Position</p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">Daily Streak:</span>
          <span className="text-orange-400 font-bold flex items-center">
            <Flame className="w-3.5 h-3.5 mr-0.5 fill-orange-400/20" />
            {profile.taskHistory.streakDays} Days
          </span>
        </div>
      </div>
    </div>
  );
}
