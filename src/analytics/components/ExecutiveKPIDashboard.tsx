/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, CheckCircle, Database, ShieldCheck, HelpCircle, Sparkles, AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { REVENUE_HISTORICAL_DATA, USER_GEOGRAPHIC_DATA, USER_FUNNEL_DATA, TASK_STATS_DATA, SECURITY_THREAT_RADAR_DATA } from '../constants';

export const ExecutiveKPIDashboard: React.FC = () => {
  const { kpis, widgets, userPermissions, searchQuery } = useAnalytics();

  // Guard against permissions
  if (!userPermissions.includes('financial')) {
    return (
      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-8 text-center space-y-3">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-semibold text-slate-200">Access Restricted</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Your current RBAC assignment does not carry high-level "financial" credential privileges. Shift to Owner or Super Admin nodes.
        </p>
      </div>
    );
  }

  // Filter based on search query
  const filteredKPIs = kpis.filter(kpi => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return kpi.title.toLowerCase().includes(q) || kpi.description.toLowerCase().includes(q);
  });

  const getKPIIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return <DollarSign className="h-4 w-4 text-emerald-400" />;
      case 'users':
        return <Users className="h-4 w-4 text-indigo-400" />;
      case 'tasks':
        return <CheckCircle className="h-4 w-4 text-cyan-400" />;
      case 'validation':
        return <Sparkles className="h-4 w-4 text-violet-400" />;
      case 'cloud':
        return <Database className="h-4 w-4 text-sky-400" />;
      case 'security':
        return <ShieldCheck className="h-4 w-4 text-red-400" />;
      default:
        return <HelpCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const isWidgetVisible = (widgetId: string) => {
    const w = widgets.find(x => x.id === widgetId);
    return w ? w.visible : false;
  };

  return (
    <div className="space-y-6" id="executive-kpi-dashboard">
      {/* 1. Core KPIs Metric Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredKPIs.slice(0, 8).map(kpi => (
          <div 
            key={kpi.id} 
            className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-3 relative overflow-hidden group hover:border-white/10 transition-all shadow-md hover:shadow-indigo-500/5"
            id={`kpi-card-${kpi.id}`}
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{kpi.title}</span>
              <div className="p-1.5 bg-slate-950/80 rounded-lg border border-white/5">
                {getKPIIcon(kpi.category)}
              </div>
            </div>

            {/* Value Row */}
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">{kpi.value}</h2>
              <div className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                kpi.trend === 'up' 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : kpi.trend === 'down' 
                    ? 'text-red-400 bg-red-500/10' 
                    : 'text-slate-400 bg-slate-500/10'
              }`}>
                {kpi.trend === 'up' ? '+' : ''}{kpi.change}%
              </div>
            </div>

            {/* Explanation and spark mock path */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <p className="text-[10px] text-slate-400 max-w-[160px] line-clamp-2">{kpi.description}</p>
              {/* Decorative mini Sparkline */}
              <div className="w-14 h-6">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <path
                    d={kpi.trend === 'up' ? "M0,25 Q20,15 40,20 T80,5 T100,2" : "M0,2 Q20,15 40,10 T80,20 T100,28"}
                    fill="none"
                    stroke={kpi.trend === 'up' ? '#10b981' : '#f43f5e'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Primary High-Precision Dashboard Layout Grid (Depends on Builder settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* area chart */}
        {isWidgetVisible('w_revenue_trend') && (
          <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2 shadow-lg" id="widget-revenue-trend">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Revenue Progression Rates</h3>
                <p className="text-[11px] text-slate-400">Total metrics mapping SaaS Subscriptions, metered usage APIs, and enterprise budget allocations.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-md text-[10px] font-semibold text-indigo-400 border border-white/5">
                <TrendingUp className="h-3 w-3" /> Live Telemetry
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_HISTORICAL_DATA}>
                  <defs>
                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMetered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 600, fontSize: '11px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Area type="monotone" dataKey="Subscription" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                  <Area type="monotone" dataKey="Metered" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorMetered)" />
                  <Area type="monotone" dataKey="EnterpriseSpend" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* user funnel chart */}
        {isWidgetVisible('w_user_funnel') && (
          <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg" id="widget-user-funnel">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Crowd Funnel Acquisition</h3>
              <p className="text-[11px] text-slate-400">Visitor-to-paid progression efficiency rates.</p>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={USER_FUNNEL_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} tickLine={false} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '11px' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]}>
                    {USER_FUNNEL_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* task volume trends bar */}
        {isWidgetVisible('w_tasks_volume') && (
          <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2 shadow-lg" id="widget-tasks-volume">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Campaign Execution Performance</h3>
              <p className="text-[11px] text-slate-400">Total micro-tasks started, completed, and subsequent validation verdicts across categories.</p>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TASK_STATS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Started" fill="#64748b" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Completed" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Approved" fill="#10b981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* geographic pie chart */}
        {isWidgetVisible('w_validation_acc') && (
          <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg" id="widget-validation-acc">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Global Geographic Footprint</h3>
              <p className="text-[11px] text-slate-400">Unique registered network node locations.</p>
            </div>
            <div className="h-[260px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={USER_GEOGRAPHIC_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {USER_GEOGRAPHIC_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '11px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend overlay for compactness */}
              <div className="absolute bottom-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] text-slate-400">
                {USER_GEOGRAPHIC_DATA.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* security radar */}
        {isWidgetVisible('w_security_threats') && (
          <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg" id="widget-security-threats">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Threat Ingress Vectors</h3>
              <p className="text-[11px] text-slate-400">Real-time bot, VPN, proxy and authentication threat tracking.</p>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={SECURITY_THREAT_RADAR_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#475569" fontSize={8} />
                  <Radar name="Active Threats" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                  <Radar name="Baseline Standard" dataKey="B" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
