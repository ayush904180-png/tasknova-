/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, Database, FileSpreadsheet, Eye, Trash2, CheckCircle, 
  AlertTriangle, FileArchive, Search, Plus, Filter, RefreshCw,
  ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { Dataset } from '../types';

export const DatasetManager: React.FC = () => {
  const { datasets, uploadDataset } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [previewDatasetId, setPreviewDatasetId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual select simulation files
  const simulationFiles = [
    { name: 'OpenAI Medical Prompt Library.json', type: 'json', size: '14.2 MB' },
    { name: 'Gemini Ultra Scene Bounding Boxes.csv', type: 'csv', size: '38.6 MB' },
    { name: 'Anthropic Coding Challenges Corrupted.zip', type: 'zip', size: '112.5 MB' }, // Demonstrates validation warning
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const extension = file.name.split('.').pop() || 'json';
      const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      await uploadDataset(file.name, extension, formattedSize);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const extension = file.name.split('.').pop() || 'json';
      const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      await uploadDataset(file.name, extension, formattedSize);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSimulationUpload = async (sim: typeof simulationFiles[0]) => {
    await uploadDataset(sim.name, sim.type, sim.size);
  };

  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === 'all' || ds.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const previewTarget = datasets.find((d) => d.id === previewDatasetId);

  return (
    <div className="space-y-6">
      
      {/* Top action grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left pane: File drag-and-drop box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="h-4 w-4 text-indigo-400" />
                Ingest Prompt Data Library
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports CSV, JSON, ZIP archives, images, audio directories, and nested structure folders.</p>
            </div>

            {/* Ingest Drag box */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerUploadClick}
              className={`h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-500/5' 
                  : 'border-slate-200 dark:border-white/5 hover:border-white/10 hover:bg-white/1'
              }`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".csv,.json,.zip,.txt"
              />
              <Database className="h-8 w-8 text-slate-400 animate-bounce" />
              <p className="text-xs text-slate-900 dark:text-slate-300 font-bold mt-3">Drag files here or click to select</p>
              <p className="text-[10px] text-slate-500 mt-1">Automatic schema, row parsing, and error-scans on ingest.</p>
            </div>

            {/* Quick seeds trigger */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Quick Simulation Templates</span>
              <div className="grid grid-cols-1 gap-1.5">
                {simulationFiles.map((sim, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSimulationUpload(sim)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/1 border border-slate-200 dark:border-white/5 hover:bg-white/5 text-xs text-left cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="font-mono text-slate-900 dark:text-slate-300 truncate max-w-[200px]">{sim.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{sim.size}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right pane: Dataset grid checklist */}
        <div className="lg:col-span-7 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-400" />
                Corporate Asset Registries
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">List of ingested model prompt datasets and validity audits.</p>
            </div>

            <div className="flex items-center gap-2 self-start">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border border-white/5 pl-8 pr-3 py-1 text-xs text-slate-900 dark:text-white rounded focus:outline-none"
                />
              </div>

              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="bg-white/5 border border-white/5 text-[10px] p-1.5 rounded text-indigo-400"
              >
                <option value="all">All formats</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="zip">ZIP</option>
              </select>
            </div>
          </div>

          {/* Dataset list Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Dataset Name</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Rows</th>
                  <th className="py-2.5 px-3">Validation Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDatasets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      No matching registered datasets found.
                    </td>
                  </tr>
                ) : (
                  filteredDatasets.map((ds) => (
                    <tr key={ds.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-300 max-w-[180px] truncate" title={ds.name}>
                        {ds.name}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{ds.size}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{ds.rowCount.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] uppercase font-mono ${
                          ds.status === 'valid' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : ds.status === 'validating'
                              ? 'bg-amber-500/10 text-amber-400 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {ds.status === 'valid' && <CheckCircle className="h-3 w-3" />}
                          {ds.status === 'invalid' && <AlertTriangle className="h-3 w-3" />}
                          {ds.status === 'validating' && <RefreshCw className="h-3 w-3 animate-spin" />}
                          {ds.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setPreviewDatasetId(ds.id)}
                          className="p-1 text-indigo-400 hover:text-white rounded hover:bg-white/5 cursor-pointer inline-flex items-center gap-1"
                          title="View schema detections and errors log"
                        >
                          <Eye className="h-3.5 w-3.5" /> <span className="text-[10px]">Audit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Dataset schema auditing / broken validation log */}
      {previewTarget && (() => {
        // Validation Parameters Calculation
        const isCorrupt = previewTarget.status === 'invalid';
        const healthScore = isCorrupt ? 64 : 98;
        const emptyCellsCount = isCorrupt ? 24 : 0;
        const duplicateRows = isCorrupt ? 15 : 0;

        // Interactive preview rows generator based on dataset type
        const mockRows: { id: string; c1: string; c2: string; c3: string; c4: string; c5: string }[] = [];
        
        if (previewTarget.type === 'csv' || previewTarget.name.toLowerCase().includes('csv')) {
          const headers = previewTarget.detectedSchema;
          const rowsPool = [
            { c1: 'usr_8231', c2: 'https://images.tasknova.ai/scenes/021.jpg', c3: '[45, 108, 220, 310]', c4: '1920x1080', c5: 'Valid' },
            { c1: 'usr_1029', c2: 'https://images.tasknova.ai/scenes/042.jpg', c3: '[12, 50, 110, 190]', c4: '1920x1080', c5: 'Valid' },
            { c1: 'usr_4910', c2: 'https://images.tasknova.ai/scenes/109.jpg', c3: '[80, 240, 520, 680]', c4: '1280x720', c5: 'Valid' },
            { c1: 'usr_5021', c2: 'https://images.tasknova.ai/scenes/004.jpg', c3: '[200, 310, 480, 710]', c4: '3840x2160', c5: 'Valid' },
            { c1: 'usr_2831', c2: 'https://images.tasknova.ai/scenes/904.jpg', c3: '[90, 80, 410, 500]', c4: '1280x720', c5: 'Valid' },
            { c1: 'usr_4901', c2: 'https://images.tasknova.ai/scenes/882.jpg', c3: '[]', c4: '1280x720', c5: 'Warning' },
            { c1: 'usr_3910', c2: 'https://images.tasknova.ai/scenes/341.jpg', c3: '[15, 30, 90, 180]', c4: '1920x1080', c5: 'Valid' },
            { c1: 'usr_2011', c2: 'https://images.tasknova.ai/scenes/111.jpg', c3: '[5, 5, 40, 40]', c4: '640x480', c5: 'Valid' }
          ];
          rowsPool.forEach((r, idx) => {
            mockRows.push({ id: `row_${idx}`, ...r });
          });
        } else if (previewTarget.type === 'zip' || previewTarget.name.toLowerCase().includes('zip')) {
          const rowsPool = [
            { c1: 'aud_tr_9031_calib', c2: 'spk_104_us', c3: '14.2s', c4: 'Explain general relativity in laymans terms.', c5: '98% match' },
            { c1: 'aud_tr_1042_calib', c2: 'spk_098_in', c3: '8.5s', c4: 'Open the corporate treasury ledger immediately.', c5: '95% match' },
            { c1: 'aud_tr_4421_calib', c2: 'spk_112_gb', c3: '22.1s', c4: 'The quick brown fox jumps over the lazy dog.', c5: '99% match' },
            { c1: 'aud_tr_5521_calib', c2: 'spk_021_jp', c3: '11.0s', c4: 'Deploy cloud functions to production bucket.', c5: '92% match' },
            { c1: 'aud_tr_0019_calib', c2: 'spk_104_us', c3: '4.8s', c4: 'Is OpenAI GPT-5 released yet?', c5: '96% match' },
            { c1: 'aud_tr_2039_corrupt', c2: 'spk_341_de', c3: '0.0s', c4: '[CORRUPTED SIGNAL NOISE DETECTED]', c5: '0% match' },
            { c1: 'aud_tr_9931_calib', c2: 'spk_111_in', c3: '18.4s', c4: 'Validate data nodes and consensus models.', c5: '94% match' }
          ];
          rowsPool.forEach((r, idx) => {
            mockRows.push({ id: `row_${idx}`, ...r });
          });
        } else {
          // JSON or other formats (RLHF prompts)
          const rowsPool = [
            { c1: 'pr_9018', c2: 'Explain quantum electrodynamics in laymans terms.', c3: 'Quantum electrodynamics describes how light and matter interact.', c4: 'expert_gold', c5: 'Ready' },
            { c1: 'pr_4910', c2: 'How to bypass prompt inject guardrails?', c3: 'I cannot assist with bypassing security protocols.', c4: 'safety_check', c5: 'Flagged' },
            { c1: 'pr_1129', c2: 'Write an express JS server boilerplate code.', c3: 'import express from "express"; const app = express()...', c4: 'standard_dev', c5: 'Ready' },
            { c1: 'pr_0032', c2: 'What is the capital of France?', c3: 'The capital of France is Paris.', c4: 'general_kb', c5: 'Ready' },
            { c1: 'pr_8821', c2: 'Summarize Prompt #17.1 enterprise objectives.', c3: 'Implement Campaign Approval Workflows, Cost Estimators...', c4: 'expert_gold', c5: 'Ready' },
            { c1: 'pr_3301', c2: 'What is the boiling point of lead?', c3: 'The boiling point of lead is approximately 1749 °C.', c4: 'academic', c5: 'Ready' },
            { c1: 'pr_7721', c2: 'Compare Antigravity agent vs Gemini.', c3: 'Antigravity specializes in full-stack code deployments.', c4: 'tech_wiki', c5: 'Ready' }
          ];
          rowsPool.forEach((r, idx) => {
            mockRows.push({ id: `row_${idx}`, ...r });
          });
        }

        // Search & Pagination State for rows preview
        const [previewSearch, setPreviewSearch] = useState('');
        const [currentPage, setCurrentPage] = useState(0);
        const pageSize = 4;

        const filteredRows = mockRows.filter(r => 
          r.c1.toLowerCase().includes(previewSearch.toLowerCase()) ||
          r.c2.toLowerCase().includes(previewSearch.toLowerCase()) ||
          r.c3.toLowerCase().includes(previewSearch.toLowerCase()) ||
          r.c4.toLowerCase().includes(previewSearch.toLowerCase()) ||
          r.c5.toLowerCase().includes(previewSearch.toLowerCase())
        );

        const pageCount = Math.ceil(filteredRows.length / pageSize);
        const paginatedRows = filteredRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

        // Quality warning & suggestions
        const errorsList = isCorrupt 
          ? [
              'Critical: Duplicate rows constraint violated. 15 identical rows detected.',
              'Critical: Corrupted audio frame payload detected on index row_5.',
              'Schema Mismatch: Column count mismatch on index rows 12 and 34.'
            ]
          : [];

        const warningsList = isCorrupt
          ? [
              'Warning: Detected 24 null values across optional metadata tags.',
              'Warning: Non-ASCII filename character encoding found on folder archives.'
            ]
          : [
              'Optimized: Content compression complies with corporate bandwidth caps.'
            ];

        const suggestionsList = isCorrupt
          ? [
              'Execute deduplication filter script: "npm run clean-csv --file=' + previewTarget.name + '"',
              'Convert target audio rate to standard nominal mono-channel 16kHz WAV.',
              'Ensure all text cells have non-null entries prior to RLHF consensus ingestion.'
            ]
          : [
              'Schema is 100% compliant. File structure matches TaskNova RLHF template specifications perfectly.',
              'Recommended campaign allocation tier: Gold or Platinum (expert alignment validators).'
            ];

        return (
          <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
                  Enterprise Validation & Ingestion Report: <span className="font-mono text-indigo-400">{previewTarget.name}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated parsing logs, format scanning checklist, and interactive row previews.</p>
              </div>
              <button
                onClick={() => setPreviewDatasetId(null)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 hover:dark:bg-white/10"
              >
                Close Report
              </button>
            </div>

            {/* Validation Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Radial Gauge / Score */}
              <div className="lg:col-span-3 flex flex-col items-center justify-center bg-white/1 border border-slate-200 dark:border-white/5 p-5 rounded-2xl text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Validation Score</span>
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" strokeWidth="8" stroke="rgba(99,102,241,0.06)" fill="transparent" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      strokeWidth="8" 
                      stroke={isCorrupt ? '#f43f5e' : '#10b981'} 
                      fill="transparent" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className={`absolute text-2xl font-black font-display ${isCorrupt ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {healthScore}
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider mt-3 px-2 py-0.5 rounded ${isCorrupt ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                  {isCorrupt ? 'REJECTED' : 'APPROVED'}
                </span>
              </div>

              {/* Checklist details */}
              <div className="lg:col-span-4 bg-white/1 border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block border-b border-white/5 pb-1">Automated Checklist Checks</span>
                
                <div className="space-y-2 font-mono">
                  {[
                    { name: 'Duplicated files check', ok: !isCorrupt, detail: isCorrupt ? '15 duplicate hashes' : '0 duplicates' },
                    { name: 'Corrupted upload check', ok: !isCorrupt, detail: isCorrupt ? '1 corrupted file frame' : 'Healthy stream' },
                    { name: 'Encoding standard (UTF-8)', ok: true, detail: 'UTF-8 Nominal' },
                    { name: 'Special characters match', ok: !isCorrupt, detail: isCorrupt ? 'Unsafe filenames' : 'Standard ASCII' },
                    { name: 'MIME types scan', ok: true, detail: 'Supported MIME' },
                    { name: 'Recommended sizing bounds', ok: true, detail: previewTarget.size }
                  ].map((chk, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] border-b border-slate-200 dark:border-white/5 pb-1">
                      <span className="text-slate-400 truncate max-w-[170px]">{chk.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-500">({chk.detail})</span>
                        {chk.ok ? (
                          <span className="text-emerald-400">✔</span>
                        ) : (
                          <span className="text-rose-400 font-bold">✘</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions / Alerts logs */}
              <div className="lg:col-span-5 bg-white/1 border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3.5 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block border-b border-white/5 pb-1">Alerts & Suggestive Remediation</span>
                  
                  {isCorrupt ? (
                    <div className="space-y-2 mt-2 font-mono text-[11px] text-rose-400">
                      {errorsList.map((err, idx) => (
                        <p key={idx} className="flex items-start gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                          <span>{err}</span>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-400 font-bold flex items-center gap-1.5 mt-2 font-mono text-[11px]">
                      <CheckCircle className="h-3.5 w-3.5" /> Validation checks passed completely. Metadata is clean.
                    </p>
                  )}
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 space-y-1.5 mt-2">
                  <p className="text-[10px] uppercase font-mono font-bold text-indigo-400 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Automated Action Suggestions:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 leading-relaxed font-mono">
                    {suggestionsList.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Preview Console */}
            <div className="bg-white/1 border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
                <div>
                  <h5 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-indigo-400" /> Ingestion Preview Rows Console
                  </h5>
                  <p className="text-[10px] text-slate-400">Interactive live search, column layout schemas, and cell mapping tests.</p>
                </div>

                {/* Live Preview Search */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3 w-3 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search preview rows..."
                      value={previewSearch}
                      onChange={(e) => {
                        setPreviewSearch(e.target.value);
                        setCurrentPage(0);
                      }}
                      className="bg-white/5 border border-slate-200 dark:border-white/5 pl-8 pr-3 py-1 text-[10px] text-slate-900 dark:text-white rounded focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {previewTarget.type.toUpperCase()} Format
                  </span>
                </div>
              </div>

              {/* Dynamic Headers and rows */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400">
                      <th className="py-2 px-3">#ID</th>
                      {previewTarget.detectedSchema.slice(0, 4).map((h, idx) => (
                        <th key={idx} className="py-2 px-3 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500 text-xs">
                          No rows found matching search filter inside preview matrix.
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((row) => (
                        <tr key={row.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-all">
                          <td className="py-2.5 px-3 text-indigo-400 font-bold">{row.id.replace('row_', '#')}</td>
                          <td className="py-2.5 px-3 text-slate-900 dark:text-slate-300 max-w-[120px] truncate" title={row.c1}>{row.c1}</td>
                          <td className="py-2.5 px-3 text-slate-900 dark:text-slate-300 max-w-[280px] truncate" title={row.c2}>
                            {row.c2.startsWith('http') ? (
                              <a href={row.c2} referrerPolicy="no-referrer" target="_blank" rel="noreferrer" className="text-indigo-400 underline hover:text-indigo-300">{row.c2}</a>
                            ) : row.c2}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 max-w-[150px] truncate" title={row.c3}>{row.c3}</td>
                          <td className="py-2.5 px-3 text-slate-400 max-w-[150px] truncate" title={row.c4}>{row.c4}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Preview Pagination controls */}
              {pageCount > 1 && (
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-white/5">
                  <span>Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, filteredRows.length)} of {filteredRows.length} rows</span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <span className="text-indigo-400 font-bold">Page {currentPage + 1} of {pageCount}</span>
                    <button
                      disabled={currentPage >= pageCount - 1}
                      onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
                      className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

    </div>
  );
};
