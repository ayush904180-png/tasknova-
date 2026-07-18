/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';

/**
 * ProfileAdapter standardizes form inputs, validating lengths,
 * stripping white spaces from usernames, and preparing payload structures.
 */
export class ProfileAdapter {
  /**
   * Cleans raw state variables from forms, returning a sanitized partial UserProfile.
   */
  static adaptProfileUpdate(
    current: UserProfile,
    updates: Partial<UserProfile>
  ): UserProfile {
    const next = { ...current, ...updates };

    // Strict sanitization rules
    if (updates.username) {
      next.username = updates.username.replace(/\s+/g, '').toLowerCase();
    }
    if (updates.displayName) {
      next.displayName = updates.displayName.trim();
    }
    if (updates.bio !== undefined) {
      next.bio = updates.bio.slice(0, 250); // Cap bio at 250 characters
    }

    // Dynamic security scoring adjustment
    let score = 50;
    if (next.security.hasTwoFactorEnabled) score += 25;
    if (next.displayName && next.displayName.length >= 3) score += 15;
    if (next.bio && next.bio.length >= 10) score += 10;
    
    next.security = {
      ...next.security,
      score: Math.min(score, 100)
    };

    return next;
  }
}
