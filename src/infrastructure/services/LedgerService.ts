/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DoubleEntryLedgerRecord, LedgerTransactionType, LedgerEntryStatus, FinancialSummaryNode } from '../../types/wallet';
import { LedgerRepository } from '../repositories/LedgerRepository';

/**
 * Service managing core cryptographic verification and transactional math for the Double-Entry system.
 */
export class LedgerService {
  private ledgerRepo: LedgerRepository;

  constructor() {
    this.ledgerRepo = new LedgerRepository();
  }

  /**
   * Retrieves all ledger entries for a wallet.
   */
  async getWalletLedger(walletId: string): Promise<DoubleEntryLedgerRecord[]> {
    return this.ledgerRepo.getByWalletId(walletId);
  }

  /**
   * Retrieves paginated ledger entries. Useful for infinite loading lists.
   */
  async getPaginatedLedger(walletId: string, limit: number, offset: number): Promise<DoubleEntryLedgerRecord[]> {
    return this.ledgerRepo.getPaginatedByWallet(walletId, limit, offset);
  }

  /**
   * Dispatches cryptographic integrity check and balance chain validation.
   */
  async runIntegrityVerification(walletId: string): Promise<{ isValid: boolean; errors: string[] }> {
    return this.ledgerRepo.verifyIntegrity(walletId);
  }

  /**
   * Aggregates financial entries into structured daily, monthly, or yearly nodes.
   */
  async generateFinancialSummaries(walletId: string): Promise<{
    daily: FinancialSummaryNode[];
    monthly: FinancialSummaryNode[];
  }> {
    const records = await this.ledgerRepo.getByWalletId(walletId);
    
    const dailyMap = new Map<string, DoubleEntryLedgerRecord[]>();
    const monthlyMap = new Map<string, DoubleEntryLedgerRecord[]>();

    records.forEach(r => {
      if (r.status !== LedgerEntryStatus.COMPLETED) return; // Only count cleared transactions
      
      const dateKey = r.timestamp.substring(0, 10); // 'YYYY-MM-DD'
      const monthKey = r.timestamp.substring(0, 7); // 'YYYY-MM'

      if (!dailyMap.has(dateKey)) dailyMap.set(dateKey, []);
      dailyMap.get(dateKey)!.push(r);

      if (!monthlyMap.has(monthKey)) monthlyMap.set(monthKey, []);
      monthlyMap.get(monthKey)!.push(r);
    });

    const rateINR = 0.45;

    const mapToSummary = (key: string, list: DoubleEntryLedgerRecord[]): FinancialSummaryNode => {
      let credits = 0;
      let debits = 0;
      let creditCount = 0;
      let debitCount = 0;
      let lastClosing = 0;

      // Sort chronological to get closing
      list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      list.forEach(r => {
        if (r.credit > 0) {
          credits += r.credit;
          creditCount++;
        }
        if (r.debit > 0) {
          debits += r.debit;
          debitCount++;
        }
        lastClosing = r.closingBalance;
      });

      return {
        periodId: key,
        creditsCount: creditCount,
        debitsCount: debitCount,
        totalCreditedCoins: credits,
        totalDebitedCoins: debits,
        netCoinsDelta: credits - debits,
        endingBalance: lastClosing,
        currencyEquivalentINR: lastClosing * rateINR,
      };
    };

    const daily = Array.from(dailyMap.entries()).map(([k, v]) => mapToSummary(k, v));
    const monthly = Array.from(monthlyMap.entries()).map(([k, v]) => mapToSummary(k, v));

    // Sort descending (newest first)
    daily.sort((a, b) => b.periodId.localeCompare(a.periodId));
    monthly.sort((a, b) => b.periodId.localeCompare(a.periodId));

    return { daily, monthly };
  }
}
