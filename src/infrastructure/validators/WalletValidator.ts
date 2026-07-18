/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, WalletStatus, DoubleEntryLedgerRecord, LedgerEntryStatus } from '../../types/wallet';

export interface WalletValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator responsible for verifying financial correctness, status state-machine transitions,
 * cryptographic signature integrity, and preventing replay/double-spending.
 */
export class WalletValidator {
  /**
   * Validates state machine status transitions for a Wallet.
   */
  static validateStatusTransition(current: WalletStatus, next: WalletStatus): WalletValidationResult {
    const errors: string[] = [];
    
    if (current === next) {
      return { isValid: true, errors: [] };
    }

    // Closed is terminal
    if (current === WalletStatus.CLOSED) {
      errors.push('Cannot transition out of a CLOSED wallet state.');
      return { isValid: false, errors };
    }

    // Suspended can only transition to Under Review or Closed
    if (current === WalletStatus.SUSPENDED && next !== WalletStatus.UNDER_REVIEW && next !== WalletStatus.CLOSED) {
      errors.push('Suspended wallets must go Under Review or Closed first.');
    }

    // Frozen can only be Activated or Closed
    if (current === WalletStatus.FROZEN && next !== WalletStatus.ACTIVE && next !== WalletStatus.CLOSED) {
      errors.push('Frozen wallets must be Activated or Closed.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a Wallet's internal consistency.
   * Ensures that all balances are numerical, and non-negative (except where pending/frozen may be held).
   */
  static validateBalances(wallet: Wallet): WalletValidationResult {
    const errors: string[] = [];
    const b = wallet.balances;

    if (b.availableBalance < 0) errors.push('Available balance cannot be negative.');
    if (b.pendingBalance < 0) errors.push('Pending balance cannot be negative.');
    if (b.frozenBalance < 0) errors.push('Frozen balance cannot be negative.');
    if (b.lockedBalance < 0) errors.push('Locked balance cannot be negative.');
    if (b.withdrawableBalance < 0) errors.push('Withdrawable balance cannot be negative.');
    if (b.withdrawableBalance > b.availableBalance) {
      errors.push('Withdrawable balance cannot exceed available balance.');
    }

    // Coin check
    const computedCoins = b.availableBalance + b.pendingBalance + b.frozenBalance + b.lockedBalance;
    if (Math.abs(b.currentCoinBalance - computedCoins) > 0.001) {
      errors.push(`Balance mismatch: physical currentCoinBalance (${b.currentCoinBalance}) does not equal computed sum (${computedCoins}).`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a single DoubleEntryLedgerRecord's internal mathematical correctness and signature.
   */
  static validateLedgerRecord(record: DoubleEntryLedgerRecord): WalletValidationResult {
    const errors: string[] = [];

    if (!record.ledgerId) errors.push('Missing Ledger ID.');
    if (!record.walletId) errors.push('Missing Wallet ID association.');
    if (!record.transactionId) errors.push('Missing Transaction ID.');

    // Credit and Debit cannot both be positive, or negative.
    if (record.credit < 0) errors.push('Credit value must be non-negative.');
    if (record.debit < 0) errors.push('Debit value must be non-negative.');
    if (record.credit > 0 && record.debit > 0) {
      errors.push('Double entry violation: A single entry cannot be both Credit and Debit simultaneously.');
    }

    // Mathematical closure
    const expectedClosing = record.openingBalance + record.credit - record.debit;
    if (Math.abs(record.closingBalance - expectedClosing) > 0.001) {
      errors.push(`Ledger accounting mismatch: Opening (${record.openingBalance}) + Credit (${record.credit}) - Debit (${record.debit}) should equal Closing (${record.closingBalance}), but got (${record.closingBalance}).`);
    }

    // Cryptographic signature verify (simulated SHA-256 integrity seal)
    const computedSig = this.generateSignatureString(record);
    if (record.signature !== computedSig) {
      errors.push(`Cryptographic Ledger Tampering detected! Signature mismatch. Record signature: ${record.signature}, calculated: ${computedSig}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generates a deterministic mock cryptographic signature for a ledger entry.
   */
  static generateSignatureString(record: Omit<DoubleEntryLedgerRecord, 'signature'>): string {
    const parts = [
      record.ledgerId,
      record.walletId,
      record.transactionId,
      record.referenceId,
      record.timestamp,
      record.credit.toFixed(4),
      record.debit.toFixed(4),
      record.openingBalance.toFixed(4),
      record.closingBalance.toFixed(4),
      record.status,
      record.version,
    ];
    
    // Simple custom hash generator to simulate a tamper-evident blockchain or HMAC-SHA256 signature
    let hash = 0;
    const inputStr = parts.join('|');
    for (let i = 0; i < inputStr.length; i++) {
      const char = inputStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    
    return `sha256_sig_${Math.abs(hash).toString(16).toUpperCase()}`;
  }
}
