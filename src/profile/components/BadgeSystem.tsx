/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Info, Shield, HelpCircle, UserCheck, Star, ShieldAlert } from 'lucide-react';
import { Badge } from '../types';
import { SYSTEM_BADGES } from '../constants';

interface BadgeSystemProps {
  activeBadgeIds: string[];
  onAwardBadge?: (badgeId: string, badgeLabel: string) => void;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  activeBadgeIds,
  onAwardBadge
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Map icon strings to Lucide icon components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return Shield;
      case 'Award': return Award;
      case 'Cpu': return ShieldAlert;
      case 'Zap': return Star;
      case 'Star': return Star;
      case 'Users': return UserCheck;
      default: return HelpCircle;
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Cryptographic Badge Matrix
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Stack and prioritize peer-reviewed identity badges verified on the TaskNova alignment network.
        </p>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {SYSTEM_BADGES.map((badge) => {
          const isActive = activeBadgeIds.includes(badge.id);
          const Icon = getIconComponent(badge.icon);

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 relative ${
                isActive
                  ? 'bg-slate-900/60 border-indigo-500/30 hover:border-indigo-500/50'
                  : 'bg-slate-950/20 border-slate-800/40 opacity-40 hover:opacity-60'
              }`}
            >
              {/* Badge Visual Indicator */}
              <div className={`p-2.5 rounded-xl ${isActive ? badge.color : 'bg-slate-800/10 text-slate-500 border border-slate-800/30'}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Text metadata */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {badge.label}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 px-1 rounded">
                      P{badge.priority}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Status Action */}
              <div className="absolute right-3 top-3">
                <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Stacking Priority Stack Visualizer */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 font-mono">Active Stacking Sequence (Priority Sorted)</h4>
        <div className="flex flex-wrap items-center gap-2">
          {SYSTEM_BADGES.filter((b) => activeBadgeIds.includes(b.id))
            .sort((a, b) => b.priority - a.priority)
            .map((b) => {
              const Icon = getIconComponent(b.icon);
              return (
                <div
                  key={b.id}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${b.color}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{b.label}</span>
                </div>
              );
            })}
          {activeBadgeIds.length === 0 && (
            <span className="text-xs text-slate-500">No active alignment credentials stacked on this node.</span>
          )}
        </div>
      </div>

      {/* Detail Modals / Interactive Showcase */}
      {selectedBadge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedBadge.color}`}>
                {React.createElement(getIconComponent(selectedBadge.icon), { className: 'w-5 h-5' })}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{selectedBadge.label}</h4>
                <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider">{selectedBadge.category} badge</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedBadge(null)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800/30"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedBadge.description}
          </p>
          <div className="flex items-center gap-4 text-[10px] text-slate-400 border-t border-slate-800/40 pt-3 font-mono">
            <span>Stack Priority: {selectedBadge.priority}</span>
            <span>Target UID: badge_{selectedBadge.id}</span>
            {onAwardBadge && !activeBadgeIds.includes(selectedBadge.id) && (
              <button
                onClick={() => onAwardBadge(selectedBadge.id, selectedBadge.label)}
                className="ml-auto px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-colors"
              >
                Mock Earn Badge
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
