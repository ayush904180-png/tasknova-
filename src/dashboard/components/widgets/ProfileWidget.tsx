/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps, WidgetSize } from '../../types/widgets';
import { useInfrastructure } from '../../../infrastructure/providers/InfrastructureProvider';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { FirestoreProfile } from '../../../infrastructure/firebase/types';
import { Award, Zap, Flag, ShieldCheck } from 'lucide-react';

export const ProfileWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const { profiles } = useInfrastructure();
  const { user } = useAuth();
  const [profile, setProfile] = useState<FirestoreProfile | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        const userId = user?.uid || 'guest-calib-1';
        const data = await profiles.getById(userId);
        if (data && active) {
          setProfile(data);
        } else if (active) {
          // Default baseline fallback if record doesn't exist yet
          setProfile({
            id: userId,
            username: user?.displayName || 'contributor_noval',
            displayName: user?.displayName || 'Nova Contributor',
            role: 'contributor',
            country: 'US',
            skills: ['RLHF', 'Tagging', 'Prompting'],
            level: 3,
            xp: 1350,
            totalCoinsEarned: 240,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error fetching profile in widget:', err);
      }
    };

    fetchProfile();
    return () => { active = false; };
  }, [profiles, user]);

  return (
    <WidgetShell
      id="profile-widget"
      title="Validator Identity"
      subtitle="Onboarding clearance, level, and XP"
      size={size}
      expectedRepository="ProfileRepository"
      expectedModel="FirestoreProfile"
      expectedFields={['id', 'username', 'displayName', 'level', 'xp', 'skills', 'country']}
      futureConnectionPoint="const p = await useInfrastructure().profiles.getById(userId);"
      loadingStateSim="Reading profiles.db cache line..."
      emptyStateSim="No profile record found for active session."
      errorStateSim="Permission profiles:read denied in firestore.rules."
    >
      {profile && (
        <div className="space-y-3.5 mt-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-sm uppercase shadow-sm">
              {profile.displayName ? profile.displayName.substring(0, 2) : 'NV'}
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-1">
                {profile.displayName || 'Nova Contributor'}
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" title="KYC Cleared" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                @{profile.username || 'noval_contrib'} • Level {profile.level}
              </span>
            </div>
          </div>

          {/* Level / XP Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
              <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" /> XP Progress</span>
              <span>{profile.xp} / 2500 XP</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500 rounded-full" 
                style={{ width: `${(profile.xp / 2500) * 100}%` }}
              />
            </div>
          </div>

          {/* Skills Badges and Attributes */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.skills.map(skill => (
              <span 
                key={skill} 
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400 font-mono text-[9px] border border-slate-200/50 dark:border-white/1"
              >
                {skill}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 font-mono text-[9px] flex items-center gap-1">
              <Flag className="h-2.5 w-2.5" /> {profile.country}
            </span>
          </div>
        </div>
      )}
    </WidgetShell>
  );
};
