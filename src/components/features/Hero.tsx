/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Sparkles, Trophy, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AppRoute } from '../../types';

interface HeroProps {
  setActiveRoute: (route: AppRoute) => void;
}

export function Hero({ setActiveRoute }: HeroProps) {
  return (
    <div className="relative py-12 md:py-20 flex flex-col items-center text-center max-w-4xl mx-auto" id="hero-feature-container">
      
      {/* Sparkle Tagline Indicator */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 mb-6 animate-fade-in">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Version 0.1 • System Initialized</span>
      </div>

      {/* Hero Headline */}
      <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6">
        High-fidelity<br/>
        <span className="bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
          Human Feedback.
        </span>
      </h1>

      {/* Sub-headline */}
      <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10 font-sans font-light">
        The professional intelligence layer for modern LLM development. We transform complex human intuition into structured datasets for global enterprises.
      </p>

      {/* Key Core Values Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12 text-left">
        <div className="p-4 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-xl flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-brand-600 dark:text-indigo-400 mt-0.5">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
              Reward Engine
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Earn high-yield TaskNova Coins on task completion. Standard index: 1 Coin = ₹0.10.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-xl flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-0.5">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
              Sleek Micro Tasks
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              No captchas, no low-quality ads. Delightful, 10-second tasks designed with premium SaaS speed.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-xl flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-0.5">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
              India Focus (Primary)
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Sized for high penetration, integrated with local payout systems like UPI/NetBanking.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setActiveRoute(AppRoute.SANDBOX)}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="font-semibold text-sm h-11 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500 dark:shadow-2xl dark:shadow-indigo-500/20"
        >
          Deploy Infrastructure
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setActiveRoute(AppRoute.BLUEPRINT)}
          className="font-medium text-sm h-11 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
        >
          Read Documentation
        </Button>
      </div>

      {/* Trust & Compliance Note */}
      <p className="text-[10px] text-slate-400 font-mono tracking-tight mt-6">
        No payment, subscription, or login required to test the Build v0.1 Sandbox.
      </p>

    </div>
  );
}
