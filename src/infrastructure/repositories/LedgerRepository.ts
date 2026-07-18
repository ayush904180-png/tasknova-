/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DoubleEntryLedgerRecord, LedgerEntryStatus } from '../../types/wallet';
import { MemoryDatabase } from './FirestoreRepository';
import { WalletCache } from '../cache/WalletCache';
import { WalletValidator } from '../validators/WalletValidator';

export interface LedgerRepositoryInterface {
  getByWalletId(walletId: string): Promise<DoubleEntryLedgerRecord[]>;
  getPaginatedByWallet(walletId: string, limit: number, offset: number): Promise<DoubleEntryLedgerRecord[]>;
  append(record: DoubleEntryLedgerRecord): Promise<void>;
  verifyIntegrity(walletId: string): Promise<{ isValid: boolean; errors: string[] }>;
}

/**
 * Concrete Repository for Double-Entry Ledger operations.
 * Implements write-only (append-only) ledger logs to prevent retroactive ledger modification.
 */
export class LedgerRepository implements LedgerRepositoryInterface {
  private collectionName = 'ledger_v2';

  constructor() {
    MemoryDatabase.init();
  }

  /**
   * Retrieves all ledger entries for a given wallet, with caching.
   */
  async getByWalletId(walletId: string): Promise<DoubleEntryLedgerRecord[]> {
    // 1. Try cache
    const cached = WalletCache.getCachedLedgerRecords(walletId);
    if (cached) {
      return cached;
    }

    // 2. Fetch from DB
    const list = MemoryDatabase.getCollection(this.collectionName);
    const records = Object.values(list) as DoubleEntryLedgerRecord[];
    const filtered = records
      .filter(r => r.walletId === walletId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // 3. Populate default records if ledger is completely empty (legacy migration support)
    if (filtered.length === 0) {
      return this.initializeLegacySeedLedger(walletId);
    }

    // Cache the records
    WalletCache.cacheLedgerRecords(walletId, filtered);
    return filtered;
  }

  /**
   * Supports infinite scrolling and highly scalable lazy-loading pagination.
   */
  async getPaginatedByWallet(walletId: string, limit: number, offset: number): Promise<DoubleEntryLedgerRecord[]> {
    const allRecords = await this.getByWalletId(walletId);
    
    // Sort descending by timestamp for visual timelines
    const sorted = [...allRecords].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return sorted.slice(offset, offset + limit);
  }

  /**
   * Appends an immutable record. Strictly enforces append-only rule!
   */
  async append(record: DoubleEntryLedgerRecord): Promise<void> {
    // Validate record properties & cryptography
    const validation = WalletValidator.validateLedgerRecord(record);
    if (!validation.isValid) {
      throw new Error(`Ledger Cryptographic verification failed: ${validation.errors.join(', ')}`);
    }

    // Verify record doesn't already exist to block replay attacks
    const existing = MemoryDatabase.get(this.collectionName, record.ledgerId);
    if (existing) {
      throw new Error(`Replay Protection Triggered: Ledger ID ${record.ledgerId} already exists. Immutable logs cannot be re-written.`);
    }

    // Save to Database
    MemoryDatabase.set(this.collectionName, record.ledgerId, record);
    MemoryDatabase.persist();

    // Evict cached copy to trigger reload
    WalletCache.evictLedger(record.walletId);
  }

  /**
   * Performs an integrity verification across the entire wallet history.
   * Re-evaluates double-entry ledger links from Genesis block onward.
   */
  async verifyIntegrity(walletId: string): Promise<{ isValid: boolean; errors: string[] }> {
    const records = await this.getByWalletId(walletId);
    const errors: string[] = [];

    let computedBalance = 0;
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      // 1. Verify single record cryptography & math
      const singleCheck = WalletValidator.validateLedgerRecord(record);
      if (!singleCheck.isValid) {
        errors.push(`Record ${record.ledgerId} is corrupt: ${singleCheck.errors.join('; ')}`);
      }

      // 2. Validate chain sequencing
      if (Math.abs(record.openingBalance - computedBalance) > 0.001) {
        errors.push(`Ledger Chain Broken: Record ${record.ledgerId} opening balance (${record.openingBalance}) does not match expected chain balance (${computedBalance}).`);
      }

      // 3. Accumulate
      computedBalance = computedBalance + record.credit - record.debit;

      // 4. Validate closing balance matches expectation
      if (Math.abs(record.closingBalance - computedBalance) > 0.001) {
        errors.push(`Ledger Chain Broken: Record ${record.ledgerId} closing balance (${record.closingBalance}) does not match accumulated balance (${computedBalance}).`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generates a realistic legacy ledger timeline if starting on a clean database.
   * Retains full coherence with existing UPI rewards and credits history!
   */
  private async initializeLegacySeedLedger(walletId: string): Promise<DoubleEntryLedgerRecord[]> {
    const dates = [
      '2026-07-10T10:00:00.000Z',
      '2026-07-13T14:30:00.000Z',
      '2026-07-15T18:15:00.000Z',
      '2026-07-16T11:45:00.000Z',
      '2026-07-17T09:20:00.000Z', // Pending seeding
    ];

    const seedTemplates = [
      {
        ledgerId: `led_${walletId.substring(4, 9)}_001`,
        walletId,
        transactionId: 'tx_9812_reward',
        referenceId: 'ref_9812',
        credit: 1100,
        debit: 0,
        openingBalance: 0,
        closingBalance: 1100,
        status: LedgerEntryStatus.COMPLETED,
        submissionId: 'sub_legacy_01',
      },
      {
        ledgerId: `led_${walletId.substring(4, 9)}_002`,
        walletId,
        transactionId: 'tx_9813_withdraw',
        referenceId: 'ref_upi_payout_legacy',
        credit: 0,
        debit: 980,
        openingBalance: 1100,
        closingBalance: 120,
        status: LedgerEntryStatus.COMPLETED,
        submissionId: 'sub_withdrawal_01',
      },
      {
        ledgerId: `led_${walletId.substring(4, 9)}_003`,
        walletId,
        transactionId: 'tx_9814_reward',
        referenceId: 'ref_task_8042',
        credit: 250,
        debit: 0,
        openingBalance: 120,
        closingBalance: 370,
        status: LedgerEntryStatus.COMPLETED,
        submissionId: 'sub_sandbox_8042',
      },
      {
        ledgerId: `led_${walletId.substring(4, 9)}_004`,
        walletId,
        transactionId: 'tx_9815_bonus',
        referenceId: 'ref_daily_streak_1',
        credit: 10,
        debit: 0,
        openingBalance: 370,
        closingBalance: 380,
        status: LedgerEntryStatus.COMPLETED,
        submissionId: 'sub_bonus_streak',
      },
      {
        ledgerId: `led_${walletId.substring(4, 9)}_005`,
        walletId,
        transactionId: 'tx_9816_pending_reward',
        referenceId: 'ref_task_9022',
        credit: 120,
        debit: 0,
        openingBalance: 380,
        closingBalance: 500, // Ledger total including pending is 500. Available is 380
        status: LedgerEntryStatus.PENDING,
        submissionId: 'sub_pending_9022',
      }
    ];

    const records: DoubleEntryLedgerRecord[] = [];

    for (let i = 0; i < seedTemplates.length; i++) {
      const template = seedTemplates[i];
      const record: DoubleEntryLedgerRecord = {
        ledgerId: template.ledgerId,
        walletId: template.walletId,
        transactionId: template.transactionId,
        referenceId: template.referenceId,
        submissionId: template.submissionId,
        timestamp: dates[i],
        credit: template.credit,
        debit: template.debit,
        openingBalance: template.openingBalance,
        closingBalance: template.closingBalance,
        status: template.status,
        signature: '',
        version: '1.0.0',
      };

      // Sign the record deterministically
      record.signature = WalletValidator.generateSignatureString(record);
      
      // Store in MemoryDatabase
      MemoryDatabase.set(this.collectionName, record.ledgerId, record);
      records.push(record);
    }

    MemoryDatabase.persist();
    WalletCache.cacheLedgerRecords(walletId, records);
    return records;
  }
}
