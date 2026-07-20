/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMarketplace } from '../context/MarketplaceContext';
import { GlobalMatchingEngineService } from '../services/MatchingEngineService';
import { Sparkles, ArrowRight, CheckCircle2, Zap, Clock, Coins, Flame } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { formatDuration } from '../utils/marketplaceUtils';

interface RecommendationFeedProps {
  onSelectTask: (taskId: string) => void;
}

export function RecommendationFeed({ onSelectTask }: RecommendationFeedProps) {
  const { allTasks, profile } = useMarketplace();

  if (!profile || allTasks.length === 0) return null;

  // Rank all tasks and take the top 3 highest compatible ones
  const rankedResults = GlobalMatchingEngineService.rankTasks(allTasks, profile)
    .filter(item => item.match.compatibilityScore >= 75) // Only recommend high affinity matches
    .slice(0, 3);

  if (rankedResults.length === 0) {
    return (
      <div id="no-recommendations-alert" className="bg-slate-900/10 border border-slate-800/60 rounded-xl p-6 text-center backdrop-blur-sm">
        <Sparkles className="w-6 h-6 mx-auto text-slate-500 mb-2" />
        <p className="text-sm font-semibold text-slate-300">Evaluating Recommendations...</p>
        <p className="text-xs text-slate-500 mt-1">Upgrade your Trust Score or append localized languages to trigger higher affinity task matches.</p>
      </div>
    );
  }

  return (
    <div id="smart-recommendation-engine-feed" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
            <Sparkles className="w-4 h-4 fill-purple-400/20" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">AI Smart Discovery Feed</h2>
            <p className="text-[11px] text-slate-400">Personalized micro-routing matching your real-time capability matrix</p>
          </div>
        </div>
        <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 font-mono text-[10px]">
          Confidence Metric Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {rankedResults.map(({ task, match }) => {
          // Color coding for compatibility scores
          const isHigh = match.compatibilityScore >= 90;
          const scoreColor = isHigh ? 'text-teal-400' : 'text-purple-400';
          const bgGlow = isHigh ? 'group-hover:border-teal-500/40 group-hover:bg-teal-500/[0.01]' : 'group-hover:border-purple-500/40 group-hover:bg-purple-500/[0.01]';

          return (
            <div
              key={`rec_${task.id}`}
              onClick={() => onSelectTask(task.id)}
              className={`bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-slate-800/80 rounded-xl p-5 hover:border-slate-800 cursor-pointer flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-0.5 ${bgGlow}`}
            >
              {/* Highlight ribbon */}
              <div className={`absolute top-0 left-0 w-full h-0.5 rounded-t-xl transition-all duration-300 ${
                isHigh ? 'bg-teal-500/20 group-hover:bg-teal-500' : 'bg-purple-500/20 group-hover:bg-purple-500'
              }`} />

              <div>
                {/* Score & Badge Headers */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-2xl font-black tracking-tighter ${scoreColor}`}>{match.compatibilityScore}%</span>
                    <span className="text-[10px] font-mono uppercase text-slate-500">Match</span>
                  </div>
                  <div className="flex gap-1">
                    <Badge className="bg-slate-950/80 text-slate-400 border border-slate-800 font-mono text-[9px]">
                      {task.category}
                    </Badge>
                    <Badge className={`${
                      match.recommendationConfidence === 'High' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    } border text-[9px] font-mono`}>
                      {match.recommendationConfidence} Conf
                    </Badge>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-white line-clamp-1 transition-colors">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>

                {/* Core Matching Reasons Bulletpoints */}
                <div className="mt-3.5 space-y-1.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/60">
                  {match.matchingReasons.slice(0, 2).map((reason, ridx) => (
                    <div key={ridx} className="flex items-start text-[10px] text-slate-300 leading-normal font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mr-1.5 shrink-0 mt-0.5" />
                      <span className="text-slate-400">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Analytics row */}
              <div className="mt-5 pt-3.5 border-t border-slate-900/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-3 text-slate-400">
                  <div className="flex items-center gap-1" title="Expected Success Rate">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{match.expectedSuccessRate}% SR</span>
                  </div>
                  <div className="flex items-center gap-1" title="Expected Duration">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDuration(match.expectedCompletionTimeSeconds)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Coins className="w-3.5 h-3.5 shrink-0" />
                  <span>+{match.estimatedEarningsCoins} Coins</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
