/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useBilling } from '../context/BillingContext';
import { PaymentMethodType } from '../types';
import { Plus, Trash2, CheckCircle, CreditCard, Shield } from 'lucide-react';

export function PaymentMethodsTab() {
  const {
    paymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  } = useBilling();

  const [newType, setNewType] = useState<PaymentMethodType>(PaymentMethodType.CREDIT_CARD);
  const [upiVal, setUpiVal] = useState<string>('');
  const [cardVal, setCardVal] = useState<string>('4242');

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (newType === PaymentMethodType.UPI && !upiVal) {
      alert('Please specify a valid UPI ID (e.g. user@bank)');
      return;
    }

    const details = newType === PaymentMethodType.UPI
      ? { upiId: upiVal }
      : { last4: cardVal.slice(-4), brand: 'Visa' };

    addPaymentMethod(newType, details);
    setUpiVal('');
    setCardVal('4242');
    alert('Payment Gateway Adapter linked successfully.');
  };

  return (
    <div className="space-y-6" id="payment-methods-management">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Method list */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs md:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
              Authorized Payment Gateway Connectors
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage multi-gateway adapters without hardcoded API SDK dependencies.
            </p>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`border rounded-xl p-4 flex items-center justify-between transition-colors ${
                  pm.isDefault
                    ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/5'
                    : 'border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-[#09090b]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                      {pm.type} Gateway
                      {pm.isDefault && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-indigo-600 bg-indigo-100/50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-sm">
                          <CheckCircle className="h-2 w-2" /> Default
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {pm.type === 'UPI' ? pm.details.upiId : `Visa card ending in ****${pm.details.last4}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!pm.isDefault && (
                    <button
                      onClick={() => setDefaultPaymentMethod(pm.id)}
                      className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-indigo-100 dark:border-indigo-950 px-2 py-1 rounded-md cursor-pointer bg-white dark:bg-slate-950"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => deletePaymentMethod(pm.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add method form */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-indigo-500" /> Link Gateway Adapter
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Link a new payment channel to test integration endpoints.
          </p>

          <form onSubmit={handleAdd} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Gateway Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as PaymentMethodType)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {Object.values(PaymentMethodType).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {newType === PaymentMethodType.UPI ? (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  required
                  value={upiVal}
                  onChange={(e) => setUpiVal(e.target.value)}
                  placeholder="e.g. tasknova@oksbi"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-mono text-slate-900 dark:text-white"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Mock Card Number (Last 4)</label>
                <input
                  type="text"
                  required
                  value={cardVal}
                  onChange={(e) => setCardVal(e.target.value)}
                  placeholder="e.g. 4242"
                  maxLength={16}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-mono text-slate-900 dark:text-white"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer hover:shadow-md transition-all text-center"
            >
              Register Gateway
            </button>
          </form>
        </div>
      </div>

      {/* Abstract payment notification */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/85 dark:border-white/5 rounded-2xl p-6 flex gap-4 items-start">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-950 dark:text-white">
            Architecture-Driven Gateway Layer (Abstract Connectors)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            TaskNova AI decouples payments using the Repository design pattern. Gateway adapters for <strong>Stripe, Razorpay, UPI (PhonePe, GPay, Paytm)</strong> and <strong>Bank Wire</strong> remain pluggable. Adding new countries or methods requires creating a single class adhering to the <code>PaymentGatewayAdapter</code> interface — zero changes are needed in the core application views.
          </p>
        </div>
      </div>
    </div>
  );
}
export default PaymentMethodsTab;
