/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, ProfileCompleteness, Badge } from '../types';
import { SYSTEM_BADGES } from '../constants';

/**
 * Calculates the profile completeness percentage, remaining actions, and sections completed.
 */
export function calculateProfileCompleteness(profile: UserProfile): ProfileCompleteness {
  const checks: { field: string; label: string; section: string; value: boolean }[] = [
    { field: 'displayName', label: 'Set Display Name', section: 'Identity', value: !!profile.displayName.trim() },
    { field: 'username', label: 'Set Username', section: 'Identity', value: !!profile.username.trim() && profile.username !== 'staging_user' },
    { field: 'photoURL', label: 'Select Avatar Gradient', section: 'Identity', value: !!profile.photoURL },
    { field: 'bio', label: 'Write Bio description', section: 'Identity', value: !!profile.bio && profile.bio.length > 5 },
    { field: 'country', label: 'Set Location Country', section: 'Preferences', value: !!profile.country },
    { field: 'language', label: 'Set Preferred Language', section: 'Preferences', value: !!profile.language },
    { field: 'timezone', label: 'Set Timezone', section: 'Preferences', value: !!profile.timezone },
    { field: 'hasTwoFactor', label: 'Enable Two-Factor Authentication (2FA)', section: 'Security', value: profile.security.hasTwoFactorEnabled },
    { field: 'isPublic', label: 'Review Public Profile visibility', section: 'Privacy', value: profile.isPublicProfileEnabled },
  ];

  const totalCount = checks.length;
  const completed = checks.filter((c) => c.value);
  const completedCount = completed.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const remainingSteps = checks.filter((c) => !c.value).map((c) => c.label);
  
  // Extract completed sections uniquely
  const completedSectionsSet = new Set<string>();
  checks.forEach((c) => {
    if (c.value) {
      completedSectionsSet.add(c.section);
    }
  });
  const completedSections = Array.from(completedSectionsSet);

  const recommendations: string[] = [];
  if (!profile.security.hasTwoFactorEnabled) {
    recommendations.push('Enable 2FA to secure your earned TaskNova coins.');
  }
  if (!profile.bio || profile.bio.length < 15) {
    recommendations.push('Write an informative bio to build reputation inside Creator networks.');
  }
  if (profile.badges.length < 3) {
    recommendations.push('Complete tasks with >95% accuracy to earn high-tier alignment badges.');
  }

  return {
    percentage,
    completedCount,
    totalCount,
    remainingSteps,
    completedSections,
    recommendations,
  };
}

/**
 * Filters and sorts badges according to their priority metadata.
 */
export function getSortedBadgesForProfile(badgeIds: string[]): Badge[] {
  return SYSTEM_BADGES.filter((b) => badgeIds.includes(b.id)).sort((a, b) => b.priority - a.priority);
}
