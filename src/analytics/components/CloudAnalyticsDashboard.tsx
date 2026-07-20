/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Database, HardDrive, Cpu, Cloud, HelpCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CLOUD_METRICS_HISTORY } from '../constants';

export const CloudAnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6" id="cloud-analytics-dashboard">
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Firestore Reads', value: '1.35 M / day', change: '+14.5%', icon: <Database className="h-4 w-4 text-sky-400" /> },
          { title: 'Firestore Writes', value: '420 K / day', change: '+8.2%', icon: <Database className="h-4 w-4 text-indigo-400" /> },
          { title: 'Storage Buckets', value: '370 GB', change: '+12.4%', icon: <HardDrive className="h-4 w-4 text-emerald-400" /> },
          { title: 'Functions Invocations', value: '2.4 M / month', change: '+18.5%', icon: <Cpu className="h-4 w-4 text-violet-400" /> }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 flex justify-between items-start">
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
        {/* Firestore reads & writes line chart */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-sky-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">GCP Resource Demands Over Time</h3>
              <p className="text-[11px] text-slate-400">Telemetered read, write, and serverless invocations load curve tracking.</p>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CLOUD_METRICS_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="FirestoreReads" name="Firestore Reads (K)" stroke="#0ea5e9" strokeWidth={2.5} />
                <Line type="monotone" dataKey="FirestoreWrites" name="Firestore Writes (K)" stroke="#6366f1" strokeWidth={2.5} />
                <Line type="monotone" dataKey="Functions" name="Functions Invocations (K)" stroke="#a855f7" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BigQuery analytics & table metrics */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">BigQuery Storage Pools</h3>
          <p className="text-[11px] text-slate-400">Total analytical datasets structured for model training downloads.</p>

          <div className="space-y-4 pt-2">
            {[
              { table: 'bq_dataset_rlhf_v2', rows: '124,500 rows', space: '14.2 GB', color: 'bg-indigo-500' },
              { table: 'bq_dataset_trans_de_en', rows: '84,000 rows', space: '8.4 GB', color: 'bg-cyan-500' },
              { table: 'bq_dataset_vision_v1', rows: '52,100 rows', space: '22.0 GB', color: 'bg-emerald-500' },
              { table: 'bq_dataset_prompts_v4', rows: '44,900 rows', space: '3.1 GB', color: 'bg-violet-500' }
            ].map((node, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 border border-white/5 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 font-mono">{node.table}</span>
                  <span className="text-emerald-400 font-bold">{node.space}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Structured BQ Biglake Table</span>
                  <span>{node.rows}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
