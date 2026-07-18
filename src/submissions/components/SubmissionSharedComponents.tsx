/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckCircle, AlertTriangle, Clock, RefreshCw, Archive, Ban, ShieldCheck, 
  Wifi, WifiOff, FileText, Activity, AlertCircle, Laptop, Smartphone, HelpCircle
} from 'lucide-react';
import { SubmissionStatus, ValidationStatus, ReviewStatus } from '../../types/submission';

// ==========================================
// 1. SUBMISSION STATUS BADGES
// ==========================================

interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

export function SubmissionStatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = {
    [SubmissionStatus.DRAFT]: {
      label: 'Draft',
      icon: Clock,
      style: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    },
    [SubmissionStatus.SAVING]: {
      label: 'Saving',
      icon: RefreshCw,
      style: 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
    },
    [SubmissionStatus.SAVED]: {
      label: 'Saved',
      icon: CheckCircle,
      style: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    },
    [SubmissionStatus.QUEUED]: {
      label: 'Queued',
      icon: Clock,
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
    },
    [SubmissionStatus.OFFLINE]: {
      label: 'Offline Buffer',
      icon: WifiOff,
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    [SubmissionStatus.PENDING_VALIDATION]: {
      label: 'Pending Validation',
      icon: Activity,
      style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    [SubmissionStatus.AI_REVIEWING]: {
      label: 'AI Verification',
      icon: RefreshCw,
      style: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
    },
    [SubmissionStatus.HUMAN_REVIEW]: {
      label: 'Expert Audit',
      icon: ShieldCheck,
      style: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
    },
    [SubmissionStatus.APPROVED]: {
      label: 'Approved Consensus',
      icon: CheckCircle,
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    [SubmissionStatus.REJECTED]: {
      label: 'Rejected Alignment',
      icon: Ban,
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    [SubmissionStatus.REWARD_PENDING]: {
      label: 'Reward Pending',
      icon: Clock,
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    [SubmissionStatus.ARCHIVED]: {
      label: 'Archived Ledger',
      icon: Archive,
      style: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
    },
    [SubmissionStatus.CANCELLED]: {
      label: 'Cancelled',
      icon: Ban,
      style: 'bg-red-500/10 text-red-400 border-red-500/20'
    },
    [SubmissionStatus.EXPIRED]: {
      label: 'Expired lock',
      icon: AlertTriangle,
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  };

  const item = config[status] || { label: status, icon: HelpCircle, style: 'bg-slate-500/10 text-slate-400' };
  const Icon = item.icon;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider font-semibold border rounded-md ${item.style} ${className}`}
      aria-label={`Submission status: ${item.label}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{item.label}</span>
    </span>
  );
}

// ==========================================
// 2. SUBMISSION PROGRESS (PIPELINE STEPPER)
// ==========================================

interface ProgressProps {
  status: SubmissionStatus;
}

export function SubmissionProgress({ status }: ProgressProps) {
  const steps = [
    { label: 'Capture', states: [SubmissionStatus.DRAFT, SubmissionStatus.SAVING, SubmissionStatus.SAVED] },
    { label: 'Ingest', states: [SubmissionStatus.QUEUED, SubmissionStatus.OFFLINE, SubmissionStatus.PENDING_VALIDATION] },
    { label: 'Verify', states: [SubmissionStatus.AI_REVIEWING, SubmissionStatus.HUMAN_REVIEW] },
    { label: 'Commit', states: [SubmissionStatus.APPROVED, SubmissionStatus.REJECTED, SubmissionStatus.ARCHIVED] }
  ];

  const getStepIndex = (curStatus: SubmissionStatus) => {
    return steps.findIndex(step => step.states.includes(curStatus));
  };

  const currentStepIdx = getStepIndex(status);

  return (
    <div className="w-full space-y-3" id="submission-progress-pipeline">
      <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-slate-400">
        <span>CONSENSUS SEED PIPELINE</span>
        <span className="text-indigo-400 uppercase font-bold">
          {status === SubmissionStatus.APPROVED ? 'Consensus Resolved (Passed)' : 
           status === SubmissionStatus.REJECTED ? 'Consensus Rejected' : 'Processing...'}
        </span>
      </div>

      <div className="relative flex items-center justify-between gap-1">
        {/* Step Line */}
        <div className="absolute left-0 right-0 h-0.5 bg-zinc-800 top-2.5 -z-10" />

        {steps.map((step, idx) => {
          const isActive = idx <= currentStepIdx;
          const isCurrent = idx === currentStepIdx;

          return (
            <div key={idx} className="flex flex-col items-center shrink-0 w-16 text-center space-y-1">
              <div 
                className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border text-[9px] font-mono font-bold transition-all ${
                  isCurrent ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-500/20 animate-pulse' :
                  isActive ? 'bg-indigo-950 border-indigo-500 text-indigo-300' :
                  'bg-zinc-950 border-zinc-800 text-slate-500'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {idx + 1}
              </div>
              <span className={`text-[10px] font-sans transition-colors ${
                isCurrent ? 'text-indigo-400 font-bold' :
                isActive ? 'text-slate-300' :
                'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 3. SUBMISSION TIMELINE FLOW
// ==========================================

interface TimelineProps {
  startedAt: string;
  completedAt: string;
  syncedAt?: string;
  reviewedAt?: string;
  status: SubmissionStatus;
}

export function SubmissionTimeline({ startedAt, completedAt, syncedAt, reviewedAt, status }: TimelineProps) {
  const events = [
    { title: 'Validation Timer Initialized', desc: 'SLA lock claimed inside client sandbox.', date: startedAt, active: true },
    { title: 'Answers Compiled & Checked', desc: 'Sign-off cryptographic seals computed.', date: completedAt, active: true },
    { 
      title: 'Ledger Ingestion Sync', 
      desc: status === SubmissionStatus.OFFLINE ? 'Staged in local retry buffer.' : 'Committed to cloud staging repository.', 
      date: syncedAt || completedAt, 
      active: status !== SubmissionStatus.OFFLINE 
    },
    { 
      title: 'Consensus Decision', 
      desc: status === SubmissionStatus.APPROVED ? 'Approved via validation rule match.' : 
            status === SubmissionStatus.REJECTED ? 'Rejected or flagged by heuristics.' : 'Awaiting consensus verification.', 
      date: reviewedAt || null, 
      active: status === SubmissionStatus.APPROVED || status === SubmissionStatus.REJECTED 
    }
  ];

  return (
    <div className="space-y-4 text-left" id="submission-timeline">
      <h4 className="text-xs font-mono tracking-wider text-slate-400 font-bold uppercase">Transaction Lifecycle Audit Trail</h4>
      <div className="space-y-4 relative pl-4 border-l border-zinc-800">
        {events.map((ev, idx) => {
          if (!ev.active && idx > 1) return null;
          return (
            <div key={idx} className="relative space-y-1">
              {/* Bullet */}
              <div className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 top-0.5 ${
                ev.active ? 'bg-indigo-950 border-indigo-500' : 'bg-zinc-900 border-zinc-800'
              }`} />
              <div className="flex justify-between items-start gap-2">
                <span className={`text-xs font-bold font-sans ${ev.active ? 'text-slate-200' : 'text-slate-500'}`}>
                  {ev.title}
                </span>
                {ev.date && (
                  <span className="text-[9px] font-mono text-indigo-400 shrink-0">
                    {new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-sans font-light leading-snug">{ev.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 4. SUBMISSION EMPTY / ERROR / LOADING / SUCCESS SCREENS
// ==========================================

export function SubmissionEmptyState() {
  return (
    <div className="p-12 text-center space-y-4 border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20" id="submission-empty">
      <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900/40 border border-zinc-800 flex items-center justify-center text-slate-500">
        <FileText className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold font-display text-slate-300">No Submissions Found</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans leading-relaxed">
          Initialize the Universal Task Player inside the tasks tab, complete an alignment micro-task, and publish consensus nodes to view them here.
        </p>
      </div>
    </div>
  );
}

export function SubmissionLoadingState() {
  return (
    <div className="p-16 text-center space-y-4 flex flex-col items-center justify-center" id="submission-loading">
      <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
      <div className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">Querying Submission Repositories</p>
        <p className="text-xs text-slate-500 font-sans">Accessing cached indexed records and verifying integrity hashes...</p>
      </div>
    </div>
  );
}

export function SubmissionErrorState({ message }: { message: string }) {
  return (
    <div className="p-12 text-center space-y-4 border border-rose-900/20 bg-rose-950/5 rounded-2xl" id="submission-error">
      <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
      <div className="space-y-1">
        <h4 className="text-sm font-bold font-display text-rose-400">Security / Pipeline Conflict</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export function SubmissionSuccessScreen({ submissionId, onConfirm }: { submissionId: string; onConfirm: () => void }) {
  return (
    <div className="p-8 text-center bg-[#09090b] border border-zinc-800 rounded-2xl max-w-md w-full space-y-6 mx-auto" id="submission-success">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <CheckCircle className="h-8 w-8 animate-bounce" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold font-display text-white">Consensus Staged Successfully</h3>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          Your alignment answers have been signed and written to the immutable local queue blocks.
        </p>
      </div>

      <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1.5 text-left">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-slate-500">LEDGER REFERENCE ID:</span>
          <span className="text-indigo-400 font-bold">{submissionId}</span>
        </div>
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-slate-500">INTEGRITY LOCK STATUS:</span>
          <span className="text-emerald-400 font-bold uppercase">SIGNED & SEALED</span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
      >
        Dismiss Workspace Shell
      </button>
    </div>
  );
}
