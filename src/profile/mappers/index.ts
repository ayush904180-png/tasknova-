/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, AccountStatus, VerificationStatus } from '../types';
import { UserRole } from '../../auth/types';

/**
 * ProfileMapper isolates the clean UI structures from whatever raw document structure
 * we might encounter when connecting to the Firestore database later.
 */
export class ProfileMapper {
  /**
   * Safely maps a raw Firestore DB record to a standard UserProfile model.
   * Handles defensive default values to prevent frontend crashes.
   */
  static toDomain(raw: any): UserProfile {
    return {
      uid: raw.uid || '',
      displayName: raw.display_name || raw.displayName || 'Staging User',
      username: raw.username || 'staging_user',
      photoURL: raw.photo_url || raw.photoURL || null,
      bannerURL: raw.banner_url || raw.bannerURL || null,
      bio: raw.bio || '',
      country: raw.country || 'US',
      language: raw.language || 'en',
      timezone: raw.timezone || 'UTC',
      memberSince: raw.member_since || raw.memberSince || new Date().toISOString(),
      role: (raw.role as UserRole) || UserRole.CONTRIBUTOR,
      status: (raw.status as AccountStatus) || AccountStatus.ACTIVE,
      verificationStatus: (raw.verification_status as VerificationStatus) || VerificationStatus.UNVERIFIED,
      badges: Array.isArray(raw.badges) ? raw.badges : [],
      contributor: {
        level: raw.contributor?.level || 1,
        experiencePoints: raw.contributor?.experience_points || raw.contributor?.experiencePoints || 0,
        nextLevelXP: raw.contributor?.next_level_xp || raw.contributor?.nextLevelXP || 1000,
        accuracyRate: raw.contributor?.accuracy_rate || raw.contributor?.accuracyRate || 100,
        rank: raw.contributor?.rank || 'Beginner Contributor',
        tier: raw.contributor?.tier || 'Bronze',
        learningProgress: raw.contributor?.learning_progress || raw.contributor?.learningProgress || 0,
        nextMilestone: raw.contributor?.next_milestone || raw.contributor?.nextMilestone || '',
      },
      stats: {
        tasksCompleted: raw.stats?.tasks_completed || raw.stats?.tasksCompleted || 0,
        tasksReviewed: raw.stats?.tasks_reviewed || raw.stats?.tasksReviewed || 0,
        currentStreak: raw.stats?.current_streak || raw.stats?.currentStreak || 0,
        longestStreak: raw.stats?.longest_streak || raw.stats?.longestStreak || 0,
        averageAccuracy: raw.stats?.average_accuracy || raw.stats?.averageAccuracy || 0,
        countriesContributed: raw.stats?.countries_contributed || raw.stats?.countriesContributed || 1,
        achievementsEarned: raw.stats?.achievements_earned || raw.stats?.achievementsEarned || 0,
        coinsPlaceholder: raw.stats?.coins_placeholder || raw.stats?.coinsPlaceholder || 0,
      },
      preferences: {
        theme: raw.preferences?.theme || 'dark',
        language: raw.preferences?.language || 'en',
        timezone: raw.preferences?.timezone || 'UTC',
        privacyLevel: raw.preferences?.privacy_level || raw.preferences?.privacyLevel || 'public',
      },
      security: {
        score: raw.security?.score || 50,
        hasTwoFactorEnabled: !!raw.security?.has_two_factor_enabled || !!raw.security?.hasTwoFactorEnabled,
        passwordLastChanged: raw.security?.password_last_changed || raw.security?.passwordLastChanged || '',
        passkeySetupPlaceholder: !!raw.security?.passkey_setup_placeholder || !!raw.security?.passkeySetupPlaceholder,
        magicLinkEnabledPlaceholder: !!raw.security?.magic_link_enabled_placeholder || !!raw.security?.magicLinkEnabledPlaceholder,
      },
      recentSessions: Array.isArray(raw.recent_sessions || raw.recentSessions)
        ? (raw.recent_sessions || raw.recentSessions).map((s: any) => ({
            id: s.id || '',
            device: s.device || '',
            ip: s.ip || '',
            location: s.location || '',
            active: !!s.active,
            timestamp: s.timestamp || '',
          }))
        : [],
      trustedDevices: Array.isArray(raw.trusted_devices || raw.trustedDevices)
        ? (raw.trusted_devices || raw.trustedDevices).map((d: any) => ({
            id: d.id || '',
            name: d.name || '',
            lastUsed: d.last_used || d.lastUsed || '',
            trustedSince: d.trusted_since || d.trustedSince || '',
          }))
        : [],
      isPublicProfileEnabled: raw.is_public_profile_enabled !== false && raw.isPublicProfileEnabled !== false,
      portfolioUrlPlaceholder: raw.portfolio_url_placeholder || raw.portfolioUrlPlaceholder || '',
      reputationScorePlaceholder: raw.reputation_score_placeholder || raw.reputationScorePlaceholder || 100,
    };
  }

  /**
   * Translates the domain structure back into a flat object suited for database saving.
   */
  static toPersistence(profile: UserProfile): any {
    return {
      uid: profile.uid,
      display_name: profile.displayName,
      username: profile.username,
      photo_url: profile.photoURL,
      banner_url: profile.bannerURL,
      bio: profile.bio,
      country: profile.country,
      language: profile.language,
      timezone: profile.timezone,
      member_since: profile.memberSince,
      role: profile.role,
      status: profile.status,
      verification_status: profile.verificationStatus,
      badges: profile.badges,
      contributor: {
        level: profile.contributor.level,
        experience_points: profile.contributor.experiencePoints,
        next_level_xp: profile.contributor.nextLevelXP,
        accuracy_rate: profile.contributor.accuracyRate,
        rank: profile.contributor.rank,
        tier: profile.contributor.tier,
        learning_progress: profile.contributor.learningProgress,
        next_milestone: profile.contributor.nextMilestone,
      },
      stats: {
        tasks_completed: profile.stats.tasksCompleted,
        tasks_reviewed: profile.stats.tasksReviewed,
        current_streak: profile.stats.currentStreak,
        longest_streak: profile.stats.longestStreak,
        average_accuracy: profile.stats.averageAccuracy,
        countries_contributed: profile.stats.countriesContributed,
        achievements_earned: profile.stats.achievementsEarned,
        coins_placeholder: profile.stats.coinsPlaceholder,
      },
      preferences: {
        theme: profile.preferences.theme,
        language: profile.preferences.language,
        timezone: profile.preferences.timezone,
        privacy_level: profile.preferences.privacyLevel,
      },
      security: {
        score: profile.security.score,
        has_two_factor_enabled: profile.security.hasTwoFactorEnabled,
        password_last_changed: profile.security.passwordLastChanged,
        passkey_setup_placeholder: profile.security.passkeySetupPlaceholder,
        magic_link_enabled_placeholder: profile.security.magicLinkEnabledPlaceholder,
      },
      is_public_profile_enabled: profile.isPublicProfileEnabled,
      portfolio_url_placeholder: profile.portfolioUrlPlaceholder,
      reputation_score_placeholder: profile.reputationScorePlaceholder,
    };
  }
}
