/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import { AdminRole } from '../types';

import { OverviewTab } from '../components/OverviewTab';
import { UserManagementTab } from '../components/UserManagementTab';
import { BusinessManagementTab } from '../components/BusinessManagementTab';
import { ContentModerationTab } from '../components/ContentModerationTab';
import { SecurityCenterTab } from '../components/SecurityCenterTab';
import { WithdrawalTab } from '../components/WithdrawalTab';
import { AuditTab } from '../components/AuditTab';
import { NotificationCommandTab } from '../components/NotificationCommandTab';
import { PlatformConfigTab } from '../components/PlatformConfigTab';
import { AnalyticsTab } from '../components/AnalyticsTab';

import {
  Compass,
  Users,
  Building2,
  Shield,
  ShieldAlert,
  Wallet,
  FileText,
  Bell,
  Settings2,
  TrendingUp,
  Search,
  Lock,
  LockKeyhole,
  CheckCircle,
  HelpCircle,
  Clock,
  Radio,
  ExternalLink
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'users'
  | 'business'
  | 'moderation'
  | 'security'
  | 'payouts'
  | 'audits'
  | 'broadcast'
  | 'config'
  | 'analytics';

function AdminConsoleContent() {
  const { role, setRole, users, organizations, securityAlerts } = useAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Global search state
  const [showSearch, setShowSearch] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const tabsConfig = [
    { id: 'overview' as const, label: 'Overview', icon: Compass },
    { id: 'users' as const, label: 'Users Directory', icon: Users },
    { id: 'business' as const, label: 'B2B Clients', icon: Building2 },
    { id: 'moderation' as const, label: 'Moderation Desk', icon: Shield },
    { id: 'security' as const, label: 'Security Center', icon: ShieldAlert },
    { id: 'payouts' as const, label: 'Payout Queues', icon: Wallet },
    { id: 'audits' as const, label: 'Immutable Audits', icon: FileText },
    { id: 'broadcast' as const, label: 'Mass Broadcaster', icon: Bell },
    { id: 'config' as const, label: 'System Config', icon: Settings2 },
    { id: 'analytics' as const, label: 'Analytics Insights', icon: TrendingUp }
  ];

  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'users':
        return <UserManagementTab />;
      case 'business':
        return <BusinessManagementTab />;
      case 'moderation':
        return <ContentModerationTab />;
      case 'security':
        return <SecurityCenterTab />;
      case 'payouts':
        return <WithdrawalTab />;
      case 'audits':
        return <AuditTab />;
      case 'broadcast':
        return <NotificationCommandTab />;
      case 'config':
        return <PlatformConfigTab />;
      case 'analytics':
        return <AnalyticsTab />;
    }
  };

  // Global search filtering
  const searchUsers = users.filter(u => 
    u.username.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(globalSearchTerm.toLowerCase())
  );

  const searchOrgs = organizations.filter(o => 
    o.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
    o.domain.toLowerCase().includes(globalSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/40 dark:bg-[#030303] text-slate-900 dark:text-zinc-150 p-6 space-y-6" id="admin-main-stage">
      
      {/* Header with Global Search, RBAC switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-5">
        <div>
          <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest">
            TaskNova Command Headquarters
          </span>
          <h1 className="text-xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-indigo-500" /> Platform Operational OS
          </h1>
        </div>

        {/* Search button, RBAC Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 px-3.5 py-2 rounded-xl text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer transition-all"
          >
            <Search className="h-4 w-4" /> Search (Ctrl+K)
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400">ACTIVE ROLE:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-transparent outline-none border-none pr-4 cursor-pointer"
            >
              {Object.values(AdminRole).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RBAC disclaimer banner */}
      {role !== AdminRole.OWNER && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>RBAC Restrict Rule Active: You are logged in as <span className="font-bold">{role}</span>. Some core database writes may require Owner authorization.</span>
          </div>
        </div>
      )}

      {/* Top scrollable Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-white/5 overflow-x-auto scrollbar-none gap-1 py-1">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/1'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab staging */}
      <div className="min-h-[500px]">
        {getActiveTabContent()}
      </div>

      {/* Global Search Modal Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 dark:bg-black/75 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#030303] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-5 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Enterprise Directory Search</h3>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setGlobalSearchTerm('');
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-950 dark:hover:text-white px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 cursor-pointer"
              >
                ESC
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              placeholder="Search users, companies, domains, or logs..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white"
            />

            {globalSearchTerm && (
              <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
                {/* Users list */}
                {searchUsers.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase text-slate-400">Users found</span>
                    {searchUsers.map(u => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setActiveTab('users');
                          setShowSearch(false);
                          setGlobalSearchTerm('');
                        }}
                        className="p-2 border border-slate-50 dark:border-white/5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/40 text-xs cursor-pointer flex justify-between items-center"
                      >
                        <span className="font-bold">@{u.username} ({u.email})</span>
                        <span className="text-[10px] text-indigo-500 font-mono">ID: {u.id}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Orgs list */}
                {searchOrgs.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase text-slate-400">Companies found</span>
                    {searchOrgs.map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setActiveTab('business');
                          setShowSearch(false);
                          setGlobalSearchTerm('');
                        }}
                        className="p-2 border border-slate-50 dark:border-white/5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/40 text-xs cursor-pointer flex justify-between items-center"
                      >
                        <span className="font-bold">{o.name} ({o.domain})</span>
                        <span className="text-[10px] text-indigo-500 font-mono">ID: {o.id}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchUsers.length === 0 && searchOrgs.length === 0 && (
                  <p className="text-center text-slate-400 text-xs py-4 font-mono">No matching directory records located.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminConsolePage() {
  return (
    <AdminProvider>
      <AdminConsoleContent />
    </AdminProvider>
  );
}
export default AdminConsolePage;
