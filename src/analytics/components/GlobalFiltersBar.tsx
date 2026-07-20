/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { COUNTRIES, LANGUAGES, CAMPAIGNS, BUSINESSES } from '../constants';
import { Search, SlidersHorizontal, Calendar, RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AnalyticsRole } from '../types';

export const GlobalFiltersBar: React.FC = () => {
  const {
    filters,
    setFilters,
    rbacRole,
    setRbacRole,
    searchQuery,
    setSearchQuery,
    userPermissions
  } = useAnalytics();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateChange = (start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { startDate: start, endDate: end }
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: { startDate: '2026-06-20', endDate: '2026-07-20' },
      country: 'ALL',
      language: 'ALL',
      campaign: 'ALL',
      business: 'ALL',
      contributor: 'ALL',
      validationStatus: 'ALL',
      rewardType: 'ALL',
      marketplace: 'ALL'
    });
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-4 shadow-xl" id="global-filters-bar">
      {/* Top Bar: Search, Role Selection, Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Ctrl+K Unified Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports, metrics, campaigns, wallets... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* RBAC Role Selector + Reset Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/40 border border-white/5 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-slate-400 font-medium">Access Node:</span>
            <select
              value={rbacRole}
              onChange={(e) => setRbacRole(e.target.value as AnalyticsRole)}
              className="bg-transparent border-none text-xs font-semibold text-indigo-400 focus:ring-0 cursor-pointer outline-none"
            >
              {Object.values(AnalyticsRole).map(role => (
                <option key={role} value={role} className="bg-slate-950 text-slate-200">
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              showAdvanced 
                ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300' 
                : 'bg-slate-950/40 border-white/5 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>Refine</span>
          </button>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Date Range & Standard Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Date Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-500" /> Date Interval
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-950/60 border border-white/10 rounded-lg p-1">
            <input
              type="date"
              value={filters.dateRange.startDate}
              onChange={(e) => handleDateChange(e.target.value, filters.dateRange.endDate)}
              className="bg-transparent text-[11px] text-slate-300 outline-none w-full border-none focus:ring-0 cursor-pointer"
            />
            <input
              type="date"
              value={filters.dateRange.endDate}
              onChange={(e) => handleDateChange(filters.dateRange.startDate, e.target.value)}
              className="bg-transparent text-[11px] text-slate-300 outline-none w-full border-none focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Country Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Country node</label>
          <select
            value={filters.country}
            onChange={(e) => updateFilter('country', e.target.value)}
            className="bg-slate-950/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code} className="bg-slate-950 text-slate-300">{c.name}</option>
            ))}
          </select>
        </div>

        {/* Language Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Language corpus</label>
          <select
            value={filters.language}
            onChange={(e) => updateFilter('language', e.target.value)}
            className="bg-slate-950/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} className="bg-slate-950 text-slate-300">{l.name}</option>
            ))}
          </select>
        </div>

        {/* Campaign Selector */}
        <div className="flex flex-col gap-1 col-span-1 md:col-span-2 lg:col-span-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Campaign</label>
          <select
            value={filters.campaign}
            onChange={(e) => updateFilter('campaign', e.target.value)}
            className="bg-slate-950/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {CAMPAIGNS.map(cmp => (
              <option key={cmp.id} value={cmp.id} className="bg-slate-950 text-slate-300">{cmp.name}</option>
            ))}
          </select>
        </div>

        {/* Business Tenant */}
        <div className="flex flex-col gap-1 col-span-2 md:col-span-4 lg:col-span-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Enterprise Account</label>
          <select
            value={filters.business}
            onChange={(e) => updateFilter('business', e.target.value)}
            className="bg-slate-950/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {BUSINESSES.map(b => (
              <option key={b.id} value={b.id} className="bg-slate-950 text-slate-300">{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Drawer Filter Refinement Row */}
      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/30 p-3 rounded-lg border border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Verification status</label>
            <select
              value={filters.validationStatus}
              onChange={(e) => updateFilter('validationStatus', e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Auto-Passed</option>
              <option value="REJECTED">Auto-Rejected</option>
              <option value="ESCALATED">Flagged Escalations</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Reward token class</label>
            <select
              value={filters.rewardType}
              onChange={(e) => updateFilter('rewardType', e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300"
            >
              <option value="ALL">All Currencies</option>
              <option value="COINS">TaskNova Gold Coins</option>
              <option value="XP">Reputation XP Nodes</option>
              <option value="MULTIPLIERS">Boost Multipliers</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Marketplace distribution</label>
            <select
              value={filters.marketplace}
              onChange={(e) => updateFilter('marketplace', e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300"
            >
              <option value="ALL">All Marketplace Pools</option>
              <option value="PUBLIC">Public Micro-Crowd</option>
              <option value="EXCLUSIVE">Enterprise Premium Whitelist</option>
              <option value="NDA">Secure Sandbox Nodes</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span>Real-time Streams Online</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
