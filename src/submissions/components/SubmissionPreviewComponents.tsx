/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart2, FileText, Smartphone, Laptop, ShieldCheck, RefreshCw, 
  Trash2, Send, Check, X, AlertTriangle, Play, HelpCircle, Eye, ExternalLink, Globe
} from 'lucide-react';
import { Submission, SubmissionStatus, ValidationStatus, ReviewStatus } from '../../types/submission';
import { SubmissionStatusBadge, SubmissionProgress, SubmissionTimeline } from './SubmissionSharedComponents';
import { useSubmissions } from '../context/SubmissionContext';

// ==========================================
// 1. SUBMISSION SUMMARY METRIC PANELS
// ==========================================

export function SubmissionSummary() {
  const { telemetry, offlineQueueLength, isOnline, syncOfflineQueue } = useSubmissions();
  const [syncing, setSyncing] = useState(false);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await syncOfflineQueue();
      alert(`Sync Complete! Successfully processed ${res.successCount} submissions. (${res.dlqCount} sent to DLQ).`);
    } catch {
      alert('Sync process failed. Please check network connection.');
    } finally {
      setSyncing(false);
    }
  };

  const cards = [
    { label: 'Ingested Submissions', value: telemetry.totalCreated, desc: 'Accumulated in active local ledger' },
    { label: 'Consensus Accuracy Rate', value: `${telemetry.approvalRate}%`, desc: 'Average agreement on alignments' },
    { label: 'Avg Validation Time', value: `${telemetry.averageCompletionTime}s`, desc: 'Focused duration on micro-tasks' },
  ];

  return (
    <div className="space-y-4" id="submission-metrics-dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{card.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-white tracking-tight">{card.value}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans font-light leading-snug">{card.desc}</p>
          </div>
        ))}
      </div>

      {offlineQueueLength > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
              <span>Offline Submission Queue Buffer Active ({offlineQueueLength} Nodes)</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans max-w-xl">
              Some tasks were completed while disconnected. These records are staged locally and are awaiting ledger injection.
            </p>
          </div>
          <button
            onClick={handleManualSync}
            disabled={syncing || !isOnline}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-45"
          >
            {syncing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Syncing Blocks...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Force Queue Flush</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. SUBMISSION PREVIEW / INSPECTOR PANEL
// ==========================================

interface PreviewProps {
  submission: Submission;
  onClose: () => void;
}

export function SubmissionPreview({ submission, onClose }: PreviewProps) {
  const { manualReview } = useSubmissions();
  const [activeTab, setActiveTab] = useState<'answers' | 'meta' | 'audit'>('answers');

  return (
    <div className="bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden text-left flex flex-col h-full" id="submission-preview-inspector">
      {/* Header */}
      <div className="p-4 border-b border-zinc-850 flex justify-between items-center bg-zinc-950/20">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-display text-white">{submission.submissionId}</h3>
            <SubmissionStatusBadge status={submission.submissionStatus} />
          </div>
          <p className="text-[10px] font-mono text-slate-500">SESSION: {submission.playerSessionId}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          aria-label="Close inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body tabs */}
      <div className="flex border-b border-zinc-850 bg-zinc-950/10">
        {(['answers', 'meta', 'audit'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[10px] font-mono tracking-wider uppercase border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === tab 
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab === 'answers' ? 'Response Payload' : tab === 'meta' ? 'Metadata' : 'Lifecycle Trail'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {activeTab === 'answers' && (
          <div className="space-y-4 animate-fade-in">
            <SubmissionProgress status={submission.submissionStatus} />

            <div className="space-y-2">
              <h4 className="text-xs font-mono tracking-wider text-slate-400 font-bold uppercase">Structured Submissions Schema</h4>
              <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg overflow-x-auto">
                <pre className="text-[11px] font-mono text-indigo-300 leading-relaxed">
                  {JSON.stringify(submission.answers, null, 2)}
                </pre>
              </div>
            </div>

            {submission.attachmentsMetadata.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono tracking-wider text-slate-400 font-bold uppercase">Google Drive Attachments Reference</h4>
                <div className="grid grid-cols-1 gap-2">
                  {submission.attachmentsMetadata.map((att, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 border border-zinc-850 bg-zinc-950/20 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-200 font-semibold truncate">{att.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{att.driveFileId}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400 shrink-0">
                        {(att.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="space-y-4 animate-fade-in">
            {/* Devices snapshot */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-mono tracking-wider text-slate-400 font-bold uppercase">Agent Environmental Metadata</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-zinc-950/30 border border-zinc-850 rounded-lg space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Device Category</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    {submission.deviceSnapshot.deviceType === 'Desktop' ? <Laptop className="h-3.5 w-3.5 text-indigo-400" /> : <Smartphone className="h-3.5 w-3.5 text-indigo-400" />}
                    <span>{submission.deviceSnapshot.deviceType}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-zinc-950/30 border border-zinc-850 rounded-lg space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Operating System</span>
                  <span className="text-slate-300 block">{submission.deviceSnapshot.operatingSystem}</span>
                </div>
                <div className="p-2.5 bg-zinc-950/30 border border-zinc-850 rounded-lg space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Browser Engine</span>
                  <span className="text-slate-300 block">{submission.deviceSnapshot.browserName}</span>
                </div>
                <div className="p-2.5 bg-zinc-950/30 border border-zinc-850 rounded-lg space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Dynamic Resolution</span>
                  <span className="text-slate-300 block">{submission.deviceSnapshot.screenResolution}</span>
                </div>
              </div>
            </div>

            {/* Geographical snap */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-mono tracking-wider text-slate-400 font-bold uppercase">Locale Boundaries</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-zinc-950/30 border border-zinc-850 rounded-lg space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Country (ISO)</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Globe className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{submission.country}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-zinc-950/30 border border-zinc-850 rounded-lg space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Language Code</span>
                  <span className="text-slate-300 block">{submission.language}</span>
                </div>
              </div>
            </div>

            {/* Nonce and Signature */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-mono tracking-wider text-slate-400 font-bold uppercase">Security Signatures</h4>
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg space-y-2">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-slate-500">SECURITY NONCE:</span>
                  <span className="text-indigo-400 truncate max-w-[200px]">{submission.metadata?.nonce || 'N/A'}</span>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-slate-500">CLIENT CHECKSUM:</span>
                  <span className="text-emerald-400 font-bold truncate max-w-[200px]">{submission.metadata?.clientSignature || 'UNSIGNED'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4 animate-fade-in">
            <SubmissionTimeline
              startedAt={submission.startedAt}
              completedAt={submission.completedAt}
              syncedAt={submission.createdAt}
              reviewedAt={submission.updatedAt}
              status={submission.submissionStatus}
            />

            {submission.humanMetadata?.reviewerComments && (
              <div className="p-3 border border-zinc-850 bg-indigo-950/10 rounded-lg text-left space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Expert Operator Assessment</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans italic">"{submission.humanMetadata.reviewerComments}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Actions Panel */}
      {submission.submissionStatus === SubmissionStatus.PENDING_VALIDATION && (
        <SubmissionReviewCard submission={submission} />
      )}
    </div>
  );
}

// ==========================================
// 3. MANUAL REVIEW / DECISION PANEL
// ==========================================

export function SubmissionReviewCard({ submission }: { submission: Submission }) {
  const { manualReview } = useSubmissions();
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleReviewAction = async (status: 'approved' | 'rejected') => {
    if (!comments.trim()) {
      alert('Reviewer assessment notes are required for consensus logs.');
      return;
    }
    setProcessing(false);
    try {
      await manualReview(submission.submissionId, status, comments);
      alert(`Consensus Log Staged: Submission ${status.toUpperCase()}.`);
    } catch (e: any) {
      alert(e.message || 'Action failed.');
    }
  };

  return (
    <div className="p-4 border-t border-zinc-850 bg-zinc-950/40 text-left space-y-3" id="submission-review-card">
      <div className="space-y-1">
        <h4 className="text-xs font-mono tracking-wider text-slate-400 font-bold uppercase">Consensus Review Action</h4>
        <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
          Provide human consensus verification feedback. Approved nodes trigger smart contract rewards.
        </p>
      </div>

      <textarea
        value={comments}
        onChange={e => setComments(e.target.value)}
        placeholder="Enter required audit assessment notes..."
        rows={2}
        className="w-full bg-zinc-950 border border-zinc-800 text-xs text-slate-300 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
      />

      <div className="flex gap-2">
        <button
          onClick={() => handleReviewAction('rejected')}
          disabled={processing}
          className="flex-1 py-2 border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
        >
          <X className="h-3.5 w-3.5" />
          <span>Reject Alignment</span>
        </button>
        <button
          onClick={() => handleReviewAction('approved')}
          disabled={processing}
          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Approve Alignment</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. RETRY / QUEUE TRACKER
// ==========================================

export function SubmissionQueueCard({ syncCount }: { syncCount: number }) {
  const { isOnline } = useSubmissions();
  return (
    <div className="p-4 border border-zinc-850 bg-zinc-950/20 rounded-xl flex justify-between items-center text-left" id="submission-queue-card">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <RefreshCw className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span>Network Ledger Gateway</span>
        </div>
        <p className="text-[11px] text-slate-400 font-sans max-w-sm">
          Integrates real-time exponential retries and priority sorting queues.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
}
