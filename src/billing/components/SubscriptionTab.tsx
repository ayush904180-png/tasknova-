/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { PLANS_REGISTRY } from '../services/BillingService';
import { PlanTier, BillingCycle } from '../types';
import { Check, Info, Sparkles, HelpCircle } from 'lucide-react';

export function SubscriptionTab() {
  const { subscription, changePlan, toggleAutoRenew } = useBilling();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.cycle);

  const handlePlanSelect = (tier: PlanTier) => {
    if (subscription.tier === tier && subscription.cycle === billingCycle) return;
    const confirmUpgrade = window.confirm(
      `Are you sure you want to transition your subscription to the "${tier}" plan billing on a ${billingCycle} cycle?`
    );
    if (confirmUpgrade) {
      changePlan(tier, billingCycle);
    }
  };

  return (
    <div className="space-y-6" id="subscription-center-container">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
            Subscription Control Center
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dynamically adjust corporate limits, support tiers, and capabilities in real time.
          </p>
        </div>

        {/* Toggle switch */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-fit">
          <button
            onClick={() => setBillingCycle(BillingCycle.MONTHLY)}
            className={`text-xs font-medium px-4 py-1.5 rounded-lg cursor-pointer transition-all ${
              billingCycle === BillingCycle.MONTHLY
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly Rate
          </button>
          <button
            onClick={() => setBillingCycle(BillingCycle.YEARLY)}
            className={`text-xs font-medium px-4 py-1.5 rounded-lg cursor-pointer transition-all ${
              billingCycle === BillingCycle.YEARLY
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Yearly (Save ~15%)
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(PlanTier).map((tier) => {
          const plan = PLANS_REGISTRY[tier];
          const isCurrent = subscription.tier === tier;
          const rate = billingCycle === BillingCycle.MONTHLY ? plan.priceMonthly : plan.priceYearly;

          return (
            <div
              key={tier}
              className={`bg-white dark:bg-slate-950 border rounded-2xl p-6 relative flex flex-col justify-between shadow-xs transition-all duration-300 ${
                isCurrent
                  ? 'border-indigo-500 ring-1 ring-indigo-500'
                  : 'border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-500 text-white text-[9px] font-mono uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                  Active Subscription
                </span>
              )}

              <div>
                {/* Plan Tier Title */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white font-sans">
                    {plan.tier}
                  </h4>
                  {plan.trialDays > 0 && !isCurrent && (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                      {plan.trialDays}-day Trial
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white">
                    ${rate}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    /{billingCycle === BillingCycle.MONTHLY ? 'mo' : 'yr'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 min-h-8">
                  Support Level: <span className="font-semibold text-slate-600 dark:text-slate-300">{plan.supportLevel}</span>
                </p>

                {/* Feature List */}
                <div className="mt-6 space-y-2.5 border-t border-slate-100 dark:border-white/5 pt-4">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Limits & Allocation</p>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>API Calls Limit</span>
                      <span className="font-mono font-medium text-slate-900 dark:text-white">{plan.limits.apiLimits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cloud Storage</span>
                      <span className="font-mono font-medium text-slate-900 dark:text-white">{plan.limits.storageGb} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Campaigns</span>
                      <span className="font-mono font-medium text-slate-900 dark:text-white">{plan.limits.campaignLimits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Datasets</span>
                      <span className="font-mono font-medium text-slate-900 dark:text-white">{plan.limits.datasetLimits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Task Cap</span>
                      <span className="font-mono font-medium text-slate-900 dark:text-white">{plan.limits.taskLimits.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono pt-2">Feature Flags</p>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {Object.entries(plan.features).map(([key, enabled]) => (
                      <li key={key} className="flex items-center gap-2">
                        <Check className={`h-3.5 w-3.5 ${enabled ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-700'}`} />
                        <span className={enabled ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}>
                          {key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePlanSelect(tier)}
                disabled={isCurrent && subscription.cycle === billingCycle}
                className={`mt-6 w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isCurrent && subscription.cycle === billingCycle
                    ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed text-center'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-md hover:scale-[1.01] text-center'
                }`}
              >
                {isCurrent && subscription.cycle === billingCycle ? 'Active Plan' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Auto-renew controls */}
      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/85 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-950 dark:text-white">
            Subscription Auto-Renewal Setting
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            When enabled, the default payment source will automatically be charged on your expiration date: <span className="font-mono text-indigo-500">{subscription.endDate}</span>.
          </p>
        </div>
        <button
          onClick={toggleAutoRenew}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            subscription.autoRenew
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400'
          }`}
        >
          {subscription.autoRenew ? '● Auto-Renew Enabled' : '○ Auto-Renew Disabled'}
        </button>
      </div>
    </div>
  );
}
export default SubscriptionTab;
