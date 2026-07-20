/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { SecurityAlert } from '../types';
import {
  ShieldAlert,
  Terminal,
  Activity,
  Globe,
  Lock,
  Unlock,
  CheckCircle,
  Eye,
  AlertOctagon,
  Radar,
  ArrowRight,
  UserX,
  Plus
} from 'lucide-react';

export function SecurityCenterTab() {
  const { securityAlerts, threatFeed, resolveSecurityAlert, banUser } = useAdmin();
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [reasonVal, setReasonVal] = useState('');

  const handleResolve = (status: 'Resolved' | 'Whitelisted') => {
    if (!selectedAlert) return;
    if (!reasonVal) {
      alert('An audit logging reason is required.');
      return;
    }

    resolveSecurityAlert(selectedAlert.id, status, reasonVal);
    alert(`Threat ticket #${selectedAlert.id} resolved as ${status}.`);
    setReasonVal('');
    setSelectedAlert(null);
  };

  const handleQuickBan = () => {
    if (!selectedAlert || !selectedAlert.username) return;
    if (!reasonVal) {
      alert('Please specify a ban auditing reason.');
      return;
    }

    banUser(selectedAlert.username, reasonVal);
    alert(`Account @${selectedAlert.username} has been permanently blocked from server ingress.`);
    setReasonVal('');
    setSelectedAlert(null);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    if (score >= 40) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  const getAlertIcon = (category: SecurityAlert['category']) => {
    switch (category) {
      case 'Failed_Login':
        return <Lock className="h-4 w-4 text-amber-500" />;
      case 'Proxy':
      case 'VPN':
        return <Globe className="h-4 w-4 text-indigo-500" />;
      case 'Bot':
        return <Activity className="h-4 w-4 text-rose-500" />;
      case 'Velocity':
      case 'Tamper':
      case 'Replay':
      case 'Fraud':
      default:
        return <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />;
    }
  };

  return (
    <div className="space-y-6" id="security-center-panel">
      {/* Risk index visual grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-950 text-white rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-600/10 blur-3xl rounded-full" />
          <div className="flex justify-between items-start">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">Threat Risk Level</h4>
            <Radar className="h-5 w-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h2 className="text-3xl font-bold mt-4 font-sans tracking-tight">LOW <span className="text-xs font-mono font-normal text-slate-400">Risk Factor 14.5%</span></h2>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Platform firewall nodes are rejecting credential-stuffing. WAF blocks active.</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">Live Server Firewall Block Log</h4>
            <span className="text-[9px] font-mono text-emerald-500">Live feed updates</span>
          </div>
          <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
            {threatFeed.map((thr) => (
              <div key={thr.id} className="p-2 bg-slate-50 dark:bg-[#030303] border border-slate-100 dark:border-white/5 rounded-xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 shrink-0">WAF_BLOCK</span>
                  <p className="text-slate-800 dark:text-slate-300 font-medium font-mono">{thr.vector} • <span className="text-slate-400">{thr.ip} ({thr.country})</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-emerald-500 font-mono font-bold">{thr.actionTaken}</span>
                  <span className="text-[8px] text-slate-400 font-mono">{new Date(thr.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main ledger list and controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs lg:col-span-2">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Unresolved Security Incidents</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {securityAlerts.filter(a => a.status === 'Unresolved' || a.status === 'Investigating').map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all ${
                  selectedAlert?.id === alert.id ? 'bg-indigo-50/15 dark:bg-indigo-950/5' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                    {getAlertIcon(alert.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-rose-500 uppercase">{alert.category}</span>
                      <span className="text-[10px] text-slate-400 font-mono">• IP: {alert.ip}</span>
                      {alert.username && <span className="text-[10px] text-indigo-500 font-mono">• User: @{alert.username}</span>}
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium mt-1 leading-snug">{alert.details}</p>
                    <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 animate-ping mt-1" />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center text-[9px] font-mono border px-2 py-0.5 rounded-md ${getRiskColor(alert.riskScore)}`}>
                    Risk {alert.riskScore}%
                  </span>
                  <p className="text-[9px] text-slate-400 font-mono mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}

            {securityAlerts.filter(a => a.status === 'Unresolved' || a.status === 'Investigating').length === 0 && (
              <div className="p-12 text-center text-slate-400 text-xs">
                Perfect! No security incidents currently require review. All filters running normal.
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 shadow-xs h-fit space-y-6">
          {selectedAlert ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                    <ShieldAlert className="h-4.5 w-4.5 text-indigo-500" /> Incident Assessment
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Ticket ID: <span className="font-bold text-slate-900 dark:text-white">#{selectedAlert.id}</span></p>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg cursor-pointer text-slate-400"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              {/* Alert Details */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-slate-400">System Telemetry Log</span>
                <div className="p-3 bg-slate-50 dark:bg-[#030303] border border-slate-100 dark:border-white/5 rounded-xl font-mono text-[10px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <p className="font-bold">VECTOR: {selectedAlert.category}</p>
                  <p>IP ADDRESS: {selectedAlert.ip}</p>
                  <p>ACCOUNT FLAGGED: @{selectedAlert.username || 'Unauthenticated'}</p>
                  <p>RISK PROFILER: {selectedAlert.riskScore}% severity</p>
                  <p>TIMESTAMP: {new Date(selectedAlert.timestamp).toISOString()}</p>
                </div>
              </div>

              {/* Resolution auditer */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Resolution Auditing Reason *</label>
                <input
                  type="text"
                  required
                  value={reasonVal}
                  onChange={(e) => setReasonVal(e.target.value)}
                  placeholder="e.g. Whitelisted server load testing node"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* Option action buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleResolve('Resolved')}
                    className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" /> Resolve Ticket
                  </button>
                  <button
                    onClick={() => handleResolve('Whitelisted')}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Globe className="h-4 w-4" /> Whitelist IP
                  </button>
                </div>

                {selectedAlert.username && (
                  <button
                    onClick={handleQuickBan}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserX className="h-4 w-4" /> Hard Ban User @{selectedAlert.username}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <ShieldAlert className="h-8 w-8 mx-auto text-slate-300 dark:text-zinc-800 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Intrusion Assessment Center</h4>
                <p className="text-[10px] text-slate-400 mt-1">Select an active warning event log in the left list to review detailed client-side telemetry hashes, whitelist nodes, or block accounts.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SecurityCenterTab;
