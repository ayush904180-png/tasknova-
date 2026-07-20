/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Star, GitMerge, FileCheck, ShieldX } from 'lucide-react';

export const MarketplaceAnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6" id="marketplace-analytics-dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Task Reservations', value: '115,400', label: 'Cumulative worker reserve slots locked.', trend: '+14.2%' },
          { title: 'Matching Calibration Score', value: '98.2%', label: 'Average skill-to-task compatibility index.', trend: '+0.5%' },
          { title: 'Reservation Expirations', value: '4.5%', label: 'Reserved slots released due to timer timeout.', trend: '-11.2%' },
          { title: 'Active Pool Share', value: '88.4%', label: 'Percent of published campaigns fully assigned.', trend: '+4.8%' }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{item.title}</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-slate-200">{item.value}</h3>
              <span className={`text-xs font-semibold ${item.trend.includes('-') ? 'text-emerald-400' : 'text-indigo-400'}`}>{item.trend}</span>
            </div>
            <p className="text-[10px] text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill matching weight distribution */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Required Skills Distribution Matrix</h3>
              <p className="text-[11px] text-slate-400">Comparing available crowd credentials relative to active campaign constraints.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { skill: 'Natural Language processing (NLP)', match: '98.5%', percent: 85, color: 'bg-indigo-500' },
              { skill: 'Computer Vision & Core Segmentations', match: '96.2%', percent: 74, color: 'bg-cyan-500' },
              { skill: 'German / English Translation Corpus', match: '99.1%', percent: 92, color: 'bg-emerald-500' },
              { skill: 'Prompt Bias Mitigation Filters', match: '92.4%', percent: 58, color: 'bg-violet-500' }
            ].map((node, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{node.skill}</span>
                  <span className="text-slate-400 font-semibold">{node.match} Match <span className="text-[10px] text-slate-500">({node.percent}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${node.color} rounded-full`} style={{ width: `${node.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign reservations status */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Campaign Allocation Pools</h3>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Completed & Uploaded', count: '102,400', percent: 88, color: 'bg-emerald-400' },
              { label: 'Actively Reserved (Locked)', count: '8,200', percent: 7, color: 'bg-indigo-400' },
              { label: 'Canceled / Released', count: '4,800', percent: 5, color: 'bg-slate-500' }
            ].map((pool, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{pool.label}</span>
                  <span className="text-slate-400">{pool.count}</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${pool.color} rounded-full`} style={{ width: `${pool.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
