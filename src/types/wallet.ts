/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Supported wallet operational statuses.
 */
export enum WalletStatus {
  ACTIVE = 'Active',
  FROZEN = 'Frozen',
  SUSPENDED = 'Suspended',
  PENDING_VERIFICATION = 'Pending Verification',
  UNDER_REVIEW = 'Under Review',
  CLOSED = 'Closed'
}

/**
 * All transaction types supported by the Double-Entry Financial Ledger.
 */
export enum LedgerTransactionType {
  REWARD_CREDIT = 'Reward Credit',
  BONUS_CREDIT = 'Bonus Credit',
  REFERRAL_CREDIT = 'Referral Credit',
  CAMPAIGN_CREDIT = 'Campaign Credit',
  MANUAL_CREDIT = 'Manual Credit',
  PENALTY_DEBIT = 'Penalty Debit',
  ADJUSTMENT_DEBIT = 'Adjustment Debit',
  WITHDRAWAL_HOLD = 'Withdrawal Hold',
  WITHDRAWAL_COMPLETE = 'Withdrawal Complete',
  WITHDRAWAL_FAILED = 'Withdrawal Failed',
  REFUND = 'Refund',
  REVERSAL = 'Reversal',
  FUTURE_CASHBACK = 'Future Cashback'
}

/**
 * Statuses of individual ledger ledger transactions.
 */
export enum LedgerEntryStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  HELD = 'Held',
  REVERSED = 'Reversed'
}

/**
 * Core Balance Engine data structure.
 */
export interface WalletBalances {
  availableBalance: number; // Immediately withdrawable or usable (in Coins)
  pendingBalance: number;   // In validation queue, not yet cleared
  frozenBalance: number;    // Locked due to security hold/review
  lockedBalance: number;    // Staked or committed for active challenges
  withdrawableBalance: number; // Subset of available balance cleared for extraction
  lifetimeEarnings: number;
  lifetimeWithdrawals: number;
  lifetimeBonuses: number;
  lifetimePenalties: number;
  currentCoinBalance: number; // Overall physical coin ledger count
  estimatedINR: number;       // Equivalent in Indian Rupee
  estimatedUSD: number;       // Equivalent in USD
  estimatedEUR: number;       // Equivalent in EUR
}

/**
 * Metadata map for extensible wallet attributes and multi-wallet references.
 */
export interface WalletMetadata {
  displayName?: string;
  isDefault?: boolean;
  linkedUpiId?: string;
  linkedBankAccountMasked?: string;
  kycTier?: 'Tier 0' | 'Tier 1' | 'Tier 2';
  preferredCurrency?: 'INR' | 'USD' | 'EUR';
  deviceFingerprint?: string;
  ipAddressLastUsed?: string;
  freezeReason?: string;
  frozenAt?: string;
  futureWallets?: Array<{
    walletId: string;
    currency: string;
    type: 'fiat' | 'crypto' | 'token';
  }>;
}

/**
 * Financial Wallet representation.
 */
export interface Wallet {
  id: string;
  ownerId: string; // User ID reference
  status: WalletStatus;
  version: string; // Semantic version e.g., '1.0.0'
  currency: string; // Default visual currency code (INR, etc.)
  createdAt: string;
  updatedAt: string;
  balances: WalletBalances;
  metadata: WalletMetadata;
}

/**
 * Double-Entry Immutable Ledger record contract.
 * Records must NEVER be edited. Only appends are permitted.
 */
export interface DoubleEntryLedgerRecord {
  ledgerId: string;       // Unique ledger row UUID
  walletId: string;       // Source financial wallet
  transactionId: string;  // Unique core operation transaction reference
  referenceId: string;    // External reference (UPI tx, system adjustment)
  submissionId?: string;  // Associated task submission
  rewardId?: string;      // Related reward transaction item
  validationId?: string;  // Associated validation cycle reference
  timestamp: string;      // Event UTC timestamp
  credit: number;         // Amount added (+ values)
  debit: number;          // Amount subtracted (+ values represented as debit count)
  openingBalance: number; // Balance before operation
  closingBalance: number; // Balance after operation
  status: LedgerEntryStatus;
  signature: string;      // Anti-tamper blockchain signature seal
  version: string;        // Ledger record schema version
}

/**
 * Financial Audit summary models.
 */
export interface FinancialAuditReport {
  auditId: string;
  timestamp: string;
  walletId: string;
  totalRecordsAudited: number;
  checksumStatus: 'Passed' | 'Failed' | 'Mismatched_Balances';
  openingBalanceCheck: number;
  closingBalanceCheck: number;
  recomputedBalance: number;
  varianceDetected: number;
  tamperedRecordsCount: number;
  tamperedRecordIds: string[];
  auditLogs: string[];
}

/**
 * Financial Summary aggregates.
 */
export interface FinancialSummaryNode {
  periodId: string; // e.g., '2026-07', '2026-W29'
  creditsCount: number;
  debitsCount: number;
  totalCreditedCoins: number;
  totalDebitedCoins: number;
  netCoinsDelta: number;
  endingBalance: number;
  currencyEquivalentINR: number;
}

/**
 * Telemetry metrics for Wallet & Financial Ledger operations.
 */
export interface WalletTelemetryKPIs {
  averageWalletBalance: number;
  highestWalletBalance: number;
  dailyCredits: number;
  dailyDebits: number;
  ledgerGrowthRate: number; // delta percentage
  walletStatusDistribution: Record<WalletStatus, number>;
  averageTransactionSize: number;
  auditFailuresCount: number;
  securityIncidentsCount: number;
}
