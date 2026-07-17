/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../auth/hooks/useAuth';
import { OnboardingStep, OnboardingState } from '../types';
import { INITIAL_ONBOARDING_STATE } from '../constants';
import { onboardingStorageMock } from '../mocks';
import { WelcomeStep } from './WelcomeStep';
import { ChooseRoleStep } from './ChooseRoleStep';
import { AcceptTermsStep } from './AcceptTermsStep';
import { EmailVerificationStep } from './EmailVerificationStep';
import { ProfileSetupStep } from './ProfileSetupStep';
import { InterestsSkillsStep } from './InterestsSkillsStep';
import { NotificationsStep } from './NotificationsStep';
import { CompleteStep } from './CompleteStep';
import { 
  Sparkles, CheckCircle, ShieldAlert, Clock, ChevronRight, 
  Settings, Zap, ArrowRight, Save, RotateCcw 
} from 'lucide-react';

interface OnboardingShellProps {
  onComplete: () => void;
}

export const OnboardingShell: React.FC<OnboardingShellProps> = ({ onComplete }) => {
  const { isDeveloperMode } = useApp();
  const auth = useAuth();
  
  const [state, setState] = useState<OnboardingState>(() => {
    return onboardingStorageMock.loadOnboardingState();
  });

  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Sync state with local mock storage (Auto-Save Architecture)
  useEffect(() => {
    setSavingStatus('saving');
    onboardingStorageMock.saveOnboardingState(state);
    const t = setTimeout(() => {
      setSavingStatus('saved');
      const tInner = setTimeout(() => setSavingStatus('idle'), 1500);
      return () => clearTimeout(tInner);
    }, 800);
    return () => clearTimeout(t);
  }, [state]);

  // Adjust display name if auth user loaded
  useEffect(() => {
    if (auth.user && !state.profile.displayName && !state.profile.username) {
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          displayName: auth.user?.displayName || '',
          username: auth.user?.email ? auth.user.email.split('@')[0] : '',
        }
      }));
    }
  }, [auth.user]);

  const handleNext = () => {
    if (state.currentStep < OnboardingStep.COMPLETE) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > OnboardingStep.WELCOME) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleSkip = () => {
    // Only allow skipping optional screens: Profile, Interests, Notifications
    if (
      state.currentStep === OnboardingStep.PROFILE_SETUP ||
      state.currentStep === OnboardingStep.INTERESTS_SKILLS ||
      state.currentStep === OnboardingStep.NOTIFICATIONS
    ) {
      handleNext();
    }
  };

  const isSkipable = 
    state.currentStep === OnboardingStep.PROFILE_SETUP ||
    state.currentStep === OnboardingStep.INTERESTS_SKILLS ||
    state.currentStep === OnboardingStep.NOTIFICATIONS;

  const currentStepName = () => {
    switch (state.currentStep) {
      case OnboardingStep.WELCOME: return 'Welcome Node';
      case OnboardingStep.CHOOSE_ROLE: return 'Choose Role';
      case OnboardingStep.ACCEPT_TERMS: return 'Compliance';
      case OnboardingStep.EMAIL_VERIFICATION: return 'Verification';
      case OnboardingStep.PROFILE_SETUP: return 'Profile';
      case OnboardingStep.INTERESTS_SKILLS: return 'Interests & Skills';
      case OnboardingStep.NOTIFICATIONS: return 'Communications';
      case OnboardingStep.COMPLETE: return 'Launch ready';
      default: return 'Onboarding';
    }
  };

  // Step Percentage calculation
  const totalSteps = Object.keys(OnboardingStep).length / 2;
  const progressPercent = Math.round(((state.currentStep) / (totalSteps - 1)) * 100);

  // Quick reset for developer evaluation
  const handleReset = () => {
    onboardingStorageMock.clearOnboardingState();
    setState({ ...INITIAL_ONBOARDING_STATE });
  };

  const jumpToStep = (step: OnboardingStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4" id="onboarding-root-container">
      {/* Developer Mode Bypass Bar */}
      {isDeveloperMode && (
        <div className="p-3 bg-indigo-950/45 border border-indigo-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200" id="dev-shortcuts-bar">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">Developer Sandbox Bypass Mode Active</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 mr-1.5 font-mono">Jump Node:</span>
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => jumpToStep(idx)}
                className={`px-2 py-1 rounded font-semibold text-[10px] transition-colors cursor-pointer ${
                  state.currentStep === idx
                    ? 'bg-indigo-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {idx}
              </button>
            ))}
            <button
              onClick={handleReset}
              className="ml-3 px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold flex items-center gap-1 cursor-pointer"
              title="Reset state progress to step 0"
            >
              <RotateCcw className="w-3 h-3" />
              Reset State
            </button>
          </div>
        </div>
      )}

      {/* Main Header Card with Step Progress */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-mono text-indigo-400">
            <span>Onboarding Status Array</span>
            <span>•</span>
            <span className="text-slate-500">Step {state.currentStep + 1} of {totalSteps}</span>
          </div>
          <h1 className="text-lg font-bold text-slate-200 flex items-center gap-2 justify-center sm:justify-start">
            {currentStepName()}
            <span className="text-slate-600 font-normal">|</span>
            <span className="text-sm font-semibold text-slate-400">{progressPercent}% Calibrated</span>
          </h1>
        </div>

        {/* Skippable actions & auto save telemetry */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            {savingStatus === 'saving' && (
              <span className="text-[10px] font-mono text-indigo-400 animate-pulse flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" />
                Auto-saving Node State...
              </span>
            )}
            {savingStatus === 'saved' && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 justify-end">
                <CheckCircle className="w-3 h-3" />
                Ledger Synced Offline
              </span>
            )}
            {savingStatus === 'idle' && (
              <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1 justify-end">
                <Save className="w-3 h-3" />
                Node Synced
              </span>
            )}
          </div>

          {isSkipable && (
            <button
              onClick={handleSkip}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
              id="btn-onboarding-skip"
            >
              Skip Step
            </button>
          )}
        </div>
      </div>

      {/* Real-time High Contrast Progress Line */}
      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Onboarding Wizard Router Screen */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-950/20 shadow-xl min-h-[400px] flex flex-col justify-center">
        {state.currentStep === OnboardingStep.WELCOME && (
          <WelcomeStep
            displayName={state.profile.displayName || auth.user?.displayName || null}
            onContinue={handleNext}
          />
        )}

        {state.currentStep === OnboardingStep.CHOOSE_ROLE && (
          <ChooseRoleStep
            selectedRole={state.role}
            onSelectRole={(role) => setState((prev) => ({ ...prev, role }))}
            onContinue={handleNext}
            onBack={handleBack}
          />
        )}

        {state.currentStep === OnboardingStep.ACCEPT_TERMS && (
          <AcceptTermsStep
            termsAccepted={state.termsAccepted}
            onChangeTerms={(key, value) => setState((prev) => ({
              ...prev,
              termsAccepted: { ...prev.termsAccepted, [key]: value }
            }))}
            onContinue={handleNext}
            onBack={handleBack}
          />
        )}

        {state.currentStep === OnboardingStep.EMAIL_VERIFICATION && (
          <EmailVerificationStep
            email={auth.user?.email || 'staging-user@tasknova.ai'}
            isVerified={state.emailVerifiedSimulated}
            onSimulateVerify={() => setState((prev) => ({ ...prev, emailVerifiedSimulated: true }))}
            onContinue={handleNext}
            onBack={handleBack}
          />
        )}

        {state.currentStep === OnboardingStep.PROFILE_SETUP && (
          <ProfileSetupStep
            profile={state.profile}
            onChangeProfile={(profile) => setState((prev) => ({ ...prev, profile }))}
            onContinue={handleNext}
            onBack={handleBack}
          />
        )}

        {state.currentStep === OnboardingStep.INTERESTS_SKILLS && (
          <InterestsSkillsStep
            selectedInterests={state.selectedInterests}
            onChangeInterests={(selectedInterests) => setState((prev) => ({ ...prev, selectedInterests }))}
            onContinue={handleNext}
            onBack={handleBack}
          />
        )}

        {state.currentStep === OnboardingStep.NOTIFICATIONS && (
          <NotificationsStep
            notifications={state.notifications}
            onChangeNotifications={(key, value) => setState((prev) => ({
              ...prev,
              notifications: { ...prev.notifications, [key]: value }
            }))}
            onContinue={handleNext}
            onBack={handleBack}
          />
        )}

        {state.currentStep === OnboardingStep.COMPLETE && (
          <CompleteStep
            onboardingState={state}
            onFinish={() => {
              setState((prev) => ({ ...prev, isCompleted: true }));
              onComplete();
            }}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};
