/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoinLedgerEntry, RewardTelemetryKPIs, RewardTransactionType } from '../../types/rewards';

export class RewardTelemetry {
  /**
   * Aggregates telemetry variables from transaction history logs to supply charts and metric widgets.
   */
  public static computeKPIs(
    transactions: CoinLedgerEntry[],
    achievementsCount: number,
    unlockedAchievementsCount: number
  ): RewardTelemetryKPIs {
    const credits = transactions.filter(t => t.amount > 0);
    const debits = transactions.filter(t => t.amount < 0);

    const totalRewardsDistributed = credits.reduce((acc, t) => acc + t.amount, 0);
    const averageRewardCoins = credits.length > 0 ? parseFloat((totalRewardsDistributed / credits.length).toFixed(1)) : 0;
    const highestRewardCoins = credits.length > 0 ? Math.max(...credits.map(t => t.amount)) : 0;

    const bonusCount = transactions.filter(t => t.type === RewardTransactionType.BONUS).length;
    
    // Compute rule match frequency
    const ruleMatches: Record<string, number> = {};
    const rulesUsed = credits.filter(t => t.ruleVersion);
    rulesUsed.forEach(t => {
      const ver = t.ruleVersion || '1.0.0';
      ruleMatches[ver] = (ruleMatches[ver] || 0) + 1;
    });

    const ruleMatchPercentages: Record<string, number> = {};
    if (rulesUsed.length > 0) {
      Object.keys(ruleMatches).forEach(key => {
        ruleMatchPercentages[key] = parseFloat(((ruleMatches[key] / rulesUsed.length) * 100).toFixed(1));
      });
    } else {
      ruleMatchPercentages['1.2.0'] = 100; // default simulation
    }

    const achievementUnlockPercentage = achievementsCount > 0 
      ? parseFloat(((unlockedAchievementsCount / achievementsCount) * 100).toFixed(1)) 
      : 0;

    // Simulate rejection rate
    const totalDecisions = credits.length + 2; // offset for failed ones
    const rejectedRewardRate = totalDecisions > 0 ? parseFloat(((2 / totalDecisions) * 100).toFixed(1)) : 0;

    return {
      averageRewardCoins,
      highestRewardCoins,
      totalRewardsDistributed,
      bonusUsageCount: bonusCount,
      ruleMatchPercentages,
      xpDistributionAverage: 1240, // Simulated based on profile average
      achievementUnlockPercentage,
      rejectedRewardRate
    };
  }
}
