/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission } from '../../types/submission';
import { RuleEvaluationContext } from '../rules/RewardRulesEngine';
import { TaskDifficulty } from '../../types/index';

export class RewardAdapter {
  /**
   * Adapts a task submission and its corresponding AI quality validation outcomes
   * into a unified evaluation context for the Rules & Multiplier Engines.
   */
  public static adaptToEvaluationContext(
    submission: Submission,
    additionalMetadata?: {
      isDuplicate?: boolean;
      isSpam?: boolean;
      velocityAttack?: boolean;
      suspiciousDevice?: boolean;
    }
  ): RuleEvaluationContext {
    // Derive parameters cleanly with fallback defaults
    const isDuplicate = additionalMetadata?.isDuplicate || false;
    const isSpam = additionalMetadata?.isSpam || false;
    const velocityAttackDetected = additionalMetadata?.velocityAttack || false;

    // Use task difficulty associated with submission or fallback to Medium
    const difficulty = (submission as any).taskDifficulty || TaskDifficulty.MEDIUM;
    const qualityScore = submission.qualityScorePlaceholder || 80;

    // Confidence and Trust scores adapted from quality scores or mock defaults
    const confidenceScore = 90;
    const trustScore = 85;

    return {
      submission,
      difficulty,
      qualityScore,
      confidenceScore,
      trustScore,
      isDuplicate,
      isSpam,
      velocityAttackDetected
    };
  }
}
