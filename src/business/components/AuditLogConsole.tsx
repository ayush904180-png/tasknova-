/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, ShieldCheck, Download, Search, RefreshCw, 
  Database, HardDrive, CheckSquare, CheckCircle, ExternalLink 
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { WorkspaceAdapter } from '../adapters/WorkspaceAdapter';

export const AuditLogConsole: React.FC = () => {
  const { auditLogs, campaigns, invoices } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetsExporting, setIsSheetsExporting] = useState(false);
  const [sheetsSyncStatus, setSheetsSyncStatus] = useState<'idle' | 'success'>('idle');
  const [isDriveExporting, setIsDriveExporting] = useState(false);
  const [driveSyncStatus, setDriveSyncStatus] = useState<'idle' | 'success'>('idle');

  const filteredLogs = auditLogs.filter((log) => {
    return (
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleExportSheets = () => {
    setIsSheetsExporting(true);
    setSheetsSyncStatus('idle');
    setTimeout(() => {
      setIsSheetsExporting(false);
      setSheetsSyncStatus('success');
      
      // Simulate spreadsheet structure compile in logs console
      console.log('Google Sheets Sync structure Compiled:', {
        CampaignsTab: WorkspaceAdapter.toCampaignSheet(campaigns),
        BillingTab: WorkspaceAdapter.toInvoiceSheet(invoices),
        AuditTab: WorkspaceAdapter.toAuditLogSheet(auditLogs)
      });
    }, 2000);
  };

  const handleExportDrive = () => {
    setIsDriveExporting(true);
    setDriveSyncStatus('idle');
    setTimeout(() => {
      setIsDriveExporting(false);
      setDriveSyncStatus('success');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Filter and Google Workspace syncing panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Immutable Audit table log */}
        <div className="lg:col-span-8 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
                Immutable Administrative Audit Trial
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Cryptographically sealed records of all business metadata operations.</p>
            </div>

            <div className="relative self-start sm:self-auto">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input 
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-slate-200 dark:border-white/5 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white rounded focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-mono">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Details</th>
                  <th className="py-2 px-3">Operator</th>
                  <th className="py-2 px-3 text-right">Signature Block</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/1 transition-colors">
                    <td className="py-3 px-3 text-slate-500 font-mono max-w-[80px] truncate">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-900 dark:text-slate-300 max-w-[200px] truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono max-w-[120px] truncate" title={log.userEmail}>
                      {log.userEmail}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[9px] text-slate-500">
                      <span className="bg-[#030303] px-2 py-1 rounded text-slate-400" title={log.signature}>
                        {log.signature.substr(0, 16)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Google Workspace Integrations */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <HardDrive className="h-4.5 w-4.5 text-indigo-400" />
                Google Workspace Exporter
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Publish financial ledgers and performance analysis sheets instantly.</p>
            </div>

            {/* Sheets publisher */}
            <div className="p-3.5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-3">
              <div className="flex items-start gap-2.5">
                <FileText className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-slate-950 dark:text-white">Google Sheets Sync Engine</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Publish tabular logs containing Campaign reports, Analytics summary, and GST compliance ledgers directly to active corporate sheets.</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleExportSheets}
                  disabled={isSheetsExporting}
                  className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-[10px] uppercase font-display rounded-lg cursor-pointer flex items-center justify-center gap-1 transition-colors"
                >
                  {isSheetsExporting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Compiling...
                    </>
                  ) : 'Sync Sheets Reports'}
                </button>

                {sheetsSyncStatus === 'success' && (
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold animate-pulse">
                    <CheckCircle className="h-3.5 w-3.5" /> Synchronized
                  </div>
                )}
              </div>
            </div>

            {/* Drive publisher */}
            <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-3">
              <div className="flex items-start gap-2.5">
                <HardDrive className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-slate-950 dark:text-white">Google Drive Archival Lock</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Save structural datasets, invoices receipts, and compliance PDF records inside dedicated folder structures: <code className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">TaskNova_Finance_Vault/</code></p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleExportDrive}
                  disabled={isDriveExporting}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-[10px] uppercase font-display rounded-lg cursor-pointer flex items-center justify-center gap-1 transition-colors"
                >
                  {isDriveExporting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Archiving...
                    </>
                  ) : 'Archive to Drive'}
                </button>

                {driveSyncStatus === 'success' && (
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold animate-pulse">
                    <CheckCircle className="h-3.5 w-3.5" /> Vaulted Complete
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
