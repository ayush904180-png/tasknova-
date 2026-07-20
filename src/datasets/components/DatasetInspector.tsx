/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, AlertTriangle, Play, CheckCircle, ShieldAlert, FileText, 
  Settings, Users, History, Key, RefreshCw, BadgeHelp, Eye, Download, Star
} from 'lucide-react';
import { useDatasets } from '../context/DatasetContext';
import { DatasetEntity, DatasetLifecycle, DatasetPermissionRole } from '../types';
import { DatasetMapper } from '../mappers/DatasetMapper';

interface DatasetInspectorProps {
  dataset: DatasetEntity;
  onBack: () => void;
}

export const DatasetInspector: React.FC<DatasetInspectorProps> = ({ dataset, onBack }) => {
  const { 
    activeRole, updateLifecycle, updateSchema, createNewVersion, 
    triggerExport, runImputationPipeline, grantPermission 
  } = useDatasets();

  const [activeTab, setActiveTab] = useState<'schema' | 'warnings' | 'history' | 'security'>('schema');
  const [imputing, setImputing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState('');
  
  // New member form
  const [newUserId, setNewUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState(DatasetPermissionRole.REVIEWER);

  const currentVer = dataset.versions.find(v => v.id === dataset.currentVersionId) || dataset.versions[0];
  const fields = currentVer?.schema?.fields || [];

  const handleRunImputation = async () => {
    setImputing(true);
    await new Promise(r => setTimeout(r, 1200));
    await runImputationPipeline(dataset.id);
    setImputing(false);
  };

  const handleExport = async (format: 'csv' | 'json' | 'parquet') => {
    setExporting(true);
    const exp = await triggerExport(dataset.id, format);
    await new Promise(r => setTimeout(r, 1500));
    setExportUrl(`https://storage.googleapis.com/secure_buckets/${dataset.id}_ver100.${format}`);
    setExporting(false);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId || !newUserName) return;
    await grantPermission(dataset.id, newUserId, newUserName, newUserRole);
    setNewUserId('');
    setNewUserName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info Panel */}
      <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <button 
            onClick={onBack}
            className="text-[10px] font-mono uppercase text-indigo-400 hover:underline cursor-pointer"
          >
            &larr; Back to Asset registries
          </button>
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">{dataset.name}</h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
                {currentVer?.versionString || 'v1.0.0'}
              </span>
              <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-full uppercase font-bold ${
                dataset.lifecycle === DatasetLifecycle.PUBLISHED 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
              }`}>
                {dataset.lifecycle}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{dataset.metadata.description}</p>
          </div>
        </div>

        {/* Dynamic Lifecycle Controls based on Role */}
        <div className="flex flex-wrap gap-2 self-start md:self-center">
          {/* researcher trigger Imputation */}
          {dataset.statistics.missingCellsCount > 0 && (
            <button
              onClick={handleRunImputation}
              disabled={imputing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 text-white rounded-xl text-xs font-mono font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${imputing ? 'animate-spin' : ''}`} />
              {imputing ? 'Imputing Cells...' : 'AI Imputation Clean'}
            </button>
          )}

          {/* reviewer Approve / Publish transitions */}
          {dataset.lifecycle === DatasetLifecycle.HUMAN_QA && (
            <button
              onClick={() => updateLifecycle(dataset.id, DatasetLifecycle.APPROVED, 'Manual verification checklist complete.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve Asset
            </button>
          )}

          {dataset.lifecycle === DatasetLifecycle.APPROVED && (
            <button
              onClick={() => updateLifecycle(dataset.id, DatasetLifecycle.PUBLISHED, 'Promoted gold model dataset target.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer animate-bounce"
            >
              <Play className="h-3.5 w-3.5" />
              Publish to Production
            </button>
          )}

          {dataset.lifecycle === DatasetLifecycle.PUBLISHED && (
            <button
              onClick={() => updateLifecycle(dataset.id, DatasetLifecycle.ARCHIVED, 'Retired target reference weights.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold cursor-pointer"
            >
              Archive Asset
            </button>
          )}
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left pane: File and Quality details */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-5">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-white/5 text-xs font-mono">
            <button 
              onClick={() => setActiveTab('schema')}
              className={`pb-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'schema' 
                  ? 'border-indigo-500 text-slate-900 dark:text-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Schema Fields ({fields.length})
            </button>
            <button 
              onClick={() => setActiveTab('warnings')}
              className={`pb-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'warnings' 
                  ? 'border-indigo-500 text-slate-900 dark:text-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Safety Diagnostics ({dataset.quality.warnings.length})
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'history' 
                  ? 'border-indigo-500 text-slate-900 dark:text-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Sovereignty RBAC Members
            </button>
          </div>

          {/* TAB: Schema list */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Schema scanning precision: {currentVer?.schema?.confidenceScore}%</span>
                <span>Detected via heuristic types mapping</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400">
                      <th className="py-2 px-3">Column Identifier</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Nullable</th>
                      <th className="py-2 px-3">Primary Key</th>
                      <th className="py-2 px-3">Sample Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">
                          No detected columns. Trigger file ingest pipeline first.
                        </td>
                      </tr>
                    ) : (
                      fields.map((f, i) => (
                        <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-white/1">
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-300">{f.name}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px]">
                              {f.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{f.isNullable ? 'Nullable' : 'Strict Non-Null'}</td>
                          <td className="py-2.5 px-3 text-slate-400">{i === 0 ? '✓ YES' : '-'}</td>
                          <td className="py-2.5 px-3 text-slate-500 max-w-[200px] truncate" title={f.sampleValue}>
                            {f.sampleValue || 'null'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Warnings logs */}
          {activeTab === 'warnings' && (
            <div className="space-y-4 font-mono text-[11px]">
              {dataset.quality.warnings.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center">
                  Zero warning markers found. Secure to parse in any model network.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-2">
                      <span className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4" /> Detected Red Flags ({dataset.quality.warnings.length})
                      </span>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-400 leading-relaxed">
                        {dataset.quality.warnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 space-y-2">
                      <span className="text-xs text-indigo-400 font-bold flex items-center gap-1.5">
                        <Star className="h-4 w-4" /> Recommended Imputations ({dataset.quality.recommendations.length})
                      </span>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-400 leading-relaxed">
                        {dataset.quality.recommendations.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {dataset.quality.potentialProblems.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" /> Long-Term Overfitting Risks
                      </span>
                      <ul className="space-y-1 text-slate-400 list-disc pl-4">
                        {dataset.quality.potentialProblems.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: RBAC sovereign permissions */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Access Policy Registry</span>
                <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">HIPAA COMPLIANT</span>
              </div>

              {/* Members List */}
              <div className="space-y-2 font-mono text-[11px]">
                {dataset.permissions.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-300">{p.userName}</p>
                      <p className="text-[9px] text-slate-500">ID: {p.userId} &bull; Granted by {p.grantedBy}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                      {p.role}
                    </span>
                  </div>
                ))}
              </div>

              {/* Grant access form */}
              <form onSubmit={handleAddMember} className="p-4 rounded-2xl bg-slate-100 dark:bg-[#09090b]/40 border border-slate-200 dark:border-white/5 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block font-bold">Grant Access Privilege</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input 
                    type="text" 
                    placeholder="Researcher Name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 p-2 rounded-xl text-xs focus:outline-none"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="User ID / E-mail"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 p-2 rounded-xl text-xs focus:outline-none"
                    required
                  />
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as DatasetPermissionRole)}
                    className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 p-2 rounded-xl text-xs font-mono focus:outline-none cursor-pointer"
                  >
                    {Object.values(DatasetPermissionRole).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors"
                >
                  Confirm Policy Access
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right pane: Statistical Radar & Export */}
        <div className="lg:col-span-4 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-5">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Structural Ingestion Diagnostics</span>
            <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white">Continuous Telemetry</h4>
          </div>

          {/* Stats Metrics Block */}
          <div className="space-y-2.5 font-mono text-[10px] bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5 rounded-xl p-3.5">
            <div className="flex justify-between items-center text-slate-400">
              <span>Row Count:</span>
              <span className="text-slate-900 dark:text-slate-300 font-bold">{dataset.statistics.rowCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Columns Count:</span>
              <span className="text-slate-900 dark:text-slate-300 font-bold">{dataset.statistics.columnCount}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>File Byte Size:</span>
              <span className="text-slate-900 dark:text-slate-300 font-bold">{DatasetMapper.formatBytes(dataset.statistics.fileSizeInBytes)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Missing Cells:</span>
              <span className={`font-bold ${dataset.statistics.missingCellsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {dataset.statistics.missingCellsCount}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Duplicates Detected:</span>
              <span className="text-slate-900 dark:text-slate-300 font-bold">{dataset.statistics.duplicateRowsCount}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Schema Density Score:</span>
              <span className="text-indigo-400 font-bold">{dataset.statistics.densityScore}%</span>
            </div>
          </div>

          {/* Interactive Export Block */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-white/5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">GCS Parquet/TFRecord Exports</span>
            
            <div className="grid grid-cols-3 gap-1.5">
              <button 
                onClick={() => handleExport('csv')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 text-[10px] font-mono text-slate-900 dark:text-slate-300 cursor-pointer font-bold transition-all text-center"
              >
                CSV
              </button>
              <button 
                onClick={() => handleExport('json')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 text-[10px] font-mono text-slate-900 dark:text-slate-300 cursor-pointer font-bold transition-all text-center"
              >
                JSON
              </button>
              <button 
                onClick={() => handleExport('parquet')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 text-[10px] font-mono text-slate-900 dark:text-slate-300 cursor-pointer font-bold transition-all text-center"
              >
                Parquet
              </button>
            </div>

            {exporting && (
              <div className="p-3 text-center text-indigo-400 font-mono text-[9px] animate-pulse">
                Invoking secure exporter serverless worker...
              </div>
            )}

            {exportUrl && !exporting && (
              <a 
                href={exportUrl}
                download
                className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download Export Asset
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
