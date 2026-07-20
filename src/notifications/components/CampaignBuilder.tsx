/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { CampaignFilters, ChannelId, CampaignStatus } from '../types';
import { 
  Send, Users, CheckCircle2, RefreshCw, BarChart, Sliders, Play, Pause, Save, Check
} from 'lucide-react';

export const CampaignBuilder: React.FC = () => {
  const {
    campaigns,
    createCampaign,
    toggleCampaignStatus,
    channels
  } = useNotifications();

  // Campaign Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [role, setRole] = useState('Contributor');
  const [language, setLanguage] = useState('German');
  const [trustLevel, setTrustLevel] = useState(90);
  const [selectedChannels, setSelectedChannels] = useState<ChannelId[]>(['email', 'push']);
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [status, setStatus] = useState<CampaignStatus>('draft');
  const [targetCount, setTargetCount] = useState(1200);

  const [success, setSuccess] = useState(false);

  const handleChannelToggle = (id: ChannelId) => {
    setSelectedChannels(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    createCampaign({
      title,
      content,
      status,
      filters: {
        role,
        language,
        trustLevel
      },
      channels: selectedChannels,
      targetCount,
      recurring
    });

    setTitle('');
    setContent('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const getStatusBadge = (stat: CampaignStatus) => {
    switch (stat) {
      case 'published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'paused': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'completed': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-white/5';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="campaign-builder">
      {/* Target/Build Form (cols 5) */}
      <div className="lg:col-span-5 bg-slate-900 border border-white/5 rounded-xl p-5 space-y-5 shadow-lg">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Send className="h-4.5 w-4.5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">Campaign Dispatcher</h3>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400 font-semibold">Campaign Subject</label>
            <input
              type="text"
              placeholder="e.g. Q3 Contributor Quality Newsletter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400 font-semibold">Copy / Message Body</label>
            <textarea
              placeholder="Compose campaign notification markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Filters Accordion/Bento */}
          <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1">
              <Sliders className="h-3 w-3" />
              Audience Filter Segments
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase text-slate-500 font-bold">Target Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-[11px] text-slate-300 outline-none"
                >
                  <option value="Contributor">Contributor Only</option>
                  <option value="Business">Business Only</option>
                  <option value="Moderator">Moderator Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase text-slate-500 font-bold">Language Group</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-[11px] text-slate-300 outline-none"
                >
                  <option value="German">German</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Japanese">Japanese</option>
                  <option value="All">All Regions</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] uppercase text-slate-500 font-bold">
                <span>Min Trust Level</span>
                <span className="text-indigo-400">{trustLevel}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={trustLevel}
                onChange={(e) => setTrustLevel(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Delivery Channels Checklist */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase text-slate-400 font-semibold">Delivery Channels</label>
            <div className="flex flex-wrap gap-1.5">
              {['email', 'push', 'slack', 'gchat'].map((chan) => {
                const isActive = selectedChannels.includes(chan as ChannelId);
                return (
                  <button
                    key={chan}
                    type="button"
                    onClick={() => handleChannelToggle(chan as ChannelId)}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all uppercase ${
                      isActive 
                        ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' 
                        : 'bg-slate-950 border-white/10 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {chan}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target volume and scheduling */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 font-semibold">Estimated Volume</label>
              <input
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 100)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 font-semibold">Frequency</label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
              >
                <option value="none">One Shot</option>
                <option value="daily">Daily Cron</option>
                <option value="weekly">Weekly Cron</option>
                <option value="monthly">Monthly Cron</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              onClick={() => setStatus('draft')}
              className="flex items-center justify-center gap-1 text-xs text-slate-400 bg-slate-950 border border-white/10 hover:bg-slate-800 py-2 rounded-lg font-semibold transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              type="submit"
              onClick={() => setStatus('published')}
              className="flex items-center justify-center gap-1 text-xs text-slate-200 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-semibold transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Publish Now</span>
            </button>
          </div>

          {success && (
            <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Campaign Successfully Stored & Registered</span>
            </div>
          )}
        </form>
      </div>

      {/* Campaigns Monitor (cols 7) */}
      <div className="lg:col-span-7 space-y-4">
        {campaigns.map((camp) => {
          const openRate = camp.sentCount > 0 ? Math.round((camp.openCount / camp.sentCount) * 100) : 0;
          return (
            <div key={camp.id} className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200 leading-normal">{camp.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{camp.content}</p>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider shrink-0 ${getStatusBadge(camp.status)}`}>
                  {camp.status}
                </span>
              </div>

              {/* Targeting specs summary */}
              <div className="p-3 bg-slate-950/60 rounded-lg border border-white/5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400">
                <div>Target: <span className="font-semibold text-slate-300">{camp.filters.role || 'Any'}</span></div>
                <div>Region: <span className="font-semibold text-slate-300">{camp.filters.language || 'Any'}</span></div>
                <div>Trust Threshold: <span className="font-semibold text-indigo-400">&ge;{camp.filters.trustLevel || 80}%</span></div>
                <div>Channels: <span className="font-mono text-[9px] text-indigo-400 uppercase font-bold">{camp.channels.join(', ')}</span></div>
              </div>

              {/* Progress metrics bars if published */}
              {camp.status === 'published' && (
                <div className="grid grid-cols-3 gap-4 pt-1">
                  <div className="space-y-1 text-center bg-slate-950 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">Audience</span>
                    <div className="text-xs font-extrabold text-slate-200">{camp.targetCount}</div>
                  </div>
                  <div className="space-y-1 text-center bg-slate-950 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">Delivered</span>
                    <div className="text-xs font-extrabold text-indigo-400">{camp.sentCount}</div>
                  </div>
                  <div className="space-y-1 text-center bg-slate-950 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">Open Rate</span>
                    <div className="text-xs font-extrabold text-emerald-400">{openRate}%</div>
                  </div>
                </div>
              )}

              {/* State Controls */}
              <div className="flex items-center justify-end gap-3.5 pt-3 border-t border-white/5 text-[11px] text-slate-400">
                {camp.status === 'paused' && (
                  <button
                    onClick={() => toggleCampaignStatus(camp.id, 'published')}
                    className="flex items-center gap-1 hover:text-slate-200 transition-colors text-emerald-400"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Publish Campaign</span>
                  </button>
                )}
                {camp.status === 'published' && (
                  <button
                    onClick={() => toggleCampaignStatus(camp.id, 'paused')}
                    className="flex items-center gap-1 hover:text-slate-200 transition-colors text-amber-500"
                  >
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause Campaign</span>
                  </button>
                )}
                <span className="text-slate-700">|</span>
                <div className="text-[10px] text-slate-500 font-mono">Created: {camp.createdDate}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
