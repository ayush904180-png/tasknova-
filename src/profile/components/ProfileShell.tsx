/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Award, Settings, ShieldCheck, Globe, RefreshCw, Star } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { ProfileOverview } from './ProfileOverview';
import { ProfileCompleteness } from './ProfileCompleteness';
import { ContributorIdentity } from './ContributorIdentity';
import { ProfileStats } from './ProfileStats';
import { BadgeSystem } from './BadgeSystem';
import { AccountPreferences } from './AccountPreferences';
import { SecurityCenter } from './SecurityCenter';
import { PublicProfileView } from './PublicProfileView';

export const ProfileShell: React.FC = () => {
  const {
    profile,
    completeness,
    sortedBadges,
    updateProfile,
    changeAvatar,
    changeLanguage,
    toggleTwoFactor,
    awardBadge,
    resetProfile
  } = useProfile();

  const [activeTab, setActiveTab] = useState<'identity' | 'badges' | 'settings' | 'security' | 'public'>('identity');

  const tabs = [
    { id: 'identity', label: 'Identity & Stats', icon: Compass },
    { id: 'badges', label: 'Badge Matrix', icon: Award },
    { id: 'settings', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security Center', icon: ShieldCheck },
    { id: 'public', label: 'Public Portal', icon: Globe },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Dynamic Dashboard Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-indigo-400" />
            Identity Verification Node
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your cryptographic telemetry keys, calibration scores, and alignment rankings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset your local profile snapshot? All changes will revert to defaults.')) {
                resetProfile();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/20 text-[10px] font-bold text-rose-400 hover:bg-rose-500/5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Node Snapshot
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="border-b border-slate-800/60 pb-px flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all relative ${
                isActive
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeProfileTabBorder"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {activeTab === 'identity' && (
              <>
                {/* 1. Profile Overview Banner */}
                <ProfileOverview
                  profile={profile}
                  onUpdate={updateProfile}
                  onChangeAvatar={changeAvatar}
                />

                {/* 2. Completeness progress engine */}
                <ProfileCompleteness
                  completeness={completeness}
                />

                {/* 3. Contributor Stats Cards */}
                <ProfileStats stats={profile.stats} />

                {/* 4. Contributor Level & Rank Gauges */}
                <ContributorIdentity
                  contributor={profile.contributor}
                  verificationStatus={profile.verificationStatus}
                />
              </>
            )}

            {activeTab === 'badges' && (
              <BadgeSystem
                activeBadgeIds={profile.badges}
                onAwardBadge={awardBadge}
              />
            )}

            {activeTab === 'settings' && (
              <AccountPreferences
                profile={profile}
                onUpdatePreferences={(prefUpdates) => {
                  updateProfile({
                    preferences: {
                      ...profile.preferences,
                      ...prefUpdates
                    }
                  });
                }}
                onUpdateTopLevel={updateProfile}
              />
            )}

            {activeTab === 'security' && (
              <SecurityCenter
                profile={profile}
                onToggleTwoFactor={toggleTwoFactor}
              />
            )}

            {activeTab === 'public' && (
              <PublicProfileView
                profile={profile}
                onToggleVisibility={(enabled) => {
                  updateProfile({ isPublicProfileEnabled: enabled });
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
