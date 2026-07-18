/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission, ValidationStatus } from '../../types/submission';
import { TaskDifficulty } from '../../types/index';
import { CalculatedRewardResult, RewardTransactionType, CoinLedgerEntry } from '../../types/rewards';
import { RewardRulesEngine, RuleEvaluationContext } from '../rules/RewardRulesEngine';
import { MultiplierEngine } from '../multipliers/MultiplierEngine';
import { AntiFraudGuard, AntiFraudContext } from '../security/AntiFraudGuard';
import { CoinLedger } from '../ledger/CoinLedger';
import { XpAchievementEngine } from '../xp/XpAchievementEngine';
import { GlobalRewardRepository } from '../repositories/RewardRepository';
import { RewardMapper } from '../mappers/RewardMapper';

/**
 * Event Listener contract for simulated event bus alignment.
 */
export type EventBusListener = (eventName: string, payload: any) => void;

export class RewardService {
  private rulesEngine: RewardRulesEngine;
  private multiplierEngine: MultiplierEngine;
  private fraudGuard: AntiFraudGuard;
  private ledger: CoinLedger;
  private xpEngine: XpAchievementEngine;
  private eventListeners: EventBusListener[] = [];

  constructor() {
    this.rulesEngine = new RewardRulesEngine();
    this.multiplierEngine = new MultiplierEngine();
    this.fraudGuard = new AntiFraudGuard();
    this.ledger = new CoinLedger();
    this.xpEngine = new XpAchievementEngine();
  }

  /**
   * Register listener for Event Bus integration.
   */
  public registerEventListener(listener: EventBusListener): void {
    this.eventListeners.push(listener);
  }

  /**
   * Dispatches events to simulated Global Event Bus.
   */
  private dispatchEvent(eventName: string, payload: any): void {
    console.log(`[EventBus] Dispatched: ${eventName}`, payload);
    this.eventListeners.forEach(listener => listener(eventName, payload));
  }

  public getRulesEngine(): RewardRulesEngine {
    return this.rulesEngine;
  }

  public getMultiplierEngine(): MultiplierEngine {
    return this.multiplierEngine;
  }

  public getLedger(): CoinLedger {
    return this.ledger;
  }

  public getXpEngine(): XpAchievementEngine {
    return this.xpEngine;
  }

  /**
   * Core workflow orchestration contract (Calculates & Commits entire Reward Package)
   */
  public async evaluateAndProcessReward(
    submission: Submission,
    options?: {
      isDuplicate?: boolean;
      isSpam?: boolean;
      riskScore?: number;
      isPayloadTampered?: boolean;
      isVelocityAttack?: boolean;
      isSuspiciousDevice?: boolean;
      streakDays?: number;
      isWeekend?: boolean;
      isFestival?: boolean;
      isPeakHour?: boolean;
      isFirstTask?: boolean;
    }
  ): Promise<CalculatedRewardResult> {
    const timestampStr = new Date().toISOString();
    const result: CalculatedRewardResult = {
      isEligible: false,
      baseRewardDetails: {
        baseRewardCoins: submission.qualityScorePlaceholder ? Math.round(submission.qualityScorePlaceholder * 0.2) : 15,
        taskDifficulty: (submission as any).taskDifficulty || TaskDifficulty.MEDIUM,
        difficultyMultiplier: 1.5,
        taskPriority: 'Medium',
        priorityMultiplier: 1.0,
        qualityScore: submission.qualityScorePlaceholder || 80,
        qualityMultiplier: 1.0,
        confidenceScore: 90,
        confidenceMultiplier: 1.0,
        trustScore: 85,
        trustMultiplier: 1.0,
        accuracyModifier: 1.0,
        businessCampaignMultiplier: 1.0,
        dailyBonusCoins: 0,
        weeklyBonusCoins: 0,
        seasonalEventBonusCoins: 0,
        specialChallengeBonusCoins: 0
      },
      multipliersApplied: {},
      bonusesApplied: {},
      finalCoins: 0,
      xpAwarded: 0,
      ruleVersionMatched: '1.2.0',
      antiFraudPassed: false,
      fraudAlerts: []
    };

    // 1. Fraud Check
    const fraudContext: AntiFraudContext = {
      isDuplicate: options?.isDuplicate || false,
      isSpam: options?.isSpam || false,
      riskScore: options?.riskScore || 10,
      isPayloadTampered: options?.isPayloadTampered || false,
      isVelocityAttack: options?.isVelocityAttack || false,
      isSuspiciousDevice: options?.isSuspiciousDevice || false
    };

    const fraudEval = this.fraudGuard.evaluateFraudRisk(submission, fraudContext);
    result.antiFraudPassed = fraudEval.passed;
    result.fraudAlerts = fraudEval.alerts;

    if (!fraudEval.passed) {
      this.dispatchEvent('RewardRejected', {
        submissionId: submission.submissionId,
        userId: submission.userId || 'USER-CURRENT',
        reason: fraudEval.alerts.join(' | '),
        timestamp: timestampStr
      });
      return result;
    }

    // Only Approved passes eligibility
    if (submission.validationStatus !== ValidationStatus.PASSED) {
      result.fraudAlerts.push('Only approved and validated submissions are eligible for reward disbursal.');
      this.dispatchEvent('RewardRejected', {
        submissionId: submission.submissionId,
        userId: submission.userId || 'USER-CURRENT',
        reason: 'Submission is not in approved validation state.',
        timestamp: timestampStr
      });
      return result;
    }

    result.isEligible = true;

    // 2. Multipliers Evaluation
    const multResults = this.multiplierEngine.calculateMultipliers({
      difficulty: result.baseRewardDetails.taskDifficulty,
      trustScore: 85,
      qualityScore: result.baseRewardDetails.qualityScore,
      isWeekend: options?.isWeekend,
      isFestival: options?.isFestival,
      isPeakHour: options?.isPeakHour,
      isFirstTask: options?.isFirstTask,
      streakDays: options?.streakDays
    });

    result.multipliersApplied = multResults.multipliersApplied;

    // 3. Rule matching
    const evaluationContext: RuleEvaluationContext = {
      submission,
      difficulty: result.baseRewardDetails.taskDifficulty,
      qualityScore: result.baseRewardDetails.qualityScore,
      confidenceScore: 90,
      trustScore: 85,
      isDuplicate: fraudContext.isDuplicate,
      isSpam: fraudContext.isSpam,
      velocityAttackDetected: fraudContext.isVelocityAttack
    };

    const rules = this.rulesEngine.getRules();
    const activeRule = rules.find(r => r.status === 'Active' && this.rulesEngine.evaluateCondition(r.conditionFormula, evaluationContext));
    if (activeRule) {
      result.ruleVersionMatched = activeRule.version;
      this.dispatchEvent('RewardRuleMatched', {
        ruleId: activeRule.id,
        ruleName: activeRule.name,
        version: activeRule.version,
        timestamp: timestampStr
      });
    }

    // Calculate final coins sum (Base * cumulative multipliers)
    const baseVal = result.baseRewardDetails.baseRewardCoins;
    const finalCalcCoins = Math.round(baseVal * multResults.cumulativeMultiplier);
    result.finalCoins = finalCalcCoins;

    // XP calculation - standard ratio of final coins (e.g. 10x multiplier)
    const rawXp = finalCalcCoins * 8;
    result.xpAwarded = rawXp;

    this.dispatchEvent('RewardCalculated', {
      submissionId: submission.submissionId,
      userId: submission.userId || 'USER-CURRENT',
      calculatedCoins: finalCalcCoins,
      xpAwarded: rawXp,
      ruleVersionMatched: result.ruleVersionMatched,
      timestamp: timestampStr
    });

    // 4. Update Ledger
    const ledgerPayload = {
      userId: submission.userId || 'USER-CURRENT',
      amount: finalCalcCoins,
      reason: `Task validation passed for submission ${submission.submissionId.slice(0, 8)}.`,
      type: RewardTransactionType.CREDIT,
      taskId: submission.taskId,
      submissionId: submission.submissionId,
      validationId: `VAL-${submission.submissionId.slice(-4).toUpperCase()}`,
      ruleVersion: result.ruleVersionMatched
    };

    const mappedPayload = RewardMapper.mapResultToLedgerEntry(ledgerPayload);
    const newLedgerEntry = this.ledger.addEntry(mappedPayload);
    await GlobalRewardRepository.saveTransaction(newLedgerEntry);

    this.dispatchEvent('RewardGranted', {
      transactionId: newLedgerEntry.id,
      userId: ledgerPayload.userId,
      coinsGranted: finalCalcCoins,
      timestamp: timestampStr
    });

    // 5. XP Awarding
    const xpOutcome = this.xpEngine.awardXp(rawXp);
    this.dispatchEvent('XPAwarded', {
      userId: ledgerPayload.userId,
      xpAwarded: rawXp,
      newTotalXp: xpOutcome.newTotalXp,
      levelUpTriggered: xpOutcome.levelUpTriggered,
      timestamp: timestampStr
    });

    if (xpOutcome.levelUpTriggered) {
      this.dispatchEvent('BonusGranted', {
        userId: ledgerPayload.userId,
        bonusType: 'LevelUp',
        coinsAwarded: xpOutcome.newLevel * 15,
        timestamp: timestampStr
      });
      // award bonus coins in ledger
      const levelUpBonusEntry = this.ledger.addEntry(RewardMapper.mapResultToLedgerEntry({
        userId: ledgerPayload.userId,
        amount: xpOutcome.newLevel * 15,
        reason: `Level Up Milestone! Promoted to Level ${xpOutcome.newLevel}.`,
        type: RewardTransactionType.BONUS
      }));
      await GlobalRewardRepository.saveTransaction(levelUpBonusEntry);
    }

    // 6. Achievements evaluation
    const unlocked = this.xpEngine.evaluateAchievementsTrigger({
      totalApprovedCount: this.ledger.getTransactions().filter(t => t.type === RewardTransactionType.CREDIT).length,
      lastQualityScore: result.baseRewardDetails.qualityScore,
      reputationIndex: 85
    });

    unlocked.forEach(ach => {
      this.dispatchEvent('AchievementUnlocked', {
        userId: ledgerPayload.userId,
        achievementId: ach.id,
        achievementName: ach.name,
        timestamp: timestampStr
      });
    });

    this.dispatchEvent('RewardCompleted', {
      submissionId: submission.submissionId,
      finalCoins: finalCalcCoins,
      xpAwarded: rawXp,
      timestamp: timestampStr
    });

    return result;
  }
}

export const GlobalRewardService = new RewardService();
