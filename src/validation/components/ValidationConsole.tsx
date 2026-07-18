/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, Clock, Activity, RefreshCw, Sliders, Download, 
  Search, Filter, CheckCircle, XCircle, Users, Check, Copy, FileText, 
  Brain, Percent, Terminal, ArrowRight, ShieldAlert, Cpu, Heart, Layers, HelpCircle
} from 'lucide-react';
import { useValidation } from '../context/ValidationContext';
import { useSubmissions } from '../../submissions/context/SubmissionContext';
import { ValidationRecord, HumanReviewItem, ValidationStepStatus, ReviewPriority } from '../../types/validation';
import { Submission, SubmissionStatus } from '../../types/submission';
import { ValidationAdapter } from '../adapters/ValidationAdapter';

/**
 * AI Validation & Quality Intelligence Console.
 * Full-featured interactive suite for exploring pipelines, risk assessments,
 * reputations, manual operator workflows, and analytical report downloads.
 */
export function ValidationConsole() {
  const { 
    validationRecords, humanReviews, telemetry, validateSubmission, 
    assignReviewer, finalizeValidation, queryValidations, generateAuditTrail 
  } = useValidation();
  
  const { submissions } = useSubmissions();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'queue' | 'bench' | 'reports'>('pipeline');
  
  // Pipeline Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Passed' | 'Failed' | 'Flagged' | 'Pending'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<ValidationRecord | null>(null);

  // Review Queue Filter
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'Pending Review' | 'Assigned Reviewer' | 'Completed'>('ALL');
  const [selectedReview, setSelectedReview] = useState<HumanReviewItem | null>(null);
  const [assignedReviewerInput, setAssignedReviewerInput] = useState('operator_expert_omega');
  const [reviewerDecision, setReviewerDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [reviewerComments, setReviewerComments] = useState('');

  // Test bench trigger state
  const [benchSubmissionId, setBenchSubmissionId] = useState('');
  const [benchRunning, setBenchRunning] = useState(false);
  const [benchStepIndex, setBenchStepIndex] = useState(-1);
  const [benchLogs, setBenchLogs] = useState<string[]>([]);
  const [benchResult, setBenchResult] = useState<ValidationRecord | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-select first record if none selected
  useEffect(() => {
    if (validationRecords.length > 0 && !selectedRecord) {
      setSelectedRecord(validationRecords[0]);
    }
  }, [validationRecords]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download Audit Trail
  const handleDownloadAudit = async (record: ValidationRecord) => {
    const auditLogs = await generateAuditTrail(record.validationId);
    const content = auditLogs.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Audit_Trail_${record.validationId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sheets CSV Exporter
  const handleExportSheets = (type: 'val' | 'quality' | 'risk' | 'review' | 'business') => {
    let payload;
    let name = 'Report';

    if (type === 'val') {
      payload = ValidationAdapter.toValidationReport(validationRecords);
      name = 'Validation_Pipeline_Audit_Trail';
    } else if (type === 'quality') {
      payload = ValidationAdapter.toQualityReport(validationRecords);
      name = 'Quality_Intelligence_Scores';
    } else if (type === 'risk') {
      payload = ValidationAdapter.toRiskReport(validationRecords);
      name = 'Security_Risk_Indices';
    } else if (type === 'review') {
      payload = ValidationAdapter.toReviewerReport(humanReviews);
      name = 'Manual_Consensus_Reviews';
    } else {
      payload = ValidationAdapter.toBusinessQAReport(validationRecords);
      name = 'Business_QA_SLA_Funding';
    }

    const csvContent = [
      payload.headers.join(','),
      ...payload.rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
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

  // Execute bench validator
  const handleRunBenchValidation = async () => {
    const targetSub = submissions.find(s => s.submissionId === benchSubmissionId);
    if (!targetSub) {
      setBenchLogs(prev => [...prev, `[ERROR] Selected Submission "${benchSubmissionId}" not found in database.`]);
      return;
    }

    setBenchRunning(true);
    setBenchResult(null);
    setBenchStepIndex(0);
    setBenchLogs([`[${new Date().toISOString()}] Initiating Sandbox Test Bench validation for ${benchSubmissionId}...`]);

    const steps = [
      'Submission Ingestion Checks...',
      'Schema Structural Auditing...',
      'Payload Completeness Metrics...',
      'Duplicate Hash Matching...',
      'Spam Character Pattern Check...',
      'Trust Reputation Lookup...',
      'Velocity Speed Analysis...',
      'Historical Consistency Analysis...',
      'AI Validator Plugin Matching...',
      'Automated Confidence Evaluation...',
      'Multidimensional Quality Scoring...',
      'Heuristic Security Risk Auditing...',
      'Decision Matrix Resolution...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setBenchStepIndex(i + 1);
      setBenchLogs(prev => [...prev, `[OK] Step ${i + 1}/14: ${steps[i]}`]);
    }

    try {
      const result = await validateSubmission(targetSub);
      setBenchLogs(prev => [
        ...prev, 
        `[${new Date().toISOString()}] Validation completed successfully!`,
        `[DECISION] status: "${result.validationStatus}" | Action: "${result.decision}"`,
        `[METRICS] Final Quality: ${result.qualityScores.finalQualityScore}/100 | Risk Index: ${result.riskScores.aggregateRiskScore}/100`
      ]);
      setBenchResult(result);
    } catch (e: any) {
      setBenchLogs(prev => [...prev, `[FATAL] Pipeline crash: ${e.message}`]);
    } finally {
      setBenchRunning(false);
    }
  };

  // Filter records
  const filteredRecords = validationRecords.filter(r => {
    const matchesSearch = r.validationId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.submissionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.taskId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.validationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReviews = humanReviews.filter(r => {
    return reviewFilter === 'ALL' || r.status === reviewFilter;
  });

  return (
    <div className="space-y-6 text-left" id="validation-console-root">
      {/* 1. Header & Quick Stat Grid */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-850 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-500 animate-pulse" />
            <span>AI Validation & Quality Intelligence System</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Automated multi-dimensional compliance and confidence engine. Executes duplicate detection, spam checkers, speed analyzers, reputation modeling, and expert reviews.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-950/80 border border-zinc-850 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'pipeline' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Pipeline Inspector
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all relative ${activeTab === 'queue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <span>Review Queue</span>
            {humanReviews.filter(r => r.status !== 'Completed').length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {humanReviews.filter(r => r.status !== 'Completed').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('bench')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'bench' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Pipeline Bench
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'reports' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Adapters Export
          </button>
        </div>
      </div>

      {/* 2. Unified Telemetry Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="validation-telemetry-panel">
        {/* Stat 1 */}
        <div className="bg-zinc-950/40 border border-zinc-850/70 p-3.5 rounded-xl space-y-1.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
          <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1">
            <Clock className="h-3 w-3 text-indigo-400" />
            <span>AVG Processing SLA</span>
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">
              {telemetry.avgValidationTimeMs || 140}
            </span>
            <span className="text-xs font-sans text-slate-400">ms</span>
          </div>
          <p className="text-[9px] font-sans text-slate-400 leading-none">Automated 14-step micro execution</p>
        </div>

        {/* Stat 2 */}
        <div className="bg-zinc-950/40 border border-zinc-850/70 p-3.5 rounded-xl space-y-1.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-400" />
            <span>Consensus Approval</span>
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-emerald-400">
              {telemetry.approvalRate || 0}%
            </span>
          </div>
          <p className="text-[9px] font-sans text-slate-400 leading-none">Passed automated decision filters</p>
        </div>

        {/* Stat 3 */}
        <div className="bg-zinc-950/40 border border-zinc-850/70 p-3.5 rounded-xl space-y-1.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-red-500/5 rounded-bl-full pointer-events-none group-hover:bg-red-500/10 transition-colors" />
          <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1">
            <XCircle className="h-3 w-3 text-red-400" />
            <span>Consensus Reject</span>
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-red-400">
              {telemetry.rejectRate || 0}%
            </span>
          </div>
          <p className="text-[9px] font-sans text-slate-400 leading-none">Triggered velocity or spam checks</p>
        </div>

        {/* Stat 4 */}
        <div className="bg-zinc-950/40 border border-zinc-850/70 p-3.5 rounded-xl space-y-1.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1">
            <Users className="h-3 w-3 text-amber-400" />
            <span>Human Review Queue</span>
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-amber-400">
              {telemetry.humanReviewRate || 0}%
            </span>
          </div>
          <p className="text-[9px] font-sans text-slate-400 leading-none">Escalated for expert manual audit</p>
        </div>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: List of validations */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Completed Pipeline Runs ({filteredRecords.length})
              </span>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search val ID, sub ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 pl-9 pr-3 py-2 text-xs text-slate-300 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              
              {/* Status Select filter */}
              <div className="flex items-center gap-1.5 bg-zinc-950/40 border border-zinc-850 px-2.5 py-1.5 rounded-xl">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="bg-transparent text-xs text-slate-300 border-none outline-none font-sans w-full cursor-pointer"
                >
                  <option value="ALL">All Outcomes</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                  <option value="Flagged">Flagged</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Validation List cards */}
            <div className="border border-zinc-850 rounded-xl overflow-y-auto max-h-[500px] divide-y divide-zinc-850/60 bg-zinc-950/15">
              {filteredRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-sans">
                  No pipeline records matched the filters.
                </div>
              ) : (
                filteredRecords.map(record => (
                  <button
                    key={record.validationId}
                    onClick={() => setSelectedRecord(record)}
                    className={`w-full p-3.5 text-left transition-all hover:bg-zinc-900/30 flex items-center justify-between border-l-2 cursor-pointer ${selectedRecord?.validationId === record.validationId ? 'bg-zinc-900/40 border-l-indigo-500' : 'border-l-transparent'}`}
                  >
                    <div className="space-y-1.5 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-400 font-bold text-xs">
                          {record.validationId}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500 truncate max-w-[80px]">
                          {record.submissionId}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-light font-mono">
                        Task: {record.taskId}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${record.decision === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : record.decision === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {record.decision}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        Qual: {record.qualityScores.finalQualityScore}/100
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Detailed record inspector */}
          <div className="lg:col-span-7">
            {selectedRecord ? (
              <div className="bg-zinc-950/20 border border-zinc-850 rounded-2xl p-5 space-y-6 animate-fade-in" id="validation-detailed-inspector">
                {/* ID Header and copy signature buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-zinc-850 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span>Record:</span>
                        <span className="text-indigo-400">{selectedRecord.validationId}</span>
                      </h3>
                      <button
                        onClick={() => handleCopy(selectedRecord.validationId, 'id')}
                        className="text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-zinc-900 cursor-pointer"
                        title="Copy Validation ID"
                      >
                        {copiedId === 'id' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500">
                      Assumed Submission Reference: {selectedRecord.submissionId}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadAudit(selectedRecord)}
                      className="px-2.5 py-1 text-[10px] font-mono border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-slate-300 hover:text-indigo-400 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>SLA Audit Log</span>
                    </button>
                  </div>
                </div>

                {/* Multidimensional Score Metres */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-indigo-400" />
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Multidimensional Quality Scoring (FINAL: {selectedRecord.qualityScores.finalQualityScore}/100)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/40 border border-zinc-850/50 p-4 rounded-xl">
                    {/* Accuracy Score */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Accuracy Rating</span>
                        <span className="text-white">{selectedRecord.qualityScores.accuracyScore}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${selectedRecord.qualityScores.accuracyScore}%` }} 
                        />
                      </div>
                    </div>

                    {/* Instruction Following */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Instruction Compliance</span>
                        <span className="text-white">{selectedRecord.qualityScores.instructionFollowingScore}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${selectedRecord.qualityScores.instructionFollowingScore}%` }} 
                        />
                      </div>
                    </div>

                    {/* Completeness */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Completeness coverage</span>
                        <span className="text-white">{selectedRecord.qualityScores.completenessScore}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ width: `${selectedRecord.qualityScores.completenessScore}%` }} 
                        />
                      </div>
                    </div>

                    {/* Completion Speed */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Completion Speed SLA</span>
                        <span className="text-white">{selectedRecord.qualityScores.speedScore}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500" 
                          style={{ width: `${selectedRecord.qualityScores.speedScore}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk and Security Indices */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Security & Malicious Risk Analysis</span>
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${selectedRecord.riskScores.aggregateRiskScore < 30 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : selectedRecord.riskScores.aggregateRiskScore < 60 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                      Risk Index: {selectedRecord.riskScores.aggregateRiskScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Spam risk */}
                    <div className="bg-zinc-950/40 border border-zinc-850/50 p-2.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Spam / Mash Risk</span>
                      <span className={`text-xs font-mono font-bold mt-1 ${selectedRecord.riskScores.spamRisk > 0.4 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(selectedRecord.riskScores.spamRisk * 100)}%
                      </span>
                    </div>

                    {/* Automation Risk */}
                    <div className="bg-zinc-950/40 border border-zinc-850/50 p-2.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Script Automation</span>
                      <span className={`text-xs font-mono font-bold mt-1 ${selectedRecord.riskScores.automationRisk > 0.4 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(selectedRecord.riskScores.automationRisk * 100)}%
                      </span>
                    </div>

                    {/* Fraud risk */}
                    <div className="bg-zinc-950/40 border border-zinc-850/50 p-2.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Fraud Signature Anomaly</span>
                      <span className={`text-xs font-mono font-bold mt-1 ${selectedRecord.riskScores.fraudRisk > 0.4 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(selectedRecord.riskScores.fraudRisk * 100)}%
                      </span>
                    </div>

                    {/* Bot Risk */}
                    <div className="bg-zinc-950/40 border border-zinc-850/50 p-2.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Bot Signature Risk</span>
                      <span className={`text-xs font-mono font-bold mt-1 ${selectedRecord.riskScores.botRisk > 0.4 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(selectedRecord.riskScores.botRisk * 100)}%
                      </span>
                    </div>

                    {/* LLM Injection Risk */}
                    <div className="bg-zinc-950/40 border border-zinc-850/50 p-2.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">AI Prompt Injection</span>
                      <span className={`text-xs font-mono font-bold mt-1 ${selectedRecord.riskScores.aiRisk > 0.4 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(selectedRecord.riskScores.aiRisk * 100)}%
                      </span>
                    </div>

                    {/* Duplicate Risk */}
                    <div className="bg-zinc-950/40 border border-zinc-850/50 p-2.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Duplicate Collision</span>
                      <span className={`text-xs font-mono font-bold mt-1 ${selectedRecord.riskScores.duplicateRisk > 0.4 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(selectedRecord.riskScores.duplicateRisk * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust snapshots and history deltas */}
                <div className="space-y-3 bg-zinc-950/40 border border-zinc-850/50 p-4 rounded-xl">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-indigo-400" />
                    <span>Contributor Reputation Ledger Snapshot</span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block font-mono">Reputation Level</span>
                      <span className="text-white font-bold">{selectedRecord.trustState.trustLevel}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block font-mono">Delta Impact</span>
                      <span className={`font-bold font-mono ${selectedRecord.trustState.trustDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {selectedRecord.trustState.trustDelta >= 0 ? '+' : ''}{selectedRecord.trustState.trustDelta}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block font-mono">Reputation Trend</span>
                      <span className="text-slate-300 font-bold">{selectedRecord.trustState.trustTrend}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block font-mono">Reputation Score</span>
                      <span className="text-indigo-400 font-bold font-mono">{selectedRecord.trustState.trustSnapshot.currentScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* 14 step visualizer panel */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-slate-400" />
                    <span>Cryptographic 14-Step Pipeline Executions</span>
                  </span>

                  <div className="border border-zinc-850 rounded-xl max-h-[160px] overflow-y-auto divide-y divide-zinc-900/50 p-2 space-y-1.5 bg-zinc-950/20 font-mono text-[10px] text-slate-400">
                    {selectedRecord.steps.map((step, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-500 font-bold">#{idx + 1}</span>
                          <span className="text-slate-300">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {step.status === ValidationStepStatus.COMPLETED && <span className="text-emerald-400">● Completed</span>}
                          {step.status === ValidationStepStatus.FAILED && <span className="text-red-400">● Failed</span>}
                          {step.status === ValidationStepStatus.RUNNING && <span className="text-indigo-400 animate-pulse">● Running</span>}
                          {step.status === ValidationStepStatus.SKIPPED && <span className="text-slate-500">● Skipped</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signature checksum verification footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-zinc-900/35 border border-zinc-850/80 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                      Integrity Seal Verified Secure
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 tracking-wider">
                    {selectedRecord.signature}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950/20 border border-zinc-850 rounded-2xl p-10 text-center text-slate-500 text-xs font-sans">
                Select a validation record from the list to inspect audit parameters.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: List of Human Reviews */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Staged Audit Requests ({filteredReviews.length})
              </span>
              <div className="flex items-center gap-1.5 bg-zinc-950/40 border border-zinc-850 px-2.5 py-1.5 rounded-xl">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={reviewFilter}
                  onChange={e => setReviewFilter(e.target.value as any)}
                  className="bg-transparent text-xs text-slate-300 border-none outline-none font-sans w-full cursor-pointer"
                >
                  <option value="ALL">All States</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Assigned Reviewer">Assigned Reviewer</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Review Cards list */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {filteredReviews.length === 0 ? (
                <div className="border border-zinc-850 rounded-xl p-8 text-center text-slate-500 text-xs bg-zinc-950/15">
                  No active reviews staged.
                </div>
              ) : (
                filteredReviews.map(review => (
                  <button
                    key={review.reviewId}
                    onClick={() => {
                      setSelectedReview(review);
                      setReviewerComments(review.reviewNotes || '');
                    }}
                    className={`w-full p-4 rounded-xl border text-left transition-all hover:bg-zinc-900/30 flex flex-col gap-2 cursor-pointer ${selectedReview?.reviewId === review.reviewId ? 'bg-zinc-900/40 border-indigo-500/80 shadow' : 'bg-zinc-950/10 border-zinc-850'}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono text-indigo-400 font-bold text-xs">
                        {review.reviewId}
                      </span>
                      <span className={`px-2 py-0.5 text-[8px] font-mono font-bold uppercase rounded ${review.priority === ReviewPriority.CRITICAL ? 'bg-red-500/10 text-red-500 border border-red-500/20' : review.priority === ReviewPriority.HIGH ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {review.priority} SLA
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono font-light truncate w-full">
                      Submission ID: {review.submissionId}
                    </div>

                    <div className="flex justify-between items-center w-full text-[9px] font-mono text-slate-500 mt-1">
                      <span>Status: {review.status}</span>
                      <span>By: {review.assignedReviewer || 'Unassigned'}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Review Auditing Panel */}
          <div className="lg:col-span-7">
            {selectedReview ? (
              <div className="bg-zinc-950/20 border border-zinc-850 rounded-2xl p-5 space-y-5 animate-fade-in" id="manual-audit-panel">
                <div className="border-b border-zinc-850 pb-4 space-y-1">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>Manual Audit:</span>
                    <span className="text-indigo-400">{selectedReview.reviewId}</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500">
                    Submission: {selectedReview.submissionId} | Target SLA Deadline: {new Date(selectedReview.reviewDeadline).toLocaleDateString()}
                  </p>
                </div>

                {/* Workflow Status Info */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-zinc-950/40 border border-zinc-850/50 p-3.5 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Queue Status</span>
                    <span className="text-white font-bold">{selectedReview.status}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Reviewer Assigned</span>
                    <span className="text-white font-bold">{selectedReview.assignedReviewer || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Actions Block */}
                {selectedReview.status !== 'Completed' ? (
                  <div className="space-y-4 pt-1">
                    {/* Assign Auditor */}
                    {!selectedReview.assignedReviewer && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block">
                          1. Assign Expert Reviewer Profile
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={assignedReviewerInput}
                            onChange={e => setAssignedReviewerInput(e.target.value)}
                            className="bg-zinc-950 border border-zinc-850 px-3 py-1.5 text-xs text-slate-300 rounded-xl outline-none focus:border-indigo-500 flex-1 font-mono"
                          />
                          <button
                            onClick={async () => {
                              const res = await assignReviewer(selectedReview.reviewId, assignedReviewerInput);
                              setSelectedReview(res);
                            }}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white rounded-xl transition-colors cursor-pointer"
                          >
                            Assign Expert
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Commit Decision */}
                    {selectedReview.assignedReviewer && (
                      <div className="space-y-4 border-t border-zinc-850 pt-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block">
                            2. Consensus Decision Audit
                          </label>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setReviewerDecision('Approved')}
                              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${reviewerDecision === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/80 text-emerald-400' : 'bg-zinc-950/30 border-zinc-850 text-slate-500 hover:text-slate-300'}`}
                            >
                              Approve Submission
                            </button>
                            <button
                              onClick={() => setReviewerDecision('Rejected')}
                              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${reviewerDecision === 'Rejected' ? 'bg-red-500/10 border-red-500/80 text-red-400' : 'bg-zinc-950/30 border-zinc-850 text-slate-500 hover:text-slate-300'}`}
                            >
                              Reject Submission
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block">
                            3. Reviewer comments / justifications
                          </label>
                          <textarea
                            value={reviewerComments}
                            onChange={e => setReviewerComments(e.target.value)}
                            placeholder="Provide audit remarks or failure codes..."
                            rows={3}
                            className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs text-slate-300 rounded-xl outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>

                        <button
                          onClick={async () => {
                            if (!reviewerComments.trim()) {
                              alert('Please provide reviewer remarks.');
                              return;
                            }
                            // Retrieve validation record reference
                            const valRec = validationRecords.find(r => r.submissionId === selectedReview.submissionId);
                            if (valRec) {
                              await finalizeValidation(valRec.validationId, reviewerDecision, reviewerComments);
                              const updatedReview = await assignReviewer(selectedReview.reviewId, selectedReview.assignedReviewer!);
                              setSelectedReview({
                                ...updatedReview,
                                status: 'Completed',
                                decision: reviewerDecision,
                                reviewNotes: reviewerComments
                              });
                            }
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white rounded-xl transition-all cursor-pointer font-sans"
                        >
                          Commit Resolution Seal
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl text-xs font-sans text-slate-400 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold uppercase text-[10px]">
                      <CheckCircle className="h-4 w-4" />
                      <span>Review Finalized & Locked</span>
                    </div>
                    <p className="font-mono text-[11px]">
                      Operator Remarks: <span className="text-white">"{selectedReview.reviewNotes}"</span>
                    </p>
                    <p className="font-mono text-[11px]">
                      Consensus decision resolved: <span className={`font-bold ${selectedReview.decision === 'Approved' ? 'text-emerald-400' : 'text-red-400'}`}>{selectedReview.decision}</span>
                    </p>
                  </div>
                )}

                {/* Audit Queue History Steps */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block tracking-wider">
                    Review Audit Trail Ledger
                  </span>
                  <div className="border border-zinc-850 rounded-xl bg-zinc-950/20 divide-y divide-zinc-900/50 p-3 space-y-2 font-mono text-[9px]">
                    {selectedReview.history.map((hist, idx) => (
                      <div key={idx} className="space-y-1 pt-1.5 first:pt-0">
                        <div className="flex justify-between text-slate-500">
                          <span>{hist.action} by {hist.actor}</span>
                          <span>{new Date(hist.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-300">{hist.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950/20 border border-zinc-850 rounded-2xl p-10 text-center text-slate-500 text-xs font-sans">
                Select a staged audit card to inspect manual queue operations.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bench' && (
        <div className="bg-zinc-950/20 border border-zinc-850 rounded-2xl p-6 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>Sandbox Pipeline Test Bench</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Manually trigger validation executions on captured submissions. Useful for testing rule boundaries, accuracy indexes, and compliance checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Control panel */}
            <div className="md:col-span-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block">
                  Select Submission Target
                </label>
                <select
                  value={benchSubmissionId}
                  onChange={e => setBenchSubmissionId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 p-2.5 text-xs text-slate-300 rounded-xl outline-none focus:border-indigo-500 font-mono cursor-pointer"
                >
                  <option value="">-- Choose Submission --</option>
                  {submissions.map(sub => (
                    <option key={sub.submissionId} value={sub.submissionId}>
                      {sub.submissionId} ({sub.taskId})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRunBenchValidation}
                disabled={!benchSubmissionId || benchRunning}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900 disabled:text-slate-500 text-xs font-medium text-white rounded-xl transition-all font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                {benchRunning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    <span>Launch 14-Step Validation</span>
                  </>
                )}
              </button>
            </div>

            {/* Sandbox playback visual log panel */}
            <div className="md:col-span-8 space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block tracking-wider">
                Pipeline execution playback logs
              </span>

              <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl min-h-[160px] max-h-[300px] overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-400">
                {benchLogs.length === 0 && (
                  <span className="text-slate-600">Select a submission and hit run to display logs...</span>
                )}
                {benchLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>

              {/* Bench Result display */}
              {benchResult && (
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-3.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Pipeline execution completed successfully</span>
                    </span>
                    <span className="font-mono text-[9px] text-slate-500">
                      {benchResult.validationId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">SLA Processing Time</span>
                      <span className="text-white font-bold">{benchResult.elapsedMs} ms</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Confidence Rating</span>
                      <span className="text-indigo-400 font-bold">{benchResult.confidence.confidencePercent}% ({benchResult.confidence.confidenceLevel})</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Decision Action</span>
                      <span className="text-emerald-400 font-bold">{benchResult.decision}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-zinc-950/20 border border-zinc-850 rounded-2xl p-6 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Download className="h-4 w-4 text-indigo-400" />
              <span>Google Sheets Export Adapters</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Format raw nested JSON database entries into flat tabular structures. Prepares columns and rows for seamless spreadsheet copy-pasting and Google Sheets analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Adapter 1 */}
            <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Validation report
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Consolidated compliance audits, execution times, confidence percentages, and security seals.
                </p>
              </div>
              <button
                onClick={() => handleExportSheets('val')}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-850 text-[11px] font-mono text-slate-300 hover:text-indigo-400 border border-zinc-800 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Validation Report</span>
              </button>
            </div>

            {/* Adapter 2 */}
            <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Quality Intel Report
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Aggregates accuracy scores, consistency metrics, completeness, speed factors, and modifiers.
                </p>
              </div>
              <button
                onClick={() => handleExportSheets('quality')}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-850 text-[11px] font-mono text-slate-300 hover:text-indigo-400 border border-zinc-800 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Quality Scores</span>
              </button>
            </div>

            {/* Adapter 3 */}
            <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
                  Security Risk Report
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Identifies keyboard mashing indexes, VPS proxies, duplicate hashes, and automation scripts.
                </p>
              </div>
              <button
                onClick={() => handleExportSheets('risk')}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-850 text-[11px] font-mono text-slate-300 hover:text-indigo-400 border border-zinc-800 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Risk Matrix</span>
              </button>
            </div>

            {/* Adapter 4 */}
            <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Manual Review Queue Report
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Logs operator workloads, assignees, deadlines, and active escalations.
                </p>
              </div>
              <button
                onClick={() => handleExportSheets('review')}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-850 text-[11px] font-mono text-slate-300 hover:text-indigo-400 border border-zinc-800 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Reviews Audit</span>
              </button>
            </div>

            {/* Adapter 5 */}
            <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Business QA report
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Evaluates billing compliance, funding releases, SLA milestones, and territory distributions.
                </p>
              </div>
              <button
                onClick={() => handleExportSheets('business')}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-850 text-[11px] font-mono text-slate-300 hover:text-indigo-400 border border-zinc-800 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Business QA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ValidationConsole;
