/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { GlobalMatchingEngineService } from '../services/MatchingEngineService';
import { 
  X, Coins, Clock, Shield, Award, CheckCircle, Flame, 
  MapPin, Globe, Check, AlertCircle, PlayCircle, Loader2,
  Bookmark, FileText, ArrowRight, ExternalLink, RefreshCw 
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { formatDuration, formatCountdown, getCountryFlagAndName, getLanguageName } from '../utils/marketplaceUtils';

interface TaskDetailsDrawerProps {
  taskId: string;
  onClose: () => void;
}

export function TaskDetailsDrawer({ taskId, onClose }: TaskDetailsDrawerProps) {
  const { 
    allTasks, 
    profile, 
    reservations, 
    reserveTask, 
    releaseReservation, 
    completeReservedTask,
    toggleBookmark,
    preferences,
    isOnline,
    trackRecentlyViewed 
  } = useMarketplace();

  const [isReserving, setIsReserving] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [simulatedFeedback, setSimulatedFeedback] = useState('');

  // Find the target task
  const task = allTasks.find(t => t.id === taskId);

  // Track recently viewed
  useEffect(() => {
    if (taskId) {
      trackRecentlyViewed(taskId);
    }
  }, [taskId]);

  if (!task || !profile) return null;

  // Calculate matching stats
  const match = GlobalMatchingEngineService.calculateMatch(task, profile);

  // Check if this task is currently reserved by this user
  const activeUserReservation = reservations.find(res => 
    res.taskId === taskId && 
    res.userId === profile.id && 
    res.status === 'Active'
  );

  const isBookmarked = preferences?.bookmarkedTaskIds.includes(taskId);

  // Check if reserved by *another* user (Conflict Detection simulation)
  const isReservedByAnother = !activeUserReservation && localStorage.getItem(`lock_${taskId}`) !== null;

  const handleReserve = async () => {
    setActionError('');
    setIsReserving(true);
    setSimulatedFeedback('');

    try {
      const res = await reserveTask(taskId);
      if (res.success) {
        setSimulatedFeedback('Task reserved successfully! Complete within the timer limits.');
      } else {
        setActionError(res.error || 'Failed to reserve task.');
      }
    } catch {
      setActionError('An unexpected error occurred during reservation.');
    } finally {
      setIsReserving(false);
    }
  };

  const handleRelease = async () => {
    if (!activeUserReservation) return;
    setActionError('');
    setIsReleasing(true);
    setSimulatedFeedback('');

    try {
      const res = await releaseReservation(activeUserReservation.id);
      if (res) {
        setSimulatedFeedback('Reservation released.');
      } else {
        setActionError('Failed to release reservation.');
      }
    } catch {
      setActionError('An unexpected error occurred.');
    } finally {
      setIsReleasing(false);
    }
  };

  const handleCompleteSimulation = async () => {
    if (!activeUserReservation) return;
    setIsCompleting(true);
    setActionError('');
    setSimulatedFeedback('Transmitting results to validators for consensus checks...');

    // Simulate validation latency
    setTimeout(async () => {
      try {
        await completeReservedTask(activeUserReservation.id, match.estimatedEarningsCoins);
        setSimulatedFeedback('Submission recorded! Coins and XP credited to profile.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch {
        setActionError('Failed to complete submission.');
      } finally {
        setIsCompleting(false);
      }
    }, 1200);
  };

  const countryInfo = getCountryFlagAndName(task.country);
  const langName = getLanguageName(task.language);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md relative h-full flex flex-col justify-between overflow-y-auto">
      {/* Drawer Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {task.id}
            </span>
            <Badge className="bg-slate-950/80 text-slate-400 border border-slate-800 font-mono text-[9px]">
              {task.taskType}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(taskId)}
              className={`p-1.5 rounded-lg border transition-all ${
                isBookmarked 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title="Bookmark Task"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400/20' : ''}`} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-950/80 border border-slate-800 hover:border-slate-800 hover:text-slate-200 rounded-lg text-slate-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-base font-bold text-white tracking-wide">{task.title}</h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{task.description}</p>

        {/* Campaign Metadata Fields */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <span className="text-[10px] font-mono text-slate-500 block">Reward Coins</span>
            <span className="text-sm font-bold text-amber-400 flex items-center mt-0.5">
              <Coins className="w-3.5 h-3.5 mr-1 text-amber-400" />
              +{task.rewardCoins} Coins
            </span>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <span className="text-[10px] font-mono text-slate-500 block">Est Completion</span>
            <span className="text-sm font-bold text-slate-300 flex items-center mt-0.5">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {formatDuration(task.estimatedCompletionTime)}
            </span>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <span className="text-[10px] font-mono text-slate-500 block">Task Difficulty</span>
            <span className="text-sm font-bold text-slate-300 flex items-center mt-0.5">
              <Award className="w-3.5 h-3.5 mr-1 text-purple-400" />
              {task.difficulty}
            </span>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <span className="text-[10px] font-mono text-slate-500 block">Validation Model</span>
            <span className="text-xs font-semibold text-slate-400 mt-0.5 block truncate">
              {task.validationMethod || 'Consensus'}
            </span>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <span className="text-[10px] font-mono text-slate-500 block">Accuracy Bar</span>
            <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">
              {task.requiredAccuracy || 95}% Minimum
            </span>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <span className="text-[10px] font-mono text-slate-500 block">Geographics / Lang</span>
            <span className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center truncate">
              <span className="mr-1">{countryInfo.flag}</span>
              <span className="truncate">{langName}</span>
            </span>
          </div>
        </div>

        {/* Smart Matching Analysis widget */}
        <div className="mt-5 p-4 bg-purple-950/10 border border-purple-900/30 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl" />
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-purple-400/20" /> Matching Analysis
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Profile Compatibility</span>
              <span className="text-sm font-bold text-purple-400">{match.compatibilityScore}% Match</span>
            </div>
            <div>
              <span className="text-slate-500 block">Predictive Success Rate</span>
              <span className="text-sm font-bold text-teal-400">{match.expectedSuccessRate}% Expected</span>
            </div>
            <div>
              <span className="text-slate-500 block">Earning Projections</span>
              <span className="text-sm font-bold text-amber-400">{match.estimatedEarningsCoins} Coins (Level bonus active)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Skills Intersection</span>
              <span className="text-sm font-bold text-slate-300">{match.skillMatchPercentage}% Skill match</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-purple-950/80 space-y-1">
            {match.matchingReasons.map((reason, ridx) => (
              <div key={ridx} className="text-[10px] text-slate-400 flex items-start leading-normal">
                <Check className="w-3 h-3 text-teal-400 mr-1.5 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines / Instructions list */}
        <div className="mt-5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Campaign Instructions</h3>
          <ul className="space-y-1.5">
            {task.instructions.map((inst, idx) => (
              <li key={idx} className="bg-slate-950/30 border border-slate-900/60 p-2.5 rounded-lg flex items-start text-xs text-slate-300 leading-normal">
                <span className="w-4 h-4 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-slate-500 mr-2 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1">{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Attachments Section */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Task attachments</h3>
            <div className="space-y-2">
              {task.attachments.map((attach) => (
                <div key={attach.id} className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-slate-300 block truncate">{attach.name}</span>
                      <span className="text-[10px] text-slate-500">{(attach.sizeBytes / 1024).toFixed(1)} KB | {attach.fileType}</span>
                    </div>
                  </div>
                  <a 
                    href={attach.url} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="p-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 rounded transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reservation & Interaction Footer Panel */}
      <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
        {actionError && (
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center font-mono">
            <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {simulatedFeedback && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center font-mono">
            <CheckCircle className="w-4 h-4 mr-1.5 shrink-0" />
            <span>{simulatedFeedback}</span>
          </div>
        )}

        {/* Conditional Footer Buttons */}
        {activeUserReservation ? (
          <div className="space-y-2 bg-purple-950/10 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Reservation Active
              </span>
              <span className={`font-bold ${activeUserReservation.timeRemainingSeconds < 300 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                {formatCountdown(activeUserReservation.timeRemainingSeconds)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={handleRelease}
                disabled={isReleasing || isCompleting}
                className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-40"
              >
                {isReleasing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Release Task'}
              </button>

              <button
                onClick={handleCompleteSimulation}
                disabled={isCompleting || isReleasing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-1 disabled:opacity-40"
              >
                {isCompleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Complete Task'}
              </button>
            </div>
          </div>
        ) : isReservedByAnother ? (
          <button
            disabled
            className="w-full bg-slate-950 border border-slate-900 text-slate-600 text-xs font-bold py-2.5 rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4 text-red-500/40" />
            <span>Reserved by another contributor (Collision Shield Active)</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleReserve}
              disabled={isReserving || profile.trustScore < task.requiredTrustScore || profile.accuracy < task.requiredAccuracy}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/10 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {isReserving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Reserve & Begin Task</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
