/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { WithdrawalRequest } from '../types';
import {
  Wallet,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Search,
  Filter,
  Users,
  Banknote,
  Send,
  Lock,
  Unlock,
  AlertTriangle,
  X
} from 'lucide-react';

export function WithdrawalTab() {
  const { withdrawals, processWithdrawal, role: adminRole } = useAdmin();
  const [selectedReq, setSelectedReq] = useState<WithdrawalRequest | null>(null);
  const [activeQueue, setActiveQueue] = useState<'All' | 'UPI' | 'Bank' | 'International'>('All');
  const [reasonVal, setReasonVal] = useState('');

  const filteredReqs = withdrawals.filter((req) => {
    const matchesQueue = activeQueue === 'All' || req.channel === activeQueue;
    return matchesQueue;
  });

  const handleProcess = (status: 'Approved' | 'Rejected' | 'Hold' | 'Pending') => {
    if (!selectedReq) return;
    if (!reasonVal) {
      alert('An administrative auditing reason is required to process financial payouts.');
      return;
    }

    processWithdrawal(selectedReq.id, status, reasonVal);
    alert(`Withdrawal ID #${selectedReq.id} updated status: ${status}`);
    setReasonVal('');
    setSelectedReq(null);
  };

  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/15 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/15 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
      case 'Hold':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/15 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
      case 'Pending':
      default:
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/15 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
    }
  };

  return (
    <div className="space-y-6" id="withdrawal-center-panel">
      {/* Selection Queues tabs */}
      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-1 shrink-0">
          {(['All', 'UPI', 'Bank', 'International'] as const).map((q) => (
            <button
              key={q}
              onClick={() => setActiveQueue(q)}
              className={`text-[10px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeQueue === q
                  ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {q} queue ({q === 'All' ? withdrawals.length : withdrawals.filter(w => w.channel === q).length})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Clock className="h-4 w-4" /> Average settlement time: <span className="font-bold text-slate-900 dark:text-white font-mono">2.4 mins</span>
        </div>
      </div>

      {/* Grid: queue list + payout side-editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold">User / Beneficiary</th>
                  <th className="p-4 font-semibold">Transfer Channel</th>
                  <th className="p-4 font-semibold text-right">Requested Amount</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Request Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredReqs.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedReq(req)}
                    className={`text-xs hover:bg-slate-50/55 dark:hover:bg-white/1 cursor-pointer transition-all ${
                      selectedReq?.id === req.id ? 'bg-indigo-50/20 dark:bg-indigo-950/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">@{req.username}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {req.userId}</p>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-600 dark:text-zinc-400 uppercase">
                      {req.channel}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-800 dark:text-white">
                      ${req.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[10px] text-slate-400 font-mono">
                      {new Date(req.requestDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment execution center */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 shadow-xs h-fit space-y-6">
          {selectedReq ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                    <Banknote className="h-4.5 w-4.5 text-indigo-500" /> Payout Settlement
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Ticket ID: <span className="font-bold text-slate-900 dark:text-white">#{selectedReq.id}</span></p>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg cursor-pointer text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Amount display */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Net Settlement Amount</span>
                <h1 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">${selectedReq.amount.toFixed(2)} USD</h1>
                <p className="text-[9px] text-slate-400 font-mono mt-1">Beneficiary: @{selectedReq.username}</p>
              </div>

              {/* Channel specific details */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-slate-400">Beneficiary bank node specs</span>
                <div className="p-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#030303] rounded-xl font-mono text-[10px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <p className="font-bold uppercase">PAYOUT CHANNEL: {selectedReq.channel}</p>
                  {selectedReq.details.upiId && <p>UPI ID / ADDR: {selectedReq.details.upiId}</p>}
                  {selectedReq.details.accountNo && <p>BANK ACCOUNT: {selectedReq.details.accountNo}</p>}
                  {selectedReq.details.bankName && <p>ROUTING SWIFT: {selectedReq.details.bankName}</p>}
                  {selectedReq.details.iban && <p>IBAN / SWIFT: {selectedReq.details.iban} ({selectedReq.details.swiftCode})</p>}
                </div>
              </div>

              {/* Audit Trail list */}
              <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
                <span className="text-[9px] font-mono uppercase text-slate-400">Compliance Audit logs</span>
                {selectedReq.auditTrail.map((trail, idx) => (
                  <p key={idx} className="text-[9px] text-slate-400 leading-snug border-l-2 border-indigo-500 pl-2 font-mono">{trail}</p>
                ))}
              </div>

              {/* Auditing reason input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Auditing / Bank Transfer Ref *</label>
                <input
                  type="text"
                  required
                  value={reasonVal}
                  onChange={(e) => setReasonVal(e.target.value)}
                  placeholder="e.g. Bank IMPS Transfer Ref TXN_8812934"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* Settlement actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleProcess('Approved')}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="h-4 w-4" /> Approve & Pay
                  </button>
                  <button
                    onClick={() => handleProcess('Rejected')}
                    className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" /> Reject Payout
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleProcess('Hold')}
                    className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5" /> Place Hold
                  </button>
                  <button
                    onClick={() => handleProcess('Pending')}
                    className="py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Clock className="h-3.5 w-3.5" /> Reset Pending
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Wallet className="h-8 w-8 mx-auto text-slate-300 dark:text-zinc-800" />
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Financial Settlements desk</h4>
                <p className="text-[10px] text-slate-400 mt-1">Select an active payout invoice draft in the left table queue to execute bank wire transfers, UPI routing, or flag high-value withdrawals for compliance locks.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default WithdrawalTab;
