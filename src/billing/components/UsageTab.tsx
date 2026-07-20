/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useBilling } from '../context/BillingContext';
import { PLANS_REGISTRY } from '../services/BillingService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Activity, Database, Server, Cpu, ShieldAlert } from 'lucide-react';

export function UsageTab() {
  const { usageMetrics, subscription } = useBilling();

  const planLimits = PLANS_REGISTRY[subscription.tier].limits;

  // Render metrics charts
  const metricsData = [
    { name: 'Datasets', current: usageMetrics.datasetsCount, limit: planLimits.datasetLimits },
    { name: 'Campaigns', current: usageMetrics.campaignsCount, limit: planLimits.campaignLimits },
    { name: 'Active Tasks', current: usageMetrics.publishedTasksCount, limit: planLimits.taskLimits },
  ];

  const highLoadData = [
    { name: 'Week 1', apis: Math.floor(usageMetrics.apiCallsCount * 0.2), ai: Math.floor(usageMetrics.aiValidationRunsCount * 0.2) },
    { name: 'Week 2', apis: Math.floor(usageMetrics.apiCallsCount * 0.3), ai: Math.floor(usageMetrics.aiValidationRunsCount * 0.3) },
    { name: 'Week 3', apis: Math.floor(usageMetrics.apiCallsCount * 0.35), ai: Math.floor(usageMetrics.aiValidationRunsCount * 0.35) },
    { name: 'Week 4 (Current)', apis: Math.floor(usageMetrics.apiCallsCount * 0.15), ai: Math.floor(usageMetrics.aiValidationRunsCount * 0.15) },
  ];

  return (
    <div className="space-y-6" id="usage-meter-container">
      {/* Upper header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" /> Usage Metering & Quotas
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Real-time server-side resource tracking compared against active plan quotas.
        </p>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl p-4">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
            <Database className="h-3 w-3 text-indigo-500" /> Storage Used
          </span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-1">
            {usageMetrics.storageUsedGb} GB
          </h4>
          <p className="text-[10px] text-slate-400 mt-1">Quota: {planLimits.storageGb} GB</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl p-4">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
            <Server className="h-3 w-3 text-indigo-500" /> Bandwidth Out
          </span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-1">
            {usageMetrics.bandwidthGb} GB
          </h4>
          <p className="text-[10px] text-slate-400 mt-1">Unlimited transfer</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl p-4">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
            <Cpu className="h-3 w-3 text-indigo-500" /> API Server Calls
          </span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-1">
            {usageMetrics.apiCallsCount.toLocaleString()}
          </h4>
          <p className="text-[10px] text-slate-400 mt-1">Quota: {planLimits.apiLimits.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl p-4">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
            <ShieldAlert className="h-3 w-3 text-indigo-500" /> AI Validations
          </span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-1">
            {usageMetrics.aiValidationRunsCount.toLocaleString()}
          </h4>
          <p className="text-[10px] text-slate-400 mt-1">Real-time LLM validation runs</p>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Quotas Chart */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono mb-4">
            Allocation vs Current Utilization
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="current" name="Current Use" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="limit" name="Quota Limit" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Load Line Chart (API calls & AI Validation runs) */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono mb-4">
            Server Call Rate & AI Validation Timeline
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={highLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Line type="monotone" dataKey="apis" name="API Calls" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ai" name="AI Runs" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UsageTab;
