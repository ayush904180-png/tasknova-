/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProfileFeatureFlags {
  enablePublicProfile: boolean;
  enableBadges: boolean;
  enableStatistics: boolean;
  enableSecurityCenter: boolean;
  enablePortfolio: boolean;
  enableReputation: boolean;
}

export const DEFAULT_PROFILE_FEATURE_FLAGS: ProfileFeatureFlags = {
  enablePublicProfile: true,
  enableBadges: true,
  enableStatistics: true,
  enableSecurityCenter: true,
  enablePortfolio: true,
  enableReputation: true,
};

class FeatureFlagManager {
  private flags: ProfileFeatureFlags = { ...DEFAULT_PROFILE_FEATURE_FLAGS };

  getFlags(): ProfileFeatureFlags {
    return this.flags;
  }

  setFlag(key: keyof ProfileFeatureFlags, value: boolean): void {
    this.flags[key] = value;
    console.log(`[FeatureFlags] ${key} updated to ${value}`);
  }

  isFeatureEnabled(key: keyof ProfileFeatureFlags): boolean {
    return this.flags[key];
  }
}

export const featureFlagManager = new FeatureFlagManager();
