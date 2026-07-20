/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Database, ShieldCheck, AlertCircle, Zap, TrendingUp, Clock, 
  Globe2, FileSpreadsheet, Sparkles, BarChart3, HelpCircle 
} from 'lucide-react';
import { useDatasets } from '../context/DatasetContext';
import { DatasetAnalytics } from '../analytics/DatasetAnalytics';
import { DatasetMapper } from '../mappers/DatasetMapper';

export const DatasetBentoDashboard: React.FC = () => {
  const { datasets } = useDatasets();
  const summary = DatasetAnalytics.generateSummary(datasets);

  return (
    <div className="space-y-6">
      {/* 4-Column Stat Bento Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Assets */}
        <div className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Total Managed Assets</span>
              <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">{summary.totalDatasets}</h3>
              <p className="text-[10px] text-slate-500 font-mono">{summary.publishedCount} Active Live Nodes</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Database className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Storage Volume */}
        <div className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">GCS Storage Volume</span>
              <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {DatasetMapper.formatBytes(summary.totalStorageBytes)}
              </h3>
              <p className="text-[10px] text-emerald-400 font-mono">100% Replication Integrity</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Global Quality Score */}
        <div className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Global Quality Index</span>
              <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">{summary.averageQualityScore}%</h3>
              <p className="text-[10px] text-purple-400 font-mono">Confidence Level: High</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Security & Bias Risk */}
        <div className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Leak & Bias Risk</span>
              <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">{summary.averageRiskScore}%</h3>
              <p className="text-[10px] text-rose-400 font-mono">SOC-2 Policy Shield Active</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
        </div>

      </div>

      {/* Analytics Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart Section: Quality and Risk Growth Line Graph */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
            <div>
              <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                Enterprise Asset Quality & Risk Chron-Trend
              </h4>
              <p className="text-[10px] text-slate-500">Continuous scans over the last 6 validation sweeps</p>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-mono uppercase">
              <span className="flex items-center gap-1 text-slate-900 dark:text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> Quality
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span> Safety Risk
              </span>
            </div>
          </div>

          {/* Sparkline Graph Chart */}
          <div className="h-44 flex items-end justify-between gap-1.5 pt-4 px-1 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-slate-200/50 dark:border-white/5 border-dashed"></div>
            <div className="absolute inset-x-0 top-2/4 border-b border-slate-200/50 dark:border-white/5 border-dashed"></div>
            <div className="absolute inset-x-0 top-3/4 border-b border-slate-200/50 dark:border-white/5 border-dashed"></div>

            {summary.qualityTrend.map((pt, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group z-10">
                <div className="w-full flex justify-center gap-1 h-32 items-end relative">
                  {/* Quality Column (Indigo) */}
                  <div 
                    style={{ height: `${pt.avgScore}%` }}
                    className="w-4 bg-gradient-to-t from-indigo-600/70 to-indigo-500 rounded-t-sm transition-all duration-500 group-hover:brightness-110 relative"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-1 rounded">
                      {pt.avgScore}%
                    </span>
                  </div>

                  {/* Risk Column (Rose) */}
                  <div 
                    style={{ height: `${pt.riskScore}%` }}
                    className="w-2.5 bg-gradient-to-t from-rose-500/70 to-rose-400 rounded-t-xs transition-all duration-500 group-hover:brightness-110 relative"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-rose-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-1 rounded">
                      {pt.riskScore}%
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-400">{pt.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown (Right Bento Sidebar) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-purple-400" />
              Category Distributions
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Asset count mapped by domain context</p>
          </div>

          <div className="space-y-2.5 font-mono text-[10px] py-2 flex-grow flex flex-col justify-center">
            {Object.entries(summary.categoryDistribution).map(([category, count], idx) => {
              const max = Math.max(...Object.values(summary.categoryDistribution));
              const percent = Math.round((count / datasets.length) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="truncate max-w-[160px] text-slate-900 dark:text-slate-300 font-medium">{category}</span>
                    <span className="text-indigo-400 font-bold">{count} ({percent}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percent}%` }}
                      className="h-full bg-indigo-500 rounded-full"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 text-[10px] leading-relaxed text-indigo-400 font-mono">
            <p className="font-bold uppercase tracking-wider flex items-center gap-1 text-[9px] mb-0.5">
              <Sparkles className="h-3 w-3" /> Autonomous Health Scan
            </p>
            <p className="text-slate-400">
              All cloud engines operating in healthy ranges. Duplicate cluster overlap averages 4.25%, exceeding model alignment safety targets.
            </p>
          </div>
        </div>

      </div>

      {/* Lower Bento Deck: Contributor Registry, Storage Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Contributor Workloads */}
        <div className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-emerald-400" />
            Researcher Ingestion Ledgers
          </h4>
          <div className="space-y-3 font-mono text-[11px]">
            {summary.contributorStats.map((c, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-300">{c.contributorName}</p>
                  <p className="text-[9px] text-slate-500">{c.datasetsUploaded} Datasets Contributed</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{(c.recordsCount / 1000).toFixed(0)}K rows</p>
                  <p className="text-[9px] text-slate-500">99.8% Accept Ratio</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Region & Language Maps */}
        <div className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-amber-400" />
              Language & Sovereignty Reach
            </h4>
            <p className="text-[10px] text-slate-500">Geographic regulatory distribution checklist</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">Languages</span>
              <div className="space-y-1 font-mono text-[10px]">
                {Object.entries(summary.languageDistribution).map(([lang, count], i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span className="text-slate-400">{lang}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">Sovereignty Country</span>
              <div className="space-y-1 font-mono text-[10px]">
                {Object.entries(summary.countryDistribution).map(([c, count], i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span className="text-slate-400">{c}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-[10px] font-mono">
            <span className="text-slate-500">SLA Accuracy Margin:</span>
            <span className="text-emerald-400 font-bold">99.98% Compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
};
