/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskDifficulty } from '../../types/index';

/**
 * Configuration schema for reward multipliers.
 */
export interface MultiplierConfig {
  difficultyMultiplier: { Easy: number; Medium: number; Hard: number };
  trustLevels: { Low: number; Medium: number; High: number };
  qualityThresholds: { basic: number; outstanding: number; perfect: number };
  campaignRate: number;
  weekendBonusRate: number;
  festivalBonusRate: number;
  peakHourRate: number;
  firstTaskRate: number;
  dailyStreakRate: number;
  weeklyStreakRate: number;
  monthlyStreakRate: number;
  referralBonusRate: number;
  futureAiBonusRate: number;
}

export class MultiplierEngine {
  private config: MultiplierConfig;

  constructor() {
    this.config = {
      difficultyMultiplier: { Easy: 1.0, Medium: 1.5, Hard: 2.2 },
      trustLevels: { Low: 0.8, Medium: 1.0, High: 1.25 },
      qualityThresholds: { basic: 1.0, outstanding: 1.15, perfect: 1.3 },
      campaignRate: 1.5, // Campaign multiplier e.g. active event
      weekendBonusRate: 1.1,
      festivalBonusRate: 1.25,
      peakHourRate: 1.15,
      firstTaskRate: 2.0,
      dailyStreakRate: 1.05,
      weeklyStreakRate: 1.15,
      monthlyStreakRate: 1.3,
      referralBonusRate: 1.1,
      futureAiBonusRate: 1.05
    };
  }

  /**
   * Retrieves active config settings.
   */
  public getConfig(): MultiplierConfig {
    return { ...this.config };
  }

  /**
   * Dynamically evaluates all multipliers based on contextual inputs.
   */
  public calculateMultipliers(params: {
    difficulty: TaskDifficulty;
    trustScore: number;
    qualityScore: number;
    isWeekend?: boolean;
    isFestival?: boolean;
    isPeakHour?: boolean;
    isFirstTask?: boolean;
    streakDays?: number;
    isReferralCampaign?: boolean;
  }): {
    multipliersApplied: Record<string, number>;
    cumulativeMultiplier: number;
  } {
    const multipliersApplied: Record<string, number> = {};
    let cumulative = 1.0;

    // 1. Difficulty Multiplier
    const diffMult = this.config.difficultyMultiplier[params.difficulty] || 1.0;
    multipliersApplied['Difficulty'] = diffMult;
    cumulative *= diffMult;

    // 2. Trust Multiplier
    let trustMult = this.config.trustLevels.Medium;
    if (params.trustScore >= 85) trustMult = this.config.trustLevels.High;
    else if (params.trustScore < 40) trustMult = this.config.trustLevels.Low;
    multipliersApplied['Trust'] = trustMult;
    cumulative *= trustMult;

    // 3. Quality Multiplier
    let qualMult = this.config.qualityThresholds.basic;
    if (params.qualityScore >= 98) qualMult = this.config.qualityThresholds.perfect;
    else if (params.qualityScore >= 90) qualMult = this.config.qualityThresholds.outstanding;
    multipliersApplied['Quality'] = qualMult;
    cumulative *= qualMult;

    // 4. Weekend Bonus
    if (params.isWeekend) {
      multipliersApplied['Weekend Bonus'] = this.config.weekendBonusRate;
      cumulative *= this.config.weekendBonusRate;
    }

    // 5. Festival Bonus
    if (params.isFestival) {
      multipliersApplied['Festival Bonus'] = this.config.festivalBonusRate;
      cumulative *= this.config.festivalBonusRate;
    }

    // 6. Peak Hour Bonus
    if (params.isPeakHour) {
      multipliersApplied['Peak Hour Bonus'] = this.config.peakHourRate;
      cumulative *= this.config.peakHourRate;
    }

    // 7. First Task Bonus
    if (params.isFirstTask) {
      multipliersApplied['First Task Bonus'] = this.config.firstTaskRate;
      cumulative *= this.config.firstTaskRate;
    }

    // 8. Streak Bonuses
    if (params.streakDays && params.streakDays > 0) {
      if (params.streakDays >= 30) {
        multipliersApplied['Monthly Streak'] = this.config.monthlyStreakRate;
        cumulative *= this.config.monthlyStreakRate;
      } else if (params.streakDays >= 7) {
        multipliersApplied['Weekly Streak'] = this.config.weeklyStreakRate;
        cumulative *= this.config.weeklyStreakRate;
      } else {
        multipliersApplied['Daily Streak'] = this.config.dailyStreakRate;
        cumulative *= this.config.dailyStreakRate;
      }
    }

    // 9. Referral Campaign Bonus
    if (params.isReferralCampaign) {
      multipliersApplied['Referral Bonus'] = this.config.referralBonusRate;
      cumulative *= this.config.referralBonusRate;
    }

    // 10. Future AI Bonus placeholder
    multipliersApplied['AI Quality Bonus'] = this.config.futureAiBonusRate;
    cumulative *= this.config.futureAiBonusRate;

    return {
      multipliersApplied,
      cumulativeMultiplier: parseFloat(cumulative.toFixed(3))
    };
  }
}
