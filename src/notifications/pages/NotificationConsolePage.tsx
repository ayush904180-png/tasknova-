/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NotificationProvider, useNotifications } from '../context/NotificationContext';
import { NotificationHub } from '../components/NotificationHub';
import { MessageCenter } from '../components/MessageCenter';
import { AnnouncementCenter } from '../components/AnnouncementCenter';
import { AutomationEngine } from '../components/AutomationEngine';
import { CampaignBuilder } from '../components/CampaignBuilder';
import { TemplateManager } from '../components/TemplateManager';
import { CommandPalette } from '../components/CommandPalette';
import { GoogleCloudAdapters } from '../adapters/GoogleCloudAdapters';
import { 
  Bell, MessageSquare, Sparkles, Cpu, Send, FileText, Database, Shield, 
  Wifi, WifiOff, RefreshCw, KeyRound, Radio, Activity, Terminal
} from 'lucide-react';
import { NotificationRbacRole } from '../types';

const NotificationConsoleInner: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    rbacRole,
    setRbacRole,
    hasPermission,
    isOnline,
    setIsOnline,
    latencyMs,
    onlineUserCount,
    offlineQueue,
    syncingGcp,
    triggerGcpSync,
    setSearchModalOpen
  } = useNotifications();

  // Roles mapper list
  const roles: NotificationRbacRole[] = [
    'Owner', 'Super Admin', 'Business', 'Moderator', 'Support', 'Finance', 'Developer', 'Auditor', 'Read Only'
  ];

  const handleForceSync = async () => {
    if (!isOnline) {
      alert('You must toggle Online mode to flush local mutations to firestore.');
      return;
    }
    await triggerGcpSync();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6" id="notification-console-container">
      {/* 1. Header Command Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">TaskNova Comms Node</span>
            <span className="text-slate-500">•</span>
            <button 
              onClick={() => setSearchModalOpen(true)}
              className="text-[10px] text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-white/10 px-2 py-0.5 rounded flex items-center gap-1"
            >
              <span>Global Index Search</span>
              <kbd className="bg-slate-900 px-1 py-0.2 text-[9px] rounded font-sans">Ctrl + K</kbd>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Enterprise Dispatch & Engagement OS</h1>
          <p className="text-xs text-slate-400">
            Secure full-stack routing matrix for user notifications, Slack webhook automations, FCM mobile pushes, and linguistic campaign builders.
          </p>
        </div>

        {/* Real-time sync panel and status togglers */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Online/Offline Simulator Switch */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
            title="Toggle system network simulator"
          >
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 animate-pulse" />
                <span>Online Stream Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                <span>Local Offline Mode</span>
              </>
            )}
          </button>

          {/* Offline Queue Badge */}
          {offlineQueue.length > 0 && (
            <button
              onClick={handleForceSync}
              disabled={syncingGcp}
              className="flex items-center gap-1.5 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg font-bold animate-pulse"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncingGcp ? 'animate-spin' : ''}`} />
              <span>Flush {offlineQueue.length} Mutations</span>
            </button>
          )}

          {/* RBAC Role Selector dropdown */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
            <KeyRound className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <select
              value={rbacRole}
              onChange={(e) => setRbacRole(e.target.value as any)}
              className="bg-transparent border-none text-xs font-semibold text-slate-300 focus:ring-0 outline-none cursor-pointer"
            >
              {roles.map(r => (
                <option key={r} value={r} className="bg-slate-950 text-slate-200">{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Communication Segments Tab Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-3 bg-slate-900 border border-white/5 rounded-xl p-3 space-y-4 shadow-lg">
          <div className="px-2 pt-1 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Comms Modules</span>
            <span className="text-[9px] text-slate-500 font-mono">latency: {isOnline ? `${latencyMs}ms` : 'N/A'}</span>
          </div>

          <div className="space-y-0.5">
            {[
              { id: 'notifications', label: 'Alerts Inbox', icon: <Bell className="h-3.5 w-3.5" />, perm: 'read' },
              { id: 'messages', label: 'Support Threads', icon: <MessageSquare className="h-3.5 w-3.5" />, perm: 'read' },
              { id: 'announcements', label: 'Broadcast Notes', icon: <Sparkles className="h-3.5 w-3.5" />, perm: 'read' },
              { id: 'automation', label: 'Rule Automations', icon: <Cpu className="h-3.5 w-3.5" />, perm: 'rules' },
              { id: 'campaigns', label: 'Target Campaigns', icon: <Send className="h-3.5 w-3.5" />, perm: 'campaigns' },
              { id: 'templates', label: 'Asset Templates', icon: <FileText className="h-3.5 w-3.5" />, perm: 'templates' },
              { id: 'gcp_logs', label: 'Google Cloud Node', icon: <Database className="h-3.5 w-3.5" />, perm: 'gcp' }
            ].map(tab => {
              const isAllowed = hasPermission(tab.perm);
              const isActive = activeTab === tab.id;

              if (!isAllowed) return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all border ${
                    isActive
                      ? 'bg-indigo-600/15 border-indigo-500/20 text-indigo-300'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/5 px-2 space-y-1 text-[10px] text-slate-500">
            <div className="flex justify-between">
              <span>Identity Role:</span>
              <span className="font-bold text-indigo-400">{rbacRole}</span>
            </div>
            <div className="flex justify-between">
              <span>Online Nodes:</span>
              <span className="font-bold text-emerald-400">{onlineUserCount} peers</span>
            </div>
          </div>
        </div>

        {/* 3. Main Workspace Display Area */}
        <div className="lg:col-span-9 space-y-6">
          {activeTab === 'notifications' && <NotificationHub />}
          {activeTab === 'messages' && <MessageCenter />}
          {activeTab === 'announcements' && <AnnouncementCenter />}
          {activeTab === 'automation' && <AutomationEngine />}
          {activeTab === 'campaigns' && <CampaignBuilder />}
          {activeTab === 'templates' && <TemplateManager />}

          {/* GCP Logs / Pipeline Adapter Tab */}
          {activeTab === 'gcp_logs' && (
            <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-5 shadow-lg animate-fade-in" id="gcp-logs-tab">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-200">Google Cloud Integration Logs</h3>
                  <p className="text-xs text-slate-400 font-mono">Telemetry outputs from Firebase, BigQuery, FCM, Sheets, and Drive API adapters.</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded border border-white/5">
                    Storage Ref: firebase_applet_config.xml
                  </span>
                </div>
              </div>

              {/* Logs Stream */}
              <div className="space-y-3 font-mono text-[11px] max-h-[440px] overflow-y-auto pr-1 scrollbar-thin">
                {GoogleCloudAdapters.getLogs().map((l) => (
                  <div key={l.id} className="p-3 bg-slate-950/60 border border-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/10 transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-1 bg-slate-900 border border-white/10 rounded font-bold text-[9px] text-indigo-400 uppercase shrink-0 mt-0.5">
                        {l.service}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-slate-300 font-bold flex items-center gap-2">
                          <span>{l.operation}</span>
                          <span className={`text-[9px] font-bold ${
                            l.status === 'SUCCESS' ? 'text-emerald-400' : l.status === 'ERROR' ? 'text-rose-400' : 'text-amber-400'
                          }`}>
                            [{l.status}]
                          </span>
                        </div>
                        <p className="text-slate-400 leading-normal truncate">{l.message}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-600 shrink-0 self-end sm:self-center">
                      {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ctrl + K command palette overlay */}
      <CommandPalette />
    </div>
  );
};

export const NotificationConsolePage: React.FC = () => {
  return (
    <NotificationProvider>
      <NotificationConsoleInner />
    </NotificationProvider>
  );
};
