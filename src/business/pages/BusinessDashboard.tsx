/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Sparkles, TrendingUp, Layers, Database, CreditCard, 
  Users, ShieldCheck, Zap, Lock, Eye, AlertCircle, Bell, MailOpen, Check
} from 'lucide-react';
import { BusinessProvider, useBusiness } from '../context/BusinessContext';
import { BusinessDashboardView } from '../components/BusinessDashboardView';
import { CampaignManagerView } from '../components/CampaignManagerView';
import { DatasetManager } from '../components/DatasetManager';
import { BillingCenterView } from '../components/BillingCenterView';
import { ContributorMonitorView } from '../components/ContributorMonitorView';
import { AuditLogConsole } from '../components/AuditLogConsole';
import { DeveloperToolsConsole } from '../components/DeveloperToolsConsole';
import { CampaignWizard } from '../components/CampaignWizard';
import { ROLE_PERMISSIONS } from '../utils/permissions';

type TabId = 'telemetry' | 'pipelines' | 'datasets' | 'billing' | 'contributors' | 'audits' | 'sandbox';

const BusinessDashboardContent: React.FC = () => {
  const { currentRole, campaigns } = useBusiness();
  const [activeTab, setActiveTab] = useState<TabId>('telemetry');
  const [showWizard, setShowWizard] = useState(false);

  // Smart Notification Center State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'billing' | 'workflow' | 'sla' | 'system'>('all');
  const [notifications, setNotifications] = useState([
    { id: 'not_01', category: 'billing', message: 'Invoice #INV-9014 paid. $24,500.00 standard credit replenishment completed.', time: '5 mins ago', unread: true },
    { id: 'not_02', category: 'workflow', message: 'Campaign "Model Red-Teaming Jailbreak Evaluation" approved by AI pre-validation model.', time: '1 hour ago', unread: true },
    { id: 'not_03', category: 'sla', message: 'SLA warning: Consensus latency spiked to 4.12m on gold-tier contributor tracks.', time: '2 hours ago', unread: false },
    { id: 'not_04', category: 'system', message: 'Emergency systems stress-test successfully launched on sandbox cluster.', time: '1 day ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Read permission parameters
  const permissions = ROLE_PERMISSIONS[currentRole];

  // Helper stats
  const activeCount = campaigns.filter((c) => c.status === 'published').length;

  return (
    <div className="space-y-6 relative">
      
      {/* Top Banner and Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-500" />
            <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">TaskNova Corporate Workspace</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-bold uppercase">
              Enterprise SaaS
            </span>
          </div>
          <p className="text-xs text-slate-400">AI campaign orchestration, human alignment datasets validator, and corporate treasury ledger.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-mono">Operator Compliance Scope</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center justify-end gap-1">
              <Lock className="h-3 w-3 text-indigo-400" />
              {currentRole.replace('_', ' ')}
            </p>
          </div>

          {/* Dynamic Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-indigo-500/40 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-slate-100 dark:ring-[#131316] animate-pulse" />
              )}
            </button>

            {/* Slide Down Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/10 rounded-2xl w-80 shadow-2xl z-50 p-4 space-y-3 font-sans"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-xs font-bold font-display text-slate-950 dark:text-white flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5 text-indigo-400" /> Notifications Center
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[9px] text-indigo-400 hover:text-indigo-300 font-mono uppercase font-bold flex items-center gap-0.5"
                      >
                        <Check className="h-2.5 w-2.5" /> Read All
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-1 overflow-x-auto pb-1 text-[8px] font-mono uppercase tracking-wide">
                    {(['all', 'billing', 'workflow', 'sla', 'system'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNotificationFilter(cat)}
                        className={`px-1.5 py-0.5 rounded border transition-all ${
                          notificationFilter === cat
                            ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold'
                            : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Notifications list */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {notifications
                      .filter(n => notificationFilter === 'all' || n.category === notificationFilter)
                      .length === 0 ? (
                        <p className="text-[10px] text-slate-500 text-center py-4 font-mono">No notifications in this ledger category.</p>
                      ) : (
                        notifications
                          .filter(n => notificationFilter === 'all' || n.category === notificationFilter)
                          .map((not) => (
                            <div
                              key={not.id}
                              className={`p-2 rounded-xl border relative group transition-all text-[11px] leading-relaxed ${
                                not.unread 
                                  ? 'bg-indigo-500/5 border-indigo-500/20 text-slate-900 dark:text-slate-200' 
                                  : 'bg-white/5 border-white/5 text-slate-500'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className={`text-[8px] uppercase font-mono px-1 rounded ${
                                  not.category === 'billing' ? 'bg-emerald-500/10 text-emerald-400' :
                                  not.category === 'workflow' ? 'bg-indigo-500/10 text-indigo-400' :
                                  not.category === 'sla' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {not.category}
                                </span>
                                <span className="text-[8px] text-slate-500 font-mono">{not.time}</span>
                              </div>
                              <p className="mt-1 font-sans">{not.message}</p>
                              <button
                                onClick={() => deleteNotification(not.id)}
                                className="absolute top-1 right-1 text-slate-600 hover:text-rose-400 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Dismiss"
                              >
                                ✕
                              </button>
                            </div>
                          ))
                      )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {permissions.canCreateCampaign && (
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-display text-xs rounded-xl cursor-pointer shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Campaign Architect
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#131316] border border-slate-200 dark:border-white/5 p-1 rounded-xl overflow-x-auto">
        {[
          { id: 'telemetry', label: 'Executive Telemetry', icon: TrendingUp },
          { id: 'pipelines', label: 'Campaign Pipelines', icon: Layers },
          { id: 'datasets', label: 'Dataset Repositories', icon: Database },
          { id: 'billing', label: 'Billing & Ledger', icon: CreditCard },
          { id: 'contributors', label: 'Contributor Nodes', icon: Users },
          { id: 'audits', label: 'Security Audit', icon: ShieldCheck },
          { id: 'sandbox', label: 'Developer Sandbox', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 font-semibold' 
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5 text-indigo-400" />
              {tab.label}
              {tab.id === 'pipelines' && activeCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Primary Tab View Panel Wrapper */}
      <div className="min-h-[480px]">
        {activeTab === 'telemetry' && <BusinessDashboardView />}
        {activeTab === 'pipelines' && <CampaignManagerView onOpenWizard={() => setShowWizard(true)} />}
        {activeTab === 'datasets' && <DatasetManager />}
        {activeTab === 'billing' && <BillingCenterView />}
        {activeTab === 'contributors' && <ContributorMonitorView />}
        {activeTab === 'audits' && <AuditLogConsole />}
        {activeTab === 'sandbox' && <DeveloperToolsConsole />}
      </div>

      {/* Full-screen Campaign Architect Wizard Overlay Modal */}
      <AnimatePresence>
        {showWizard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <CampaignWizard onClose={() => setShowWizard(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export const BusinessDashboard: React.FC = () => {
  return (
    <BusinessProvider>
      <BusinessDashboardContent />
    </BusinessProvider>
  );
};
