/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, LineChart, FileUp, ShieldAlert, Shield, 
  Trash2, Eye, Lock, Layers, Calendar, ChevronRight, Activity, Clock
} from 'lucide-react';
import { useDatasets } from '../context/DatasetContext';
import { DatasetLifecycle, DatasetCategory, DatasetPermissionRole } from '../types';
import { DatasetBentoDashboard } from '../components/DatasetBentoDashboard';
import { DatasetSearchAndFilters } from '../components/DatasetSearchAndFilters';
import { DatasetUploadCenter } from '../components/DatasetUploadCenter';
import { DatasetInspector } from '../components/DatasetInspector';
import { DatasetMapper } from '../mappers/DatasetMapper';

export const EnterpriseDatasetIntelligencePlatform: React.FC = () => {
  const { 
    datasets, activeRole, setActiveRole, auditLogs, deleteDataset 
  } = useDatasets();

  // Active view tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registries' | 'upload'>('dashboard');
  
  // Selected dataset for deep inspection
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLifecycle, setSelectedLifecycle] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter datasets
  const filtered = datasets.filter((ds) => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ds.metadata.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ds.category === selectedCategory;
    const matchesLifecycle = selectedLifecycle === 'all' || ds.lifecycle === selectedLifecycle;
    return matchesSearch && matchesCategory && matchesLifecycle;
  });

  // Sort datasets
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'rowsHigh') return b.statistics.rowCount - a.statistics.rowCount;
    if (sortBy === 'rowsLow') return a.statistics.rowCount - b.statistics.rowCount;
    if (sortBy === 'qualityHigh') return b.quality.qualityScore - a.quality.qualityScore;
    if (sortBy === 'sizeHigh') return b.statistics.fileSizeInBytes - a.statistics.fileSizeInBytes;
    return 0;
  });

  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId);

  return (
    <div className="space-y-6">
      
      {/* Platform Title Banner / Global Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            Enterprise Dataset Intelligence Platform
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Continuous automated validation, data cleaning, schema detection, and model baseline publishing.</p>
        </div>

        {/* Action Controls & Role Simulation Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-xl text-xs font-mono">
            <Shield className="h-4 w-4 text-indigo-400 flex-shrink-0" />
            <span className="text-slate-500">Access Role:</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as DatasetPermissionRole)}
              className="bg-transparent text-slate-900 dark:text-slate-300 font-bold focus:outline-none cursor-pointer border-none"
            >
              {Object.values(DatasetPermissionRole).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sub-view selection tabs bar (if not inspecting detailed view) */}
      {!selectedDatasetId && (
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10'
                : 'bg-white dark:bg-[#131316] border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <LineChart className="h-4 w-4" />
            Analytics Bento Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('registries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'registries'
                ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10'
                : 'bg-white dark:bg-[#131316] border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <Database className="h-4 w-4" />
            Managed Registries ({datasets.length})
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10'
                : 'bg-white dark:bg-[#131316] border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <FileUp className="h-4 w-4" />
            Configure Ingest Pipeline
          </button>
        </div>
      )}

      {/* RENDER VIEW BLOCKS */}
      {selectedDataset ? (
        <DatasetInspector 
          dataset={selectedDataset} 
          onBack={() => setSelectedDatasetId(null)} 
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Main Workspace Area (Left 8 Columns) */}
          <div className="xl:col-span-8 space-y-6">
            
            {activeTab === 'dashboard' && <DatasetBentoDashboard />}

            {activeTab === 'upload' && <DatasetUploadCenter />}

            {activeTab === 'registries' && (
              <div className="space-y-4">
                {/* Search Filter Strip */}
                <DatasetSearchAndFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedLifecycle={selectedLifecycle}
                  setSelectedLifecycle={setSelectedLifecycle}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                {/* Grid list of assets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sorted.length === 0 ? (
                    <div className="col-span-2 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-10 text-center text-slate-500 text-xs">
                      No managed datasets matches the query filters.
                    </div>
                  ) : (
                    sorted.map((ds) => {
                      const healthColor = ds.health.status === 'optimal' 
                        ? 'text-emerald-400' 
                        : ds.health.status === 'degraded' 
                          ? 'text-amber-400 animate-pulse' 
                          : 'text-rose-400 animate-bounce';

                      return (
                        <div 
                          key={ds.id} 
                          className="bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between group hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/2 transition-all relative overflow-hidden"
                        >
                          {ds.metadata.isConfidential && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.2 rounded-md">
                              <Lock className="h-2.5 w-2.5" /> SOC-2 LOCKED
                            </div>
                          )}

                          <div className="space-y-2">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">{ds.category}</span>
                            <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white truncate pr-16">{ds.name}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{ds.metadata.description}</p>
                          </div>

                          {/* Inline Stats Mini-Row */}
                          <div className="grid grid-cols-3 gap-2 font-mono text-[10px] bg-slate-50 dark:bg-white/1 border border-slate-150 dark:border-white/5 rounded-xl p-2.5 text-slate-400">
                            <div>
                              <span className="block text-slate-500 text-[8px] uppercase">RowCount</span>
                              <span className="font-bold text-slate-900 dark:text-slate-300">{(ds.statistics.rowCount / 1000).toFixed(1)}K</span>
                            </div>
                            <div>
                              <span className="block text-slate-500 text-[8px] uppercase">ByteSize</span>
                              <span className="font-bold text-slate-900 dark:text-slate-300">
                                {DatasetMapper.formatBytes(ds.statistics.fileSizeInBytes).split(' ')[0]}
                                <span className="text-[8px] ml-0.5">{DatasetMapper.formatBytes(ds.statistics.fileSizeInBytes).split(' ')[1]}</span>
                              </span>
                            </div>
                            <div>
                              <span className="block text-slate-500 text-[8px] uppercase">Quality</span>
                              <span className="font-bold text-indigo-400">{ds.quality.qualityScore}%</span>
                            </div>
                          </div>

                          {/* Footer Action buttons */}
                          <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase ${
                              ds.lifecycle === DatasetLifecycle.PUBLISHED 
                                ? 'text-emerald-400' 
                                : 'text-amber-400 animate-pulse'
                            }`}>
                              <Activity className={`h-3 w-3 ${healthColor}`} />
                              {ds.lifecycle}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Inspector detailed trigger */}
                              <button
                                onClick={() => setSelectedDatasetId(ds.id)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-slate-300 text-[10px] font-mono font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                <Eye className="h-3 w-3" /> Audit
                              </button>

                              {activeRole === DatasetPermissionRole.OWNER && (
                                <button
                                  onClick={() => deleteDataset(ds.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/5 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Audit Trail Sidebar LEDGER (Right 4 Columns) */}
          <div className="xl:col-span-4 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
              <div>
                <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-indigo-400 animate-pulse" />
                  SOC-2 Continuous Audit Ledger
                </h4>
                <p className="text-[9px] text-slate-500 font-mono mt-0.5">Cryptographically signed operations stream</p>
              </div>
            </div>

            {/* Audit Logs list */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-500 font-mono text-[10px]">
                  Zero audits logged yet. Upload files to generate.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5 rounded-xl font-mono text-[10px] space-y-1.5 relative overflow-hidden">
                    <div className="flex justify-between items-start text-slate-400">
                      <span className="text-indigo-400 font-bold">{log.userName}</span>
                      <span className="text-[8px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-300 text-[10px] leading-relaxed">{log.comment}</p>
                    <div className="pt-1.5 border-t border-slate-150 dark:border-white/5 flex justify-between items-center text-[9px] text-slate-500">
                      <span>{log.previousState} &rarr; {log.newState}</span>
                      <span className="text-[8px] bg-white/5 px-1 py-0.2 rounded">{log.ipAddress}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
export default EnterpriseDatasetIntelligencePlatform;
