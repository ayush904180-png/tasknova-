/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useBilling } from '../context/BillingContext';
import { PLANS_REGISTRY } from '../services/BillingService';
import {
  CreditCard,
  TrendingUp,
  Cpu,
  Coins,
  Shield,
  Activity,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { BillingRole } from '../types';

export function DashboardTab() {
  const {
    subscription,
    creditState,
    budget,
    usageMetrics,
    role,
    setRole,
    simulateUsage,
    paymentMethods
  } = useBilling();

  const activePlanDetails = PLANS_REGISTRY[subscription.tier];

  // Dynamic estimate: $0.001 per API call, $0.05 per storage GB, $0.02 per AI run
  const calculatedSpend = Number(
    (
      (usageMetrics.apiCallsCount / 1000) * 1.0 +
      usageMetrics.storageUsedGb * 0.05 +
      usageMetrics.aiValidationRunsCount * 0.02
    ).toFixed(2)
  );

  const budgetProgress = Math.min((calculatedSpend / budget.monthlyBudget) * 100, 100);

  const defaultPm = paymentMethods.find(pm => pm.isDefault) || paymentMethods[0];

  const handleSimulateApiCall = () => {
    simulateUsage({ apiCallsCount: 1500, bandwidthGb: 1.2 });
  };

  const handleSimulateAiRun = () => {
    simulateUsage({ aiValidationRunsCount: 25, storageUsedGb: 0.5 });
  };

  const handleSimulateCampaign = () => {
    simulateUsage({ campaignsCount: 1, datasetsCount: 1, generatedTasksCount: 200 });
  };

  return (
    <div className="space-y-6" id="billing-dashboard-container">
      {/* Role Play / Simulation Banner (for the evaluator/user) */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white font-sans">
              Billing Role Simulation Control
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Switch roles to experience granular billing authorization limits (RBAC checks).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Current Persona:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as BillingRole)}
            className="text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {Object.values(BillingRole).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan Summary */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 text-slate-900 dark:text-white">
            <Shield className="h-24 w-24" />
          </div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Current Account Plan</p>
          <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">
            {subscription.tier}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Renewal Cycle: <span className="font-semibold text-slate-700 dark:text-slate-300">{subscription.cycle}</span>
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Rate: ${subscription.price}/cycle</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              {subscription.status}
            </span>
          </div>
        </div>

        {/* Spend Meter */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Dynamic Estimated Spend</p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Limit: ${budget.monthlyBudget}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
              ${calculatedSpend.toFixed(2)}
            </h3>
            <span className="text-xs text-indigo-500 font-mono flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> 14.8%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetProgress > 90 ? 'bg-rose-500' : budgetProgress > 75 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${budgetProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-mono">
              <span>{budgetProgress.toFixed(1)}% Consumed</span>
              <span>Forecast: ${budget.forecastedSpend.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Credit System Wallet */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 text-slate-900 dark:text-white">
            <Coins className="h-24 w-24" />
          </div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">SaaS Credit Balance</p>
          <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">
            ${creditState.balance.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Available for automated invoice offsets.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Ledgers: {creditState.ledger.length}</span>
            <span className="text-xs text-indigo-500 font-medium">Auto-apply enabled</span>
          </div>
        </div>
      </div>

      {/* Gateway Configuration Overview & Live Metering Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Default Gateway */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-indigo-500" /> Default Payment Gateway
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            The gateway utilized to offset renewal subscription invoices.
          </p>

          {defaultPm ? (
            <div className="mt-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-xs font-mono">
                  {defaultPm.type === 'Stripe' ? 'ST' : 'UP'}
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {defaultPm.type === 'Stripe' ? `Visa ending in ${defaultPm.details.last4}` : defaultPm.details.upiId}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">Added: {new Date(defaultPm.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                Active Default
              </span>
            </div>
          ) : (
            <div className="mt-4 text-center py-6 border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
              <p className="text-xs text-slate-400">No payment methods added yet.</p>
            </div>
          )}
        </div>

        {/* Live Simulator Panel */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" /> Sandbox Telemetry Simulator
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate actual cloud platform activities to watch metering progress in real time.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <button
              onClick={handleSimulateApiCall}
              className="text-[11px] font-medium bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 px-3 border border-slate-100 dark:border-white/5 rounded-xl cursor-pointer transition-colors text-center"
            >
              +1,500 APIs
            </button>
            <button
              onClick={handleSimulateAiRun}
              className="text-[11px] font-medium bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 px-3 border border-slate-100 dark:border-white/5 rounded-xl cursor-pointer transition-colors text-center"
            >
              +25 AI Runs
            </button>
            <button
              onClick={handleSimulateCampaign}
              className="text-[11px] font-medium bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 px-3 border border-slate-100 dark:border-white/5 rounded-xl cursor-pointer transition-colors text-center"
            >
              +1 Campaign Pack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
