/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LEADERBOARD_RANKING } from '../constants';
import { Award, Trophy, ShieldCheck, Zap, Coins, Clock, Star } from 'lucide-react';

export const ContributorAnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6" id="contributor-analytics-dashboard">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Mean Trust Rating', value: '98.4%', change: '+0.4%', icon: <ShieldCheck className="h-4 w-4 text-emerald-400" /> },
          { title: 'Total Distributed Coins', value: '8,420,000', change: '+14.2%', icon: <Coins className="h-4 w-4 text-amber-400" /> },
          { title: 'Total Accumulated XP', value: '24,500,000', change: '+12.8%', icon: <Zap className="h-4 w-4 text-indigo-400" /> },
          { title: 'Mean Session Speed', value: '42s / Task', change: '-5.4%', icon: <Clock className="h-4 w-4 text-cyan-400" /> }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{item.title}</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-slate-200">{item.value}</h3>
                <span className="text-xs text-emerald-400 font-medium">{item.change}</span>
              </div>
            </div>
            <div className="p-2 bg-slate-950/80 rounded-lg border border-white/5">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Table */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Top Crowd Nodes Leaderboard</h3>
              <p className="text-[11px] text-slate-400">Top-performing contributors sorted by reputation XP, gold earnings, and high consensus trust ratings.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 uppercase tracking-wider text-[10px] pb-2 font-semibold">
                  <th className="pb-3 text-center">Rank</th>
                  <th className="pb-3">Username Node</th>
                  <th className="pb-3 text-right">Reputation XP</th>
                  <th className="pb-3 text-right">Gold Coins</th>
                  <th className="pb-3 text-right">Trust Score</th>
                  <th className="pb-3 text-right">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {LEADERBOARD_RANKING.map((contributor) => (
                  <tr key={contributor.rank} className="hover:bg-slate-950/30 transition-colors">
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold ${
                        contributor.rank === 1 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : contributor.rank === 2 
                            ? 'bg-slate-300/10 text-slate-300 border border-slate-300/20' 
                            : contributor.rank === 3 
                              ? 'bg-amber-700/10 text-amber-700 border border-amber-700/20' 
                              : 'bg-slate-950/80 text-slate-400'
                      }`}>
                        {contributor.rank}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-slate-300">@{contributor.name}</td>
                    <td className="py-3 text-right text-slate-400 font-mono">{contributor.xp.toLocaleString()} XP</td>
                    <td className="py-3 text-right text-amber-400 font-mono font-semibold">{contributor.coins.toLocaleString()} Coins</td>
                    <td className="py-3 text-right text-indigo-400 font-semibold">{contributor.trust}%</td>
                    <td className="py-3 text-right text-slate-500 font-semibold">{contributor.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Level Distribution Widget */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Worker Tiers Distribution</h3>
          </div>
          <div className="space-y-4 pt-2">
            {[
              { tier: 'Tier 1: Apprentice (New Nodes)', count: '8,450 workers', percent: 46.3, color: 'bg-slate-400' },
              { tier: 'Tier 2: Elite (Passed Gold Criteria)', count: '6,200 workers', percent: 34.0, color: 'bg-indigo-500' },
              { tier: 'Tier 3: Master (Audit Privileges)', count: '2,680 workers', percent: 14.7, color: 'bg-cyan-500' },
              { tier: 'Tier 4: Moderator Node (Top 1%)', count: '900 workers', percent: 5.0, color: 'bg-amber-500' }
            ].map((level, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{level.tier}</span>
                  <span className="text-slate-400">{level.percent}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${level.color} rounded-full`} style={{ width: `${level.percent}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 text-right">{level.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
