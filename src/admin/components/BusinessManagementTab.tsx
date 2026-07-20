/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminOrganization } from '../types';
import {
  Building2,
  Shield,
  CreditCard,
  Layers,
  FileSpreadsheet,
  Settings,
  X,
  Plus,
  TrendingUp,
  Snowflake,
  Play,
  Pause,
  ArrowUpRight,
  Receipt
} from 'lucide-react';

export function BusinessManagementTab() {
  const {
    organizations,
    suspendCompany,
    resumeCompany,
    freezeBilling,
    updateBudgetLimit,
    role: adminRole
  } = useAdmin();

  const [selectedOrg, setSelectedOrg] = useState<AdminOrganization | null>(null);
  const [budgetVal, setBudgetVal] = useState('');
  const [reasonVal, setReasonVal] = useState('');

  const handleSelectOrg = (org: AdminOrganization) => {
    setSelectedOrg(org);
    setBudgetVal(org.budgetLimit.toString());
    setReasonVal('');
  };

  const handleStatusChange = (status: 'Active' | 'Suspended' | 'Billing_Frozen') => {
    if (!selectedOrg) return;
    if (!reasonVal) {
      alert('An audit logging reason is required.');
      return;
    }

    if (status === 'Active') {
      resumeCompany(selectedOrg.id, reasonVal);
      alert(`Company ${selectedOrg.name} has been set to Active status.`);
    } else if (status === 'Suspended') {
      suspendCompany(selectedOrg.id, reasonVal);
      alert(`Company ${selectedOrg.name} has been set to Suspended status.`);
    } else if (status === 'Billing_Frozen') {
      freezeBilling(selectedOrg.id, reasonVal);
      alert(`Company ${selectedOrg.name} billing accounts have been frozen.`);
    }
    setReasonVal('');
    setSelectedOrg(null);
  };

  const handleApplyBudget = () => {
    if (!selectedOrg) return;
    if (!reasonVal) {
      alert('An audit logging reason is required.');
      return;
    }
    const limit = Number(budgetVal);
    if (isNaN(limit) || limit < 0) {
      alert('Please specify a valid positive numeric limit.');
      return;
    }

    updateBudgetLimit(selectedOrg.id, limit, reasonVal);
    alert(`Company budget ceiling recalibrated to $${limit.toLocaleString()}`);
    setReasonVal('');
    setSelectedOrg(null);
  };

  return (
    <div className="space-y-6" id="business-management-panel">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List of Client Organizations */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs lg:col-span-2">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Enterprise B2B Client Directory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Corporate Client</th>
                  <th className="p-4 font-semibold text-right">Budget Consumed</th>
                  <th className="p-4 font-semibold text-center">Campaigns</th>
                  <th className="p-4 font-semibold text-center">API Usage</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {organizations.map((org) => {
                  const spentPercent = Math.min(100, (org.budgetSpent / org.budgetLimit) * 100);
                  return (
                    <tr
                      key={org.id}
                      onClick={() => handleSelectOrg(org)}
                      className={`text-xs hover:bg-slate-50/55 dark:hover:bg-white/1 cursor-pointer transition-all ${
                        selectedOrg?.id === org.id ? 'bg-indigo-50/20 dark:bg-indigo-950/5' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white font-sans">{org.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{org.domain} • ID: {org.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-block text-right">
                          <p className="font-bold font-mono text-slate-800 dark:text-slate-200">${org.budgetSpent.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ ${org.budgetLimit.toLocaleString()}</span></p>
                          <div className="w-24 bg-slate-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mt-1 ml-auto">
                            <div className="bg-indigo-500 h-full" style={{ width: `${spentPercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {org.campaignsCount} <span className="text-[10px] text-slate-400 font-normal">camps</span>
                      </td>
                      <td className="p-4 text-center font-mono font-semibold text-indigo-500">
                        {org.apiCallsCount.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          org.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/15 dark:text-emerald-400'
                            : org.status === 'Suspended'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/15 dark:text-rose-400'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/15 dark:text-blue-400'
                        }`}>
                          {org.status === 'Billing_Frozen' && <Snowflake className="h-3 w-3 shrink-0" />}
                          {org.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate Controls Side Panel */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 shadow-xs h-fit space-y-6">
          {selectedOrg ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                    <Shield className="h-4.5 w-4.5 text-indigo-500" /> B2B Control Panel
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Corporate: <span className="font-bold text-slate-950 dark:text-white">{selectedOrg.name}</span></p>
                </div>
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg cursor-pointer text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status Toggles */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Account status controls</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange('Active')}
                    className="py-2 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <Play className="h-4 w-4" /> Resume
                  </button>
                  <button
                    onClick={() => handleStatusChange('Suspended')}
                    className="py-2 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 rounded-xl flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <Pause className="h-4 w-4" /> Suspend
                  </button>
                  <button
                    onClick={() => handleStatusChange('Billing_Frozen')}
                    className="py-2 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 rounded-xl flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <Snowflake className="h-4 w-4" /> Freeze
                  </button>
                </div>
              </div>

              {/* Budget Override */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Budget Limit recalibration</h4>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-400 uppercase">Spend Ceiling ($)</label>
                  <input
                    type="number"
                    value={budgetVal}
                    onChange={(e) => setBudgetVal(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Auditor reason */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-400 uppercase">Administrative reason *</label>
                <input
                  type="text"
                  required
                  value={reasonVal}
                  onChange={(e) => setReasonVal(e.target.value)}
                  placeholder="e.g. Cleared invoice pending. Recalibrated credits"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleApplyBudget}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer hover:shadow-md transition-all text-center flex items-center justify-center gap-1"
              >
                Apply Budget Change
              </button>

              {/* Invoices list */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/5">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Client Invoice History</h4>
                {selectedOrg.invoices.map((inv) => (
                  <div key={inv.id} className="p-2 border border-slate-50 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-[#030303] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{inv.invoiceNo}</p>
                        <p className="text-[8px] text-slate-400 font-mono mt-0.5">Date: {inv.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold font-mono text-slate-900 dark:text-white">${inv.amount.toLocaleString()}</p>
                      <span className={`text-[8px] font-mono ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'} uppercase font-bold`}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Building2 className="h-8 w-8 mx-auto text-slate-300 dark:text-zinc-800" />
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Corporate Portal</h4>
                <p className="text-[10px] text-slate-400 mt-1">Select a client organization in the left table to suspend APIs, adjust credit limits, freeze accounts, or view ledger billing invoices.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default BusinessManagementTab;
