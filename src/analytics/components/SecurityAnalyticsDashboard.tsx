/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Terminal, HelpCircle, EyeOff, AlertOctagon } from 'lucide-react';

export const SecurityAnalyticsDashboard: React.FC = () => {
  const incidents = [
    { id: 'SEC-3904', type: 'VPN Ingress Block', severity: 'MEDIUM', node: 'Node IP 185.120.44.12', time: '5 mins ago', desc: 'Worker registered with datacenter proxy pool.' },
    { id: 'SEC-3903', type: 'Velocity Attack Intercept', severity: 'HIGH', node: 'Node IP 42.110.15.82', time: '14 mins ago', desc: 'Attempted 140 submissions inside 10 seconds.' },
    { id: 'SEC-3902', type: 'Bot Behavior Signature', severity: 'HIGH', node: 'Node IP 192.12.90.34', time: '32 mins ago', desc: 'Mouse path coordinates detected linear entropy-free jumps.' },
    { id: 'SEC-3901', type: 'Failed Admin Authentication', severity: 'CRITICAL', node: 'Subnet 10.4.52.0/24', time: '1 hour ago', desc: 'Invalid Super Admin credentials from unauthorized region.' }
  ];

  return (
    <div className="space-y-6" id="security-analytics-dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Intercepted Attacks', value: '485 incidents', change: '-12.4%', label: 'All blocked malicious ingress events.' },
          { title: 'Median IP Velocity Rate', value: '0.4 HITs / min', change: '-5.2%', label: 'Average submissions index per standard crowd node.' },
          { title: 'Bot Fingerprint Matches', value: '140 cases', change: '+2.1%', label: 'Auto-detections using entropy mouse tracking.' },
          { title: 'WAF Rule Blocks', value: '1,240 blocks', change: '+14.5%', label: 'DDoS/Proxy requests filtered at Cloud Armor Edge.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{item.title}</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-slate-200">{item.value}</h3>
              <span className={`text-xs font-semibold ${item.change.includes('-') ? 'text-emerald-400' : 'text-indigo-400'}`}>{item.change}</span>
            </div>
            <p className="text-[10px] text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Incident details log */}
      <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-rose-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Security Gate Intercept Stream</h3>
            <p className="text-[11px] text-slate-400">Chronological list of edge mitigation alerts, sandbox isolation protocols, and credential rejections.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Alarm ID</th>
                <th className="pb-3">Threat Category</th>
                <th className="pb-3 text-center">Severity</th>
                <th className="pb-3">Ingress Source</th>
                <th className="pb-3">Mitigation Incident Details</th>
                <th className="pb-3 text-right">Elapsed Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-950/20 transition-colors">
                  <td className="py-3 text-slate-400 font-semibold">{inc.id}</td>
                  <td className="py-3 text-slate-200 font-semibold">{inc.type}</td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      inc.severity === 'CRITICAL' 
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30' 
                        : inc.severity === 'HIGH' 
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' 
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{inc.node}</td>
                  <td className="py-3 text-[11px] text-slate-400 font-sans">{inc.desc}</td>
                  <td className="py-3 text-right text-slate-500 font-semibold font-sans">{inc.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
