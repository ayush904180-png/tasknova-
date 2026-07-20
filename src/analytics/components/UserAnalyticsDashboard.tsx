/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, UserCheck, Heart, Percent, LayoutGrid, Smartphone, Globe } from 'lucide-react';
import { USER_GEOGRAPHIC_DATA, USER_DEVICE_DATA, USER_BROWSER_DATA } from '../constants';

export const UserAnalyticsDashboard: React.FC = () => {
  const { kpis } = useAnalytics();

  const userKPIs = [
    { title: 'Total Registered Accounts', value: '42,500', trend: '+14.5%', detail: 'Total credential profiles in system.' },
    { title: 'New Users (Last 7 Days)', value: '1,820', trend: '+8.2%', detail: 'Verified post-onboarding test.' },
    { title: 'D30 Stickiness (DAU/MAU)', value: '28.8%', trend: '+3.1%', detail: 'Measures active user habit loops.' },
    { title: 'Avg Session Duration', value: '18.4 mins', trend: '+5.4%', detail: 'Mean duration of active work windows.' }
  ];

  // Mock DAU/MAU progression data
  const userStickinessHistory = [
    { name: '07-14', DAU: 3800, MAU: 13500 },
    { name: '07-15', DAU: 4050, MAU: 13900 },
    { name: '07-16', DAU: 4200, MAU: 14200 },
    { name: '07-17', DAU: 4500, MAU: 14800 },
    { name: '07-18', DAU: 4100, MAU: 15100 },
    { name: '07-19', DAU: 4300, MAU: 15600 },
    { name: '07-20', DAU: 4850, MAU: 16800 }
  ];

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6" id="user-analytics-dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userKPIs.map((card, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{card.title}</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-slate-200">{card.value}</h3>
              <span className="text-xs text-emerald-400 font-medium">{card.trend}</span>
            </div>
            <p className="text-[10px] text-slate-500">{card.detail}</p>
          </div>
        ))}
      </div>

      {/* Main Trends and Device Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Daily vs. Monthly Activity Volatility</h3>
            <p className="text-[11px] text-slate-400">DAU / MAU trends representing active ecosystem stickiness indexes.</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userStickinessHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="DAU" name="Daily Active (DAU)" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="MAU" name="Monthly Active (MAU)" stroke="#10b981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Ingress Agent Hardware</h3>
            <p className="text-[11px] text-slate-400">Primary browsers and client device metrics.</p>
          </div>

          <div className="h-[140px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={USER_DEVICE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {USER_DEVICE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Listings */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            {USER_DEVICE_DATA.map((dev, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{dev.name}</span>
                </div>
                <span className="font-semibold text-slate-400">{dev.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geolocation Map Indicator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Localized Node Operations</h3>
          </div>
          <div className="space-y-3">
            {USER_GEOGRAPHIC_DATA.map((geo, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{geo.name}</span>
                  <span className="text-slate-400 font-semibold">{geo.value.toLocaleString()} nodes</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(geo.value / 18230) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser User Ratios */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">Ecosystem Browsers Distribution</h3>
          </div>
          <div className="space-y-3">
            {USER_BROWSER_DATA.map((browser, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{browser.name}</span>
                  <span className="text-slate-400 font-semibold">{browser.value}% share</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${browser.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
