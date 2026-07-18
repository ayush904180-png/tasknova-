/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RewardRule } from '../../types/rewards';
import { Submission, ValidationStatus } from '../../types/submission';
import { TaskDifficulty } from '../../types/index';

/**
 * Context payload passed to the Reward Rules Engine for evaluation.
 */
export interface RuleEvaluationContext {
  submission: Submission;
  difficulty: TaskDifficulty;
  qualityScore: number;
  confidenceScore: number;
  trustScore: number;
  isDuplicate: boolean;
  isSpam: boolean;
  velocityAttackDetected: boolean;
}

export class RewardRulesEngine {
  private rules: RewardRule[] = [];

  constructor() {
    this.loadDefaultRules();
  }

  /**
   * Seed dynamic reward rules that simulate a business dashboard configuration.
   */
  private loadDefaultRules() {
    this.rules = [
      {
        id: 'RULE-001',
        name: 'Standard Approved Reward Rule',
        version: '1.2.0',
        priority: 10,
        status: 'Active',
        effectiveDate: '2026-01-01',
        conditionFormula: 'submission.validationStatus === "Passed" && !isDuplicate && !isSpam',
        actionFormula: 'baseRewardCoins * multipliers',
        elseFormula: '0'
      },
      {
        id: 'RULE-002',
        name: 'High Trust Contributor Modifier',
        version: '1.0.1',
        priority: 20,
        status: 'Active',
        effectiveDate: '2026-01-10',
        conditionFormula: 'trustScore >= 85',
        actionFormula: 'finalCoins * 1.2',
        elseFormula: 'finalCoins'
      },
      {
        id: 'RULE-003',
        name: 'Quality Excellence Incentive',
        version: '1.1.0',
        priority: 30,
        status: 'Active',
        effectiveDate: '2026-02-15',
        conditionFormula: 'qualityScore >= 90',
        actionFormula: 'finalCoins + 10',
        elseFormula: 'finalCoins'
      },
      {
        id: 'RULE-004',
        name: 'Draft Experimental Double Weekend',
        version: '2.0.0-draft',
        priority: 5,
        status: 'Draft',
        effectiveDate: '2026-08-01',
        conditionFormula: 'isWeekend()',
        actionFormula: 'finalCoins * 2.0'
      }
    ];
  }

  /**
   * Retrieves all registered rules.
   */
  public getRules(): RewardRule[] {
    return [...this.rules];
  }

  /**
   * Saves or updates a reward rule, showing how future business users can edit rules.
   */
  public saveRule(rule: RewardRule): void {
    const index = this.rules.findIndex(r => r.id === rule.id);
    if (index >= 0) {
      this.rules[index] = rule;
    } else {
      this.rules.push(rule);
    }
  }

  /**
   * Deletes a reward rule.
   */
  public deleteRule(id: string): void {
    this.rules = this.rules.filter(r => r.id !== id);
  }

  /**
   * Simple safe condition evaluator simulating dynamic logic parsing.
   * Business created rules are parsed here dynamically.
   */
  public evaluateCondition(condition: string, context: RuleEvaluationContext): boolean {
    const { submission, qualityScore, trustScore, isDuplicate, isSpam } = context;

    try {
      // Safely simulate formula parser for UI demo
      if (condition.includes('submission.validationStatus === "Passed"')) {
        const passCheck = submission.validationStatus === ValidationStatus.PASSED;
        return passCheck && !isDuplicate && !isSpam;
      }
      if (condition.includes('trustScore >= 85')) {
        return trustScore >= 85;
      }
      if (condition.includes('qualityScore >= 90')) {
        return qualityScore >= 90;
      }
      if (condition.includes('isWeekend()')) {
        const today = new Date().getDay();
        return today === 0 || today === 6; // Sun or Sat
      }
      
      // Secondary fallback safe sandbox simulation
      return submission.validationStatus === ValidationStatus.PASSED;
    } catch (e) {
      console.error('Error evaluating rule condition formula', e);
      return false;
    }
  }
}
