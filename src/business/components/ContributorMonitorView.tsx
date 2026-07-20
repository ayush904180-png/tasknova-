/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Award, ShieldAlert, CheckCircle, Search, 
  Ban, ShieldCheck, Zap, Globe, AlertCircle, TrendingUp 
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { ContributorMonitorStats } from '../types';

export const ContributorMonitorView: React.FC = () => {
  const { contributors } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeContributors, setActiveContributors] = useState<ContributorMonitorStats[]>(contributors);

  const handleToggleSuspend = (id: string) => {
    setActiveContributors((prev) => 
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'suspended' ? 'active' : 'suspended';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const filtered = activeContributors.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and filters header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
            <Users className="h-4 w-4 text-indigo-400" />
            Active Contributor Demographics
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time status of distributed human annotators validating active projects.</p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search by name/country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-slate-200 dark:border-white/5 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white rounded focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] p-2 rounded text-indigo-400"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Table List of annotators */}
        <div className="lg:col-span-8 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Annotator Name</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Trust Score</th>
                  <th className="py-2.5 px-3">Speed (tasks/hr)</th>
                  <th className="py-2.5 px-3">Active Pipeline</th>
                  <th className="py-2.5 px-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const isActive = c.status === 'active';
                  const isSuspended = c.status === 'suspended';

                  return (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/1 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-300">{c.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{c.country} • {c.language}</p>
                        </div>
                      </td>
                      <td className={`py-3 px-3 font-mono font-bold ${c.accuracy > 95 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {c.accuracy}%
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{c.trustScore}%</td>
                      <td className="py-3 px-3 text-slate-400 font-mono flex items-center gap-1 pt-4">
                        <Zap className="h-3 w-3 text-amber-500" />
                        {c.speed}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {c.activeTask}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleSuspend(c.id)}
                          className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                            isSuspended 
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          }`}
                        >
                          {isSuspended ? 'Whitelist' : 'Block Node'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Leaderboards & spam alerts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quality Leaderboard card */}
          <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold font-display text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              Accuracy Leaderboard
            </h4>

            <div className="space-y-3">
              {activeContributors
                .sort((a, b) => b.accuracy - a.accuracy)
                .slice(0, 3)
                .map((user, idx) => (
                  <div key={user.id} className="p-2.5 bg-[#030303]/40 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400">#{idx + 1}</span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-300">{user.name}</p>
                        <p className="text-[10px] text-slate-500">Tasks: {user.completedCount}</p>
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{user.accuracy}%</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Spam detection honey pot log */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-500 mt-0.5 flex-shrink-0 animate-pulse" />
              <div>
                <p className="font-bold text-rose-400">Spam Trapping Active</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  Anti-spam automated filters flagged node <strong className="text-rose-400">Hans Schmidt</strong> (Germany) for speed outliers (180 tasks/hr). High probability of click-farm automation / adversarial bypass attempts.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
