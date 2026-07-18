/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldAlert, Cpu, Sparkles, Star, TrendingUp } from 'lucide-react';
import { ContributorIdentity as ContributorType, VerificationStatus } from '../types';

interface ContributorIdentityProps {
  contributor: ContributorType;
  verificationStatus: VerificationStatus;
}

export const ContributorIdentity: React.FC<ContributorIdentityProps> = ({
  contributor,
  verificationStatus
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond': return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'Platinum': return 'text-slate-300 bg-slate-500/10 border-slate-500/30';
      case 'Gold': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Silver': return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30';
      default: return 'text-amber-600 bg-amber-700/10 border-amber-700/30';
    }
  };

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-3 h-3" />
            Verified Special Node
          </span>
        );
      case VerificationStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <Cpu className="w-3 h-3 animate-pulse" />
            Audit Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <ShieldAlert className="w-3 h-3" />
            Unverified
          </span>
        );
    }
  };

  const xpPercentage = Math.round((contributor.experiencePoints / contributor.nextLevelXP) * 100);

  return (
    <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md space-y-6">
      {/* Level and Rank Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Alignment Spec Index
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            {contributor.rank}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Validating fine-tuning datasets and RLHF alignment runs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getVerificationBadge(verificationStatus)}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getTierColor(contributor.tier)}`}>
            {contributor.tier} Tier
          </span>
        </div>
      </div>

      {/* Stats Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP Track */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Level Progression</span>
            <span className="text-white font-mono font-bold">Lvl {contributor.level}</span>
          </div>
          <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>{contributor.experiencePoints} XP</span>
            <span>{contributor.nextLevelXP} XP Next</span>
          </div>
        </div>

        {/* Accuracy Meter */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Validation Accuracy</span>
            <span className="text-emerald-400 font-mono font-bold">{contributor.accuracyRate}%</span>
          </div>
          <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${contributor.accuracyRate}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Critical Target Limit: 95%</span>
            <span className="text-emerald-400/80">Sustained High Fidelity</span>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Model Safety Onboarding</span>
            <span className="text-purple-400 font-mono font-bold">{contributor.learningProgress}%</span>
          </div>
          <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${contributor.learningProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>3/4 curriculum nodes passed</span>
            <span className="text-purple-400/80">Calibration Active</span>
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs">
        <TrendingUp className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span className="text-slate-400">
          Next Milestone Target:{' '}
          <strong className="text-slate-200 font-medium">{contributor.nextMilestone}</strong>
        </span>
      </div>
    </div>
  );
};
