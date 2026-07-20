/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers, Activity, Gauge, Flame, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TaskAnalyticsDashboard: React.FC = () => {
  const taskKPIs = [
    { title: 'Cumulative Active Tasks', value: '74,200', trend: '+12.4%', text: 'Total published micro tasks currently live.' },
    { title: 'Submissions Rate', value: '4,850 / Hour', trend: '+8.2%', text: 'Completed upload payloads streaming into validation queue.' },
    { title: 'Avg Difficulty Level', value: 'Medium', trend: 'Neutral', text: 'Calibrated weight across active campaigns.' },
    { title: 'Dead-Letter Task Blocks', value: '42 items', trend: '-18.5%', text: 'Expired blocks returned back to pool.' }
  ];

  const categoryShare = [
    { name: 'RLHF Chatbot Evaluation', value: 45, count: 33390, color: '#6366f1' },
    { name: 'Semantic Tagging / Labeling', value: 28, count: 20776, color: '#06b6d4' },
    { name: 'Technical Translations', value: 15, count: 11130, color: '#10b981' },
    { name: 'Creative Prompt Scoring', value: 12, count: 8904, color: '#a855f7' }
  ];

  const difficultyRatio = [
    { name: 'Easy (Under 10s)', value: 58, color: '#10b981' },
    { name: 'Medium (10s to 45s)', value: 32, color: '#06b6d4' },
    { name: 'Hard (Over 45s)', value: 10, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6" id="task-analytics-dashboard">
      {/* Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {taskKPIs.map((card, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{card.title}</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-slate-200">{card.value}</h3>
              <span className={`text-xs font-semibold ${card.trend.includes('-') ? 'text-red-400' : card.trend === 'Neutral' ? 'text-slate-400' : 'text-emerald-400'}`}>
                {card.trend}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">{card.text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Share Distribution */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Task Volume Division Index</h3>
          </div>
          <div className="space-y-4 pt-2">
            {categoryShare.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">{cat.name}</span>
                  <span className="text-slate-400">{cat.count.toLocaleString()} blocks <span className="text-[10px] text-slate-500">({cat.value}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Calibration Ratio */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">Difficulty Calibration Ratio</h3>
          </div>

          <div className="space-y-4 pt-2">
            {difficultyRatio.map((diff, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{diff.name}</span>
                  <span className="text-slate-400 font-semibold">{diff.value}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${diff.value}%`, backgroundColor: diff.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-white/5 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <Activity className="h-3.5 w-3.5" />
              <span>Optimized Task Pools Calibration</span>
            </div>
            <p>Our platform routing module dynamically shapes difficulty thresholds daily based on available worker node skills.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
