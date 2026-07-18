/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Wallet, DoubleEntryLedgerRecord, WalletTelemetryKPIs, FinancialAuditReport, LedgerTransactionType, LedgerEntryStatus, FinancialSummaryNode } from '../types/wallet';
import { WalletService } from '../infrastructure/services/WalletService';
import { LedgerService } from '../infrastructure/services/LedgerService';

interface WalletContextType {
  wallet: Wallet | null;
  ledger: DoubleEntryLedgerRecord[];
  telemetry: WalletTelemetryKPIs | null;
  summaries: { daily: FinancialSummaryNode[]; monthly: FinancialSummaryNode[] } | null;
  isLoading: boolean;
  isAuditing: boolean;
  auditReport: FinancialAuditReport | null;
  eventLogs: string[];
  triggerAudit: () => Promise<FinancialAuditReport>;
  claimPayout: (amount: number, upiId: string) => Promise<boolean>;
  addBonus: (amount: number, reason: string) => Promise<void>;
  freezeWallet: (reason: string) => Promise<void>;
  activateWallet: () => Promise<void>;
  syncWallet: () => Promise<void>;
  generateMonthlyStatement: (month: string) => Promise<{ success: boolean; statementText: string; driveFileId: string }>;
  exportReport: (reportType: string) => Promise<{ success: boolean; message: string; url?: string }>;
  clearLedgerLogs: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const DEFAULT_USER_ID = 'usr_ayush_tasknova';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [ledger, setLedger] = useState<DoubleEntryLedgerRecord[]>([]);
  const [telemetry, setTelemetry] = useState<WalletTelemetryKPIs | null>(null);
  const [summaries, setSummaries] = useState<{ daily: FinancialSummaryNode[]; monthly: FinancialSummaryNode[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<FinancialAuditReport | null>(null);
  const [eventLogs, setEventLogs] = useState<string[]>([]);

  // Instantiating services
  const [walletService] = useState(() => new WalletService());
  const [ledgerService] = useState(() => new LedgerService());

  /**
   * Refreshes all wallet balances, ledger entries, summaries, and telemetry stats in sync.
   */
  const refreshAllData = useCallback(async (targetWalletId?: string) => {
    try {
      const ownerId = DEFAULT_USER_ID;
      
      // 1. Get or create wallet
      const activeWallet = await walletService.CreateWallet(ownerId);
      const walletId = targetWalletId || activeWallet.id;

      // 2. Load latest ledger records
      const fullLedger = await ledgerService.getWalletLedger(walletId);
      
      // 3. Sync balances to ensure accurate INR/USD equivalent conversions
      const syncedWallet = await walletService.SyncWallet(walletId);

      // 4. Generate visual aggregates
      const periodicSums = await ledgerService.generateFinancialSummaries(walletId);

      // 5. Query KPI Telemetry
      const kpis = await walletService.getTelemetryKPIs(walletId);

      setWallet(syncedWallet);
      setLedger(fullLedger);
      setSummaries(periodicSums);
      setTelemetry(kpis);
    } catch (error) {
      console.error('Error refreshing wallet details:', error);
    }
  }, [walletService, ledgerService]);

  // Handle subscriber notifications on Global Event Bus
  useEffect(() => {
    const unsubscribe = walletService.subscribeToEvents((event, payload) => {
      const logText = `[${new Date().toLocaleTimeString()}] Event: ${event} | ${JSON.stringify(payload)}`;
      setEventLogs(prev => [logText, ...prev].slice(0, 50)); // Cap logs to last 50
    });

    return () => unsubscribe();
  }, [walletService]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshAllData();
      setIsLoading(false);
    };
    init();
  }, [refreshAllData]);

  /**
   * Runs the full double-entry cryptographic verification chain.
   */
  const triggerAudit = async (): Promise<FinancialAuditReport> => {
    if (!wallet) throw new Error('No active wallet loaded.');
    setIsAuditing(true);
    try {
      // Simulate auditing computing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      const report = await walletService.GenerateAudit(wallet.id);
      setAuditReport(report);
      return report;
    } finally {
      setIsAuditing(false);
    }
  };

  /**
   * Submits a withdraw request. Subtracts available balance and logs in Ledger.
   */
  const claimPayout = async (amount: number, upiId: string): Promise<boolean> => {
    if (!wallet) return false;
    if (wallet.status !== 'Active') {
      throw new Error(`Transaction blocked: Wallet is in ${wallet.status} state.`);
    }
    if (wallet.balances.availableBalance < amount) {
      throw new Error('Insufficient coins to process UPI claim.');
    }

    try {
      // Record Debit Entry
      await walletService.recordLedgerTransaction({
        walletId: wallet.id,
        type: LedgerTransactionType.WITHDRAWAL_COMPLETE,
        amount,
        referenceId: `upi_${upiId.substring(0, 4)}_${Math.random().toString(36).substr(2, 6)}`,
        status: LedgerEntryStatus.COMPLETED,
      });

      // Refresh states
      await refreshAllData(wallet.id);
      return true;
    } catch (err) {
      console.error('Error executing coin payout transaction:', err);
      return false;
    }
  };

  /**
   * Inject a bonus credit for user sandbox testing.
   */
  const addBonus = async (amount: number, reason: string): Promise<void> => {
    if (!wallet) return;
    await walletService.recordLedgerTransaction({
      walletId: wallet.id,
      type: LedgerTransactionType.BONUS_CREDIT,
      amount,
      referenceId: `bn_${Math.random().toString(36).substr(2, 6)}`,
      status: LedgerEntryStatus.COMPLETED,
    });
    await refreshAllData(wallet.id);
  };

  /**
   * Freezes the current wallet.
   */
  const freezeWallet = async (reason: string): Promise<void> => {
    if (!wallet) return;
    await walletService.FreezeWallet(wallet.id, reason);
    await refreshAllData(wallet.id);
  };

  /**
   * Reactivates the current wallet.
   */
  const activateWallet = async (): Promise<void> => {
    if (!wallet) return;
    await walletService.ActivateWallet(wallet.id);
    await refreshAllData(wallet.id);
  };

  /**
   * Re-syncs and evaluates entire history.
   */
  const syncWallet = async (): Promise<void> => {
    if (!wallet) return;
    setIsLoading(true);
    await walletService.SyncWallet(wallet.id);
    await refreshAllData(wallet.id);
    setIsLoading(false);
  };

  /**
   * Triggers monthly statement compilation and logs virtual drive Parents list.
   */
  const generateMonthlyStatement = async (month: string): Promise<{ success: boolean; statementText: string; driveFileId: string }> => {
    if (!wallet) throw new Error('No wallet loaded');
    return walletService.GenerateStatement(wallet.id, month);
  };

  /**
   * Simulates publishing a Sheet or Drive archive node.
   */
  const exportReport = async (reportType: string): Promise<{ success: boolean; message: string; url?: string }> => {
    if (!wallet) throw new Error('No wallet loaded');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Sim loader
    
    const mockSheetId = '1tXNOvA_payout_ledger_2026_xYz9827';
    
    this; // no-op anchor

    return {
      success: true,
      message: `Successfully synchronized and exported "${reportType}" to Google Workspace.`,
      url: `https://docs.google.com/spreadsheets/d/${mockSheetId}/edit#gid=0`,
    };
  };

  /**
   * Reset sandbox back to original seed.
   */
  const clearLedgerLogs = async (): Promise<void> => {
    if (!wallet) return;
    setIsLoading(true);
    
    // Purge simulated local collections for wallets & ledgers to force re-seeding
    try {
      const stored = localStorage.getItem('tasknova_mock_firestore');
      if (stored) {
        const parsed = JSON.parse(stored);
        delete parsed['wallets_v2'];
        delete parsed['ledger_v2'];
        localStorage.setItem('tasknova_mock_firestore', JSON.stringify(parsed));
      }
    } catch (err) {
      console.warn('Error clearing localStorage mock databases:', err);
    }

    await refreshAllData();
    setAuditReport(null);
    setIsLoading(false);
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        ledger,
        telemetry,
        summaries,
        isLoading,
        isAuditing,
        auditReport,
        eventLogs,
        triggerAudit,
        claimPayout,
        addBonus,
        freezeWallet,
        activateWallet,
        syncWallet,
        generateMonthlyStatement,
        exportReport,
        clearLedgerLogs,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
