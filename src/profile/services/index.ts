/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';
import { ProfileRepository } from '../repositories';
import { ProfileAdapter } from '../adapters';
import { profileAnalytics } from '../analytics';
import { featureFlagManager } from '../featureFlags';

/**
 * ProfileService manages higher-level coordinate tasks,
 * validating feature flags before executing sub-actions,
 * and dispatching precise telemetry events.
 */
export class ProfileService {
  /**
   * Updates display details of a user's active profile node.
   */
  static updateProfileDetails(
    current: UserProfile,
    updates: Partial<UserProfile>
  ): UserProfile {
    const sanitized = ProfileAdapter.adaptProfileUpdate(current, updates);
    ProfileRepository.saveProfile(sanitized);

    // Track analytics events
    const fieldsChanged: string[] = [];
    if (updates.displayName && updates.displayName !== current.displayName) {
      fieldsChanged.push('displayName');
    }
    if (updates.username && updates.username !== current.username) {
      fieldsChanged.push('username');
    }
    if (updates.bio !== undefined && updates.bio !== current.bio) {
      fieldsChanged.push('bio');
    }

    if (fieldsChanged.length > 0) {
      profileAnalytics.track({
        type: 'PROFILE_UPDATED',
        payload: { uid: current.uid, fieldsChanged }
      });
    }

    return sanitized;
  }

  /**
   * Cycles avatar styles.
   */
  static changeAvatarStyle(current: UserProfile, style: string): UserProfile {
    const updated: UserProfile = {
      ...current,
      photoURL: style
    };
    ProfileRepository.saveProfile(updated);

    profileAnalytics.track({
      type: 'AVATAR_CHANGED',
      payload: { uid: current.uid, style }
    });

    return updated;
  }

  /**
   * Updates selected localization values.
   */
  static updateLanguagePreference(current: UserProfile, code: string): UserProfile {
    const updated: UserProfile = {
      ...current,
      language: code,
      preferences: {
        ...current.preferences,
        language: code
      }
    };
    ProfileRepository.saveProfile(updated);

    profileAnalytics.track({
      type: 'LANGUAGE_CHANGED',
      payload: { uid: current.uid, previous: current.language, next: code }
    });

    return updated;
  }

  /**
   * Toggles two-factor authentication configuration.
   */
  static toggleTwoFactorAuth(current: UserProfile): UserProfile {
    const nextStatus = !current.security.hasTwoFactorEnabled;
    const nextScore = current.security.score + (nextStatus ? 25 : -25);

    const updated: UserProfile = {
      ...current,
      security: {
        ...current.security,
        hasTwoFactorEnabled: nextStatus,
        score: Math.min(Math.max(nextScore, 0), 100),
        passwordLastChanged: new Date().toISOString()
      }
    };
    ProfileRepository.saveProfile(updated);

    profileAnalytics.track({
      type: 'PROFILE_UPDATED',
      payload: { uid: current.uid, fieldsChanged: ['hasTwoFactorEnabled', 'securityScore'] }
    });

    return updated;
  }

  /**
   * Award badges.
   */
  static grantBadge(current: UserProfile, badgeId: string, badgeLabel: string): UserProfile {
    if (!featureFlagManager.isFeatureEnabled('enableBadges')) {
      console.warn('[ProfileService] Grant badge blocked: feature flag disabled.');
      return current;
    }

    if (current.badges.includes(badgeId)) {
      return current;
    }

    const updated: UserProfile = {
      ...current,
      badges: [...current.badges, badgeId]
    };
    ProfileRepository.saveProfile(updated);

    profileAnalytics.track({
      type: 'BADGE_EARNED',
      payload: { uid: current.uid, badgeId, label: badgeLabel }
    });

    return updated;
  }
}
