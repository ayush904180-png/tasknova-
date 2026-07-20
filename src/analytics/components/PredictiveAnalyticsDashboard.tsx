/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LineChart as LineIcon, AlertCircle, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

export const PredictiveAnalyticsDashboard: React.FC = () => {
  const {
    forecastingMetric,
    setForecastingMetric,
    forecastData,
    triggerModelRefresh
  } = useAnalytics();

  const [refreshing, setRefreshing] = useState(false);
  const [success, setSuccess] = useState(false);

  const metrics = [
    'Revenue', 'Users', 'Tasks', 'Validation Volume', 'Business Growth',
    'Storage', 'API Usage', 'Cloud Costs', 'Budget Burn', 'Wallet Liabilities'
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    setSuccess(false);
    const ok = await triggerModelRefresh();
    setRefreshing(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6" id="predictive-analytics-dashboard">
      {/* Selector + Trigger Row */}
      <div className="bg-slate-900 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
            <LineIcon className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Linear Progression Forecasting Engine</h3>
            <p className="text-[11px] text-slate-400">Projecting future vectors for key platform capacities with a 95% confidence interval.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Select dropdown */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-xs text-slate-400 font-medium">Metric:</span>
            <select
              value={forecastingMetric}
              onChange={(e) => setForecastingMetric(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-indigo-400 focus:ring-0 cursor-pointer outline-none"
            >
              {metrics.map(m => (
                <option key={m} value={m} className="bg-slate-950 text-slate-200">{m}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-slate-200 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Recalibrate</span>
          </button>
        </div>
      </div>

      {/* Primary Forecast Chart */}
      <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">{forecastingMetric} Regression Projector</h4>
            <p className="text-[11px] text-slate-400">Historical bounds mapping directly into a 10-step forward statistical estimation.</p>
          </div>
          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
              <span>GCP Forecasting Pipeline Completed</span>
            </div>
          )}
        </div>

        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorUncertainty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              {/* Historical Line */}
              <Line type="monotone" dataKey="historical" name="Historical Observed" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 6 }} dot={true} />
              {/* Projected Line */}
              <Line type="monotone" dataKey="projected" name="Projected Curve" stroke="#06b6d4" strokeDasharray="5 5" strokeWidth={2.5} dot={true} />
              {/* Confidence Interval */}
              <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="url(#colorUncertainty)" />
              <Area type="monotone" dataKey="lowerBound" stroke="transparent" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Informational Warning Block */}
      <div className="bg-slate-950/40 border border-white/5 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-xs font-semibold text-slate-300">Statistical Boundary Constraints</h5>
          <p className="text-[11px] text-slate-400">
            Predictive forecasts utilize linear regressions mapping active ledger variables. Actual values are subject to extreme variance based on published corporate campaigns or global holiday schedules.
          </p>
        </div>
      </div>
    </div>
  );
};
