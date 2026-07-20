/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Percent, TrendingUp, Landmark, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { REVENUE_HISTORICAL_DATA } from '../constants';

export const BusinessIntelligenceDashboard: React.FC = () => {
  const { kpis, filters } = useAnalytics();

  const businessMetrics = [
    { title: 'Gross Profit Margin', value: '78.4%', change: '+1.8%', desc: 'Operating margin net of crowd coin disbursements.' },
    { title: 'Customer Acquisition Cost', value: '$840', change: '-4.2%', desc: 'Ad spend relative to newly contracted organizations.' },
    { title: 'Average Campaign Budget', value: '$24,500', change: '+12.5%', desc: 'Mean dollar size of published enterprise work blocks.' },
    { title: 'Client LTV (Mean)', value: '$185,000', change: '+8.4%', desc: 'Projected net revenue per contracted corporate node.' }
  ];

  const enterpriseLeaderboard = [
    { org: 'Google Workspace Corp', activeCampaigns: 4, datasetCount: 145000, spend: 112000, completion: '98.5%', roi: '3.4x' },
    { org: 'Stripe Global Inc', activeCampaigns: 2, datasetCount: 84000, spend: 74200, completion: '99.1%', roi: '4.1x' },
    { org: 'OpenAI Labs Corp', activeCampaigns: 6, datasetCount: 210000, spend: 198000, completion: '96.4%', roi: '2.8x' },
    { org: 'Tesla Autopilot Div', activeCampaigns: 3, datasetCount: 115000, spend: 89000, completion: '97.2%', roi: '3.6x' }
  ];

  return (
    <div className="space-y-6" id="business-intelligence-dashboard">
      {/* Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessMetrics.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{item.title}</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-slate-200">{item.value}</h3>
              <span className="text-xs text-emerald-400 font-medium">{item.change}</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Spend Trends & ROI Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Budget Burn Rates vs. Enterprise Spend</h3>
            <p className="text-[11px] text-slate-400">Comparing gross cash-outlay in task reward coins with B2B metered ingestion receipts.</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="EnterpriseSpend" name="Enterprise Spend" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                <Bar dataKey="BudgetBurn" name="Budget Burn" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Distribution Widget */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Revenue Drivers Analysis</h3>
            <p className="text-[11px] text-slate-400">Contribution index by campaign types.</p>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { type: 'RLHF Chat Alignment', percent: 45, val: '$171,900', color: 'bg-indigo-500' },
              { type: 'Semantic Tagging / Labeling', percent: 28, val: '$106,960', color: 'bg-cyan-500' },
              { type: 'Technical Translation Validation', percent: 15, val: '$57,300', color: 'bg-emerald-500' },
              { type: 'Creative Prompt Scoring Models', percent: 12, val: '$45,840', color: 'bg-violet-500' }
            ].map((driver, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{driver.type}</span>
                  <span className="text-slate-400">{driver.val} <span className="text-[10px] text-slate-500">({driver.percent}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${driver.color} rounded-full`} style={{ width: `${driver.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Directory Spend Matrix */}
      <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Enterprise Clients Spending Ledger</h3>
            <p className="text-[11px] text-slate-400">Detailed overview of corporate nodes, active contracts, and validated accuracy indices.</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-600/15 transition-colors">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Generate Sheets Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Client Organization</th>
                <th className="pb-3 text-center">Active Campaigns</th>
                <th className="pb-3 text-right">Datapoints Processed</th>
                <th className="pb-3 text-right">Gross Spend (USD)</th>
                <th className="pb-3 text-right">Validation Accuracy</th>
                <th className="pb-3 text-right">Platform ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enterpriseLeaderboard.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-950/20 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{item.org}</td>
                  <td className="py-3 text-center text-slate-300">{item.activeCampaigns}</td>
                  <td className="py-3 text-right text-slate-300">{item.datasetCount.toLocaleString()}</td>
                  <td className="py-3 text-right text-emerald-400 font-semibold">${item.spend.toLocaleString()}</td>
                  <td className="py-3 text-right text-indigo-400 font-medium">{item.completion}</td>
                  <td className="py-3 text-right text-slate-400">{item.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
