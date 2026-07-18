/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { UserProfile, ProfileCompleteness, Badge } from '../types';
import { ProfileRepository } from '../repositories';
import { ProfileService } from '../services';
import { calculateProfileCompleteness, getSortedBadgesForProfile } from '../utils';
import { profileAnalytics } from '../analytics';

export interface UseProfileReturn {
  profile: UserProfile;
  completeness: ProfileCompleteness;
  sortedBadges: Badge[];
  updateProfile: (updates: Partial<UserProfile>) => void;
  changeAvatar: (style: string) => void;
  changeLanguage: (code: string) => void;
  toggleTwoFactor: () => void;
  awardBadge: (badgeId: string, badgeLabel: string) => void;
  resetProfile: () => void;
}

/**
 * Custom React Hook to load and edit the User Profile state.
 */
export function useProfile(uid: string = 'genesis_user_node_99'): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile>(() =>
    ProfileRepository.getProfile(uid)
  );

  // Sync profile when uid changes
  useEffect(() => {
    const loaded = ProfileRepository.getProfile(uid);
    setProfile(loaded);
    
    // Log telemetry profile viewed
    profileAnalytics.track({
      type: 'PROFILE_VIEWED',
      payload: { uid, source: 'profile_view_mount' }
    });
  }, [uid]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = ProfileService.updateProfileDetails(prev, updates);
      return next;
    });
  }, []);

  const changeAvatar = useCallback((style: string) => {
    setProfile((prev) => {
      const next = ProfileService.changeAvatarStyle(prev, style);
      return next;
    });
  }, []);

  const changeLanguage = useCallback((code: string) => {
    setProfile((prev) => {
      const next = ProfileService.updateLanguagePreference(prev, code);
      return next;
    });
  }, []);

  const toggleTwoFactor = useCallback(() => {
    setProfile((prev) => {
      const next = ProfileService.toggleTwoFactorAuth(prev);
      return next;
    });
  }, []);

  const awardBadge = useCallback((badgeId: string, badgeLabel: string) => {
    setProfile((prev) => {
      const next = ProfileService.grantBadge(prev, badgeId, badgeLabel);
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    const resetData = ProfileRepository.resetToDefault();
    setProfile(resetData);
  }, []);

  // Compute stats on the fly
  const completeness = calculateProfileCompleteness(profile);
  const sortedBadges = getSortedBadgesForProfile(profile.badges);

  return {
    profile,
    completeness,
    sortedBadges,
    updateProfile,
    changeAvatar,
    changeLanguage,
    toggleTwoFactor,
    awardBadge,
    resetProfile
  };
}
