/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoinLedgerEntry, RewardTransactionType } from '../../types/rewards';

export class CoinLedger {
  private transactions: CoinLedgerEntry[] = [];

  constructor() {
    this.loadDefaultLedger();
  }

  /**
   * Load mock historical ledger logs for user display.
   */
  private loadDefaultLedger() {
    this.transactions = [
      {
        id: 'TX-COIN-001',
        userId: 'USER-CURRENT',
        timestamp: '2026-07-14T10:12:45.000Z',
        type: RewardTransactionType.BONUS,
        amount: 50,
        reason: 'Onboarding calibration sequence completed.',
        referenceId: 'REF-ONB-77',
        cryptographicSignature: '0x7f3a8b29c1de',
      },
      {
        id: 'TX-COIN-002',
        userId: 'USER-CURRENT',
        timestamp: '2026-07-15T14:20:11.000Z',
        type: RewardTransactionType.CREDIT,
        amount: 18,
        reason: 'Passed RLHF Alignment Assessment task.',
        taskId: 'TASK-901',
        submissionId: 'SUB-A882',
        validationId: 'VAL-7721',
        ruleVersion: '1.2.0',
        referenceId: 'REF-SUB-A882',
        cryptographicSignature: '0xa4b3c2d1e0f9',
      },
      {
        id: 'TX-COIN-003',
        userId: 'USER-CURRENT',
        timestamp: '2026-07-16T18:05:32.000Z',
        type: RewardTransactionType.CREDIT,
        amount: 25,
        reason: 'Passed Semantic Tagging Batch verification.',
        taskId: 'TASK-004',
        submissionId: 'SUB-X101',
        validationId: 'VAL-0045',
        ruleVersion: '1.2.0',
        referenceId: 'REF-SUB-X101',
        cryptographicSignature: '0x9922cc88dd33',
      },
      {
        id: 'TX-COIN-004',
        userId: 'USER-CURRENT',
        timestamp: '2026-07-17T09:00:00.000Z',
        type: RewardTransactionType.DEBIT,
        amount: -100,
        reason: 'UPI holdings instant clearance payout.',
        referenceId: 'REF-PAY-01',
        cryptographicSignature: '0xffee11223344',
      }
    ];
  }

  /**
   * Retrieves all ledger entries.
   */
  public getTransactions(): CoinLedgerEntry[] {
    return [...this.transactions];
  }

  /**
   * Appends an immutable record, calculating a simulated digital hash signature.
   */
  public addEntry(entry: Omit<CoinLedgerEntry, 'cryptographicSignature'>): CoinLedgerEntry {
    const signatureMaterial = `${entry.id}-${entry.userId}-${entry.amount}-${entry.type}-${entry.timestamp}`;
    const cryptographicSignature = this.generateHash(signatureMaterial);

    const completeEntry: CoinLedgerEntry = {
      ...entry,
      cryptographicSignature
    };

    this.transactions.unshift(completeEntry); // newest first
    return completeEntry;
  }

  /**
   * Utility to simulate digital hash signing for security auditing.
   */
  public generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return '0x' + Math.abs(hash).toString(16);
  }

  /**
   * Verifies the cryptographic integrity of the entire ledger.
   * If a record's data is edited without regenerating its hash, it's flagged.
   */
  public verifyLedgerIntegrity(): {
    isValid: boolean;
    tamperedCount: number;
    tamperedIds: string[];
  } {
    const tamperedIds: string[] = [];

    for (const tx of this.transactions) {
      if (tx.isTampered) {
        tamperedIds.push(tx.id);
        continue;
      }
      
      const signatureMaterial = `${tx.id}-${tx.userId}-${tx.amount}-${tx.type}-${tx.timestamp}`;
      const recomputed = this.generateHash(signatureMaterial);
      if (recomputed !== tx.cryptographicSignature) {
        tamperedIds.push(tx.id);
      }
    }

    return {
      isValid: tamperedIds.length === 0,
      tamperedCount: tamperedIds.length,
      tamperedIds
    };
  }

  /**
   * Simulates an attack/tampering attempt to demonstrate the security system works.
   */
  public tamperTransaction(id: string, newAmount: number): boolean {
    const tx = this.transactions.find(t => t.id === id);
    if (tx) {
      tx.amount = newAmount;
      tx.isTampered = true; // explicitly flag or let signature check fail
      return true;
    }
    return false;
  }
}
