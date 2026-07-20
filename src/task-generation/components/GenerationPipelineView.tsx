/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, Database, FileText, Code, CheckCircle, 
  Play, Eye, HelpCircle, Activity, RefreshCw, Layers, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useTaskGeneration } from '../context/TaskGenerationContext';
import { useDatasets } from '../../datasets/context/DatasetContext';
import { TaskGenPipelineStatus } from '../types';
import { TaskDifficulty } from '../../types/tasks';

export const GenerationPipelineView: React.FC = () => {
  const { pipelines, templates, triggerPipelineRun, isOnline } = useTaskGeneration();
  const { datasets } = useDatasets();

  // Active pipelines filter / list
  const [activePipelineLogId, setActivePipelineLogId] = useState<string | null>(null);

  // Form State
  const [pipelineName, setPipelineName] = useState('');
  const [selectedDatasetId, setSelectedDatasetId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [taskType, setTaskType] = useState('AI Response Comparison');
  const [sourceContent, setSourceContent] = useState('');
  const [mediaUrlsInput, setMediaUrlsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Handle template selection change to auto-fill task type
  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setTaskType(template.taskType);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipelineName || !selectedDatasetId || !selectedTemplateId) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const selectedDataset = datasets.find(d => d.id === selectedDatasetId);
      const datasetName = selectedDataset ? selectedDataset.name : 'Custom Dataset Ingestion';
      
      const mediaUrls = mediaUrlsInput
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.startsWith('http'));

      const pipeId = await triggerPipelineRun(
        pipelineName,
        selectedDatasetId,
        datasetName,
        taskType,
        selectedTemplateId,
        sourceContent,
        mediaUrls
      );

      setSuccessMsg(`Inference Pipeline "${pipelineName}" successfully queued under ID: ${pipeId}`);
      // Reset form
      setPipelineName('');
      setSelectedDatasetId('');
      setSelectedTemplateId('');
      setSourceContent('');
      setMediaUrlsInput('');
    } catch (err: any) {
      alert(`Pipeline initialization failed: ${err?.message || 'Error occurred.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPipelineLogs = pipelines.find(p => p.id === activePipelineLogId);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Left side: Pipeline Trigger Console (8 columns) */}
      <div className="xl:col-span-8 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-5">
        
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
          <div>
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Configure Task Generation Pipeline
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Automated deep chunking & microtask mapping engine</p>
          </div>
          {!isOnline && (
            <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg animate-pulse">
              OFFLINE BUFFER QUEUED
            </span>
          )}
        </div>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3.5 text-xs font-mono flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pipeline Name */}
            <div className="space-y-1">
              <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider">Pipeline Identity Name *</label>
              <input
                type="text"
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                placeholder="e.g. Red-Teaming Jailbreak Evaluation Track"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5 focus:border-indigo-500 focus:outline-none rounded-xl"
                required
              />
            </div>

            {/* Dataset Selector */}
            <div className="space-y-1">
              <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider">Approved Source Dataset *</label>
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#131316] border border-slate-200 dark:border-white/5 focus:border-indigo-500 focus:outline-none rounded-xl"
                required
              >
                <option value="">Select an Approved Repository...</option>
                {datasets.map(ds => (
                  <option key={ds.id} value={ds.id}>{ds.name} ({ds.lifecycle})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Template Selector */}
            <div className="space-y-1">
              <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider">Reusable Microtask Template *</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#131316] border border-slate-200 dark:border-white/5 focus:border-indigo-500 focus:outline-none rounded-xl"
                required
              >
                <option value="">Select Taxonomy Template...</option>
                {templates.map(temp => (
                  <option key={temp.id} value={temp.id}>{temp.name} ({temp.taskType})</option>
                ))}
              </select>
            </div>

            {/* Task Type Definition */}
            <div className="space-y-1">
              <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider">Task Classification (Auto-filled)</label>
              <input
                type="text"
                value={taskType}
                readOnly
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Source Content Input */}
          <div className="space-y-1">
            <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider">Raw Text Dataset Content (Optional CSV/JSON/PDF Text)</label>
            <textarea
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              placeholder="Paste raw records content. For CSV: include header row.\nFor JSON: paste list of objects.\nOr write continuous text for PDF mock chunking."
              className="w-full h-24 px-3.5 py-2.5 bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5 focus:border-indigo-500 focus:outline-none rounded-xl font-mono"
            />
          </div>

          {/* Media references URL Input */}
          <div className="space-y-1">
            <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider">Target Image / Audio / Video URLs (Optional - One per line)</label>
            <textarea
              value={mediaUrlsInput}
              onChange={(e) => setMediaUrlsInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-...\nhttps://actions.google.com/..."
              className="w-full h-16 px-3.5 py-2.5 bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5 focus:border-indigo-500 focus:outline-none rounded-xl font-mono text-[10px]"
            />
          </div>

          {/* Trigger button */}
          <div className="pt-2 border-t border-slate-150 dark:border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white font-bold rounded-xl cursor-pointer shadow-lg hover:shadow-indigo-500/10 flex items-center gap-1.5 transition-all text-xs"
            >
              <Play className="h-4 w-4" />
              {isSubmitting ? 'Analyzing & Generation Running...' : 'Execute Task Ingestion & Parameter prediction'}
            </button>
          </div>

        </form>

      </div>

      {/* Right side: Pipeline Monitor Panel (4 columns) */}
      <div className="xl:col-span-4 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-indigo-400" />
            Active Pipelines ({pipelines.length})
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time inference queue telemetry</p>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {pipelines.length === 0 ? (
            <div className="py-8 text-center text-slate-500 font-mono text-[10px]">
              No pipelines configured yet.
            </div>
          ) : (
            pipelines.map(pipe => {
              const statusColor = 
                pipe.status === TaskGenPipelineStatus.PUBLISHED ? 'text-emerald-400 bg-emerald-500/10' :
                pipe.status === TaskGenPipelineStatus.REVIEW_PENDING ? 'text-indigo-400 bg-indigo-500/10' :
                pipe.status === TaskGenPipelineStatus.FAILED ? 'text-rose-400 bg-rose-500/10' :
                'text-amber-400 bg-amber-500/10 animate-pulse';

              return (
                <div key={pipe.id} className="p-3 bg-slate-50 dark:bg-white/1 border border-slate-150 dark:border-white/5 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[10px] font-bold text-slate-900 dark:text-zinc-200 truncate max-w-[150px]" title={pipe.name}>
                      {pipe.name}
                    </span>
                    <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded font-bold ${statusColor}`}>
                      {pipe.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] text-slate-500">
                      <span>Inference Progression</span>
                      <span>{pipe.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-300" 
                        style={{ width: `${pipe.progressPercentage}%` }} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-500 pt-1 border-t border-slate-200 dark:border-white/5">
                    <div>
                      <span>Chunks: </span>
                      <span className="font-bold text-slate-900 dark:text-slate-300">{pipe.generatedCount}</span>
                    </div>
                    <div>
                      <span>Est Cost: </span>
                      <span className="font-bold text-indigo-400">{pipe.estimatedCost} Coins</span>
                    </div>
                  </div>

                  {/* Audit details trigger */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setActivePipelineLogId(pipe.id === activePipelineLogId ? null : pipe.id)}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Eye className="h-3 w-3" /> 
                      {activePipelineLogId === pipe.id ? 'Close Logs' : 'View Pipeline Logs'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pipeline logs details drawer */}
        {selectedPipelineLogs && (
          <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
            <h4 className="text-[10px] font-bold font-mono text-slate-900 dark:text-slate-300 uppercase">
              Logs: {selectedPipelineLogs.name.substring(0, 20)}...
            </h4>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 max-h-[150px] overflow-y-auto space-y-1 font-mono text-[9px] text-slate-300 leading-relaxed">
              {selectedPipelineLogs.telemetryLogs.map((log, i) => (
                <div key={i} className="text-slate-400">
                  <span className="text-indigo-400">&gt;&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
