/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useBilling } from '../context/BillingContext';
import { CreditType, BillingRole } from '../types';
import { Plus, Coins, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';

export function CreditsTab() {
  const { creditState, addCredits, role } = useBilling();

  const [amount, setAmount] = useState<string>('50');
  const [type, setType] = useState<CreditType>(CreditType.PROMOTIONAL);
  const [reason, setReason] = useState<string>('Incentive Promo Voucher');

  const canGrant = [BillingRole.OWNER, BillingRole.FINANCE, BillingRole.BILLING_MANAGER].includes(role);

  const handleGrant = (e: FormEvent) => {
    e.preventDefault();
    if (!canGrant) {
      alert('Unauthorized: Switching to the "Owner", "Finance", or "Billing Manager" persona is required to add credits.');
      return;
    }

    const val = Number(amount);
    if (isNaN(val) || val <= 0) {
      alert('Please specify a positive numeric credit amount.');
      return;
    }

    addCredits(val, type, reason);
    setAmount('50');
    setReason('');
    alert('Promotional or balance credit granted and recorded in the secure ledger.');
  };

  return (
    <div className="space-y-6" id="credits-ledger-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ledger */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs md:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
              Credits Ledger & Audit Logs
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure logging of credit issuances, refunds, and promotional expiration timelines.
            </p>
          </div>

          <div className="space-y-3">
            {creditState.ledger.map((entry) => (
              <div
                key={entry.id}
                className="border border-slate-100 dark:border-white/5 rounded-xl p-4 bg-slate-50/20 dark:bg-[#09090b]/10 flex items-center justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    entry.type === 'credit'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                  }`}>
                    {entry.type === 'credit' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                      {entry.reason}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      Type: <span className="text-indigo-500 font-semibold">{entry.creditType}</span> • ID: {entry.id}
                    </p>
                    {entry.expirationDate && (
                      <p className="text-[9px] text-amber-500 font-mono mt-0.5">
                        Expires: {new Date(entry.expirationDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`text-sm font-bold font-mono ${
                  entry.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {entry.type === 'credit' ? '+' : '-'}${entry.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grant module */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-indigo-500" /> Admin Credit Grant
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Issue platform/promotional credits to offset tenant renewals.
          </p>

          <form onSubmit={handleGrant} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Credit Category</label>
              <select
                disabled={!canGrant}
                value={type}
                onChange={(e) => setType(e.target.value as CreditType)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {Object.values(CreditType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Grant Amount ($)</label>
              <input
                type="number"
                disabled={!canGrant}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-mono text-slate-900 dark:text-white"
                placeholder="50.00"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Reason / Voucher Description</label>
              <input
                type="text"
                disabled={!canGrant}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-sans text-slate-900 dark:text-white"
                placeholder="e.g. Campaign Performance Voucher"
              />
            </div>

            {!canGrant && (
              <div className="bg-amber-50/55 dark:bg-amber-950/10 p-3 rounded-xl border border-amber-100 dark:border-amber-950/20 flex gap-2 items-start">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5" />
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  Credit additions require <strong>Owner, Finance,</strong> or <strong>Billing Manager</strong> permissions. Switch role above.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!canGrant}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:shadow-md transition-all text-center"
            >
              Dispatch Credits
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CreditsTab;
