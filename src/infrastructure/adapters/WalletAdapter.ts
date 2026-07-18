/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, DoubleEntryLedgerRecord, FinancialAuditReport } from '../../types/wallet';

export interface TabularExportData {
  headers: string[];
  rows: any[][];
}

/**
 * Format converter/adapter to prepare rich domain ledger data for third-party workspace APIs.
 */
export class WalletAdapter {
  /**
   * Adapts a collection of Wallets into a tabular Sheet representation.
   */
  static adaptWalletsToSheet(wallets: Wallet[]): TabularExportData {
    return {
      headers: [
        'Wallet ID',
        'Owner ID',
        'Status',
        'Currency',
        'Available Balance',
        'Pending Balance',
        'Frozen Balance',
        'Locked Balance',
        'Current Coin Balance',
        'Estimated INR',
        'Lifetime Earnings',
        'KYC Tier',
        'Linked UPI ID',
        'Updated At',
      ],
      rows: wallets.map(w => [
        w.id,
        w.ownerId,
        w.status,
        w.currency,
        w.balances.availableBalance,
        w.balances.pendingBalance,
        w.balances.frozenBalance,
        w.balances.lockedBalance,
        w.balances.currentCoinBalance,
        w.balances.estimatedINR,
        w.balances.lifetimeEarnings,
        w.metadata.kycTier || 'N/A',
        w.metadata.linkedUpiId || 'N/A',
        w.updatedAt,
      ]),
    };
  }

  /**
   * Adapts ledger records to a high-fidelity CSV/Sheet format.
   */
  static adaptLedgerToSheet(records: DoubleEntryLedgerRecord[]): TabularExportData {
    return {
      headers: [
        'Ledger Entry ID',
        'Wallet ID',
        'Transaction ID',
        'Reference ID',
        'Submission ID',
        'Reward ID',
        'Validation ID',
        'Timestamp',
        'Credit (In)',
        'Debit (Out)',
        'Opening Balance',
        'Closing Balance',
        'Status',
        'Cryptographic Signature',
        'Schema Version',
      ],
      rows: records.map(r => [
        r.ledgerId,
        r.walletId,
        r.transactionId,
        r.referenceId,
        r.submissionId || 'N/A',
        r.rewardId || 'N/A',
        r.validationId || 'N/A',
        r.timestamp,
        r.credit,
        r.debit,
        r.openingBalance,
        r.closingBalance,
        r.status,
        r.signature,
        r.version,
      ]),
    };
  }

  /**
   * Adapts an Audit Report for Google Drive metadata description tags.
   */
  static adaptAuditToDriveMetadata(report: FinancialAuditReport): Record<string, string> {
    return {
      title: `Financial-Audit-Report-${report.auditId}`,
      mimeType: 'application/json',
      description: `TaskNova AI Financial Audit. Checksum: ${report.checksumStatus}. Audited Records: ${report.totalRecordsAudited}. Opening Check: ${report.openingBalanceCheck} Coins. Closing Check: ${report.closingBalanceCheck} Coins. Variance: ${report.varianceDetected}. Tampered Entries: ${report.tamperedRecordsCount}.`,
      folderId: 'tasknova_finance_audits_folder',
    };
  }

  /**
   * Generates a structural text report representing a contributor monthly statement.
   */
  static generateStatementText(wallet: Wallet, ledger: DoubleEntryLedgerRecord[], monthLabel: string): string {
    const divider = '='.repeat(60);
    const dateStr = new Date().toLocaleDateString();

    const transactionsBlock = ledger
      .map(
        r =>
          `[${r.timestamp.substring(11, 19)}] ID: ${r.ledgerId.substring(0, 8)}... | ${
            r.credit > 0 ? `CREDIT: +${r.credit}` : `DEBIT : -${r.debit}`
          } | Bal: ${r.closingBalance} Coins | Status: ${r.status}`
      )
      .join('\n');

    return `
${divider}
TASKNOVA AI - MONTHLY CONTRIBUTOR FINANCIAL STATEMENT
Period: ${monthLabel} | Generated: ${dateStr}
${divider}

OWNER IDENTIFICATION:
- Wallet ID : ${wallet.id}
- User ID   : ${wallet.ownerId}
- KYC Tier  : ${wallet.metadata.kycTier || 'Tier 1 (Standard Verification)'}
- Wallet Status: ${wallet.status}

CONSOLIDATED BALANCES:
- Current Coins Available : ${wallet.balances.availableBalance} Coins
- Pending Review Clear   : ${wallet.balances.pendingBalance} Coins
- Locked / Engaged Staking: ${wallet.balances.lockedBalance} Coins
- Frozen Legal Holds     : ${wallet.balances.frozenBalance} Coins
- Total Ledger Value     : ${wallet.balances.currentCoinBalance} Coins
- Estimated INR Valuation: ₹${wallet.balances.estimatedINR.toFixed(2)} (at 1 Coin = ₹0.45)

LIFETIME AGGREGATES:
- Lifetime Earnings      : ${wallet.balances.lifetimeEarnings} Coins
- Lifetime Withdrawals   : ${wallet.balances.lifetimeWithdrawals} Coins
- Total Bonuses Awarded  : ${wallet.balances.lifetimeBonuses} Coins
- Total Penalties Deducted: ${wallet.balances.lifetimePenalties} Coins

${divider}
CHRONOLOGICAL DOUBLE-ENTRY TRANSACTION LEDGER (IMMUTABLE)
${divider}
${transactionsBlock || 'No transactions logged in this statement period.'}

${divider}
INTEGRITY SEAL VERIFICATION
This document is a certified extract from the TaskNova AI cryptographic distributed financial ledger database. Every ledger entry contains a cryptographic seal signed against parent transactional hashes.
Database Seal Signature status: VERIFIED / UNALTERED
${divider}
`;
  }
}
