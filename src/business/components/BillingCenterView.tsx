/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Coins, FileText, AlertTriangle, ShieldAlert, Sparkles, 
  CreditCard, RefreshCw, CheckCircle, Download, ExternalLink, ShieldAlert as LockIcon 
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { ROLE_PERMISSIONS } from '../utils/permissions';

export const BillingCenterView: React.FC = () => {
  const { 
    billingSummary, invoices, transactions, currentRole, 
    purchaseCredits, addBonusBudget, triggerEmergencyStop 
  } = useBusiness();

  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [bonusAmount, setBonusAmount] = useState<number>(50000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState(false);

  // Check role capabilities
  const permissions = ROLE_PERMISSIONS[currentRole];

  const handlePurchase = async () => {
    setIsProcessing(true);
    await purchaseCredits(topUpAmount);
    setIsProcessing(false);
  };

  const handleBonusInject = async () => {
    await addBonusBudget(bonusAmount);
  };

  const handleEmergencyStop = async () => {
    if (confirm("WARNING: This will instantly PAUSE and lock outbound budget lines for ALL published campaigns. This cannot be undone automatically. Proceed with corporate stop?")) {
      setIsEmergencyStopped(true);
      await triggerEmergencyStop();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Overview Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Reserved Budget</span>
          <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {(billingSummary?.reservedBudget || 0).toLocaleString()}
          </h3>
          <p className="text-[9px] text-slate-400">Locked inside active pipelines</p>
        </div>

        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Spent Fiduciary</span>
          <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {(billingSummary?.spentBudget || 0).toLocaleString()}
          </h3>
          <p className="text-[9px] text-slate-400">Lifetime payouts disbursed</p>
        </div>

        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Pending Audits Hold</span>
          <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {(billingSummary?.pendingBudget || 0).toLocaleString()}
          </h3>
          <p className="text-[9px] text-slate-400">Review queue locks</p>
        </div>

        <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Granted Bonus pool</span>
          <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {(billingSummary?.bonusBudget || 0).toLocaleString()}
          </h3>
          <p className="text-[9px] text-emerald-400">Admin discretionary fund</p>
        </div>

      </div>

      {/* Main Budget & Billing Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Purchase credits, and Emergency Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Purchase credit form */}
          {permissions.canManageBilling && (
            <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-indigo-400" />
                  Settle Credit Ledger
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Wire USD deposits to purchase TaskNova training coins.</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Deposit Amount ($USD)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range"
                      min="500"
                      max="10000"
                      step="500"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(Number(e.target.value))}
                      className="flex-1 accent-indigo-500 h-1.5 bg-white/5 rounded-lg"
                    />
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded">
                      ${topUpAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-[#030303]/40 p-2.5 rounded-lg border border-white/5 flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Coins equivalence:</span>
                  <span className="text-white font-bold">{(topUpAmount * 100).toLocaleString()} Coins</span>
                </div>

                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-display text-xs rounded-xl cursor-pointer shadow-lg hover:shadow-indigo-500/10 transition-colors"
                >
                  {isProcessing ? 'Authorizing wire...' : 'Settle USD wire payment'}
                </button>
              </div>
            </div>
          )}

          {/* Emergency Stop Panel */}
          {permissions.canPublishCampaign && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <LockIcon className="h-5 w-5 text-rose-500 flex-shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold font-display text-rose-400 uppercase tracking-wide">Fiduciary Emergency Brake</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Triggering the emergency brake pauses ALL outbound disbursements, locking every published campaign's wallet pool immediately. Use in cases of adversarial prompt injection leaks or validation system spoof alerts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEmergencyStop}
                className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-400 font-bold font-display text-xs rounded-xl cursor-pointer transition-colors"
              >
                {isEmergencyStopped ? 'Ledgers locked' : 'EMERGENCY STOP LEDGERS'}
              </button>
            </div>
          )}

          {/* Administrative Bonus Injections */}
          {permissions.canManageBilling && (
            <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold font-display text-slate-950 dark:text-white uppercase tracking-wider">Discretionary Bonus Pool</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Inject direct administrative coin bonuses into the platform pools.</p>
              </div>

              <div className="flex gap-2">
                <input 
                  type="number"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  placeholder="Coins e.g. 50000"
                  className="flex-1 bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleBonusInject}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-display text-xs px-4 rounded-lg cursor-pointer"
                >
                  Grant Bonus
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Tabular invoices and transactions ledger */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* GST Ready Invoices Table */}
          <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-400" />
                GST-Ready Corporate Invoices
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">SaaS invoice trail in compliance with corporate tax structures (18% GST ready).</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 font-mono">
                    <th className="py-2 px-3">Invoice #</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Coins Injected</th>
                    <th className="py-2 px-3">Amount ($)</th>
                    <th className="py-2 px-3">Tax (18% GST)</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/1 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-950 dark:text-slate-300">{inv.invoiceNumber}</td>
                      <td className="py-2.5 px-3 text-slate-400">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{inv.coinsPurchased.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">${inv.amountUsd.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">${inv.taxAmountUsd.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-semibold ${
                          inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transactions timeline ledger */}
          <div className="bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-indigo-400" />
                Outbound Coins Disbursements Timeline
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Chronological double-entry transactions log matching corporate bank settlements.</p>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {transactions.map((tx) => {
                const isDeposit = tx.type === 'deposit' || tx.type === 'bonus';
                return (
                  <div key={tx.id} className="p-2 bg-[#030303]/30 rounded-xl border border-white/5 flex items-center justify-between text-xs font-sans">
                    <div className="space-y-1">
                      <p className="text-slate-900 dark:text-slate-300 font-semibold">{tx.description}</p>
                      <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                        <span>Ref: {tx.referenceId}</span>
                        <span>•</span>
                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      </p>
                    </div>

                    <span className={`font-mono font-bold text-xs ${isDeposit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isDeposit ? '+' : ''}{tx.amount.toLocaleString()} Coins
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
