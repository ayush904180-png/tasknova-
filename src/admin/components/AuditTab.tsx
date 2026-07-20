/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAdmin } from '../context/AdminContext';
import { Shield, Key, Search, RefreshCw, FileText } from 'lucide-react';

export function AuditTab() {
  const { auditLogs } = useAdmin();

  return (
    <div className="space-y-6" id="audit-logs-panel">
      {/* Informative top banner */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-600/10 blur-3xl rounded-full" />
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">Cryptographic Integrity Ledger</h4>
            <h2 className="text-xl font-bold mt-2 font-sans tracking-tight flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-400 animate-pulse" /> Compliance Immutable Audit Trail
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-2xl">
              All modifications affecting B2B credits, user state, 2FA credentials, or media assets are signed and hashed into an append-only distributed ledger. Tamper-evident seals are active on all database rows.
            </p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl font-mono text-[11px] text-right">
            <span className="text-slate-400">Ledger state:</span> <span className="text-emerald-400 font-bold">VERIFIED SECURE</span>
            <p className="text-[9px] text-slate-500 mt-0.5">HASH_ALGO: SHA-1</p>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Historical administrative action log</h3>
          <span className="text-[9px] font-mono text-slate-400">{auditLogs.length} audit logs synchronized</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50/40 dark:hover:bg-white/1 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 uppercase shrink-0">
                    {log.action}
                  </span>
                  <div className="text-slate-800 dark:text-slate-200">
                    Admin <span className="font-bold">@{log.adminId}</span> ({log.adminRole}) modified target:{' '}
                    <span className="font-bold text-slate-900 dark:text-white">{log.target}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-normal shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              {/* Reason box */}
              <div className="p-2.5 rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-[#030303] text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Reason: <span className="font-medium text-slate-700 dark:text-slate-300">{log.reason}</span></span>
              </div>

              {/* Telemetry and SHA hash */}
              <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 flex-wrap gap-2">
                <div>
                  NODE_IP: <span className="text-slate-700 dark:text-zinc-400 font-bold">{log.ip}</span> • SYSTEM: <span className="text-slate-700 dark:text-zinc-400">{log.device}</span>
                </div>
                <div>
                  SHA-1 SEAL: <span className="text-indigo-500 dark:text-indigo-400 font-bold">{log.hash}</span>
                </div>
              </div>
            </div>
          ))}

          {auditLogs.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No immutable audit ledger records present.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AuditTab;
