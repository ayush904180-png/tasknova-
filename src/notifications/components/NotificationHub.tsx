/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { NotificationItem, NotificationCategory } from '../types';
import { 
  Bell, CheckCircle, Pin, Archive, Trash2, ShieldAlert, CreditCard, 
  Settings, Award, RefreshCw, Layers, Sparkles, SlidersHorizontal, Eye
} from 'lucide-react';

export const NotificationHub: React.FC = () => {
  const {
    notifications,
    toggleNotificationStatus,
    deleteNotification,
    markAllAsRead,
    hasPermission
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');

  const categories: { value: NotificationCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'system', label: 'System Alerts' },
    { value: 'security', label: 'Security' },
    { value: 'task', label: 'Tasks' },
    { value: 'submission', label: 'Submissions' },
    { value: 'validation', label: 'AI Validation' },
    { value: 'reward', label: 'Reward Intel' },
    { value: 'wallet', label: 'Wallet Logs' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'billing', label: 'Billing Ledger' },
    { value: 'business', label: 'B2B Workspaces' },
    { value: 'campaign', label: 'Campaigns' },
    { value: 'dataset', label: 'Datasets' },
    { value: 'announcement', label: 'Broadcasts' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'developer', label: 'Developer SDK' },
    { value: 'admin', label: 'Admin Control' }
  ];

  const filteredNotifications = notifications.filter(n => {
    // 1. Tab states
    if (activeFilter === 'unread' && n.status !== 'unread') return false;
    if (activeFilter === 'pinned' && n.status !== 'pinned') return false;
    if (activeFilter === 'archived' && n.status !== 'archived') return false;
    if (activeFilter === 'all' && n.status === 'archived') return false; // Hide archived by default in "all"

    // 2. Category dropdown
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;

    return true;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'security': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'billing': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'validation': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'reward': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'dataset': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'campaign': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-white/5';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500/15 text-rose-400 font-bold';
      case 'medium': return 'bg-indigo-500/10 text-indigo-400';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case 'billing': return <CreditCard className="h-4 w-4 text-teal-400" />;
      case 'validation': return <Sparkles className="h-4 w-4 text-indigo-400" />;
      case 'reward': return <Award className="h-4 w-4 text-amber-400" />;
      default: return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6" id="notification-hub">
      {/* Filters Hub Row */}
      <div className="bg-slate-900 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Active Streams' },
            { id: 'unread', label: 'Unread Alert' },
            { id: 'pinned', label: 'Pinned Pins' },
            { id: 'archived', label: 'Archived Folders' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all capitalize ${
                activeFilter === tab.id
                  ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-300'
                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-transparent border-none text-xs font-semibold text-slate-300 focus:ring-0 cursor-pointer outline-none"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-950 text-slate-200">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/60 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      {/* Primary Notifications List */}
      <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden shadow-lg">
        {filteredNotifications.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-2">
            <Bell className="h-10 w-10 text-slate-600 mx-auto" />
            <h4 className="text-xs font-semibold text-slate-300">Clean Alert Ledger</h4>
            <p className="text-[11px] text-slate-500">No active alerts matched the selected filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredNotifications.map((n) => {
              const isUnread = n.status === 'unread';
              return (
                <div
                  key={n.id}
                  className={`p-4 md:p-5 flex gap-4 transition-colors ${
                    isUnread ? 'bg-indigo-950/10' : 'hover:bg-slate-950/20'
                  }`}
                >
                  {/* Category icon indicator */}
                  <div className="p-2.5 bg-slate-950 border border-white/5 rounded-xl shrink-0 h-fit">
                    {getCategoryIcon(n.category)}
                  </div>

                  {/* Message body */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-200 leading-snug">{n.title}</h4>
                      {isUnread && (
                        <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full shrink-0 animate-pulse" />
                      )}
                      
                      <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold tracking-wider ${getCategoryBadge(n.category)}`}>
                        {n.category}
                      </span>

                      <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold ${getPriorityBadge(n.priority)}`}>
                        {n.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{n.message}</p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                      <span>Dispatched by: {n.sender || 'System'}</span>
                      <span>•</span>
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {n.status !== 'read' && (
                      <button
                        onClick={() => toggleNotificationStatus(n.id, 'read')}
                        className="p-1.5 hover:bg-slate-950/60 rounded text-slate-400 hover:text-indigo-400 transition-colors"
                        title="Mark as Read"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleNotificationStatus(n.id, n.status === 'pinned' ? 'read' : 'pinned')}
                      className={`p-1.5 hover:bg-slate-950/60 rounded transition-colors ${
                        n.status === 'pinned' ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
                      }`}
                      title="Pin alert"
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleNotificationStatus(n.id, n.status === 'archived' ? 'read' : 'archived')}
                      className={`p-1.5 hover:bg-slate-950/60 rounded transition-colors ${
                        n.status === 'archived' ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-400'
                      }`}
                      title="Archive alert"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="p-1.5 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
