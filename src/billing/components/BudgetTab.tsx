/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { Settings, AlertTriangle, Play, Pause } from 'lucide-react';
import { BillingRole } from '../types';

export function BudgetTab() {
  const { budget, updateBudget, role } = useBilling();

  const [monthly, setMonthly] = useState<string>(budget.monthlyBudget.toString());
  const [campaign, setCampaign] = useState<string>(budget.campaignBudget.toString());
  const [department, setDepartment] = useState<string>(budget.departmentBudget.toString());
  const [alerts, setAlerts] = useState<boolean>(budget.alertsEnabled);
  const [autoPause, setAutoPause] = useState<boolean>(budget.autoPause);

  const canEdit = [BillingRole.OWNER, BillingRole.FINANCE].includes(role);

  const handleSave = () => {
    if (!canEdit) {
      alert('Unauthorized: You must switch to the "Owner" or "Finance" persona to modify company budgets.');
      return;
    }

    updateBudget({
      monthlyBudget: Number(monthly),
      campaignBudget: Number(campaign),
      departmentBudget: Number(department),
      alertsEnabled: alerts,
      autoPause: autoPause
    });

    alert('Corporate budgets saved and thresholds re-balanced successfully.');
  };

  return (
    <div className="space-y-6" id="budget-management-console">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-500" /> Budget Configuration Console
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control organizational spending, activate alerts, or enable auto-pausing safeguards.
          </p>
        </div>

        {!canEdit && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" /> Read-only mode
          </div>
        )}
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
          <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wide">
            Monthly Recurring Budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">$</span>
            <input
              type="number"
              disabled={!canEdit}
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 disabled:opacity-75 border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-2.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <p className="text-[10px] text-slate-400">Controls maximum standard API and server billing.</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
          <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wide">
            Campaign Allocation Budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">$</span>
            <input
              type="number"
              disabled={!canEdit}
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 disabled:opacity-75 border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-2.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <p className="text-[10px] text-slate-400">Caps task-related payouts across campaigns.</p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
          <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wide">
            Department Shared Budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">$</span>
            <input
              type="number"
              disabled={!canEdit}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 disabled:opacity-75 border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-2.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <p className="text-[10px] text-slate-400">Hard limit allocated to internal development.</p>
        </div>
      </div>

      {/* Safeguards / Toggles */}
      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-6">
        <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wide">
          Safe Mode Threshold Settings
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email / slack alerts */}
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              disabled={!canEdit}
              id="budget-alerts"
              checked={alerts}
              onChange={(e) => setAlerts(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 border-slate-300 dark:border-white/10 rounded-sm cursor-pointer"
            />
            <div>
              <label htmlFor="budget-alerts" className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                Enable Alert Notifications
              </label>
              <p className="text-[10px] text-slate-400 mt-1">
                Trigger secure webhooks & emails when spend hits 50%, 80%, and 90% thresholds.
              </p>
            </div>
          </div>

          {/* Auto Pause */}
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              disabled={!canEdit}
              id="budget-autopause"
              checked={autoPause}
              onChange={(e) => setAutoPause(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 border-slate-300 dark:border-white/10 rounded-sm cursor-pointer"
            />
            <div>
              <label htmlFor="budget-autopause" className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                Enforce Hard Auto-Pause
              </label>
              <p className="text-[10px] text-slate-400 mt-1">
                Instantly freeze all outbound active task campaigns and API endpoints when spend reaches 100% of budget.
              </p>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
            <button
              onClick={handleSave}
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl cursor-pointer hover:shadow-md transition-all"
            >
              Save Financial Budget
            </button>
          </div>
        )}
      </div>

      {/* Forecast Visualizer */}
      <div className="bg-indigo-50/25 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-950/40 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Cost Costing & Spending Warning
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Your current dynamic cloud consumption forecasts <span className="font-semibold text-slate-900 dark:text-white">${budget.forecastedSpend.toFixed(2)}</span> of spending this cycle. This remains within your monthly recurring cap of <span className="font-semibold text-slate-900 dark:text-white">${budget.monthlyBudget.toFixed(2)}</span>. No automated freeze blocks are scheduled.
          </p>
        </div>
      </div>
    </div>
  );
}
export default BudgetTab;
