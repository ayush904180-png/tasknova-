/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FirestoreRepository, MemoryDatabase } from '../../infrastructure/repositories/FirestoreRepository';
import { BusinessBillingSummary, BusinessInvoice, BusinessTransaction } from '../types';

export class BillingRepository {
  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed billing summary
    const summary = MemoryDatabase.get('billing', 'summary_current');
    if (!summary) {
      const initialSummary: BusinessBillingSummary = {
        id: 'summary_current',
        companyName: 'TaskNova Enterprise Portfolio',
        reservedBudget: 1500000,
        spentBudget: 4200000,
        pendingBudget: 800000,
        estimatedBudget: 6500000,
        refundBudget: 150000,
        bonusBudget: 300000,
        dailyLimit: 500000, // coins
        campaignLimit: 2000000, // coins
        creditBalance: 12500000, // Available credits
      };
      MemoryDatabase.set('billing', 'summary_current', initialSummary);
    }

    // 2. Seed invoices
    const invoices = MemoryDatabase.list('billing_invoices');
    if (!invoices || invoices.length === 0) {
      const initialInvoices: BusinessInvoice[] = [
        {
          id: 'inv_001',
          invoiceNumber: 'TKNV-2026-00084',
          date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
          coinsPurchased: 10000000,
          amountUsd: 100000,
          status: 'paid',
          gstNumber: 'GSTIN27AABCT8431R1ZP',
          taxAmountUsd: 18000, // 18% GST
        },
        {
          id: 'inv_002',
          invoiceNumber: 'TKNV-2026-00125',
          date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
          coinsPurchased: 5000000,
          amountUsd: 50000,
          status: 'paid',
          gstNumber: 'GSTIN27AABCT8431R1ZP',
          taxAmountUsd: 9000,
        },
        {
          id: 'inv_003',
          invoiceNumber: 'TKNV-2026-00199',
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          coinsPurchased: 3000000,
          amountUsd: 30000,
          status: 'pending',
          gstNumber: 'GSTIN27AABCT8431R1ZP',
          taxAmountUsd: 5400,
        }
      ];
      initialInvoices.forEach(inv => MemoryDatabase.set('billing_invoices', inv.id, inv));
    }

    // 3. Seed transactions
    const txs = MemoryDatabase.list('billing_transactions');
    if (!txs || txs.length === 0) {
      const initialTxs: BusinessTransaction[] = [
        {
          id: 'tx_b001',
          campaignId: 'camp_openai_gpt5_rlhf',
          amount: -120000,
          type: 'spend',
          description: 'RLHF response validation cost deduction - GPT-5',
          timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
          referenceId: 'ref_sha_94101a0'
        },
        {
          id: 'tx_b002',
          campaignId: 'camp_deepmind_gemini_multimodal',
          amount: -85000,
          type: 'spend',
          description: 'Multimodal bounding box labelling disbursement - Gemini Ultra',
          timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
          referenceId: 'ref_sha_5819aa4'
        },
        {
          id: 'tx_b003',
          amount: 5000000,
          type: 'deposit',
          description: 'Corporate Wire Settlement - Invoice TKNV-2026-00125 Sync',
          timestamp: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
          referenceId: 'ref_sha_0128fa1'
        },
        {
          id: 'tx_b004',
          campaignId: 'camp_anthropic_claude_pairwise',
          amount: 15000,
          type: 'refund',
          description: 'Automatic consensus validation timeout refund - Claude 4 Pairwise',
          timestamp: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
          referenceId: 'ref_sha_8840cd4'
        }
      ];
      initialTxs.forEach(tx => MemoryDatabase.set('billing_transactions', tx.id, tx));
    }
  }

  async getSummary(): Promise<BusinessBillingSummary> {
    return MemoryDatabase.get('billing', 'summary_current') as BusinessBillingSummary;
  }

  async updateSummary(data: Partial<BusinessBillingSummary>): Promise<void> {
    const summary = await this.getSummary();
    MemoryDatabase.set('billing', 'summary_current', { ...summary, ...data });
  }

  async getInvoices(): Promise<BusinessInvoice[]> {
    return MemoryDatabase.list('billing_invoices') as BusinessInvoice[];
  }

  async createInvoice(invoice: BusinessInvoice): Promise<void> {
    MemoryDatabase.set('billing_invoices', invoice.id, invoice);
  }

  async getTransactions(): Promise<BusinessTransaction[]> {
    const list = MemoryDatabase.list('billing_transactions') as BusinessTransaction[];
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async appendTransaction(tx: BusinessTransaction): Promise<void> {
    MemoryDatabase.set('billing_transactions', tx.id, tx);
    // Update credit balances
    const summary = await this.getSummary();
    await this.updateSummary({
      creditBalance: summary.creditBalance + tx.amount,
      spentBudget: tx.type === 'spend' ? summary.spentBudget + Math.abs(tx.amount) : summary.spentBudget,
    });
  }
}
