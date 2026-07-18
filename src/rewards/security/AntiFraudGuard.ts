/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission, ValidationStatus, SubmissionStatus } from '../../types/submission';

export interface AntiFraudContext {
  isDuplicate: boolean;
  isSpam: boolean;
  riskScore: number; // 0 to 100, e.g. > 80 is high risk
  isPayloadTampered: boolean;
  isVelocityAttack: boolean;
  isSuspiciousDevice: boolean;
  futureFraudDetectionFlag?: boolean;
}

export class AntiFraudGuard {
  /**
   * Assess if a submission passes all anti-fraud checks to be eligible for reward payout.
   */
  public evaluateFraudRisk(submission: Submission, context: AntiFraudContext): {
    passed: boolean;
    alerts: string[];
  } {
    const alerts: string[] = [];

    // 1. Validation Status Check
    if (submission.validationStatus !== ValidationStatus.PASSED) {
      alerts.push(`Validation Status is not passed (${submission.validationStatus || 'None'}).`);
    }

    // 2. Submission Human Review or Pending status Check
    if (submission.submissionStatus === SubmissionStatus.HUMAN_REVIEW) {
      alerts.push('Submission status is currently HUMAN_REVIEW pending. Reward deferred.');
    }

    // 3. Spam Check
    if (context.isSpam) {
      alerts.push('AI Quality Engine flagged this submission as Spam.');
    }

    // 4. Duplicate Check
    if (context.isDuplicate) {
      alerts.push('Consensus matching identifies this as a duplicate submission node.');
    }

    // 5. High Risk Score Check
    if (context.riskScore > 75) {
      alerts.push(`Risk index too high (${context.riskScore}%). Threat threshold exceeded.`);
    }

    // 6. Payload Tampering Verification
    if (context.isPayloadTampered) {
      alerts.push('Cryptographic checksum validation failed - tampered payload detected.');
    }

    // 7. Velocity Attack (Rate limiting checks)
    if (context.isVelocityAttack) {
      alerts.push('Submission frequency anomaly triggered velocity attack detection.');
    }

    // 8. Suspicious Device Fingerprint
    if (context.isSuspiciousDevice) {
      alerts.push('Device fingerprint associated with automated botnets / emulator arrays.');
    }

    // 9. Future Fraud Detection Flag
    if (context.futureFraudDetectionFlag) {
      alerts.push('Future proof security flag detected. Account validation required.');
    }

    return {
      passed: alerts.length === 0,
      alerts
    };
  }
}
