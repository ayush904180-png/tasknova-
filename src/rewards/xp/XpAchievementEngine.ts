/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { XpProfile, Achievement } from '../../types/rewards';

export class XpAchievementEngine {
  private xpProfile: XpProfile;
  private achievements: Achievement[] = [];

  constructor() {
    this.xpProfile = {
      userId: 'USER-CURRENT',
      currentXp: 1240,
      currentLevel: 4,
      xpForNextLevel: 2500,
      contributorRank: 'Senior Aligner',
      milestonesReached: [
        { milestoneId: 'MILESTONE-LVL2', dateReached: '2026-06-15' },
        { milestoneId: 'MILESTONE-LVL3', dateReached: '2026-07-01' },
        { milestoneId: 'MILESTONE-LVL4', dateReached: '2026-07-10' },
      ]
    };

    this.loadDefaultAchievements();
  }

  /**
   * Seed standard achievement registry records.
   */
  private loadDefaultAchievements() {
    this.achievements = [
      {
        id: 'ACH-001',
        name: 'First Small Step',
        description: 'Completed your first micro alignment verification sequence.',
        badgeIcon: 'Zap',
        criteriaDescription: 'Submit 1 valid micro task response.',
        category: 'volume',
        unlockedAt: '2026-07-14T10:13:00.000Z'
      },
      {
        id: 'ACH-002',
        name: 'Excellence Standard',
        description: 'Achieve 100% accuracy validation output score on 5 tasks.',
        badgeIcon: 'Award',
        criteriaDescription: '5 tasks passed with 100% QA score.',
        category: 'accuracy',
        unlockedAt: '2026-07-16T18:06:00.000Z'
      },
      {
        id: 'ACH-003',
        name: 'Trusted Contributor Node',
        description: 'Maintain a reputation profile score exceeding 90 points.',
        badgeIcon: 'ShieldCheck',
        criteriaDescription: 'Reputation index >= 90.',
        category: 'special',
        unlockedAt: '2026-07-16T18:06:00.000Z'
      },
      {
        id: 'ACH-004',
        name: 'Centurion Validator',
        description: 'Process 100 complete human alignment submissions successfully.',
        badgeIcon: 'Sparkles',
        criteriaDescription: 'Complete 100 approved tasks.',
        category: 'volume'
      },
      {
        id: 'ACH-005',
        name: 'Speed Demon',
        description: 'Complete an intricate evaluation under 30% estimated duration.',
        badgeIcon: 'TrendingUp',
        category: 'special',
        criteriaDescription: 'Time speed modifier >= 1.25'
      },
      {
        id: 'ACH-006',
        name: 'AI Quality Guardian',
        description: 'Earn approval status on 10 highly critical high priority tasks.',
        badgeIcon: 'BookOpen',
        category: 'special',
        criteriaDescription: '10 critical difficulty approvals.'
      }
    ];
  }

  /**
   * Retrieves XP profile status.
   */
  public getXpProfile(): XpProfile {
    return { ...this.xpProfile };
  }

  /**
   * Retrieves registered achievements.
   */
  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  /**
   * Calculate standard experience level boundaries dynamically.
   * e.g. xp to clear level L = L * 500 XP points
   */
  public calculateLevelProgress(xp: number): {
    level: number;
    xpInCurrentLevel: number;
    xpRequiredForNext: number;
    percent: number;
  } {
    let level = 1;
    let accumulatedXp = 0;
    
    while (true) {
      const xpRequired = level * 400; // quadratic experience scaling curve
      if (xp >= accumulatedXp + xpRequired) {
        accumulatedXp += xpRequired;
        level++;
      } else {
        const xpInCurrentLevel = xp - accumulatedXp;
        const xpRequiredForNext = xpRequired;
        const percent = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100));
        return {
          level,
          xpInCurrentLevel,
          xpRequiredForNext,
          percent
        };
      }
    }
  }

  /**
   * Awards XP to profile and assesses Level Up transitions.
   */
  public awardXp(amount: number): {
    newTotalXp: number;
    levelUpTriggered: boolean;
    previousLevel: number;
    newLevel: number;
  } {
    const prevXp = this.xpProfile.currentXp;
    const prevProgress = this.calculateLevelProgress(prevXp);
    
    const newXp = prevXp + amount;
    const newProgress = this.calculateLevelProgress(newXp);
    
    this.xpProfile.currentXp = newXp;
    this.xpProfile.currentLevel = newProgress.level;
    this.xpProfile.xpForNextLevel = newProgress.xpRequiredForNext;

    // Rank evaluation based on level
    if (newProgress.level >= 10) {
      this.xpProfile.contributorRank = 'Grandmaster Aligner';
    } else if (newProgress.level >= 5) {
      this.xpProfile.contributorRank = 'Lead Consensus Inspector';
    } else if (newProgress.level >= 3) {
      this.xpProfile.contributorRank = 'Senior Aligner';
    } else {
      this.xpProfile.contributorRank = 'Junior Associate';
    }

    const levelUpTriggered = newProgress.level > prevProgress.level;
    if (levelUpTriggered) {
      const milestoneId = `MILESTONE-LVL${newProgress.level}`;
      this.xpProfile.milestonesReached.push({
        milestoneId,
        dateReached: new Date().toISOString().split('T')[0]
      });
    }

    return {
      newTotalXp: newXp,
      levelUpTriggered,
      previousLevel: prevProgress.level,
      newLevel: newProgress.level
    };
  }

  /**
   * Evaluates criteria and unlocks corresponding achievement.
   */
  public evaluateAchievementsTrigger(params: {
    totalApprovedCount: number;
    lastQualityScore: number;
    reputationIndex: number;
  }): Achievement[] {
    const unlockedThisTurn: Achievement[] = [];

    // Trigger Centurion Validator (ACH-004) if approved count >= 100
    const ach004 = this.achievements.find(a => a.id === 'ACH-004');
    if (ach004 && !ach004.unlockedAt && params.totalApprovedCount >= 100) {
      ach004.unlockedAt = new Date().toISOString();
      unlockedThisTurn.push(ach004);
    }

    // Trigger Trusted Contributor Node (ACH-003) if reputation >= 90
    const ach003 = this.achievements.find(a => a.id === 'ACH-003');
    if (ach003 && !ach003.unlockedAt && params.reputationIndex >= 90) {
      ach003.unlockedAt = new Date().toISOString();
      unlockedThisTurn.push(ach003);
    }

    return unlockedThisTurn;
  }

  /**
   * Simulates manually unlocking achievement for visual evaluation purposes.
   */
  public manualUnlock(id: string): Achievement | null {
    const ach = this.achievements.find(a => a.id === id);
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = new Date().toISOString();
      return ach;
    }
    return null;
  }

  /**
   * Reset achievements for demo purposes.
   */
  public resetAchievements(): void {
    this.loadDefaultAchievements();
    this.xpProfile.currentXp = 1240;
    const prog = this.calculateLevelProgress(1240);
    this.xpProfile.currentLevel = prog.level;
    this.xpProfile.xpForNextLevel = prog.xpRequiredForNext;
  }
}
