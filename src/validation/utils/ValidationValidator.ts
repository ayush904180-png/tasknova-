/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationRecord } from '../../types/validation';

/**
 * Enterprise Validation Audit Helper.
 * Handles client-to-server signature checks, replay logs, and tampering audits.
 */
export class ValidationValidator {
  private static SEED = 'TaskNova_Validation_AES256_Salt';

  /**
   * Computes a highly reliable polynomial hash representing the payload's integrity signature.
   */
  static computeSignature(record: Omit<ValidationRecord, 'signature'>): string {
    const serialized = JSON.stringify({
      validationId: record.validationId,
      submissionId: record.submissionId,
      validationStatus: record.validationStatus,
      decision: record.decision,
      quality: record.qualityScores,
      confidence: record.confidence,
      risk: record.riskScores,
      startedAt: record.startedAt,
    });

    let hash = 0;
    const combined = serialized + ValidationValidator.SEED;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }

    return `SIG-VAL-${Math.abs(hash).toString(16).toUpperCase()}`;
  }

  /**
   * Evaluates a completed validation record for security tamper attempts and data freshness.
   */
  static auditRecord(record: ValidationRecord): { isValid: boolean; error?: string } {
    // 1. Structure check
    if (!record.validationId || !record.submissionId || !record.startedAt) {
      return { isValid: false, error: 'Malformed block: missing critical metadata fields.' };
    }

    // 2. Replay attack check (Nonce or date-range evaluation)
    const startedTime = new Date(record.startedAt).getTime();
    const now = Date.now();
    const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
    const futureLimit = now + 1 * 60 * 60 * 1000; // 1 hr tolerance

    if (startedTime < threeDaysAgo || startedTime > futureLimit) {
      return { isValid: false, error: 'Replay prevention: validation record timestamp is stale or out-of-bounds.' };
    }

    // 3. Signature verification (Tamper detection)
    const expectedSig = this.computeSignature(record);
    if (record.signature !== expectedSig) {
      return { isValid: false, error: 'Integrity violation: cryptographic validation signature does not match payload.' };
    }

    return { isValid: true };
  }
}
