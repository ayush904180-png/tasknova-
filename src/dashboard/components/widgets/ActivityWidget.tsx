/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';
import { useInfrastructure } from '../../../infrastructure/providers/InfrastructureProvider';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { FirestoreTransaction } from '../../../infrastructure/firebase/types';
import { Clock, TrendingUp, Award, PlayCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  iconType: 'coins' | 'badge' | 'task' | 'level';
}

export const ActivityWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const { transactions } = useInfrastructure();
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let active = true;
    const fetchActivities = async () => {
      try {
        const userId = user?.uid || 'guest-calib-1';
        const txs = await transactions.getTransactionsByWallet(`wallet-${userId}`);
        
        if (txs && txs.length > 0 && active) {
          const mapped: ActivityItem[] = txs.map(tx => ({
            id: tx.id,
            title: tx.type === 'credit' ? `Coins Credited: +${tx.amount}` : `Coins Debited: -${tx.amount}`,
            description: `${tx.purpose.toUpperCase()} Reference Node: ${tx.referenceId || 'N/A'}`,
            time: new Date(tx.createdAt).toLocaleTimeString(),
            iconType: 'coins',
          }));
          setActivities(mapped.slice(0, 3));
        } else if (active) {
          // Pre-populate with typical operations timeline
          setActivities([
            {
              id: 'act-1',
              title: 'RLHF Task Complete',
              description: 'Earned +250 COINS on LLM Response Alignment safety pipeline.',
              time: 'Just now',
              iconType: 'coins',
            },
            {
              id: 'act-2',
              title: 'Badge Unlocked: Speed Demon',
              description: 'Completed 10 prompt evaluations in under 15 seconds average duration.',
              time: '2 hours ago',
              iconType: 'badge',
            },
            {
              id: 'act-3',
              title: 'Promoted to Level 3',
              description: 'SLA calibration score holds firm at 99.4% accuracy threshold.',
              time: '1 day ago',
              iconType: 'level',
            }
          ]);
        }
      } catch (err) {
        console.error('Error generating activities timeline:', err);
      }
    };

    fetchActivities();
    return () => { active = false; };
  }, [transactions, user]);

  return (
    <WidgetShell
      id="activity-widget"
      title="Recent Node Activities"
      subtitle="Operational audits and verification events"
      size={size}
      expectedRepository="TransactionRepository"
      expectedModel="FirestoreTransaction"
      expectedFields={['id', 'amount', 'type', 'purpose', 'referenceId', 'createdAt']}
      futureConnectionPoint="const ledger = await useInfrastructure().transactions.getTransactionsByWallet(walletId);"
      loadingStateSim="Reading microtask ledger stream..."
      emptyStateSim="Zero activity logged inside current ledger block."
      errorStateSim="Ledger index is corrupted or locked."
    >
      <div className="space-y-3 mt-2 font-sans text-xs">
        {activities.map((act) => (
          <div key={act.id} className="flex gap-3 text-left">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-6 w-6 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center">
                {act.iconType === 'coins' && <TrendingUp className="h-3 w-3 text-amber-500" />}
                {act.iconType === 'badge' && <Award className="h-3 w-3 text-pink-500" />}
                {act.iconType === 'level' && <Clock className="h-3 w-3 text-indigo-500" />}
              </div>
            </div>

            <div className="min-w-0 flex-1 border-b border-slate-100 dark:border-white/5 pb-2">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-semibold text-[11px] text-slate-800 dark:text-zinc-200">
                  {act.title}
                </span>
                <span className="text-[8px] font-mono text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                  {act.time}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed truncate">
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
};
