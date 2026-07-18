/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';

interface ChartPoint {
  day: string;
  evaluations: number;
  earnings: number;
}

export const AnalyticsWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    setData([
      { day: 'Mon', evaluations: 4, earnings: 320 },
      { day: 'Tue', evaluations: 8, earnings: 640 },
      { day: 'Wed', evaluations: 5, earnings: 400 },
      { day: 'Thu', evaluations: 12, earnings: 960 },
      { day: 'Fri', evaluations: 15, earnings: 1200 },
      { day: 'Sat', evaluations: 9, earnings: 720 },
      { day: 'Sun', evaluations: 18, earnings: 1440 },
    ]);
  }, []);

  // Compute SVG dimensions and paths dynamically
  const width = 500;
  const height = 140;
  const padding = 25;

  const maxEarnings = 1600;

  // Generate SVG coordinate points
  const points = data.map((pt, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (pt.earnings / maxEarnings) * (height - padding * 2);
    return { x, y, pt };
  });

  const linePath = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <WidgetShell
      id="analytics-widget"
      title="Validator SLA Analytics & Yield"
      subtitle="Calibration logs, evaluation speed metrics, and cumulative earnings"
      size={size}
      expectedRepository="AnalyticsRepository"
      expectedModel="DatasetAnalytics"
      expectedFields={['date', 'evaluations', 'coins', 'sla']}
      futureConnectionPoint="const summary = await useInfrastructure().analytics.getWeeklyStats(userId);"
      loadingStateSim="Reading daily telemetry logs..."
      emptyStateSim="No performance telemetry logged for this period."
      errorStateSim="Ledger metrics connection timeout."
    >
      <div className="mt-2 text-left space-y-4">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-2.5 rounded-lg border border-slate-150 bg-slate-50/50 dark:border-white/5 dark:bg-white/1">
            <span className="text-[9px] font-mono text-slate-400 block">SLA Accuracy Score</span>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">99.2% Gold</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-150 bg-slate-50/50 dark:border-white/5 dark:bg-white/1">
            <span className="text-[9px] font-mono text-slate-400 block">Task Alignment Cycle</span>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">18.4s Avg</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-150 bg-slate-50/50 dark:border-white/5 dark:bg-white/1">
            <span className="text-[9px] font-mono text-slate-400 block">Weekly Submissions</span>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">71 Tasks</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-150 bg-slate-50/50 dark:border-white/5 dark:bg-white/1">
            <span className="text-[9px] font-mono text-slate-400 block">Consolidated Yield</span>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">5,680 COINS</span>
          </div>
        </div>

        {/* Dynamic High-Craft Custom SVG Area Chart */}
        <div className="border border-slate-100 rounded-lg dark:border-white/5 p-2 bg-slate-50/20 dark:bg-white/1 relative">
          <div className="w-full overflow-hidden">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-auto text-slate-400 dark:text-zinc-600"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="svgColorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" strokeOpacity={0.08} strokeDasharray="3 3" />
              <line x1={padding} y1={(height - padding * 2) / 2 + padding} x2={width - padding} y2={(height - padding * 2) / 2 + padding} stroke="currentColor" strokeOpacity={0.08} strokeDasharray="3 3" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeOpacity={0.12} />

              {/* Chart Paths */}
              {points.length > 0 && (
                <>
                  {/* Fill Area */}
                  <path d={areaPath} fill="url(#svgColorEarnings)" />
                  {/* Line Stroke */}
                  <path d={linePath} fill="none" stroke="#6366f1" strokeWidth={1.8} />
                </>
              )}

              {/* Interactive Point Indicators & Labels */}
              {points.map((pt, idx) => (
                <g key={idx}>
                  {/* Circular Nodes */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={3.5} 
                    fill="#6366f1" 
                    stroke={window.localStorage.getItem('theme') === 'dark' ? '#0a0a0c' : '#ffffff'} 
                    strokeWidth={1} 
                    className="hover:r-5 transition-all cursor-pointer"
                  />
                  {/* Dynamic Value Hover overlay */}
                  <text 
                    x={pt.x} 
                    y={pt.y - 8} 
                    textAnchor="middle" 
                    fontSize={8} 
                    className="fill-slate-600 dark:fill-zinc-400 font-mono"
                  >
                    {pt.pt.earnings}
                  </text>
                  {/* X-Axis labels */}
                  <text 
                    x={pt.x} 
                    y={height - padding + 12} 
                    textAnchor="middle" 
                    fontSize={8.5} 
                    className="fill-slate-400 dark:fill-zinc-500 font-mono"
                  >
                    {pt.pt.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
};
