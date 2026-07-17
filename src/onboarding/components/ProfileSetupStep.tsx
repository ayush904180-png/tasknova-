/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OnboardingProfile } from '../types';
import { COUNTRIES, LANGUAGES, TIMEZONES } from '../constants';
import { Camera, User, Globe, MessageSquare, Clock, ShieldAlert } from 'lucide-react';

interface ProfileSetupStepProps {
  profile: OnboardingProfile;
  onChangeProfile: (profile: OnboardingProfile) => void;
  onContinue: () => void;
  onBack: () => void;
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-emerald-400 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-amber-400 to-orange-500'
];

export const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({
  profile,
  onChangeProfile,
  onContinue,
  onBack,
}) => {
  const [gradientIndex, setGradientIndex] = useState(0);
  const [errors, setErrors] = useState<{ displayName?: string; username?: string }>({});

  const validate = (field: 'displayName' | 'username', val: string) => {
    const nextErrors = { ...errors };
    if (field === 'displayName') {
      if (!val.trim()) {
        nextErrors.displayName = 'Display Name is required';
      } else if (val.length < 3) {
        nextErrors.displayName = 'Display Name must be at least 3 characters';
      } else {
        delete nextErrors.displayName;
      }
    }

    if (field === 'username') {
      const sanitized = val.replace(/\s+/g, '').toLowerCase();
      if (!sanitized) {
        nextErrors.username = 'Username is required';
      } else if (sanitized.length < 3) {
        nextErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(sanitized)) {
        nextErrors.username = 'Username can only contain alphanumeric characters and underscores';
      } else {
        delete nextErrors.username;
      }
    }
    setErrors(nextErrors);
  };

  const handleFieldChange = (key: keyof OnboardingProfile, value: string) => {
    const updated = { ...profile, [key]: value };
    onChangeProfile(updated);
    if (key === 'displayName' || key === 'username') {
      validate(key, value);
    }
  };

  const handleCycleAvatar = () => {
    const nextIndex = (gradientIndex + 1) % AVATAR_GRADIENTS.length;
    setGradientIndex(nextIndex);
    const mockURL = `gradient:${AVATAR_GRADIENTS[nextIndex]}`;
    onChangeProfile({ ...profile, photoURL: mockURL });
  };

  const currentGradient = profile.photoURL?.startsWith('gradient:')
    ? profile.photoURL.split(':')[1]
    : AVATAR_GRADIENTS[gradientIndex];

  const canSubmit = profile.displayName.length >= 3 && profile.username.length >= 3 && Object.keys(errors).length === 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto" id="onboarding-profile-step">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight sm:text-3xl">
          Initialize Custom Profile
        </h2>
        <p className="text-sm text-slate-400">
          Set your credentials signature. All settings can be altered on your future settings node.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Left Col: Avatar Selection */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-800 bg-slate-950/20 text-center space-y-4">
          <div className="relative">
            <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${currentGradient} flex items-center justify-center text-slate-950 text-3xl font-extrabold shadow-xl select-none`}>
              {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : <User className="w-10 h-10 stroke-[2.5]" />}
            </div>
            <button
              type="button"
              onClick={handleCycleAvatar}
              className="absolute bottom-0 right-0 p-2.5 bg-slate-900 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              aria-label="Cycle avatar gradient background"
              title="Cycle avatar gradient background"
              id="btn-cycle-avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Node Signature</span>
            <p className="text-xs text-slate-400">
              Click the camera icon to cycle beautiful gradient styles.
            </p>
          </div>
        </div>

        {/* Right Col: Personal Settings Form */}
        <div className="md:col-span-2 space-y-4">
          {/* Display Name */}
          <div className="space-y-1">
            <label htmlFor="displayName" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={profile.displayName}
              onChange={(e) => handleFieldChange('displayName', e.target.value)}
              placeholder="e.g. Captain Nova"
              className={`w-full px-4 py-2.5 rounded-lg bg-slate-900 border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 ${
                errors.displayName ? 'border-rose-500/50' : 'border-slate-800 hover:border-slate-700'
              }`}
            />
            {errors.displayName && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <ShieldAlert className="w-3 h-3" />
                {errors.displayName}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label htmlFor="username" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <span className="text-slate-500 font-mono">@</span>
              Unique Username
            </label>
            <input
              type="text"
              id="username"
              value={profile.username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              placeholder="e.g. captain_nova"
              className={`w-full px-4 py-2.5 rounded-lg bg-slate-900 border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 ${
                errors.username ? 'border-rose-500/50' : 'border-slate-800 hover:border-slate-700'
              }`}
            />
            {errors.username && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <ShieldAlert className="w-3 h-3" />
                {errors.username}
              </p>
            )}
          </div>

          {/* Country & Language Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="country" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                Country
              </label>
              <select
                id="country"
                value={profile.country}
                onChange={(e) => handleFieldChange('country', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="language" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                Language
              </label>
              <select
                id="language"
                value={profile.language}
                onChange={(e) => handleFieldChange('language', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-1">
            <label htmlFor="timezone" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Timezone Array
            </label>
            <select
              id="timezone"
              value={profile.timezone}
              onChange={(e) => handleFieldChange('timezone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
            >
              {TIMEZONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-900">
        <button
          onClick={onBack}
          className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          id="btn-profile-back"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          disabled={!canSubmit}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
            canSubmit
              ? 'text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 cursor-pointer'
              : 'text-slate-500 bg-slate-900 border border-slate-800 cursor-not-allowed'
          }`}
          id="btn-profile-continue"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};
