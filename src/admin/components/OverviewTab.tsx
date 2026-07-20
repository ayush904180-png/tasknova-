/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAdmin } from '../context/AdminContext';
import { HealthStatus, LiveEvent } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Users,
  Activity,
  Cpu,
  Server,
  Database,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Radio,
  RefreshCw,
  Search,
  HardDrive
} from 'lucide-react';

export function OverviewTab() {
  const { stats, serviceHealth, liveEvents, isSyncing, syncOfflineData, pendingOfflineCount } = useAdmin();

  const getHealthIcon = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY:
        return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
      case HealthStatus.WARNING:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case HealthStatus.CRITICAL:
        return <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />;
      case HealthStatus.OFFLINE:
        return <XCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getHealthColorClass = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950/45';
      case HealthStatus.WARNING:
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-950/45';
      case HealthStatus.CRITICAL:
        return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-950/45';
      case HealthStatus.OFFLINE:
        return 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800';
    }
  };

  const getEventBadgeStyle = (severity: LiveEvent['severity']) => {
    switch (severity) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'error':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
      case 'info':
      default:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
    }
  };

  return (
    <div className="space-y-6" id="admin-overview-container">
      {/* Sync banner for offline capabilities */}
      {pendingOfflineCount > 0 && (
        <div className="bg-indigo-50/65 dark:bg-indigo-950/15 border border-indigo-100 dark:border-indigo-950/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Offline Changes Queued ({pendingOfflineCount})</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Your modifications are stored locally in the Repository cache. Synchronize them with the Google Cloud Server.</p>
            </div>
          </div>
          <button
            onClick={syncOfflineData}
            disabled={isSyncing}
            className="text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            {isSyncing ? 'Syncing...' : 'Sync with Firestore'}
          </button>
        </div>
      )}

      {/* Primary Executive Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Row 1 */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Platform Health</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">{stats.platformHealth}%</h3>
          <p className="text-[9px] text-emerald-500 font-mono mt-1">● Nominal uptime</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Online Users</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">{stats.onlineUsers.toLocaleString()}</h3>
          <p className="text-[9px] text-slate-400 font-mono mt-1">Total database: {stats.offlineUsers.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Tasks Sandbox</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">{stats.tasksRunning} <span className="text-xs text-slate-400">running</span></h3>
          <p className="text-[9px] text-slate-400 font-mono mt-1">Waiting: {stats.tasksWaiting} | Failed: {stats.tasksFailed}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Revenue Today</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">${stats.revenueToday.toLocaleString()}</h3>
          <p className="text-[9px] text-emerald-500 font-mono mt-1">Month: ${(stats.revenueThisMonth/1000).toFixed(0)}k</p>
        </div>

        {/* Row 2 */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Pending Tasks</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">{stats.pendingWithdrawals} <span className="text-xs text-slate-400">payouts</span></h3>
          <p className="text-[9px] text-slate-400 font-mono mt-1">Validation Queue: {stats.validationQueue}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">DB Operations</span>
            <Database className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-2">{(stats.firestoreReads/1000).toFixed(1)}k <span className="text-xs text-slate-400">reads</span></h3>
          <p className="text-[9px] text-slate-400 font-mono mt-1">Writes: {(stats.firestoreWrites/1000).toFixed(1)}k</p>
        </div>
      </div>

      {/* Third row showing infrastructure indicators (CPU, RAM, API delay) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">CPU Usage</p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{stats.cpuUsagePercent}%</h4>
            </div>
          </div>
          <div className="w-16 bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{ width: `${stats.cpuUsagePercent}%` }} />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg">
              <HardDrive className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">RAM Memory</p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{stats.ramUsagePercent}%</h4>
            </div>
          </div>
          <div className="w-16 bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{ width: `${stats.ramUsagePercent}%` }} />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Avg Latency</p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{stats.averageApiLatencyMs} ms</h4>
            </div>
          </div>
          <span className="text-[9px] text-emerald-500 font-mono">Excellent</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">System Errors</p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{stats.systemErrorRatePercent}%</h4>
            </div>
          </div>
          <span className="text-[9px] text-emerald-500 font-mono">Stable</span>
        </div>
      </div>

      {/* Grid: Health Check and Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Check Checklist */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Google Cloud Microservices Health
              </h4>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="space-y-3">
              {serviceHealth.map((srv, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl border border-slate-50 dark:border-white/1 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex items-center gap-2">
                    {getHealthIcon(srv.status)}
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{srv.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-400">{srv.latencyMs}ms</span>
                    <span className={`text-[9px] font-semibold border px-1.5 py-0.5 rounded-md ${getHealthColorClass(srv.status)}`}>
                      {srv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 mt-4 text-[10px] text-slate-400 font-mono text-center">
            Last diagnostic run: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Real-time Streaming timeline */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 shadow-xs lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Radio className="h-4 w-4 text-rose-500 animate-pulse" /> Live Operational Event Stream
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Sub-second event bus telemetry streaming from live pubsub nodes.</p>
            </div>
            <span className="text-[9px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-sm">
              Live updates active
            </span>
          </div>

          <div className="flex-1 min-h-[380px] max-h-[460px] overflow-y-auto space-y-3 scrollbar-thin pr-1">
            <AnimatePresence initial={false}>
              {liveEvents.map((evt) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -15, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="p-3 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/20 dark:bg-[#09090b]/10 flex items-start justify-between gap-3 overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded-md shrink-0 uppercase ${getEventBadgeStyle(evt.severity)}`}>
                      {evt.type}
                    </span>
                    <div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{evt.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-slate-400 font-mono">ID: {evt.id}</span>
                        {Object.keys(evt.details).length > 0 && (
                          <span className="text-[9px] text-slate-400 font-mono">
                            • {JSON.stringify(evt.details)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono shrink-0">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OverviewTab;
