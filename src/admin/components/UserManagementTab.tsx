/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminUser } from '../types';
import {
  Search,
  Filter,
  Shield,
  Key,
  Ban,
  UserCheck,
  Award,
  Wallet,
  Clock,
  Laptop,
  CheckCircle,
  AlertOctagon,
  X,
  Zap,
  RotateCcw
} from 'lucide-react';

export function UserManagementTab() {
  const {
    users,
    suspendUser,
    unsuspendUser,
    banUser,
    adjustReputation,
    resetCredentials,
    role: adminRole
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended' | 'Banned'>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'contributor' | 'creator' | 'admin'>('All');

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [reputationVal, setReputationVal] = useState('');
  const [trustVal, setTrustVal] = useState('');
  const [reasonVal, setReasonVal] = useState('');
  const [detailsTab, setDetailsTab] = useState<'sessions' | 'history' | 'wallet'>('sessions');

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSelectUser = (user: AdminUser) => {
    setSelectedUser(user);
    setReputationVal(user.reputation.toString());
    setTrustVal(user.trustScore.toString());
    setReasonVal('');
  };

  const handleApplyStatusChange = (status: 'Active' | 'Suspended' | 'Banned') => {
    if (!selectedUser) return;
    if (!reasonVal) {
      alert('An administrative auditing reason must be specified for logging.');
      return;
    }

    if (status === 'Active') {
      unsuspendUser(selectedUser.id, reasonVal);
      alert(`User ${selectedUser.username} status set to Active.`);
    } else if (status === 'Suspended') {
      suspendUser(selectedUser.id, reasonVal);
      alert(`User ${selectedUser.username} status set to Suspended.`);
    } else if (status === 'Banned') {
      banUser(selectedUser.id, reasonVal);
      alert(`User ${selectedUser.username} status set to Banned.`);
    }
    setReasonVal('');
    setSelectedUser(null);
  };

  const handleApplyReputationChange = () => {
    if (!selectedUser) return;
    if (!reasonVal) {
      alert('An administrative auditing reason must be specified.');
      return;
    }
    const rep = Number(reputationVal);
    const trust = Number(trustVal);
    if (isNaN(rep) || isNaN(trust)) {
      alert('Reputation and Trust Score values must be valid numeric values.');
      return;
    }

    adjustReputation(selectedUser.id, rep, trust, reasonVal);
    alert(`Reputation successfully set to ${rep}, Trust Score set to ${trust}%`);
    setReasonVal('');
    setSelectedUser(null);
  };

  const handleCredentialReset = (type: '2FA' | 'Password') => {
    if (!selectedUser) return;
    if (!reasonVal) {
      alert('An auditing reason must be provided.');
      return;
    }

    resetCredentials(selectedUser.id, type, reasonVal);
    alert(`Security override: User's ${type} reset command dispatched successfully.`);
    setReasonVal('');
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6" id="user-management-panel">
      {/* Search & filters panel */}
      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by ID, email, or username..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status filters */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-1 shrink-0">
            {(['All', 'Active', 'Suspended', 'Banned'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Role filters */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-1 shrink-0">
            {(['All', 'contributor', 'creator', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase ${
                  roleFilter === r
                    ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-950'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: list + drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User list table */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold">User details</th>
                  <th className="p-4 font-semibold">Security Role</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Reputation</th>
                  <th className="p-4 font-semibold text-right">Trust Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`text-xs hover:bg-slate-50/55 dark:hover:bg-white/1 cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? 'bg-indigo-50/20 dark:bg-indigo-950/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <h4 className="font-bold text-slate-900 dark:text-white font-sans">{user.username}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.email} • ID: {user.id}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-sm uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/15 dark:text-emerald-400'
                          : user.status === 'Suspended'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/15 dark:text-amber-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/15 dark:text-rose-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Suspended' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                      {user.reputation.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-indigo-500">
                      {user.trustScore}%
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                      No matching user records detected in the active directory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Administration side drawer/panel */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 shadow-xs h-fit space-y-6">
          {selectedUser ? (
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                    <Shield className="h-4.5 w-4.5 text-indigo-500" /> Administrative Console
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Editing: <span className="font-bold text-slate-900 dark:text-white">@{selectedUser.username}</span></p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg cursor-pointer text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Quick metrics */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50/55 dark:bg-slate-900/10 border border-slate-100 dark:border-white/5 p-3 rounded-xl">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400">Wallet balance</span>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">${selectedUser.walletBalance.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400">Total earned</span>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">${selectedUser.rewardsEarned.toFixed(2)}</p>
                </div>
              </div>

              {/* Reason audit input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Audit Logging Reason *</label>
                <input
                  type="text"
                  required
                  value={reasonVal}
                  onChange={(e) => setReasonVal(e.target.value)}
                  placeholder="e.g. Cleared automated bot security warning"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* Option tabs */}
              <div className="flex border-b border-slate-100 dark:border-white/5">
                {(['sessions', 'history', 'wallet'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailsTab(tab)}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase border-b-2 cursor-pointer transition-all ${
                      detailsTab === tab
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab contents */}
              {detailsTab === 'sessions' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Credential overrides & status</h4>
                  
                  {/* Status update buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleApplyStatusChange('Active')}
                      className="py-2 px-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4" /> Activate
                    </button>
                    <button
                      onClick={() => handleApplyStatusChange('Suspended')}
                      className="py-2 px-1 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 rounded-xl flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Ban className="h-4 w-4" /> Suspend
                    </button>
                    <button
                      onClick={() => handleApplyStatusChange('Banned')}
                      className="py-2 px-1 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 rounded-xl flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <AlertOctagon className="h-4 w-4" /> Ban User
                    </button>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Security bypasses</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCredentialReset('Password')}
                        className="flex-1 py-2 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Key className="h-3.5 w-3.5" /> Reset Pass
                      </button>
                      <button
                        onClick={() => handleCredentialReset('2FA')}
                        className="flex-1 py-2 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Shield className="h-3.5 w-3.5" /> Reset 2FA
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Active sessions</h4>
                    {selectedUser.sessions.map((sess) => (
                      <div key={sess.id} className="p-2 border border-slate-50 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-[#030303] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Laptop className="h-3.5 w-3.5 text-slate-400" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{sess.device}</p>
                            <p className="text-[8px] text-slate-400 font-mono mt-0.5">IP: {sess.ip}</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-slate-400">{new Date(sess.lastActive).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailsTab === 'history' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Reputation Calibration</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 uppercase">Reputation XP</label>
                      <input
                        type="number"
                        value={reputationVal}
                        onChange={(e) => setReputationVal(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 uppercase">Trust score (%)</label>
                      <input
                        type="number"
                        value={trustVal}
                        onChange={(e) => setTrustVal(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleApplyReputationChange}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer hover:shadow-md transition-all text-center flex items-center justify-center gap-1"
                  >
                    <Award className="h-4 w-4" /> Save Score Settings
                  </button>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">RLHF Annotation History</h4>
                    {selectedUser.validationHistory.map((val, idx) => (
                      <div key={idx} className="p-2 border border-slate-50 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-[#030303] flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">ID: {val.taskId}</p>
                          <p className="text-[8px] text-slate-400 font-mono mt-0.5">Date: {val.date}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          val.result === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {val.result}
                        </span>
                      </div>
                    ))}
                    {selectedUser.validationHistory.length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-2">No historical validation actions logged.</p>
                    )}
                  </div>
                </div>
              )}

              {detailsTab === 'wallet' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Corporate & Billing logs</h4>
                  {selectedUser.billingDetails.map((bill) => (
                    <div key={bill.invoiceId} className="p-3 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/20 dark:bg-slate-900/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-indigo-500" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Invoice: {bill.invoiceId}</p>
                          <p className="text-[8px] text-slate-400 font-mono mt-0.5">Date: {bill.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold font-mono text-slate-900 dark:text-white">${bill.amount.toFixed(2)}</p>
                        <span className="text-[8px] font-mono text-emerald-500 uppercase">{bill.status}</span>
                      </div>
                    </div>
                  ))}
                  {selectedUser.billingDetails.length === 0 && (
                    <p className="text-[10px] text-slate-400 text-center py-4">No commercial invoices matched.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Shield className="h-8 w-8 mx-auto text-slate-300 dark:text-zinc-800" />
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Administrative Workspace</h4>
                <p className="text-[10px] text-slate-400 mt-1">Select a user account in the adjacent ledger to begin credentials overrides, reputation calibrating, or status freezes.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default UserManagementTab;
