/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Announcement, AnnouncementType } from '../types';
import { Sparkles, Pin, AlertTriangle, Hammer, RefreshCw, EyeOff, Check, AlertCircle } from 'lucide-react';

export const AnnouncementCenter: React.FC = () => {
  const {
    announcements,
    pinAnnouncement,
    dismissAnnouncement,
    hasPermission
  } = useNotifications();

  const [filter, setFilter] = useState<AnnouncementType | 'all'>('all');

  const visibleAnnouncements = announcements.filter(a => {
    if (a.dismissed) return false;
    if (filter !== 'all' && a.type !== filter) return false;
    return true;
  });

  // Sort: pinned first, then newest timestamp
  const sortedAnnouncements = [...visibleAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const getAnnounceTypeBadge = (type: AnnouncementType) => {
    switch (type) {
      case 'emergency': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'maintenance': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'release': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'feature': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-white/5';
    }
  };

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />;
      case 'maintenance': return <Hammer className="h-4.5 w-4.5 text-amber-400" />;
      case 'release': return <RefreshCw className="h-4.5 w-4.5 text-indigo-400" />;
      default: return <Sparkles className="h-4.5 w-4.5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6" id="announcement-center">
      {/* 1. Filtering row */}
      <div className="bg-slate-900 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Global Broadcast Feeds</h3>
          <p className="text-[11px] text-slate-400">Official product release notes, hotfixes, and maintenance logs.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-lg border border-white/5">
          {(['all', 'release', 'emergency', 'maintenance', 'feature'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded capitalize transition-all ${
                filter === type
                  ? 'bg-indigo-600 text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency banner section (if any active emergency exists) */}
      {sortedAnnouncements.some(a => a.type === 'emergency') && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3.5 animate-pulse">
          <AlertCircle className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Active Regional Cluster Outage Alert</h4>
            <p className="text-[11px] text-rose-400/90 leading-relaxed">
              Google Cloud FireStore syncing streams in regional zones are undergoing replica repairs. Dashboard telemetry feeds may suffer intermittent lag.
            </p>
          </div>
        </div>
      )}

      {/* Announcements Stream */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <div className="py-20 text-center bg-slate-900 border border-white/5 rounded-xl text-slate-500 space-y-2">
            <Sparkles className="h-10 w-10 text-slate-600 mx-auto" />
            <h4 className="text-xs font-semibold text-slate-300">Clean Broadcast Log</h4>
            <p className="text-[11px] text-slate-500">No announcements found for selected category.</p>
          </div>
        ) : (
          sortedAnnouncements.map((announce) => (
            <div
              key={announce.id}
              className={`p-5 bg-slate-900 border rounded-xl space-y-3.5 relative overflow-hidden transition-all hover:border-white/10 ${
                announce.pinned 
                  ? 'border-indigo-500/30 bg-slate-950/40 shadow-[0_0_20px_rgba(99,102,241,0.05)]' 
                  : 'border-white/5'
              }`}
            >
              {announce.pinned && (
                <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl border-l border-b border-indigo-500/20 flex items-center gap-1">
                  <Pin className="h-2.5 w-2.5 fill-current" />
                  <span>Pinned</span>
                </div>
              )}

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-slate-950 border border-white/5 rounded-xl mt-0.5 shrink-0">
                  {getTypeIcon(announce.type)}
                </div>

                <div className="space-y-1 flex-1 min-w-0 pr-16">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-sm font-bold text-slate-200">{announce.title}</h3>
                    <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold tracking-wider ${getAnnounceTypeBadge(announce.type)}`}>
                      {announce.type}
                    </span>
                    {announce.badge && (
                      <span className="bg-indigo-600/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-semibold">
                        {announce.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{announce.content}</p>

                  <div className="text-[10px] text-slate-500 font-mono pt-1">
                    Posted on {new Date(announce.timestamp).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Action pins / dismissals footer row */}
              <div className="flex items-center justify-end gap-3.5 pt-3 border-t border-white/5 text-[11px] text-slate-500">
                <button
                  onClick={() => pinAnnouncement(announce.id)}
                  className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                >
                  <Pin className="h-3.5 w-3.5" />
                  <span>{announce.pinned ? 'Unpin' : 'Pin Announcement'}</span>
                </button>
                <button
                  onClick={() => dismissAnnouncement(announce.id)}
                  className="flex items-center gap-1 text-rose-400/80 hover:text-rose-400 transition-colors"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
