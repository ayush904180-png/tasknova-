/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoinLedgerEntry, CalculatedRewardResult } from '../../types/rewards';

export class RewardMapper {
  /**
   * Transforms calculated result metrics into an immutable coin ledger entry structure.
   */
  public static mapResultToLedgerEntry(params: {
    userId: string;
    amount: number;
    reason: string;
    type: any;
    taskId?: string;
    submissionId?: string;
    validationId?: string;
    ruleVersion?: string;
  }): Omit<CoinLedgerEntry, 'cryptographicSignature'> {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16);
    const txId = `TX-REWARD-${Date.now().toString().slice(-6)}-${randomHex.toUpperCase()}`;

    return {
      id: txId,
      userId: params.userId,
      timestamp: new Date().toISOString(),
      type: params.type,
      amount: params.amount,
      reason: params.reason,
      referenceId: `REF-${txId}`,
      taskId: params.taskId,
      submissionId: params.submissionId,
      validationId: params.validationId,
      ruleVersion: params.ruleVersion || '1.0.0'
    };
  }

  /**
   * Map database representation down to UI dashboard models.
   */
  public static mapTransactionsToTimeline(entries: CoinLedgerEntry[]) {
    return entries.map(entry => ({
      id: entry.id,
      amount: entry.amount,
      type: entry.type,
      reason: entry.reason,
      timestamp: new Date(entry.timestamp).toLocaleString(),
      taskId: entry.taskId || 'SYSTEM-WIDE',
      ruleVersion: entry.ruleVersion || 'N/A',
      signature: entry.cryptographicSignature
    }));
  }
}
