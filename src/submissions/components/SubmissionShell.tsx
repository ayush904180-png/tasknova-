/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Sliders, RefreshCw, Layers, CheckCircle, Clock, 
  WifiOff, ArrowUpDown, ChevronRight, FileText, Download, Eye, Table
} from 'lucide-react';
import { useSubmissions } from '../context/SubmissionContext';
import { Submission, SubmissionStatus, ValidationStatus } from '../../types/submission';
import { SubmissionStatusBadge, SubmissionEmptyState } from './SubmissionSharedComponents';
import { SubmissionSummary, SubmissionPreview, SubmissionQueueCard } from './SubmissionPreviewComponents';
import { SubmissionAdapter } from '../adapters/SubmissionAdapter';

// ==========================================
// 1. DYNAMIC SUBMISSIONS HISTORIC TABLE
// ==========================================

export function SubmissionHistory({ onSelect }: { onSelect: (sub: Submission) => void }) {
  const { submissions, querySubmissions } = useSubmissions();
  
  // Search and Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [offlineFilter, setOfflineFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'elapsedTime'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchFiltered = async () => {
      const opts: any = {
        sortBy,
        sortOrder,
      };

      if (statusFilter !== 'ALL') {
        opts.submissionStatus = statusFilter as SubmissionStatus;
      }

      if (offlineFilter === 'YES') {
        opts.offlineFlag = true;
      } else if (offlineFilter === 'NO') {
        opts.offlineFlag = false;
      }

      const list = await querySubmissions(opts);
      
      // Clientside search matches ID or Task ID
      const query = search.toLowerCase().trim();
      if (query) {
        setFilteredSubmissions(
          list.filter(s => 
            s.submissionId.toLowerCase().includes(query) || 
            s.taskId.toLowerCase().includes(query)
          )
        );
      } else {
        setFilteredSubmissions(list);
      }
    };

    fetchFiltered();
  }, [submissions, search, statusFilter, offlineFilter, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Reports Excel/CSV dynamic download simulator
  const triggerReportExport = (type: 'qa' | 'val' | 'admin' | 'business') => {
    let reportData;
    let name = 'Report';
    if (type === 'qa') {
      reportData = SubmissionAdapter.toQAReport(submissions);
      name = 'QA_Manual_Audit_Trail';
    } else if (type === 'val') {
      reportData = SubmissionAdapter.toValidationReport(submissions);
      name = 'Validation_Consensus_Pipeline';
    } else if (type === 'admin') {
      reportData = SubmissionAdapter.toAdminReport(submissions);
      name = 'Admin_Operations_Master';
    } else {
      reportData = SubmissionAdapter.toBusinessReport(submissions);
      name = 'Business_Campaign_Funding';
    }

    // Convert tabular structure to flat tab-delimited or comma string representation
    const csvContent = [
      reportData.headers.join(','),
      ...reportData.rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}_V1_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4" id="submission-history-panel">
      {/* Search & Dynamic Filter Actions */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Submission ID or Task ID..."
            className="w-full bg-zinc-950 border border-zinc-850 pl-10 pr-4 py-2 text-xs text-slate-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-zinc-950/40 border border-zinc-850 px-2.5 py-1.5 rounded-xl">
            <Filter className="h-3 w-3 text-slate-500" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 border-none outline-none font-sans cursor-pointer focus:ring-0"
            >
              <option value="ALL">All States</option>
              {Object.values(SubmissionStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Offline filter */}
          <div className="flex items-center gap-1.5 bg-zinc-950/40 border border-zinc-850 px-2.5 py-1.5 rounded-xl">
            <WifiOff className="h-3 w-3 text-slate-500" />
            <select
              value={offlineFilter}
              onChange={e => setOfflineFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 border-none outline-none font-sans cursor-pointer focus:ring-0"
            >
              <option value="ALL">All Network</option>
              <option value="YES">Offline Only</option>
              <option value="NO">Online Only</option>
            </select>
          </div>

          {/* Sort controls */}
          <button
            onClick={toggleSortOrder}
            className="p-2 border border-zinc-850 bg-zinc-950/40 hover:bg-zinc-900 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle sort order"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Export Report Actions Bar */}
      <div className="bg-zinc-950/40 border border-zinc-850 p-2.5 rounded-xl flex flex-wrap justify-between items-center gap-2">
        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Table className="h-3.5 w-3.5 text-indigo-400" />
          <span>Analytical Reports (Google Sheets Formatted)</span>
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => triggerReportExport('qa')}
            className="px-2.5 py-1 text-[10px] font-mono border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:text-indigo-400 text-slate-300 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>QA Report</span>
          </button>
          <button
            onClick={() => triggerReportExport('val')}
            className="px-2.5 py-1 text-[10px] font-mono border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:text-indigo-400 text-slate-300 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>Validation Report</span>
          </button>
          <button
            onClick={() => triggerReportExport('business')}
            className="px-2.5 py-1 text-[10px] font-mono border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:text-indigo-400 text-slate-300 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>Business Report</span>
          </button>
        </div>
      </div>

      {/* List / Grid Display */}
      {filteredSubmissions.length === 0 ? (
        <SubmissionEmptyState />
      ) : (
        <div className="border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-950/60 border-b border-zinc-850 text-slate-500 font-mono text-[10px] tracking-wider uppercase">
                  <th className="p-3.5">Submission ID</th>
                  <th className="p-3.5">Task ID</th>
                  <th className="p-3.5">Time Elapsed</th>
                  <th className="p-3.5">Ingestion Status</th>
                  <th className="p-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850/65 text-slate-300">
                {filteredSubmissions.map((sub) => (
                  <tr 
                    key={sub.submissionId}
                    className="hover:bg-zinc-900/20 transition-colors group cursor-pointer"
                    onClick={() => onSelect(sub)}
                  >
                    <td className="p-3.5 font-mono text-indigo-400 font-bold group-hover:text-indigo-300">
                      {sub.submissionId}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 font-light truncate max-w-[120px]">
                      {sub.taskId}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">
                      {sub.elapsedTime}s
                    </td>
                    <td className="p-3.5">
                      <SubmissionStatusBadge status={sub.submissionStatus} />
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
                        className="p-1 text-slate-500 group-hover:text-white rounded-lg hover:bg-zinc-900/60 transition-colors cursor-pointer"
                        aria-label={`Inspect submission ${sub.submissionId}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. MAIN SUBMISSIONS MANAGEMENT SHELL
// ==========================================

export function SubmissionShell() {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  return (
    <div className="space-y-6 text-left" id="submission-shell-master">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            <span>Universal Submission Engine</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Captured alignment validation ledger nodes. Coordinates consensus integrity verification audits.
          </p>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <SubmissionSummary />

      {/* Network Health Check Card */}
      <SubmissionQueueCard syncCount={0} />

      {/* Double Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Submissions list with Filter selectors */}
        <div className={`${selectedSub ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300 space-y-4`}>
          <SubmissionHistory onSelect={setSelectedSub} />
        </div>

        {/* Right Side: Selected Submission Preview Inspector */}
        {selectedSub && (
          <div className="lg:col-span-5 h-[580px] lg:sticky lg:top-4 animate-fade-in">
            <SubmissionPreview 
              submission={selectedSub} 
              onClose={() => setSelectedSub(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
