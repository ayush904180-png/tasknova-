/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OnboardingState } from '../types';
import { CheckCircle, ArrowRight, Star, Compass, Award, ShieldCheck, Mail, Loader2 } from 'lucide-react';

interface CompleteStepProps {
  onboardingState: OnboardingState;
  onFinish: () => void;
  onBack: () => void;
}

export const CompleteStep: React.FC<CompleteStepProps> = ({
  onboardingState,
  onFinish,
  onBack,
}) => {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinishClick = () => {
    setIsFinishing(true);
    setTimeout(() => {
      setIsFinishing(false);
      onFinish();
    }, 1500); // Simulated save timing
  };

  const getRoleLabel = () => {
    if (onboardingState.role === 'contributor') return 'Model Alignment Contributor';
    if (onboardingState.role === 'creator') return 'Campaign Creator / Evaluator';
    if (onboardingState.role === 'business') return 'Enterprise Partner Node';
    return 'General Node';
  };

  return (
    <div className="space-y-6 animate-fade-in text-center max-w-lg mx-auto py-4" id="onboarding-complete-step">
      {/* Decorative Fireworks / Circles */}
      <div className="relative inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 mb-2">
        <CheckCircle className="w-16 h-16" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Onboarding Complete</span>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight sm:text-4xl">
          Your Workspace is Ready!
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          All initialization files have been structured successfully. Your active node is fully calibrated and live.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 text-left space-y-4 my-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Active Node Configuration Summary
        </h3>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Display Signature:</span>
            <span className="font-semibold text-slate-200">{onboardingState.profile.displayName || 'Staging User'}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">Username:</span>
            <span className="font-mono text-indigo-300">@{onboardingState.profile.username || 'staging_user'}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">Assigned Role:</span>
            <span className="font-medium text-slate-200 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {getRoleLabel()}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">Interests / Skills:</span>
            <span className="font-medium text-slate-200">
              {onboardingState.selectedInterests.length} Selected
            </span>
          </div>

          <div className="col-span-2">
            <span className="text-slate-500 block mb-0.5">Communication Channels:</span>
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {onboardingState.notifications.email && (
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5" />
                  Email
                </span>
              )}
              {onboardingState.notifications.taskAlerts && (
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                  <Compass className="w-2.5 h-2.5" />
                  Tasks
                </span>
              )}
              {onboardingState.notifications.rewardUpdates && (
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                  <Award className="w-2.5 h-2.5" />
                  Rewards
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save action/loader */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleFinishClick}
          disabled={isFinishing}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg shadow-lg hover:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all cursor-pointer w-full"
          id="btn-onboarding-finish"
        >
          {isFinishing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Writing node payload registry...
            </>
          ) : (
            <>
              Go to Dashboard (Placeholder)
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          onClick={onBack}
          disabled={isFinishing}
          className="text-xs text-slate-500 hover:text-slate-300 underline focus:outline-none transition-colors cursor-pointer"
          id="btn-complete-back"
        >
          Review configuration details
        </button>
      </div>
    </div>
  );
};
