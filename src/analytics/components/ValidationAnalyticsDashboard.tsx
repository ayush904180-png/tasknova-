/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Brain, CheckCircle2, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';

export const ValidationAnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6" id="validation-analytics-dashboard">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Golden Set Calibration', value: '99.1%', status: 'optimal', label: 'Consensus alignment with standard data.' },
          { title: 'AI Consensus Engine Approval', value: '72.4%', status: 'optimal', label: 'Submissions passed automatically by Gemini.' },
          { title: 'Human Moderation Ratio', value: '24.2%', status: 'warning', label: 'Submissions routed to human consensus pools.' },
          { title: 'Manual Escalation Flags', value: '3.4%', status: 'danger', label: 'Ambiguous edge cases requiring admin nodes.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{item.title}</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-slate-200">{item.value}</h3>
              <span className={`w-2 h-2 rounded-full ${
                item.status === 'optimal' ? 'bg-emerald-400' : item.status === 'warning' ? 'bg-amber-400' : 'bg-rose-500'
              }`} />
            </div>
            <p className="text-[10px] text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Scoring Breakdown */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-slate-200">Confidence Distribution Matrix</h3>
            </div>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">Calibrated daily</span>
          </div>

          <div className="space-y-3">
            {[
              { bracket: 'Optimal Confidence (95% - 100%)', count: '53,200 uploads', percent: 71.7, color: 'bg-emerald-500' },
              { bracket: 'Moderate Confidence (75% - 94%)', count: '14,100 uploads', percent: 19.0, color: 'bg-indigo-500' },
              { bracket: 'Low Confidence (50% - 74%)', count: '4,800 uploads', percent: 6.5, color: 'bg-amber-500' },
              { bracket: 'Under-threshold (Escalated to human pools)', count: '2,100 uploads', percent: 2.8, color: 'bg-rose-500' }
            ].map((br, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{br.bracket}</span>
                  <span className="text-slate-400 font-semibold">{br.percent}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${br.color} rounded-full`} style={{ width: `${br.percent}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 text-right">{br.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Spam and duplicate tracker */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-200">Abuse Vectors & Dup Filter</h3>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { vector: 'Repeated Payload/Duplicates', blocks: '420 blocked', percent: 55 },
              { vector: 'Bot-driven Input Signatures', blocks: '280 blocked', percent: 36 },
              { vector: 'Plausible Nonsense (AI Generated)', blocks: '55 blocked', percent: 7 },
              { vector: 'Malicious Payload Scripts', blocks: '12 blocked', percent: 2 }
            ].map((vec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{vec.vector}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{vec.blocks}</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${vec.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-rose-500/10 text-[10px] text-slate-400 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p>Our auto-validation algorithm intercepts sybil-nodes using client signature tracking and entropy analysis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
