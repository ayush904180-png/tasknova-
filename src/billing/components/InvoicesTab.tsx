/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { PaymentMethodType, Invoice, InvoiceStatus } from '../types';
import { useInvoiceDownloader } from '../hooks/useInvoiceDownloader';
import { Download, CreditCard, Coins, CheckCircle, Clock } from 'lucide-react';

export function InvoicesTab() {
  const {
    invoices,
    creditState,
    payInvoice,
    applyCreditsToInvoice,
    paymentMethods
  } = useBilling();

  const { downloadInvoice } = useInvoiceDownloader();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<PaymentMethodType>(PaymentMethodType.STRIPE);
  const [creditApplyAmount, setCreditApplyAmount] = useState<number>(10);

  const pendingInvoices = invoices.filter(inv => inv.status === InvoiceStatus.PENDING);

  const handlePay = (invoiceId: string) => {
    payInvoice(invoiceId, paymentGateway);
    setSelectedInvoice(null);
  };

  const handleApplyCredits = (invoiceId: string) => {
    if (creditApplyAmount <= 0) {
      alert('Please enter a valid credit amount to apply.');
      return;
    }
    if (creditApplyAmount > creditState.balance) {
      alert('Amount exceeds available credit wallet balance.');
      return;
    }
    applyCreditsToInvoice(invoiceId, creditApplyAmount);
  };

  return (
    <div className="space-y-6" id="invoices-ledger-container">
      {/* Table Section */}
      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
            Invoices Ledger & Transaction Audit
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full transaction histories, statutory compliance (GST tax calculations), and downloading offline ready logs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/10 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                <th className="py-4 px-6 font-medium">Invoice Number</th>
                <th className="py-4 px-6 font-medium">Issue Date</th>
                <th className="py-4 px-6 font-medium">Subtotal</th>
                <th className="py-4 px-6 font-medium">GST Tax (18%)</th>
                <th className="py-4 px-6 font-medium">Applied Credits</th>
                <th className="py-4 px-6 font-medium">Grand Total</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors">
                  <td className="py-4 px-6 font-mono font-medium text-slate-900 dark:text-white">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                    {invoice.date}
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">
                    ${invoice.subtotal.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono">
                    ${invoice.tax.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-rose-500 font-mono">
                    -${invoice.creditsApplied.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-slate-900 dark:text-white font-bold font-mono">
                    ${invoice.grandTotal.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        invoice.status === InvoiceStatus.PAID
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}
                    >
                      {invoice.status === InvoiceStatus.PAID ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {invoice.status !== InvoiceStatus.PAID && (
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-lg cursor-pointer hover:bg-indigo-500 transition-colors"
                      >
                        <CreditCard className="h-3 w-3" /> Pay Invoice
                      </button>
                    )}
                    <button
                      onClick={() => downloadInvoice(invoice)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Download className="h-3 w-3" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out or centered invoice details & payment portal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Invoice Settlement Desk - {selectedInvoice.invoiceNumber}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Statutory 18% GST Compliance Included</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-mono cursor-pointer"
              >
                [Esc] Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Item Details */}
              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 space-y-2 text-xs">
                {selectedInvoice.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between font-medium">
                    <span className="text-slate-600 dark:text-slate-400">{it.description}</span>
                    <span className="font-mono text-slate-900 dark:text-white">${it.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 dark:border-white/5 pt-2 mt-2 space-y-1 text-[11px] text-slate-500 font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statutory Tax (18%)</span>
                    <span>${selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.creditsApplied > 0 && (
                    <div className="flex justify-between text-rose-500">
                      <span>Credits Offset</span>
                      <span>-${selectedInvoice.creditsApplied.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white pt-1">
                    <span>Grand Total Due</span>
                    <span>${selectedInvoice.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Offset via credits */}
              {creditState.balance > 0 && (
                <div className="border border-indigo-100 dark:border-indigo-950/40 rounded-xl p-4 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <Coins className="h-4 w-4 text-indigo-500" /> Apply Corporate Credits
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Available: ${creditState.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={creditApplyAmount}
                      onChange={(e) => setCreditApplyAmount(Number(e.target.value))}
                      className="text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 font-mono w-28 text-slate-900 dark:text-white"
                      placeholder="Amount ($)"
                    />
                    <button
                      onClick={() => handleApplyCredits(selectedInvoice.id)}
                      className="text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                    >
                      Apply Offsets
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Gateway Connectors */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-900 dark:text-white">
                  Route via Payment Gateway Adapter
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(PaymentMethodType).map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentGateway(method)}
                      className={`text-[10px] font-semibold font-sans py-2 px-1 border rounded-lg text-center cursor-pointer transition-all ${
                        paymentGateway === method
                          ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 ring-1 ring-indigo-500'
                          : 'border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/10">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePay(selectedInvoice.id)}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl cursor-pointer hover:shadow-lg transition-all"
              >
                Charge & Settle Invoice (${selectedInvoice.grandTotal.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default InvoicesTab;
