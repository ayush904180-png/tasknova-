/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Save, X, Shield, ShieldCheck, Mail, Calendar, MapPin, Eye, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { UserProfile, AccountStatus, VerificationStatus } from '../types';

interface ProfileOverviewProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onChangeAvatar: (style: string) => void;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  profile,
  onUpdate,
  onChangeAvatar,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [country, setCountry] = useState(profile.country);

  // Avatar presets
  const AVATAR_PRESETS = [
    'gradient:from-indigo-500 to-purple-500',
    'gradient:from-emerald-400 to-teal-500',
    'gradient:from-orange-400 to-rose-500',
    'gradient:from-blue-500 to-cyan-500',
    'gradient:from-pink-500 to-purple-600',
    'gradient:from-yellow-400 to-amber-500'
  ];

  // Banner presets
  const BANNER_PRESETS = [
    'gradient:from-slate-900 via-indigo-950/20 to-slate-900',
    'gradient:from-slate-900 via-emerald-950/20 to-slate-900',
    'gradient:from-slate-900 via-rose-950/20 to-slate-900',
    'gradient:from-slate-900 via-teal-950/20 to-slate-900',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      displayName,
      username,
      bio,
      country,
    });
    setIsEditing(false);
  };

  const parseGradient = (styleString: string) => {
    if (styleString.startsWith('gradient:')) {
      return styleString.replace('gradient:', '');
    }
    return 'from-slate-800 to-slate-900';
  };

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case AccountStatus.PENDING_REVIEW:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/10 backdrop-blur-md">
      {/* Dynamic Banner Placeholder */}
      <div className={`h-40 w-full bg-gradient-to-r ${parseGradient(profile.bannerURL || BANNER_PRESETS[0])} border-b border-slate-800/60 relative`}>
        {/* Banner Quick Swapper */}
        {isEditing && (
          <div className="absolute right-4 top-4 flex gap-1.5 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 backdrop-blur-md">
            {BANNER_PRESETS.map((banner, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onUpdate({ bannerURL: banner })}
                className={`w-6 h-4 rounded-md border transition-all ${
                  profile.bannerURL === banner ? 'border-white scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{
                  background: banner.includes('emerald')
                    ? 'linear-gradient(to right, #022c22, #0f172a)'
                    : banner.includes('rose')
                    ? 'linear-gradient(to right, #4c0519, #0f172a)'
                    : banner.includes('teal')
                    ? 'linear-gradient(to right, #115e59, #0f172a)'
                    : 'linear-gradient(to right, #1e1b4b, #0f172a)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Metadata Section */}
      <div className="px-6 pb-6 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 gap-4 mb-6">
          {/* Avatar and Info Block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative group">
              {/* Photo Display */}
              <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${parseGradient(profile.photoURL || AVATAR_PRESETS[0])} border-4 border-slate-900 shadow-2xl flex items-center justify-center font-bold text-2xl text-white font-mono`}>
                {displayName.slice(0, 2).toUpperCase()}
              </div>

              {/* Avatar Cycler list */}
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 bg-slate-950 p-1 rounded-lg border border-slate-800 flex gap-1 shadow-lg">
                  {AVATAR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => onChangeAvatar(preset)}
                      className={`w-4 h-4 rounded-full bg-gradient-to-tr ${parseGradient(preset)} border transition-transform ${
                        profile.photoURL === preset ? 'scale-125 border-white' : 'border-transparent hover:scale-110'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Static titles */}
            {!isEditing && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">{profile.displayName}</h2>
                  {profile.verificationStatus === VerificationStatus.VERIFIED && (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="text-xs font-mono text-indigo-400">@{profile.username}</div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-800 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile Node
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(profile.displayName);
                    setUsername(profile.username);
                    setBio(profile.bio);
                    setCountry(profile.country);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-400 border border-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white border border-indigo-500/30 shadow-lg shadow-indigo-600/15 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content switch: Form edit vs Profile Details */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              onSubmit={handleSave}
              className="space-y-4 border-t border-slate-800/40 pt-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Short Bio Description (Max 250 characters)</label>
                <textarea
                  value={bio}
                  rows={3}
                  maxLength={250}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="static"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 border-t border-slate-800/40 pt-5"
            >
              {/* Bio and metadata text */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Specialist Calibration Bio</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {profile.bio || 'This calibration unit has not configured their bio snapshot.'}
                  </p>
                </div>

                {/* Info side table */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Node Registry</h4>
                  
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Account status</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                      </span>
                      <span className="text-slate-300 font-medium">{profile.country}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Genesis Date
                      </span>
                      <span className="text-slate-300 font-mono">
                        {new Date(profile.memberSince).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
