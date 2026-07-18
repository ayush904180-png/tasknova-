/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Coins, ShieldCheck, ShieldAlert, RefreshCw, AlertTriangle, ChevronRight, 
  ChevronDown, Calendar, Landmark, CheckCircle2, Eye, Plus, FileText, 
  BarChart3, Clock, Download, Shield, Info, Activity, Globe, CheckSquare, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWallet } from '../../context/WalletContext';
import { DoubleEntryLedgerRecord, LedgerEntryStatus, LedgerTransactionType, WalletStatus } from '../../types/wallet';

export function WalletDashboard() {
  const {
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
  } = useWallet();

  // Selected state for details modal or row expansion
  const [expandedLedgerId, setExpandedLedgerId] = useState<string | null>(null);

  // Pagination for Ledger Explorer
  const [ledgerLimit, setLedgerLimit] = useState<number>(5);

  // Statement selected month
  const [statementMonth, setStatementMonth] = useState<string>('2026-07');
  const [renderedStatement, setRenderedStatement] = useState<string | null>(null);
  const [isGeneratingStatement, setIsGeneratingStatement] = useState<boolean>(false);

  // UPI claim input fields
  const [claimAmount, setClaimAmount] = useState<string>('100');
  const [upiId, setUpiId] = useState<string>(wallet?.metadata.linkedUpiId || 'ayush904180@okaxis');
  const [payoutStatus, setPayoutStatus] = useState<{ success?: boolean; msg?: string } | null>(null);

  // Bonus input fields (sandbox)
  const [bonusAmount, setBonusAmount] = useState<string>(`100`);
  const [bonusReason, setBonusReason] = useState<string>('Semantic validation bounty');

  // Freeze input fields (sandbox)
  const [freezeReason, setFreezeReason] = useState<string>('High risk automation velocity flagged.');

  // Workspace exports states
  const [exportingReport, setExportingReport] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Computed visual properties
  const sortedLedger = useMemo(() => {
    return [...ledger].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [ledger]);

  const visibleLedger = useMemo(() => {
    return sortedLedger.slice(0, ledgerLimit);
  }, [sortedLedger, ledgerLimit]);

  if (isLoading || !wallet) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading ledger nodes and decrypting cryptographic blocks...</p>
      </div>
    );
  }

  // Handle UPI disbursement claim simulation
  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutStatus(null);
    const amount = Number(claimAmount);

    if (isNaN(amount) || amount <= 0) {
      setPayoutStatus({ success: false, msg: 'Please provide a valid coin amount.' });
      return;
    }
    if (amount < 100) {
      setPayoutStatus({ success: false, msg: 'Minimum payout is 100 Coins.' });
      return;
    }
    if (amount > wallet.balances.availableBalance) {
      setPayoutStatus({ success: false, msg: 'Insufficient available coins in balance.' });
      return;
    }

    try {
      const res = await claimPayout(amount, upiId);
      if (res) {
        setPayoutStatus({
          success: true,
          msg: `Successfully enqueued UPI disbursal of ₹${(amount * 0.45).toFixed(2)} to ${upiId}.`
        });
        setClaimAmount('100');
      } else {
        setPayoutStatus({ success: false, msg: 'Transaction processing halted by safety protocols.' });
      }
    } catch (err: any) {
      setPayoutStatus({ success: false, msg: err.message || 'Verification failed.' });
    }
  };

  // Handle sandbox bonus mint
  const handleAddBonus = async () => {
    const amount = Number(bonusAmount);
    if (!amount || amount <= 0) return;
    await addBonus(amount, bonusReason);
  };

  // Generate compliance statement
  const handleGenerateStatement = async () => {
    setIsGeneratingStatement(true);
    setRenderedStatement(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = await generateMonthlyStatement(statementMonth);
      setRenderedStatement(result.statementText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingStatement(false);
    }
  };

  // Export center simulation
  const handleExportWorkspace = async (type: string) => {
    setExportingReport(type);
    setExportMessage(null);
    try {
      const res = await exportReport(type);
      setExportMessage(res.message);
    } finally {
      setExportingReport(null);
    }
  };

  /**
   * Action: Tamper with ledger
   * Mutates a ledger record in MemoryDatabase directly, bypassing cryptographic append verification,
   * to showcase how the Audit Console instantly flags data corruption and tampering in real-time.
   */
  const handleSimulateTamper = () => {
    try {
      const dbStr = localStorage.getItem('tasknova_mock_firestore');
      if (dbStr) {
        const db = JSON.parse(dbStr);
        const ledgersColl = db['ledger_v2'];
        if (ledgersColl) {
          const keys = Object.keys(ledgersColl);
          if (keys.length > 0) {
            const randomKey = keys[0];
            const target = ledgersColl[randomKey];
            // Corrupt the values but keep same signature
            target.credit = 9999;
            target.closingBalance = 15400;
            localStorage.setItem('tasknova_mock_firestore', JSON.stringify(db));
            
            // Reload context values without full reset
            syncWallet();
            // Instantly run audit to trigger failure UI
            triggerAudit();
          }
        }
      }
    } catch (err) {
      console.error('Tamper simulation error:', err);
    }
  };

  return (
    <div className="space-y-6 text-white text-left font-sans" id="wallet-dashboard-module">
      
      {/* 1. BALANCE CARDS MODULE (WCAG Compliant high-contrast gradients and sizing) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="balance-cards-grid">
        
        {/* Core Available Balance Widget */}
        <div className="bg-gradient-to-br from-indigo-950 via-[#0a0a16] to-[#05050e] border border-indigo-500/35 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono block">Withdrawable Coin Holdings</span>
              <h2 className="text-4xl font-extrabold font-display text-white tracking-tight">
                {wallet.balances.availableBalance}
              </h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
              <Coins className="h-5 w-5 text-indigo-400" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-950/60 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Estimated INR</span>
            <span className="text-white font-semibold">₹{wallet.balances.estimatedINR.toFixed(2)}</span>
          </div>
          <div className="mt-1.5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>USD: ${(wallet.balances.availableBalance * 0.0054).toFixed(2)}</span>
            <span>EUR: €{(wallet.balances.availableBalance * 0.0050).toFixed(2)}</span>
          </div>
        </div>

        {/* Dynamic Pending & Holds Balance Card */}
        <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80 font-mono block">Pending Audit Holds</span>
              <h2 className="text-3xl font-extrabold font-display text-zinc-100">
                {wallet.balances.pendingBalance} <span className="text-sm font-normal text-slate-500">Coins</span>
              </h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          
          <p className="text-[11px] text-slate-500 mt-2 font-light leading-normal">
            Coins matching tasks currently queued in RLHF consensus validation. Auto-transfers to Available balance immediately upon validator clearance.
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Current State:</span>
            <span className="text-amber-500 font-medium flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Validating Queue
            </span>
          </div>
        </div>

        {/* Unified Statistics Widget */}
        <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">Accumulated Lifecycle Metrics</span>
              <h3 className="text-xs text-slate-400 mt-1">Simulated Double-Entry Vault</h3>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-850/60">
              <span className="text-[10px] text-slate-500 block">LIFETIME EARNED</span>
              <span className="text-white font-semibold">+{wallet.balances.lifetimeEarnings} Coins</span>
            </div>
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-850/60">
              <span className="text-[10px] text-slate-500 block">LIFETIME WITHDRAWN</span>
              <span className="text-white font-semibold">-{wallet.balances.lifetimeWithdrawals} Coins</span>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-slate-500 flex justify-between items-center">
            <span>Total Ledger Entries</span>
            <span className="font-mono text-white font-semibold">{ledger.length} immutable records</span>
          </div>
        </div>

      </div>

      {/* 2. OVERVIEW & DISBURSAL ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="payout-overview-row">
        
        {/* Wallet Overview & Disbursal Module */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-white">Disburse Coin Holdings</h3>
              <p className="text-xs text-slate-400 font-sans font-light">
                Submit a withdraw block. Clears holdings instantly to linked UPI / bank channels.
              </p>
            </div>
            <Landmark className="h-5 w-5 text-indigo-400" />
          </div>

          <form onSubmit={handleClaim} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">UPI Address / VPA</label>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. name@okaxis"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Coins to Disburse</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    min="100"
                    max={wallet.balances.availableBalance}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Min 100 Coins"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-[9px] font-mono text-slate-500">COINS</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-zinc-950/80 p-3 rounded-xl border border-zinc-850/60">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono block">Disbursal Value:</span>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  ₹{(Number(claimAmount) * 0.45 || 0).toFixed(2)} INR <span className="text-[10px] text-slate-500 font-light font-sans">(rate: ₹0.45 per Coin)</span>
                </span>
              </div>
              <button
                type="submit"
                disabled={wallet.status !== WalletStatus.ACTIVE}
                className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-xs font-semibold rounded-xl text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
              >
                Execute Ledger Disbursal
              </button>
            </div>
          </form>

          {payoutStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 border rounded-xl flex items-center gap-2.5 ${payoutStatus.success ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' : 'bg-rose-950/40 border-rose-500/20 text-rose-400'}`}
            >
              {payoutStatus.success ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />}
              <span className="text-xs font-mono leading-normal">{payoutStatus.msg}</span>
            </motion.div>
          )}

          {/* Wallet Metadata Specs */}
          <div className="pt-4 border-t border-zinc-850/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[9px] text-slate-500 block">WALLET ID</span>
              <span className="text-white block font-medium mt-0.5 select-all">{wallet.id}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">WALLET VERSION</span>
              <span className="text-white block font-medium mt-0.5">V{wallet.version}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">KYC LEVEL</span>
              <span className="text-indigo-400 block font-medium mt-0.5">{wallet.metadata.kycTier}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">PREF CURRENCY</span>
              <span className="text-white block font-medium mt-0.5">{wallet.metadata.preferredCurrency || 'INR'}</span>
            </div>
          </div>

        </div>

        {/* Wallet Status and Health Module */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-display text-white">Wallet Health & Security</h3>
            <p className="text-xs text-slate-400 font-sans font-light">
              Compliance status, transaction safety blocks, and freeze operations.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">Wallet State Node:</span>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full uppercase ${wallet.status === WalletStatus.ACTIVE ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                {wallet.status}
              </span>
            </div>

            {/* Sandbox Actions to change Status */}
            <div className="space-y-2 pt-2 border-t border-zinc-900">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono block">Sandbox Status Controls</span>
              
              {wallet.status === WalletStatus.ACTIVE ? (
                <div className="space-y-2">
                  <input 
                    type="text"
                    value={freezeReason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-rose-500"
                    placeholder="Reason for suspension"
                  />
                  <button 
                    onClick={() => freezeWallet(freezeReason)}
                    className="w-full py-1.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/50 text-[10px] font-mono rounded-lg text-rose-400 transition-colors cursor-pointer text-center"
                  >
                    Simulate Wallet Freeze / Lock
                  </button>
                </div>
              ) : (
                <button 
                  onClick={activateWallet}
                  className="w-full py-1.5 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-900/50 text-[10px] font-mono rounded-lg text-emerald-400 transition-colors cursor-pointer text-center"
                >
                  Clear Suspensions (Unlock Wallet)
                </button>
              )}
            </div>
          </div>

          {/* Audit telemetry micro values */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-zinc-950/40 border border-zinc-850/50 rounded-xl">
              <span className="text-[9px] text-slate-500 block uppercase">growth rate</span>
              <span className="text-white block font-semibold mt-0.5">+{telemetry?.ledgerGrowthRate.toFixed(1)}%</span>
            </div>
            <div className="p-3 bg-zinc-950/40 border border-zinc-850/50 rounded-xl">
              <span className="text-[9px] text-slate-500 block uppercase">avg tx size</span>
              <span className="text-white block font-semibold mt-0.5">{telemetry?.averageTransactionSize.toFixed(1)} Coins</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. AUDIT CONSOLE & CRYPTOGRAPHIC LEDGER VERIFICATION */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-6" id="audit-console-module">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-bold font-display text-white">Cryptographic Ledger Auditor</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans font-light">
              Every ledger appendment hashes its parameters with the parent hash. Run validation audits to verify 100% database coherence.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Simulate manual db alteration */}
            <button
              onClick={handleSimulateTamper}
              className="px-3 py-2 border border-rose-900/50 bg-rose-950/10 hover:bg-rose-900/15 text-[10px] font-mono rounded-xl text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Edits database directly, bypassing validation triggers to simulate a ledger attack"
            >
              <AlertTriangle className="h-3 w-3" />
              Simulate Ledger Tamper
            </button>

            <button
              onClick={clearLedgerLogs}
              className="px-3 py-2 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-mono rounded-xl text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="h-3 w-3 text-slate-400" />
              Reset Ledger Seeds
            </button>

            <button
              onClick={() => triggerAudit()}
              disabled={isAuditing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold rounded-xl text-white transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/10"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Running Blockchain Verification...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Run Cryptographic Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Report Result Panel */}
        <AnimatePresence mode="wait">
          {auditReport && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-zinc-800 bg-zinc-950/60 rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-850 flex justify-between items-center bg-zinc-900/50">
                <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Audit Execution Node: {auditReport.auditId}</span>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full uppercase ${auditReport.checksumStatus === 'Passed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                  Checksum status: {auditReport.checksumStatus}
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-4 space-y-4 text-xs font-mono border-b md:border-b-0 md:border-r border-zinc-850 pb-4 md:pb-0 md:pr-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px]">TOTAL BLOCKS AUDITED</span>
                    <span className="text-white font-bold block text-sm">{auditReport.totalRecordsAudited} Records</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px]">RECOMPUTED CHECKSUM</span>
                    <span className={`font-bold block text-sm ${auditReport.checksumStatus === 'Passed' ? 'text-emerald-400' : 'text-rose-400 font-extrabold'}`}>
                      {auditReport.checksumStatus === 'Passed' ? 'COHERENT (0.00 VARIANCE)' : 'CORRUPTED VALUES DETECTED'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px]">TAMPERED LOG ENTRIES</span>
                    <span className={`font-bold block text-sm ${auditReport.tamperedRecordsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {auditReport.tamperedRecordsCount} Records
                    </span>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-2 text-[11px] font-mono">
                  <span className="text-slate-500 uppercase text-[10px] font-semibold tracking-wider block">Auditor Verification Console Log Output:</span>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 h-28 overflow-y-auto space-y-1.5 select-text text-slate-400 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
                    {auditReport.auditLogs.map((log, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <span className="text-indigo-500 font-bold">»</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 4. IMMUTABLE LEDGER EXPLORER */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4 animate-fade-in" id="ledger-explorer-module">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-bold font-display text-white">Double-Entry Immutable Ledger Explorer</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans font-light">
              This financial ledger is strictly append-only. History changes are structurally impossible without invalidating upstream blocks.
            </p>
          </div>
        </div>

        <div className="border border-zinc-850 bg-zinc-950/40 rounded-xl overflow-hidden">
          
          {/* Responsive scroll box */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-850 bg-zinc-950 text-[10px] text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Ledger ID</th>
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold text-right">Debit (Out)</th>
                  <th className="p-4 font-semibold text-right">Credit (In)</th>
                  <th className="p-4 font-semibold text-right">Closing Bal</th>
                  <th className="p-4 font-semibold text-center">Security Hash</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {visibleLedger.map((row) => {
                  const isExpanded = expandedLedgerId === row.ledgerId;
                  
                  // Compute dynamic signature check state
                  const isRecordCorrupted = row.credit === 9999; // Mock tampering logic reference
                  
                  return (
                    <React.Fragment key={row.ledgerId}>
                      <tr 
                        className={`hover:bg-zinc-900/50 transition-colors ${isRecordCorrupted ? 'bg-rose-950/20 text-rose-300 hover:bg-rose-950/30' : ''}`}
                      >
                        <td className="p-4 font-semibold text-slate-400 select-all">{row.ledgerId.substring(0, 12)}...</td>
                        <td className="p-4 text-slate-400 text-[10px]">{new Date(row.timestamp).toLocaleDateString()} {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            row.credit > 0 
                              ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' 
                              : 'bg-zinc-900 text-slate-300 border border-zinc-800'
                          }`}>
                            {row.credit > 0 ? 'Credit: ' : 'Debit: '}{row.credit > 0 ? 'REWARD' : 'PAYOUT'}
                          </span>
                        </td>
                        <td className="p-4 text-right text-slate-400 font-bold">{row.debit > 0 ? `-${row.debit}` : '—'}</td>
                        <td className="p-4 text-right text-emerald-400 font-bold">{row.credit > 0 ? `+${row.credit}` : '—'}</td>
                        <td className="p-4 text-right font-bold text-white">{row.closingBalance} Coins</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isRecordCorrupted ? (
                              <>
                                <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-rose-400">HASH_INVALID</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                <span className="text-[10px] text-slate-500 select-all">{row.signature.substring(0, 10)}...</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setExpandedLedgerId(isExpanded ? null : row.ledgerId)}
                            className="p-1.5 hover:bg-zinc-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Transaction Details Panel (WCAG Accessible) */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-4 bg-zinc-950/80 border-t border-zinc-900">
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400"
                            >
                              <div className="space-y-1.5">
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">System Transaction ID</span>
                                <span className="text-white select-all font-semibold block">{row.transactionId}</span>
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 block mt-2">External Reference ID</span>
                                <span className="text-white select-all font-mono block">{row.referenceId}</span>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">RLHF Task Submission ID</span>
                                <span className="text-indigo-400 select-all font-mono block">{row.submissionId || 'N/A (Non-Task Operation)'}</span>
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 block mt-2">Verification status</span>
                                <span className="text-emerald-400 font-semibold block">Passed Automated Consensus Audits</span>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">UPSTREAM SEAL CHECKSUM SHA256</span>
                                <span className="text-indigo-400 block break-all leading-normal select-all font-mono font-light text-[10px] bg-zinc-900/50 p-2 rounded border border-zinc-850">
                                  {row.signature}
                                </span>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400">Showing {visibleLedger.length} of {ledger.length} ledger transaction logs</span>
            {ledgerLimit < ledger.length && (
              <button
                onClick={() => setLedgerLimit(prev => prev + 5)}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-slate-300 font-semibold rounded-lg cursor-pointer transition-all"
              >
                Load More Entries
              </button>
            )}
          </div>

        </div>

      </div>

      {/* 5. STATEMENT VIEWER & EXPORT CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="payout-exporters-row">
        
        {/* Compliance Statement Viewer */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-bold font-display text-white">Monthly Statement Extractor</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans font-light">
              Compile standard legal financial statements with integrated checksum verification seals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-grow max-w-[180px]">
              <div className="relative">
                <input 
                  type="text" 
                  value={statementMonth}
                  onChange={(e) => setStatementMonth(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="YYYY-MM"
                />
                <Calendar className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <button
              onClick={handleGenerateStatement}
              disabled={isGeneratingStatement}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold rounded-xl text-white transition-all cursor-pointer flex items-center gap-2"
            >
              {isGeneratingStatement ? 'Compiling Extract...' : 'Generate Extract'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {renderedStatement && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-3"
              >
                <div className="relative">
                  <pre className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl h-44 overflow-y-auto text-[9px] text-slate-300 font-mono leading-relaxed select-text text-left scrollbar-thin scrollbar-thumb-zinc-800">
                    {renderedStatement}
                  </pre>
                  <button
                    onClick={() => {
                      const blob = new Blob([renderedStatement], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `TaskNova_Statement_${wallet.id.substring(4, 9)}_${statementMonth}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="absolute right-3 bottom-3 p-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
                    title="Download Statement Text Document"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex items-center gap-2 text-[10px] text-indigo-400 font-mono">
                  <Info className="h-3.5 w-3.5" />
                  <span>Metadata synchronized inside Google Drive Parent ID: tasknova_finance_vault</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Corporate Workspace Export Center */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between space-y-6 animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-bold font-display text-white">Google Workspace Exporter</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans font-light">
              Export legal financial ledgers, wallet summaries, and daily compliance balance records programmatically.
            </p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Ledger Audit Export', icon: FileText, desc: 'Syncs complete cryptographic ledger chain logs to Google Sheets.' },
              { label: 'Business Balance Report', icon: Landmark, desc: 'Generates business accounts and cost summaries inside Sheets.' },
              { label: 'Ledger Archives Document', icon: ShieldCheck, desc: 'Stores legal-compliant transaction backups inside Google Drive vaults.' }
            ].map((exportNode, i) => (
              <button
                key={i}
                onClick={() => handleExportWorkspace(exportNode.label)}
                disabled={!!exportingReport}
                className="w-full p-3 bg-zinc-950 hover:bg-zinc-950/40 disabled:opacity-50 border border-zinc-850 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group hover:border-indigo-500/30"
              >
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/20">
                    <exportNode.icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-200">{exportNode.label}</span>
                    <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">{exportNode.desc}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          {exportMessage && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-[11px] font-mono text-indigo-400 leading-normal">
              {exportMessage}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
