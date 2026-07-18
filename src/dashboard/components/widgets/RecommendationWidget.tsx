/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';
import { Sparkles, Brain, ArrowRight, Activity } from 'lucide-react';

interface RecommendationItem {
  taskId: string;
  title: string;
  matchScore: number;
  reason: string;
  payout: number;
}

export const RecommendationWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    setRecommendations([
      {
        taskId: 'rec-task-1',
        title: 'Safety Evaluation - Red Teaming Persona',
        matchScore: 98,
        reason: 'SLA alignment accuracy on safety datasets is Gold standard.',
        payout: 420,
      },
      {
        taskId: 'rec-task-2',
        title: 'Code Synthesis semantic verification',
        matchScore: 94,
        reason: 'Matches your declared background skill in syntax checks.',
        payout: 280,
      }
    ]);
  }, []);

  return (
    <WidgetShell
      id="recommendation-widget"
      title="Nova AI Matching Recommendations"
      subtitle="RLHF tasks matching your calibration persona"
      size={size}
      expectedRepository="RecommendationRepository"
      expectedModel="TaskRecommendation"
      expectedFields={['taskId', 'title', 'matchScore', 'estimatedEarning']}
      futureConnectionPoint="const items = await useInfrastructure().recommendations.getRecommendedTasks(userId);"
      loadingStateSim="Triggering semantic matchmaking algorithm..."
      emptyStateSim="AI matched 0 new campaigns for your current skill vectors."
      errorStateSim="Matchmaking engine cluster offline."
    >
      <div className="space-y-2.5 mt-2">
        {recommendations.map(rec => (
          <div key={rec.taskId} className="p-2 border border-violet-100 rounded-lg dark:border-violet-950/20 bg-violet-50/10 dark:bg-violet-950/5 flex gap-2.5 items-center justify-between group cursor-pointer">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-indigo-500" />
                <span className="text-[10px] font-bold text-indigo-500 font-mono">
                  {rec.matchScore}% SEMANTIC MATCH
                </span>
              </div>
              <h5 className="font-semibold text-[11px] text-slate-800 dark:text-zinc-200 mt-1 truncate">
                {rec.title}
              </h5>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-tight truncate">
                {rec.reason}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="font-mono font-bold text-[10px] text-indigo-500 dark:text-indigo-400">
                +{rec.payout} COINS
              </span>
              <ArrowRight className="h-3 w-3 text-indigo-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
};
