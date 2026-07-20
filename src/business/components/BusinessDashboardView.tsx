/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Users, ShieldCheck, Clock, Layers, AlertCircle, 
  HelpCircle, DollarSign, ArrowUpRight, CheckCircle, Flame, Globe2, 
  Calendar, Shield, RefreshCw
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { AnalyticsEngine } from '../analytics/AnalyticsEngine';

export const BusinessDashboardView: React.FC = () => {
  const { campaigns, billingSummary, auditLogs, currentRole } = useBusiness();
  const [chartTimeframe, setChartTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [activeGeoFilter, setActiveGeoFilter] = useState<'country' | 'language' | 'device'>('country');

  // Compute stats aggregates based on campaigns
  const activeCampaignsCount = campaigns.filter(c => c.status === 'published').length;
  const draftCampaignsCount = campaigns.filter(c => c.status === 'draft').length;
  
  // Realtime analytics point fetch
  const chartData = AnalyticsEngine.getBudgetVelocity(chartTimeframe);
  const countryDist = AnalyticsEngine.getCountryDistribution();
  const langDist = AnalyticsEngine.getLanguageDistribution();
  const deviceDist = AnalyticsEngine.getDeviceDistribution();

  const activeDist = 
    activeGeoFilter === 'country' ? countryDist : 
    activeGeoFilter === 'language' ? langDist : deviceDist;

  const maxVal = Math.max(...chartData.map(d => d.value));

  return (
    <div className="space-y-6">
      
      {/* Executive Overview KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Coins Remaining</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
              {(billingSummary?.creditBalance || 0).toLocaleString()}
            </h3>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="h-3 w-3" />
              SaaS Credit Pool Active
            </p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Campaign Status</span>
            <Layers className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
              {activeCampaignsCount} Active
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <span>{draftCampaignsCount} drafts awaiting review</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Platform Accuracy</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
              95.68%
            </h3>
            <p className="text-[10px] text-emerald-400 mt-1 font-mono">
              +0.24% above SLA target
            </p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Avg Response Time</span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
              34.8s
            </h3>
            <p className="text-[10px] text-indigo-400 mt-1 font-mono">
              Live feedback latency
            </p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 col-span-2 lg:col-span-1 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Budget Spent</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
              {((billingSummary?.spentBudget || 0) / 1000).toFixed(0)}k Coins
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Burn rate: {billingSummary ? (billingSummary.spentBudget / 5.2).toFixed(0) : '0'} coins/hr
            </p>
          </div>
        </div>

      </div>

      {/* Main Analytical Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Section: Realtime charts */}
        <div className="lg:col-span-8 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                Budget Velocity & Outbound Disbursements
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time aggregate consumption statistics across core pipelines.</p>
            </div>

            <div className="flex gap-1.5 self-start">
              {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase rounded border transition-all cursor-pointer ${
                    chartTimeframe === tf
                      ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-400'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Premium custom SVG chart area */}
          <div className="relative h-60 w-full flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-white/5 w-full h-0" />
              <div className="border-b border-white/5 w-full h-0" />
              <div className="border-b border-white/5 w-full h-0" />
              <div className="border-b border-white/5 w-full h-0" />
            </div>

            {/* Custom SVG Line and Fill Graphic */}
            <div className="flex-1 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                  </linearGradient>
                </defs>
                
                {/* Generate Area Paths dynamically */}
                <path
                  d={`M 0,200 ${chartData.map((d, idx) => {
                    const x = (idx / (chartData.length - 1)) * 600;
                    const y = 200 - (d.value / maxVal) * 160;
                    return `L ${x},${y}`;
                  }).join(' ')} L 600,200 Z`}
                  fill="url(#chart-grad)"
                />

                {/* Generate stroke line */}
                <path
                  d={chartData.map((d, idx) => {
                    const x = (idx / (chartData.length - 1)) * 600;
                    const y = 200 - (d.value / maxVal) * 160;
                    return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Generate dot values */}
                {chartData.map((d, idx) => {
                  const x = (idx / (chartData.length - 1)) * 600;
                  const y = 200 - (d.value / maxVal) * 160;
                  return (
                    <g key={idx} className="group/dot cursor-pointer">
                      <circle cx={x} cy={y} r="4" fill="#6366f1" className="hover:r-6 hover:fill-white transition-all" />
                      <circle cx={x} cy={y} r="10" fill="#6366f1" fillOpacity="0" className="hover:fillOpacity-1" />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Overlay Floating Details Hover Simulation */}
              <div className="absolute top-2 left-4 bg-[#09090b] border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-mono text-slate-400">
                Max Peak: <span className="text-indigo-400 font-bold">{maxVal.toLocaleString()} Coins</span>
              </div>
            </div>

            {/* X-Axis labels */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5">
              {chartData.map((d, idx) => (
                <span key={idx}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Demographics and Distributions */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4 text-indigo-400" />
                  Demographic Heatmap
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Contributor location ratios.</p>
              </div>

              <select
                value={activeGeoFilter}
                onChange={(e) => setActiveGeoFilter(e.target.value as any)}
                className="bg-white/5 border border-white/5 text-[9px] font-mono uppercase p-1.5 rounded text-indigo-400 focus:outline-none"
              >
                <option value="country">Country</option>
                <option value="language">Language</option>
                <option value="device">Devices</option>
              </select>
            </div>

            <div className="space-y-2.5">
              {activeDist.map((d, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>{d.name}</span>
                    <span className="text-slate-500">{d.value.toLocaleString()} ({d.percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Compliance Monitor Widget */}
          <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <div className="border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-400" />
                Active SLA Compliance Tracker
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time enterprise-grade contract compliance scanning.</p>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              {[
                { name: 'Review Accuracy Target', target: '95.0%', actual: '95.68%', status: 'compliant', color: 'text-emerald-400' },
                { name: 'Consensus Overlap Latency', target: '< 60.0s', actual: '34.8s', status: 'compliant', color: 'text-emerald-400' },
                { name: 'Audit Fraud Rejection Ratio', target: '> 2.0%', actual: '4.82%', status: 'compliant', color: 'text-emerald-400' },
                { name: 'Task Settlement Time', target: '< 5.0m', actual: '4.12m', status: 'compliant', color: 'text-emerald-400' },
                { name: 'Anchor Consensus Overlap', target: '3x redundant', actual: '3.4x average', status: 'warning', color: 'text-amber-400' }
              ].map((sla, idx) => (
                <div key={idx} className="border-b border-slate-200 dark:border-white/5 pb-1.5 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">{sla.name}</span>
                    <span className={`font-bold uppercase tracking-wide text-[9px] px-1 bg-white/5 border border-white/5 rounded ${sla.color}`}>
                      {sla.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Target: {sla.target}</span>
                    <span className="text-slate-900 dark:text-slate-300 font-bold">Actual: {sla.actual}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 text-[10px] text-rose-400 leading-relaxed font-mono flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase">SLA Alert Triggered</p>
                <p className="text-slate-400 mt-0.5">SLA warning triggered: 12 high-velocity nodes in region IND-4 have breached the average consensus overlap limit.</p>
              </div>
            </div>
          </div>

          {/* Billing warning alert */}
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-xs text-amber-400">
            <Shield className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="font-semibold">Compliance Audit Notification</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Platform is currently operational in <strong className="text-amber-400">Compliance Tier 2 (GST Ready)</strong>. Standard monthly invoices are automatically synchronized with the TaskNova compliance database.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Live System Action Audit Logs (Bottom Grid) */}
      <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-400" />
              Live Workspace Action Logs (Signed Trials)
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Chronological immutable security log chain tracking all active mutations.</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-2.5 rounded-lg bg-white/1 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-0.5 flex-shrink-0">
                  {log.action}
                </span>
                <div>
                  <p className="text-slate-900 dark:text-slate-300 font-sans">{log.details}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Operator: {log.userEmail}</span>
                    <span>•</span>
                    <span>IP: {log.ipAddress}</span>
                  </p>
                </div>
              </div>
              
              <div className="text-[10px] text-right font-mono text-slate-500 flex-shrink-0">
                <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                <p className="text-[8px] text-indigo-400 truncate max-w-[150px]" title={log.signature}>
                  {log.signature.substr(0, 18)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
