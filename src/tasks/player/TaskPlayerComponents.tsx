/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Coins, CheckCircle, Sparkles, HelpCircle, ArrowRight, 
  ShieldCheck, AlertTriangle, RefreshCw, X, Check, Eye, Play, Pause, 
  ChevronLeft, ChevronRight, Laptop, Wifi, WifiOff, FileText, Layout, List,
  RotateCcw, LogOut, Info, ShieldAlert, Award, AlertCircle, HeartCrack
} from 'lucide-react';
import { Task, TaskDifficulty, TaskPriority } from '../../types/tasks';
import { PlayerSession, PlayerState, PlayerEventType } from '../../types/player';
import { useTasks } from '../context/TaskContext';
import { TaskPlayerPluginRegistry } from './plugins';
import { GlobalPlayerSessionService } from './PlayerSessionService';
import { GlobalTaskLockManager } from './TaskLockManager';
import { GlobalTrustEngine } from './TrustEngine';
import { GlobalTelemetryTracker } from './TelemetryTracker';
import { PlayerEventBus } from './PlayerEventBus';
import { formatCoins, formatCurrencyValue } from '../../utils';

// ==========================================
// 1. DOCK & OVERLAY LAYOUT MODALS (DIALOGS)
// ==========================================

export function PauseDialog({ isOpen, onResume }: { isOpen: boolean; onResume: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" id="pause-dialog">
      <div className="bg-[#09090b] border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Pause className="h-6 w-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-white">Session Suspended</h3>
          <p className="text-xs text-slate-400 font-sans">Your alignment validation timer has been paused. No telemetry or speed metrics are being logged.</p>
        </div>
        <button
          onClick={onResume}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          Resume Verification Work
        </button>
      </div>
    </div>
  );
}

export function ResumeDialog({ isOpen, onConfirm }: { isOpen: boolean; onConfirm: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" id="resume-dialog">
      <div className="bg-[#09090b] border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Play className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-white">Restore Active Draft?</h3>
          <p className="text-xs text-slate-400 font-sans">We found an auto-saved draft for this validation task. Would you like to restore your previous progress?</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Yes, Restore Work
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExitDialog({ isOpen, onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" id="exit-dialog">
      <div className="bg-[#09090b] border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <LogOut className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-white">Discard Ongoing Session?</h3>
          <p className="text-xs text-slate-400 font-sans">Warning: Exiting now will scrap all current inputs and release the task lock. This action is irreversible.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onCancel}
            className="py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Stay & Validate
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Discard & Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmationModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  isSubmitting 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void; 
  isSubmitting: boolean; 
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="confirmation-modal">
      <div className="bg-[#09090b] border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-white">Sign-off Consensus Alignment</h3>
          <p className="text-xs text-slate-400 font-sans">Are you sure you wish to submit? Your alignments will be verified by the consensus heuristic pipeline.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-slate-300 font-bold text-xs rounded-xl disabled:opacity-40"
          >
            Review Answers
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Commit Alignment</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. HELPER PANELS & DECORATIVE SCREENS
// ==========================================

export function LoadingScreen() {
  return (
    <div className="p-12 text-center space-y-4 flex flex-col items-center justify-center" id="loading-screen">
      <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
      <div className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">Acquiring Exclusive Reservation Lock</p>
        <p className="text-xs text-slate-400 font-sans">Verifying ledger double-submit locks and preparing alignment schemas...</p>
      </div>
    </div>
  );
}

export function ErrorScreen({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="p-12 text-center space-y-4 flex flex-col items-center justify-center border border-rose-500/20 bg-rose-500/5 rounded-2xl" id="error-screen">
      <HeartCrack className="h-10 w-10 text-rose-500 animate-pulse" />
      <div className="space-y-1">
        <p className="text-sm font-bold font-display text-rose-400">Reservation Lock Conflict</p>
        <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}

export function CompletionScreen({ 
  session, 
  coinsEarned, 
  onNext 
}: { 
  session: PlayerSession; 
  coinsEarned: number; 
  onNext: () => void; 
}) {
  return (
    <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#09090b] to-[#040405] border border-zinc-800 rounded-3xl animate-fade-in" id="completion-screen">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
          <Award className="h-8 w-8" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[8px] font-mono font-bold text-white">
          ✓
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-extrabold">Heuristic Alignment Accepted</span>
        <h3 className="text-xl font-extrabold text-white font-display">Microtask Verified Successfully!</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto font-sans leading-relaxed">
          Your alignment submission has been matched, validated, and published. Coins have been credited instantly to your local wallet ledger.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-md w-full bg-zinc-950 p-4 border border-zinc-900 rounded-2xl">
        <div className="text-center font-mono">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Payout Bounty</span>
          <p className="text-lg font-bold text-amber-400 mt-1">+{coinsEarned} Coins</p>
        </div>
        <div className="text-center font-mono border-x border-zinc-900">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">INR Value</span>
          <p className="text-xs font-bold text-emerald-400 mt-1.5">{formatCurrencyValue(coinsEarned, 'IN')}</p>
        </div>
        <div className="text-center font-mono">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Accuracy Snap</span>
          <p className="text-xs font-bold text-indigo-400 mt-1.5">{session.trustSnapshot.accuracy}%</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-105"
      >
        <span>Request Next Task Reservation</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function PluginLoader() {
  return (
    <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-zinc-950/20 rounded-xl border border-dashed border-slate-200 dark:border-zinc-850 animate-pulse" id="plugin-loader">
      <Layout className="h-6 w-6 text-indigo-400 mx-auto" />
      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold block">Configuring Dynamic workspace Plugin...</span>
    </div>
  );
}

// ==========================================
// 3. AUXILIARY STATUS BANNERS & BAR DETAILS
// ==========================================

export function OfflineBanner({ isOnline }: { isOnline: boolean }) {
  if (isOnline) return null;
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 text-[11px] font-mono uppercase font-bold flex items-center gap-2 rounded-xl" id="offline-banner">
      <WifiOff className="h-3.5 w-3.5 animate-pulse" />
      <span>Network Disconnected - Running in Local Memory Buffer Mode. Auto-saves are persistent.</span>
    </div>
  );
}

export function AutoSaveIndicator({ state }: { state: 'idle' | 'saving' | 'saved' }) {
  const styles = {
    idle: 'text-slate-400',
    saving: 'text-amber-400 animate-pulse',
    saved: 'text-emerald-400'
  };

  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold" id="autosave-indicator">
      <span className={`h-1.5 w-1.5 rounded-full ${state === 'saving' ? 'bg-amber-400 animate-ping' : state === 'saved' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
      <span className={styles[state]}>
        {state === 'saving' ? 'Synching Draft...' : state === 'saved' ? 'All changes saved locally' : 'Draft Synched'}
      </span>
    </div>
  );
}

export function SessionIndicator({ session }: { session: PlayerSession }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400 py-1" id="session-indicator">
      <span>Session: <strong className="text-slate-600 dark:text-zinc-300">{session.sessionId}</strong></span>
      <span>Locale: <strong className="text-slate-600 dark:text-zinc-300">{session.language}</strong></span>
      <span>Device: <strong className="text-slate-600 dark:text-zinc-300">{session.deviceInformation}</strong></span>
    </div>
  );
}

export function TaskInstructions({ instructions }: { instructions: string[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-slate-150 rounded-xl bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-950/25 overflow-hidden text-left" id="task-instructions-panel">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-zinc-950 text-xs font-bold font-mono uppercase text-slate-500 hover:text-slate-700 flex justify-between items-center cursor-pointer border-b border-slate-150 dark:border-zinc-850"
      >
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-indigo-400" />
          <span>SLA Alignment guidelines ({instructions.length} Rules)</span>
        </div>
        <span className="text-[10px]">{open ? 'Collapse [-]' : 'Expand [+]'}</span>
      </button>

      {open && (
        <div className="p-4 space-y-2 animate-fade-in text-xs font-sans font-light text-slate-600 dark:text-zinc-400">
          {instructions.map((step, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="font-mono text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
              <p className="leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProgressBar({ current, max }: { current: number; max: number }) {
  const ratio = Math.min(100, (current / max) * 100);
  return (
    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden" id="task-player-progress">
      <div 
        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
        style={{ width: `${ratio}%` }}
      />
    </div>
  );
}

// ==========================================
// 4. MAIN TASK PLAYER SHELL ENGINE
// ==========================================

export function TaskPlayerShell() {
  const { 
    activeTask, 
    isOnline, 
    submitTask,
    tasks,
    setActiveTask
  } = useTasks();

  const [session, setSession] = useState<PlayerSession | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.LOADING);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [autoSaveState, setAutoSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Modal Control States
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [lockToken, setLockToken] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const localTimeElapsedRef = useRef(0);

  // Initialize or reload on task modification
  useEffect(() => {
    if (!activeTask) {
      setPlayerState(PlayerState.LOADING);
      setSession(null);
      return;
    }

    const initPlayer = async () => {
      setPlayerState(PlayerState.PREPARING);
      
      // 1. Acquire transaction lease lock
      const lockRes = await GlobalTaskLockManager.acquireLock(activeTask.id, 'validator_contributor_1');
      if (!lockRes.success) {
        setErrorMessage(lockRes.reason || 'Failed to reserve task lock.');
        setPlayerState(PlayerState.ERROR);
        return;
      }
      setLockToken(lockRes.lock?.lockToken || '');

      // 2. Check for previously saved draft
      const saved = GlobalPlayerSessionService.getSavedSession(activeTask.id, 'validator_contributor_1');
      if (saved) {
        setShowRestorePrompt(true);
        setSession(saved);
        setAnswers(saved.answers);
        setSecondsElapsed(saved.elapsedTime);
        localTimeElapsedRef.current = saved.elapsedTime;
      } else {
        // Start fresh
        const newSess = await GlobalPlayerSessionService.startSession(activeTask, 'validator_contributor_1');
        const plugin = TaskPlayerPluginRegistry.get(activeTask.category);
        
        setSession(newSess);
        setAnswers(plugin.defaultAnswers(activeTask));
        setSecondsElapsed(0);
        localTimeElapsedRef.current = 0;
        setPlayerState(PlayerState.PLAYING);
      }
    };

    initPlayer();

    return () => {
      stopTimer();
    };
  }, [activeTask]);

  // Handle countdown/stopwatch timer intervals
  useEffect(() => {
    if (playerState === PlayerState.PLAYING) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [playerState]);

  // Automatically auto-saves progress changes in background
  useEffect(() => {
    if (playerState === PlayerState.PLAYING && session) {
      setAutoSaveState('saving');
      const delaySave = setTimeout(() => {
        const updated = GlobalPlayerSessionService.autoSave(session.sessionId, answers, localTimeElapsedRef.current);
        setSession(updated);
        setAutoSaveState('saved');
        setTimeout(() => setAutoSaveState('idle'), 1200);
      }, 1500); // Debounce autosaves to throttle write I/O

      return () => clearTimeout(delaySave);
    }
  }, [answers, secondsElapsed]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setSecondsElapsed(prev => {
        const next = prev + 1;
        localTimeElapsedRef.current = next;
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleRestoreDraft = () => {
    setShowRestorePrompt(false);
    setPlayerState(PlayerState.PLAYING);
    GlobalTelemetryTracker.trackEvent('restore', session!);
  };

  const handleStartFresh = () => {
    setShowRestorePrompt(false);
    if (activeTask && session) {
      const plugin = TaskPlayerPluginRegistry.get(activeTask.category);
      setAnswers(plugin.defaultAnswers(activeTask));
      setSecondsElapsed(0);
      localTimeElapsedRef.current = 0;
      setPlayerState(PlayerState.PLAYING);
    }
  };

  const handlePauseWork = () => {
    if (!session) return;
    stopTimer();
    GlobalPlayerSessionService.pauseSession(session.sessionId);
    setPlayerState(PlayerState.PAUSED);
    setShowPause(true);
  };

  const handleResumeWork = () => {
    if (!session) return;
    GlobalPlayerSessionService.resumeSession(session.sessionId);
    setPlayerState(PlayerState.PLAYING);
    setShowPause(false);
    startTimer();
  };

  const handleDiscardWork = () => {
    if (session) {
      GlobalPlayerSessionService.cancelSession(session.sessionId);
      GlobalTaskLockManager.releaseLock(session.taskId, lockToken);
      GlobalTelemetryTracker.trackEvent('cancel', session);
    }
    setShowExit(false);
    setSession(null);
    setPlayerState(PlayerState.LOADING);
    
    // Choose adjacent or clear
    if (tasks.length > 0) {
      setActiveTask(tasks[0]);
    } else {
      setActiveTask(null);
    }
  };

  const handlePreSubmit = () => {
    if (!activeTask) return;
    const plugin = TaskPlayerPluginRegistry.get(activeTask.category);
    const verify = plugin.validateAnswers(activeTask, answers);

    if (!verify.isValid) {
      alert(verify.error || 'Answers failed validation rules.');
      return;
    }

    setShowConfirm(true);
  };

  const handleFinalSubmit = async () => {
    if (!session || !activeTask) return;
    
    // 1. Evaluate Trust & Speed Checks
    const trustReport = await GlobalTrustEngine.evaluateSession(session, activeTask.estimatedCompletionTime);
    session.trustSnapshot.currentScore = trustReport.trustSnapshotScore;
    session.trustSnapshot.speedIndex = trustReport.speedIndex;
    if (trustReport.isSpeeding) session.trustSnapshot.spamProbability = 0.85;

    // 2. Submit values via TaskProvider hook (which interacts with global state + offline sync adapters)
    const success = await submitTask(answers, secondsElapsed);
    if (success) {
      await GlobalPlayerSessionService.submitSession(session.sessionId, activeTask.rewardCoins);
      GlobalTaskLockManager.releaseLock(activeTask.id, lockToken);
      GlobalTelemetryTracker.trackEvent('complete', session);
      
      setPlayerState(PlayerState.COMPLETED);
    } else {
      alert('Network transmission failed. Saving response inside offline queue buffer.');
    }
    setShowConfirm(false);
  };

  const handleNextTask = () => {
    setPlayerState(PlayerState.LOADING);
    setSession(null);
    // Find next task in queue
    const index = tasks.findIndex(t => t.id === activeTask?.id);
    if (index !== -1 && tasks.length > 1) {
      const nextIndex = (index + 1) % tasks.length;
      setActiveTask(tasks[nextIndex]);
    } else if (tasks.length > 0) {
      setActiveTask(tasks[0]);
    } else {
      setActiveTask(null);
    }
  };

  const handleResetAnswers = () => {
    if (activeTask) {
      const plugin = TaskPlayerPluginRegistry.get(activeTask.category);
      setAnswers(plugin.defaultAnswers(activeTask));
    }
  };

  const formatTimerString = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!activeTask) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-zinc-800 rounded-3xl" id="player-empty">
        <AlertTriangle className="h-8 w-8 text-slate-400 mb-2 animate-bounce" />
        <p className="text-xs text-slate-500 font-sans font-light">No validation microtasks are loaded. Select a task from the ledger queue on the left side to enter workspace.</p>
      </div>
    );
  }

  // Loaded Plugin detail
  const loadedPlugin = TaskPlayerPluginRegistry.get(activeTask.category);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 dark:bg-[#09090b] dark:border-zinc-800 p-6 space-y-6 relative overflow-hidden text-left" id="universal-task-player">
      
      {/* Dynamic Overlay Dialogs */}
      <PauseDialog isOpen={showPause} onResume={handleResumeWork} />
      <ResumeDialog isOpen={showRestorePrompt} onConfirm={handleRestoreDraft} />
      <ExitDialog isOpen={showExit} onConfirm={handleDiscardWork} onCancel={() => setShowExit(false)} />
      <ConfirmationModal isOpen={showConfirm} onConfirm={handleFinalSubmit} onCancel={() => setShowConfirm(false)} isSubmitting={false} />

      {/* 1. Universal Top Header Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-150 dark:border-zinc-850" id="player-top-header">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-extrabold uppercase rounded border border-indigo-150 dark:border-indigo-500/20">
              {activeTask.category}
            </span>
            <span className="font-mono text-[10px] text-slate-400">Ver: v{activeTask.version}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Lock Secured" />
          </div>
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">{activeTask.title}</h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Stopwatch / Remaining timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 border border-slate-250 dark:border-zinc-800 rounded-xl text-xs font-mono">
            <Clock className={`h-4 w-4 ${secondsElapsed > activeTask.estimatedCompletionTime ? 'text-amber-500 animate-pulse' : 'text-indigo-400'}`} />
            <span className="font-bold text-slate-700 dark:text-zinc-200">{formatTimerString(secondsElapsed)}</span>
            <span className="text-[10px] text-slate-400">/ Est: {formatTimerString(activeTask.estimatedCompletionTime)}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-500/5 px-2.5 py-1.5 rounded-xl border border-amber-500/10">
            <Coins className="h-4 w-4 fill-amber-500/10" />
            <span>+{activeTask.rewardCoins}</span>
          </div>
        </div>
      </div>

      <OfflineBanner isOnline={isOnline} />

      {/* 2. Interactive States routing */}
      {playerState === PlayerState.PREPARING && <LoadingScreen />}
      {playerState === PlayerState.ERROR && <ErrorScreen message={errorMessage} onRetry={() => setPlayerState(PlayerState.PREPARING)} />}
      {playerState === PlayerState.COMPLETED && session && (
        <CompletionScreen session={session} coinsEarned={activeTask.rewardCoins} onNext={handleNextTask} />
      )}

      {playerState === PlayerState.PLAYING && session && (
        <div className="space-y-6" id="player-active-workspace">
          
          {/* Expandable SLA instructions */}
          <TaskInstructions instructions={activeTask.instructions} />

          {/* 3. The Core Plugin Renderer Workspace Box */}
          <div className="p-5 bg-slate-50/50 dark:bg-zinc-950/20 border border-slate-150 dark:border-zinc-850/80 rounded-2xl relative">
            <div className="absolute right-3 top-3">
              <AutoSaveIndicator state={autoSaveState} />
            </div>

            {/* Render loaded Category Plugin */}
            {loadedPlugin.renderAnswerPanel({
              task: activeTask,
              answers,
              onChange: (newAnsw) => setAnswers(newAnsw)
            })}
          </div>

          {/* 4. Controls Ribbon Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t border-slate-150 dark:border-zinc-850" id="player-action-controls">
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePauseWork}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Pause alignment duration clock"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>Pause Work</span>
              </button>
              
              <button
                type="button"
                onClick={handleResetAnswers}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-500 rounded-xl transition-all cursor-pointer"
                title="Reset answers to template default"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowExit(true)}
                className="px-4 py-2 bg-zinc-50 border border-slate-200 hover:bg-slate-100 dark:bg-zinc-950 dark:border-zinc-850 dark:hover:bg-zinc-900 text-slate-500 hover:text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Exit Workspace
              </button>

              <button
                type="button"
                onClick={handlePreSubmit}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
              >
                <span>Commit Alignment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

          <SessionIndicator session={session} />

        </div>
      )}

    </div>
  );
}
