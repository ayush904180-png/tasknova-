/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardRow {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

export const LeaderboardWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const [rankings, setRankings] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    // Top 3 alignment validators
    setRankings([
      { userId: 'u1', username: 'alex_RLHF_expert', score: 18500, rank: 1 },
      { userId: 'u2', username: 'carla_localizer', score: 14200, rank: 2 },
      { userId: 'u3', username: 'ayush904180', score: 12500, rank: 3 }
    ]);
  }, []);

  return (
    <WidgetShell
      id="leaderboard-widget"
      title="Global Validator Rankings"
      subtitle="Highest scoring RLHF calibrators"
      size={size}
      expectedRepository="LeaderboardRepository"
      expectedModel="FirestoreLeaderboard"
      expectedFields={['id', 'period', 'category', 'rankings']}
      futureConnectionPoint="const rank = await useInfrastructure().leaderboards.getById('weekly_global');"
      loadingStateSim="Reading periodic scores cached memory map..."
      emptyStateSim="Leaderboard calculation in progress."
      errorStateSim="Leaderboard database collection is unreachable."
    >
      <div className="space-y-2 mt-2">
        {rankings.map((user) => (
          <div key={user.userId} className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-5 text-center font-mono font-bold text-slate-400 dark:text-zinc-500">
                {user.rank === 1 && <Crown className="h-3.5 w-3.5 text-yellow-500 mx-auto" />}
                {user.rank === 2 && <Medal className="h-3.5 w-3.5 text-slate-400 mx-auto" />}
                {user.rank === 3 && <Medal className="h-3.5 w-3.5 text-amber-600 mx-auto" />}
                {user.rank > 3 && user.rank}
              </span>
              <span className="font-medium text-slate-800 dark:text-zinc-200">
                @{user.username}
              </span>
            </div>

            <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">
              {user.score.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
};
