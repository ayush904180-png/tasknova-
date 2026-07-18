/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoinLedgerEntry, RewardRule } from '../../types/rewards';

export class RewardValidator {
  /**
   * Validate that a transaction payload is complete and non-zero before commitment.
   */
  public static validateLedgerEntry(entry: Partial<CoinLedgerEntry>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!entry.id || entry.id.trim() === '') {
      errors.push('Transaction ID is missing or empty.');
    }
    if (!entry.userId || entry.userId.trim() === '') {
      errors.push('User Reference ID is missing.');
    }
    if (entry.amount === undefined || isNaN(entry.amount)) {
      errors.push('Transaction amount must be a valid number.');
    }
    if (entry.amount === 0) {
      errors.push('Zero-value reward transactions are forbidden by the ledger policy.');
    }
    if (!entry.type) {
      errors.push('Transaction classification Type is missing.');
    }
    if (!entry.reason || entry.reason.trim() === '') {
      errors.push('Transaction narrative reason is required for accounting transparency.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates dynamic business created rules before storage write.
   */
  public static validateRule(rule: Partial<RewardRule>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!rule.id || rule.id.trim() === '') {
      errors.push('Rule Identifier cannot be empty.');
    }
    if (!rule.name || rule.name.trim() === '') {
      errors.push('Rule Name is required.');
    }
    if (!rule.version || rule.version.trim() === '') {
      errors.push('Rule Version must follow semantic formats (e.g. 1.0.0).');
    }
    if (!rule.conditionFormula || rule.conditionFormula.trim() === '') {
      errors.push('IF Condition evaluation formula is required.');
    }
    if (!rule.actionFormula || rule.actionFormula.trim() === '') {
      errors.push('THEN Action calculation formula is required.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
