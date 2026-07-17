/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, Compass, Shield, Target } from 'lucide-react';

interface WelcomeStepProps {
  onContinue: () => void;
  displayName: string | null;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onContinue, displayName }) => {
  return (
    <div className="space-y-8 animate-fade-in text-center max-w-2xl mx-auto py-4" id="onboarding-welcome-step">
      <div className="relative inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-2">
        <Sparkles className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Welcome to TaskNova AI{displayName ? `, ${displayName}` : ''}
        </h1>
        <p className="text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
          Your gate is secure. Let's customize your workspace to align with your background and goals on the platform.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left my-8">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all duration-200">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg w-fit mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm mb-1">Model Alignment</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Participate in reinforcement learning loops and semantic tagging to shape AI nodes.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all duration-200">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm mb-1">Secure Campaigns</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Run evaluation pipelines or contribute to certified enterprise verification arrays.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all duration-200">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg w-fit mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm mb-1">Ledger Audits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All achievements, coins, and compliance records are cryptographically stored.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-lg hover:shadow-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all cursor-pointer w-full sm:w-auto"
          id="btn-onboarding-welcome-continue"
        >
          Begin Onboarding Journey
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
