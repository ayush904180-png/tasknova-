/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useAdmin } from '../context/AdminContext';
import { TrendingUp, Users, Zap, ShieldAlert, Layers, Activity } from 'lucide-react';

export function AnalyticsTab() {
  const { stats } = useAdmin();

  // 1. Revenue trends (SaaS subscriptions + metering)
  const revenueData = [
    { name: 'Jan', Subscription: 120000, Usage: 45000 },
    { name: 'Feb', Subscription: 145000, Usage: 52000 },
    { name: 'Mar', Subscription: 150000, Usage: 68000 },
    { name: 'Apr', Subscription: 180000, Usage: 85000 },
    { name: 'May', Subscription: 210000, Usage: 98000 },
    { name: 'Jun', Subscription: 245000, Usage: 110000 },
    { name: 'Jul', Subscription: 260000, Usage: 122000 }
  ];

  // 2. User onboarding registration growth
  const growthData = [
    { name: 'W1', Contributors: 12400, Businesses: 38 },
    { name: 'W2', Contributors: 13900, Businesses: 41 },
    { name: 'W3', Contributors: 15200, Businesses: 45 },
    { name: 'W4', Contributors: 16800, Businesses: 48 },
    { name: 'W5', Contributors: 18230, Businesses: 52 }
  ];

  // 3. Platform task volume throughput & API latencies
  const performanceData = [
    { time: '00:00', LatencyMs: 40, ThroughputHz: 120 },
    { time: '04:00', LatencyMs: 38, ThroughputHz: 95 },
    { time: '08:00', LatencyMs: 42, ThroughputHz: 185 },
    { time: '12:00', LatencyMs: 48, ThroughputHz: 280 },
    { time: '16:00', LatencyMs: 45, ThroughputHz: 240 },
    { time: '20:00', LatencyMs: 41, ThroughputHz: 190 }
  ];

  return (
    <div className="space-y-6" id="system-analytics-panel">
      {/* Analytics stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Gross MRR</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">$382,000</h3>
          <p className="text-[9px] text-emerald-500 font-mono mt-1">▲ +12.4% vs last month</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Workers</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">18,230</h3>
          <p className="text-[9px] text-emerald-500 font-mono mt-1">▲ +1,424 this week</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Median Latency</span>
            <Zap className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">{stats.averageApiLatencyMs} ms</h3>
          <p className="text-[9px] text-emerald-500 font-mono mt-1">● Healthy latency profile</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">System throughput</span>
            <Layers className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">1,240 <span className="text-xs text-slate-400">hits/min</span></h3>
          <p className="text-[9px] text-slate-400 font-mono mt-1">99.96% success rate</p>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">Gross MRR Revenue Stream</h4>
            <p className="text-[10px] text-slate-400 mt-1">Aggregates tiered subscription packages and metered microtask verification API usage fees.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                <Area type="monotone" dataKey="Subscription" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                <Area type="monotone" dataKey="Usage" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Bar Chart */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">User Directory Onboarding Velocity</h4>
            <p className="text-[10px] text-slate-400 mt-1">Growth progression of global contributors vs corporate business tenants over the last 5 weeks.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="Contributors" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency and throughput line chart */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 space-y-4 lg:col-span-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">Platform Latency vs API Ingress Throughput</h4>
            <p className="text-[10px] text-slate-400 mt-1">Validates server capability to maintain low execution latencies under load spikes.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="LatencyMs" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ThroughputHz" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
export default AnalyticsTab;
