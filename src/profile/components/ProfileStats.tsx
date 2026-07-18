/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Eye, Flame, ShieldAlert, Globe, Trophy, Coins, Zap } from 'lucide-react';
import { ProfileStats as StatsType } from '../types';

interface ProfileStatsProps {
  stats: StatsType;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Tasks Completed',
      value: stats.tasksCompleted,
      desc: 'Validated alignment batches',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Tasks Reviewed',
      value: stats.tasksReviewed,
      desc: 'Peer validation audits',
      icon: Eye,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} Days`,
      desc: 'Consecutive log cycles',
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10'
    },
    {
      label: 'Longest Streak',
      value: `${stats.longestStreak} Days`,
      desc: 'Personal peak streak',
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      label: 'Average Accuracy',
      value: `${stats.averageAccuracy}%`,
      desc: 'Evaluation fidelity metric',
      icon: ShieldAlert,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      label: 'Regions Reached',
      value: stats.countriesContributed,
      desc: 'Geographic contributions',
      icon: Globe,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10'
    },
    {
      label: 'Achievements',
      value: `${stats.achievementsEarned} Unlocked`,
      desc: 'Verified system awards',
      icon: Trophy,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      label: 'Nova Coins',
      value: `${stats.coinsPlaceholder} NC`,
      desc: 'Calculated incentive pool',
      icon: Coins,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            id={`stat-card-${idx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs text-slate-400 font-medium truncate">{card.label}</span>
              <div className={`p-1.5 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-white tracking-tight">{card.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{card.desc}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
