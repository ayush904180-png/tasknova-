/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Bell,
  Mail,
  Send,
  Smartphone,
  MessageSquare,
  Users,
  Target,
  Clock,
  Eye,
  CheckCircle,
  Plus
} from 'lucide-react';

export function NotificationCommandTab() {
  const { campaigns, launchBroadcast } = useAdmin();

  // Form states
  const [title, setTitle] = useState('');
  const [templateName, setTemplateName] = useState('platform_maintenance_alert');
  const [bodyText, setBodyText] = useState('TaskNova servers will undergo security kernel patches in 15 minutes. Please complete and submit any active sandbox assignments.');
  const [selectedChannels, setSelectedChannels] = useState<Array<'Email' | 'SMS' | 'Push' | 'In-App'>>(['Push', 'In-App']);
  const [targetRole, setTargetRole] = useState('all');
  const [targetCountry, setTargetCountry] = useState('ALL');
  const [targetLanguage, setTargetLanguage] = useState('ALL');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

  const handleChannelToggle = (ch: 'Email' | 'SMS' | 'Push' | 'In-App') => {
    if (selectedChannels.includes(ch)) {
      setSelectedChannels(selectedChannels.filter(c => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleDispatch = () => {
    if (!title) {
      alert('A campaign title must be specified.');
      return;
    }
    if (selectedChannels.length === 0) {
      alert('At least one broadcast communication channel must be checked.');
      return;
    }

    launchBroadcast({
      title,
      channels: selectedChannels,
      targets: {
        roles: targetRole === 'all' ? ['contributor', 'creator'] : [targetRole],
        countries: [targetCountry],
        languages: [targetLanguage]
      },
      templateName,
      status: isScheduled ? 'Scheduled' : 'Sent',
      scheduledTime: isScheduled ? scheduledTime || new Date(Date.now() + 1000 * 3600).toISOString() : undefined
    });

    alert(isScheduled ? 'Broadcast campaign successfully scheduled.' : 'Broadcast campaign successfully dispatched!');
    
    // Reset form
    setTitle('');
    setBodyText('Write template body content here...');
  };

  return (
    <div className="space-y-6" id="notification-command-panel">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dispatches Editor form */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Multi-Channel Mass Broadcast Console</h3>
            <p className="text-[11px] text-slate-400 mt-1">Dispatches push warnings, transactional SMS alerts, email notifications, and in-app system overlays to targeted nodes globally.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Broadcast Campaign Name *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Database Refactor Warning"
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            {/* Template select */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Preconfigured template trigger</label>
              <select
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="platform_maintenance_alert">[Alert] Platform System Maintenance</option>
                <option value="b2b_compliance_terms">[Notice] B2B Commercial Compliance Terms</option>
                <option value="reward_bonus_multiplication">[Promo] Token Reward Multiplier Event</option>
              </select>
            </div>
          </div>

          {/* Body text template */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Template Body text content</label>
            <textarea
              rows={3}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white font-sans"
            />
          </div>

          {/* Channel checkboxes */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Active delivery pipelines</label>
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'Push' as const, label: 'Push Notifications', icon: Bell },
                { type: 'Email' as const, label: 'Email Broadcast', icon: Mail },
                { type: 'SMS' as const, label: 'SMS Transactional', icon: Smartphone },
                { type: 'In-App' as const, label: 'In-App System Overlay', icon: MessageSquare }
              ].map((ch) => {
                const Icon = ch.icon;
                const isChecked = selectedChannels.includes(ch.type);
                return (
                  <button
                    key={ch.type}
                    onClick={() => handleChannelToggle(ch.type)}
                    className={`px-3 py-2 border rounded-xl flex items-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-indigo-50 border-indigo-250 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-950 dark:text-indigo-400'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {ch.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demographic target selectors */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Audience target constraints</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Role target</span>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1.5 text-slate-900 dark:text-white"
                >
                  <option value="all">All global users</option>
                  <option value="contributor">Contributor pool only</option>
                  <option value="creator">Business creators only</option>
                </select>
              </div>

              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Country Geofence</span>
                <select
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1.5 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Countries (Global)</option>
                  <option value="IN">India (IN)</option>
                  <option value="US">United States (US)</option>
                  <option value="DE">Germany (DE)</option>
                </select>
              </div>

              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Locale Language</span>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1.5 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Languages</option>
                  <option value="EN">English (EN)</option>
                  <option value="HI">Hindi (HI)</option>
                  <option value="DE">German (DE)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scheduling toggle */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Schedule Broadcast for later</span>
                <p className="text-[9px] text-slate-400">Stores dispatches in Cloud Tasks scheduler queues.</p>
              </div>
            </div>
            <button
              onClick={() => setIsScheduled(!isScheduled)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                isScheduled ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-800'
              }`}
            >
              <div className={`bg-white h-4 w-4 rounded-full shadow transition-transform duration-200 ${
                isScheduled ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {isScheduled && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-[9px] font-mono text-slate-400 uppercase">Task Queue release date-time</label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Dispatch Button */}
          <button
            onClick={handleDispatch}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md transition-all font-mono"
          >
            <Send className="h-4 w-4" /> {isScheduled ? 'Schedule dispatch campaign' : 'Deploy instant system broadcast'}
          </button>
        </div>

        {/* Mock phone preview layout */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/10 border border-slate-200/80 dark:border-white/5 rounded-2xl p-6 shadow-xs">
            <h4 className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-slate-400" /> Dynamic Receiver Preview
            </h4>

            {/* Smart mock phone layout */}
            <div className="border-[8px] border-slate-900 dark:border-zinc-800 rounded-[32px] overflow-hidden bg-slate-100 dark:bg-[#030303] aspect-[9/16] relative">
              <div className="h-6 bg-slate-900 dark:bg-zinc-800 flex justify-center items-center">
                <div className="h-3 w-16 bg-black rounded-full" />
              </div>
              <div className="p-4 space-y-4">
                {/* Simulated lock screen push notification card */}
                {selectedChannels.includes('Push') && (
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-3 border border-slate-200 dark:border-white/10 shadow-lg text-[11px] animate-fadeIn">
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span className="flex items-center gap-1 font-bold">
                        <Smartphone className="h-3 w-3" /> TASKNOVA CORE
                      </span>
                      <span>Now</span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                      {title || 'Scheduled Database Maintenance'}
                    </h5>
                    <p className="text-slate-600 dark:text-zinc-400 mt-0.5 leading-snug text-[10px]">
                      {bodyText || 'Servers will execute a scheduled restart loop.'}
                    </p>
                  </div>
                )}

                {/* Simulated in-app notification header */}
                {selectedChannels.includes('In-App') && (
                  <div className="bg-slate-950 text-white rounded-xl p-3 border border-white/5 text-[11px] space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[9px] font-bold">
                      <Bell className="h-3 w-3 animate-bounce" /> SYSTEM ADVISORY
                    </div>
                    <p className="font-sans leading-relaxed text-[10px]">
                      {bodyText || 'Servers will execute a scheduled restart loop.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Campaigns list */}
          <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 rounded-2xl p-4 shadow-xs">
            <h4 className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-3">Active dispatches ledger</h4>
            <div className="space-y-2.5">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-2.5 border border-slate-50 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 dark:text-white truncate max-w-40">{camp.title}</h5>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      camp.status === 'Sent' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono mt-1.5">
                    <span>Delivered count: {camp.sentCount} nodes</span>
                    <span>TPL: {camp.templateName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default NotificationCommandTab;
