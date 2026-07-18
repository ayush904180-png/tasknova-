/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { ProfileCompleteness as CompletenessType } from '../types';

interface ProfileCompletenessProps {
  completeness: CompletenessType;
  onNavigateToSection?: (section: string) => void;
}

export const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({
  completeness,
  onNavigateToSection
}) => {
  const getProgressColor = (percent: number) => {
    if (percent < 40) return 'bg-rose-500';
    if (percent < 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getProgressBorder = (percent: number) => {
    if (percent < 40) return 'border-rose-500/30';
    if (percent < 75) return 'border-amber-500/30';
    return 'border-emerald-500/30';
  };

  return (
    <div className={`p-6 rounded-2xl border ${getProgressBorder(completeness.percentage)} bg-slate-950/60 backdrop-blur-md space-y-6`}>
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Calibration Complete Engine
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Increase profile completion to unlock advanced task pipelines and incentive triggers.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {completeness.percentage}%
          </span>
          <div className="text-[10px] text-slate-500 font-mono">
            {completeness.completedCount}/{completeness.totalCount} parameters
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full ${getProgressColor(completeness.percentage)}`}
          initial={{ width: '0%' }}
          animate={{ width: `${completeness.percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Bottom Layout Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left column: Steps */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Remaining Steps</h4>
          {completeness.remainingSteps.length > 0 ? (
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {completeness.remainingSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/30 hover:bg-slate-900/60 p-2 rounded-lg border border-slate-800/50 transition-colors"
                >
                  <Circle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Full identity calibration achieved! No pending steps.</span>
            </div>
          )}
        </div>

        {/* Right column: Completed & Recomms */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Completed Segments</h4>
            <div className="flex flex-wrap gap-1.5">
              {completeness.completedSections.map((section, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  ✓ {section}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Recommendations</h4>
            <div className="space-y-2">
              {completeness.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-indigo-200"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
