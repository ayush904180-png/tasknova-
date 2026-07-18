/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Settings, Globe, Clock, Eye, Moon, Bell, ShieldAlert } from 'lucide-react';
import { UserProfile, ProfilePreferences } from '../types';
import { PROFILE_LANGUAGES, PROFILE_TIMEZONES } from '../constants';

interface AccountPreferencesProps {
  profile: UserProfile;
  onUpdatePreferences: (updates: Partial<ProfilePreferences>) => void;
  onUpdateTopLevel: (updates: Partial<UserProfile>) => void;
}

export const AccountPreferences: React.FC<AccountPreferencesProps> = ({
  profile,
  onUpdatePreferences,
  onUpdateTopLevel
}) => {
  const { preferences } = profile;

  return (
    <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          Global Account Preferences
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Configure alignment visual settings, localization formats, and metadata privacy modes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Localization Column */}
        <div className="space-y-4">
          {/* Language Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Language Calibration
            </label>
            <select
              value={profile.language}
              onChange={(e) => {
                onUpdateTopLevel({ language: e.target.value });
                onUpdatePreferences({ language: e.target.value });
              }}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {PROFILE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Timezone Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Temporal Timezone
            </label>
            <select
              value={profile.timezone}
              onChange={(e) => {
                onUpdateTopLevel({ timezone: e.target.value });
                onUpdatePreferences({ timezone: e.target.value });
              }}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {PROFILE_TIMEZONES.map((tz) => (
                <option key={tz.code} value={tz.code}>
                  {tz.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Configuration (Visual Preview) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-slate-400" />
              Theme Engine
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['light', 'dark', 'system'].map((themeName) => (
                <button
                  key={themeName}
                  type="button"
                  onClick={() => onUpdatePreferences({ theme: themeName as any })}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-mono capitalize transition-all ${
                    preferences.theme === themeName
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {themeName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security / Privacy Options */}
        <div className="space-y-4">
          {/* Privacy Level selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Node Metadata Visibility
            </label>
            <select
              value={preferences.privacyLevel}
              onChange={(e) => onUpdatePreferences({ privacyLevel: e.target.value as any })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="public">Public (Everyone can review statistics & badges)</option>
              <option value="restricted">Restricted (Only verified validators can audit)</option>
              <option value="private">Private (Completely hidden telemetry)</option>
            </select>
          </div>

          {/* Dummy Toggles for Notifications & Future Preferences */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              Notification Channels
            </h4>
            
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0" />
                <span>Critical security audits & login alerts</span>
              </label>
              
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0" />
                <span>High XP task availability announcements</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200">
                <input type="checkbox" className="rounded bg-slate-900 border-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0" />
                <span>Weekly ranking & coin rewards digests</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
