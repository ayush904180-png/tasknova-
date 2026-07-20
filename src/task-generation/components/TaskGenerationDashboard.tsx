/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, Layers, CheckCircle2, AlertTriangle, 
  TrendingUp, BarChart2, Zap, Coins, Globe, Users, Terminal 
} from 'lucide-react';
import { useTaskGeneration } from '../context/TaskGenerationContext';
import { TaskGenerationAnalytics } from '../analytics/TaskGenerationAnalytics';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { TaskGenerationMapper } from '../mappers/TaskGenerationMapper';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const TaskGenerationDashboard: React.FC = () => {
  const { analytics, telemetryLogs } = useTaskGeneration();
  const dailyData = TaskGenerationAnalytics.getDailyChartData();
  const breakdownData = TaskGenerationAnalytics.getTaskTypeBreakdown();

  const stats = [
    { label: 'Generated Chunks', value: analytics.totalGenerated, icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/10' },
    { label: 'Published Tasks', value: analytics.totalPublished, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/10' },
    { label: 'Average Reward', value: `${analytics.averageReward} Coins`, icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/10' },
    { label: 'Generation Velocity', value: `${analytics.generationSpeed} / min`, icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/10' },
    { label: 'Approval Rate', value: `${analytics.approvalRate}%`, icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/10' },
    { label: 'Active Node Capacity', value: analytics.contributorCapacity, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/10' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-4 rounded-2xl border bg-white dark:bg-[#131316] border-slate-200 dark:border-white/5 flex flex-col justify-between shadow-sm`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <span className={`p-1.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-bold font-display text-slate-900 dark:text-zinc-100">{stat.value}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Area - 8 Columns: Throughput Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-indigo-400" />
                Microtask Pipeline Generation Volume
              </h4>
              <p className="text-[10px] text-slate-500">Continuous transformation metrics of raw records into active human microtasks.</p>
            </div>
          </div>

          <div className="h-72 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="generated" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorGen)" name="Generated Chunks" />
                <Area type="monotone" dataKey="published" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPub)" name="Published to Marketplace" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Area - 4 Columns: Task Type Breakdown Pie */}
        <div className="lg:col-span-4 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-indigo-400" />
              Campaign Segments
            </h4>
            <p className="text-[10px] text-slate-500">Distribution of active microtasks across taxonomy templates.</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900 dark:text-zinc-200">{analytics.totalGenerated}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Total Tasks</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
            {breakdownData.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-zinc-300">{item.value} tasks</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Real-Time Operational Log Console */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-3 relative overflow-hidden">
        <div className="absolute top-2 right-4 flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Inference Live Link</span>
        </div>

        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <Terminal className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-bold font-mono text-slate-100">Task Generation Engine Output Terminal</h4>
        </div>

        <div className="space-y-1.5 font-mono text-[10px] leading-relaxed text-slate-300 max-h-[220px] overflow-y-auto pr-2">
          {telemetryLogs.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">
              System idling. Trigger dataset mapping pipeline to output logs.
            </div>
          ) : (
            telemetryLogs.map((log, index) => (
              <div key={index} className="hover:bg-white/2 p-1 rounded transition-colors flex items-start gap-1">
                <span className="text-indigo-400 flex-shrink-0">&gt;&gt;</span>
                <span>{log}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
