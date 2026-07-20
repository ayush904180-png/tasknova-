/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart2, Layers, ShieldCheck, Sparkles, Database, 
  Settings, Terminal, RefreshCw, Zap, Network, Wifi, WifiOff 
} from 'lucide-react';
import { TaskGenerationProvider, useTaskGeneration } from '../context/TaskGenerationContext';
import { TaskGenerationDashboard } from '../components/TaskGenerationDashboard';
import { GenerationPipelineView } from '../components/GenerationPipelineView';
import { TaskReviewCenter } from '../components/TaskReviewCenter';

const TaskGenerationPageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipelines' | 'review'>('dashboard');
  const { isOnline, isSyncing, syncOfflineQueue } = useTaskGeneration();

  return (
    <div className="space-y-6" id="enterprise-dataset-intelligence-module">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 dark:text-zinc-50 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Enterprise Task Generation Engine
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Continuous deep ingestion, microtask pipeline synthesis, parameter calibration & validation.</p>
        </div>

        {/* Sync & Online indicators */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {isOnline ? (
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-1.5 rounded-xl">
              <Wifi className="h-3.5 w-3.5" />
              <span>SLA Link: Live Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/10 px-2.5 py-1.5 rounded-xl">
              <WifiOff className="h-3.5 w-3.5" />
              <span>Offline: Queued Buffer Mode</span>
            </div>
          )}

          {isSyncing && (
            <div className="flex items-center gap-1.5 text-indigo-400 bg-indigo-500/10 border border-indigo-500/10 px-2.5 py-1.5 rounded-xl animate-pulse">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Syncing Queue...</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center border-b border-slate-200 dark:border-white/5 pb-0">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 text-xs font-bold font-display uppercase tracking-wider relative cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-extrabold' 
                : 'text-slate-400 hover:text-slate-300 border-b-2 border-transparent'
            }`}
          >
            Executive Dashboard
          </button>
          <button
            onClick={() => setActiveTab('pipelines')}
            className={`pb-3 text-xs font-bold font-display uppercase tracking-wider relative cursor-pointer ${
              activeTab === 'pipelines' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-extrabold' 
                : 'text-slate-400 hover:text-slate-300 border-b-2 border-transparent'
            }`}
          >
            Ingest & Generation Pipelines
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`pb-3 text-xs font-bold font-display uppercase tracking-wider relative cursor-pointer ${
              activeTab === 'review' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-extrabold' 
                : 'text-slate-400 hover:text-slate-300 border-b-2 border-transparent'
            }`}
          >
            Quality Control & Task Review
          </button>
        </div>
      </div>

      {/* Render selected tabs */}
      <div className="pt-2">
        {activeTab === 'dashboard' && <TaskGenerationDashboard />}
        {activeTab === 'pipelines' && <GenerationPipelineView />}
        {activeTab === 'review' && <TaskReviewCenter />}
      </div>

    </div>
  );
};

export const TaskGenerationPage: React.FC = () => {
  return (
    <TaskGenerationProvider id="standalone-task-generation-provider-wrapper">
      <TaskGenerationPageContent />
    </TaskGenerationProvider>
  );
};

export default TaskGenerationPage;
