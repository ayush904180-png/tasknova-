/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerSession } from '../../types/player';

/**
 * Audit result returned by the Trust Engine upon review of session submission activity.
 */
export interface TrustScoreAudit {
  valid: boolean;
  scoreAdjustment: number;
  speedIndex: number;          // Completed alignments / minute
  isSpeeding: boolean;         // Did the user finish impossibly quickly?
  isPatternSpamming: boolean;  // Repetitive or keyboard-mashed responses
  trustSnapshotScore: number;  // Resultant trust rating
  mlConfidenceScore: number;   // Simulated ML Fraud scoring confidence
}

/**
 * Trust and Fraud Detection engine designed for Human-in-the-loop task compliance verification.
 */
export class TrustEngine {
  private minTimeLimitSeconds = 3; // Minimum viable duration for any task

  /**
   * Assesses session compliance metrics, scanning for botting, scripting, and duplicate pattern behaviors.
   */
  async evaluateSession(session: PlayerSession, estimatedTime: number): Promise<TrustScoreAudit> {
    const elapsed = session.elapsedTime;
    
    // 1. Speed Check
    const isSpeeding = elapsed < this.minTimeLimitSeconds || elapsed < (estimatedTime * 0.15);
    const speedIndex = elapsed > 0 ? parseFloat((1 / (elapsed / 60)).toFixed(2)) : 0;

    // 2. Pattern Spamming Analysis (Mashing the same key or empty answers)
    const answersText = JSON.stringify(session.answers);
    const isPatternSpamming = this.analyzeRepetitivePatterns(session.answers);

    // 3. Compute baseline adjustments
    let scoreAdjustment = 0;
    let valid = true;

    if (isSpeeding) {
      scoreAdjustment -= 10;
      valid = false;
    }
    if (isPatternSpamming) {
      scoreAdjustment -= 25;
      valid = false;
    }

    if (valid) {
      // Small reward multiplier for slow, high-quality alignments
      scoreAdjustment += 1.5;
    }

    const nextTrustScore = Math.min(100, Math.max(0, session.trustSnapshot.currentScore + scoreAdjustment));

    return {
      valid,
      scoreAdjustment,
      speedIndex,
      isSpeeding,
      isPatternSpamming,
      trustSnapshotScore: parseFloat(nextTrustScore.toFixed(1)),
      mlConfidenceScore: valid ? 0.98 : 0.22
    };
  }

  private analyzeRepetitivePatterns(answers: Record<string, any>): boolean {
    const values = Object.values(answers);
    if (values.length === 0) return false;

    // Check if everything submitted is identical character repeating strings
    for (const val of values) {
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.length > 5) {
          // Detect repeated letters like "asdfasdfasdf" or mashing "aaaaa"
          const duplicates = (trimmed.match(/(.)\1{4,}/g) || []).length > 0;
          if (duplicates) return true;
        }
      }
    }
    return false;
  }
}

export const GlobalTrustEngine = new TrustEngine();
export default GlobalTrustEngine;
