/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, Landmark, CheckCircle, AlertCircle, FileText, Ban } from 'lucide-react';

export const BillingAnalyticsDashboard: React.FC = () => {
  const invoices = [
    { id: 'INV-8902', org: 'Google Workspace Corp', date: '2026-07-18', amount: '$12,450.00', status: 'PAID', type: 'SaaS + API Ingestion' },
    { id: 'INV-8901', org: 'Stripe Global Inc', date: '2026-07-15', amount: '$8,200.00', status: 'PAID', type: 'Metered Validation' },
    { id: 'INV-8900', org: 'OpenAI Labs Corp', date: '2026-07-12', amount: '$24,500.00', status: 'PAID', type: 'SaaS Platform Commitment' },
    { id: 'INV-8899', org: 'Tesla Autopilot Div', date: '2026-07-10', amount: '$15,800.00', status: 'OVERDUE', type: 'Secure NDA Sandboxing' }
  ];

  return (
    <div className="space-y-6" id="billing-analytics-dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Invoiced Amount (Month)', value: '$382,000', change: '+12.4%', label: 'SaaS + Metered API sales invoices generated.' },
          { title: 'Gateway Success Ratio', value: '99.85%', change: '+0.15%', label: 'Stripe API direct debit settle successes.' },
          { title: 'Total Refund Rate', value: '0.04%', change: '-24.5%', label: 'Corporate clients chargebacks or returns.' },
          { title: 'Taxes Settled (GST/VAT)', value: '$68,760', change: '+12.2%', label: 'Accrued tax liabilities processed.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{item.title}</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-slate-200">{item.value}</h3>
              <span className={`text-xs font-semibold ${item.change.includes('-') ? 'text-emerald-400' : 'text-indigo-400'}`}>{item.change}</span>
            </div>
            <p className="text-[10px] text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice table list */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Recent Enterprise Invoices</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Invoice ID</th>
                  <th className="pb-3">Enterprise Tenant</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Allocation Class</th>
                  <th className="pb-3 text-right">Amount (USD)</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-3 font-mono text-slate-400 font-semibold">{inv.id}</td>
                    <td className="py-3 font-semibold text-slate-200">{inv.org}</td>
                    <td className="py-3 text-slate-400">{inv.date}</td>
                    <td className="py-3 text-slate-400">{inv.type}</td>
                    <td className="py-3 text-right text-slate-300 font-semibold">{inv.amount}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                        inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
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

        {/* Ledger Balance Accounts */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">Contract Credit Balances</h3>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { client: 'Google Workspace Corp', balance: '$45,000 remaining', percent: 90, color: 'bg-emerald-400' },
              { client: 'Stripe Global Inc', balance: '$28,400 remaining', percent: 56, color: 'bg-cyan-400' },
              { client: 'OpenAI Labs Corp', balance: '$8,200 remaining', percent: 16, color: 'bg-amber-400' },
              { client: 'Tesla Autopilot Div', balance: '$1,200 (Low Funds)', percent: 2, color: 'bg-rose-500' }
            ].map((node, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{node.client}</span>
                  <span className="text-slate-400">{node.balance}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${node.color} rounded-full`} style={{ width: `${node.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
