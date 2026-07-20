/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, Database, FileSpreadsheet, Lock, Sparkles, PlusCircle } from 'lucide-react';
import { useDatasets } from '../context/DatasetContext';
import { DatasetCategory } from '../types';

export const DatasetUploadCenter: React.FC = () => {
  const { createDataset, startSimulatedFileUpload } = useDatasets();
  
  // Local form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DatasetCategory>(DatasetCategory.NLP_TEXT);
  const [description, setDescription] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual select simulation files
  const simulationFiles = [
    { name: 'Oncology Medical Scan Corpus.zip', type: 'zip', size: 125829120, category: DatasetCategory.MEDICAL_AI },
    { name: 'GPT-5 Advanced Reasoning Dialogue.json', type: 'json', size: 14889500, category: DatasetCategory.REINFORCEMENT_LEARNING },
    { name: 'Autonomous Scene Bounding Boxes.csv', type: 'csv', size: 40478000, category: DatasetCategory.COMPUTER_VISION },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processAndUploadFile = async (fileName: string, fileSize: number) => {
    setErrorMessage('');
    setSuccessMessage('');

    const finalName = name.trim() || fileName.split('.')[0].replace(/_/g, ' ') + ' Dataset';
    const finalDesc = description.trim() || `Auto-ingested dataset payload tracking ${fileName}.`;

    try {
      // 1. Create Container
      const newDataset = await createDataset(finalName, category, finalDesc);
      
      // Update confidential state
      newDataset.metadata.isConfidential = isConfidential;
      if (isConfidential) {
        newDataset.metadata.complianceLabels = ['HIPAA Secure', 'SOC-2 Locked'];
      }

      // 2. Start state-machine processing (Upload -> Scan -> Schema -> Quality -> QA)
      startSimulatedFileUpload(newDataset.id, { name: fileName, size: fileSize });
      
      // Reset form
      setName('');
      setDescription('');
      setIsConfidential(false);
      setSuccessMessage(`Successfully initialized ingestion pipelines for "${finalName}"!`);
    } catch (e) {
      setErrorMessage('Failed to trigger ingestion pipeline.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processAndUploadFile(files[0].name, files[0].size);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processAndUploadFile(files[0].name, files[0].size);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Metadata Configuration (Left Pane) */}
      <div className="lg:col-span-5 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
        <div>
          <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4 text-indigo-400" />
            Configure Ingest Pipeline
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Define asset namespaces, categories, and security parameters before uploading raw files.</p>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Dataset Name */}
          <div className="space-y-1">
            <label className="text-slate-400 font-mono text-[10px] uppercase">Dataset Name / Namespace</label>
            <input 
              type="text"
              placeholder="e.g. Chat Assistant Toxicity Tuning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 px-3 py-2 text-xs text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-slate-400 font-mono text-[10px] uppercase">Model Domain Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DatasetCategory)}
              className="w-full bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 px-3 py-2 text-xs text-slate-900 dark:text-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer"
            >
              {Object.values(DatasetCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-slate-400 font-mono text-[10px] uppercase">Abstract Description</label>
            <textarea 
              rows={2}
              placeholder="Provide a comprehensive summary of instructions, dataset biases, training logs, or licensing conditions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-white/5 px-3 py-2 text-xs text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Encryption / HIPAA Sovereignty */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/1 border border-slate-200 dark:border-white/5">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-slate-900 dark:text-slate-300 font-bold flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-indigo-400" /> SOC-2 / Confidential Security
              </span>
              <p className="text-[9px] text-slate-400">Strictly restrict access role parameters and flag HIPAA boundaries.</p>
            </div>
            <input 
              type="checkbox"
              checked={isConfidential}
              onChange={(e) => setIsConfidential(e.target.checked)}
              className="h-4 w-4 text-indigo-600 rounded bg-[#09090b] border-white/5 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* File Ingestion Dropzone & Simulations (Right Pane) */}
      <div className="lg:col-span-7 bg-white dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
        <div>
          <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
            <Upload className="h-4 w-4 text-indigo-400" />
            Ingest Source Asset
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Supports CSV (flat grid), JSON (instructions), ZIP (images/audio), and nested schema formats.</p>
        </div>

        {/* Drag Drop Area */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-500/5' 
              : 'border-slate-200 dark:border-white/5 hover:border-indigo-500/30 hover:bg-white/1'
          }`}
        >
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".csv,.json,.zip,.txt"
          />
          <Database className="h-8 w-8 text-indigo-400 animate-pulse mb-3" />
          <p className="text-xs text-slate-900 dark:text-slate-300 font-bold">Drag and drop file here, or click to browse</p>
          <p className="text-[9px] text-slate-500 font-mono mt-1">Accepts files up to 5GB. Scans for virus payload, columns structure & schema density on ingest.</p>
        </div>

        {/* Quick Simulation Templates */}
        <div className="space-y-2">
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">Simulation Pipelines templates</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {simulationFiles.map((sim, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCategory(sim.category);
                  processAndUploadFile(sim.name, sim.size);
                }}
                className="flex flex-col justify-between p-3 rounded-xl bg-slate-100 dark:bg-[#09090b]/40 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-left cursor-pointer transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="font-mono text-[9px] text-slate-900 dark:text-slate-300 truncate font-bold">{sim.name}</span>
                </div>
                <div className="mt-2.5 flex justify-between items-center w-full text-[8px] font-mono text-slate-400">
                  <span>{(sim.size / (1024 * 1024)).toFixed(1)} MB</span>
                  <span className="bg-indigo-500/10 text-indigo-400 px-1 py-0.2 rounded font-bold">Launch</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error/Success Feedbacks */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono text-rose-400">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            {successMessage}
          </div>
        )}

      </div>
    </div>
  );
};
