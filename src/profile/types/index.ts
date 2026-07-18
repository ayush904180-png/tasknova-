/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../../auth/types';

export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING_REVIEW = 'pending_review',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string; // lucide icon name
  priority: number; // For badge stacking hierarchy
  color: string; // Tailwind class color preset
  category: 'system' | 'contribution' | 'community' | 'event';
}

export interface ContributorIdentity {
  level: number;
  experiencePoints: number;
  nextLevelXP: number;
  accuracyRate: number; // 0 to 100
  rank: string; // e.g. "Elite Sentinel"
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  learningProgress: number; // 0 to 100
  nextMilestone: string;
}

export interface ProfileStats {
  tasksCompleted: number;
  tasksReviewed: number;
  currentStreak: number;
  longestStreak: number;
  averageAccuracy: number;
  countriesContributed: number;
  achievementsEarned: number;
  coinsPlaceholder: number;
}

export interface ProfilePreferences {
  theme: 'light' | 'dark' | 'system';
  language: string; // e.g. 'en', 'de'
  timezone: string;
  privacyLevel: 'public' | 'private' | 'restricted';
}

export interface SessionAudit {
  id: string;
  device: string;
  ip: string;
  location: string;
  active: boolean;
  timestamp: string;
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: string;
  trustedSince: string;
}

export interface SecurityHealth {
  score: number; // 0 to 100
  hasTwoFactorEnabled: boolean;
  passwordLastChanged: string;
  passkeySetupPlaceholder: boolean;
  magicLinkEnabledPlaceholder: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  photoURL: string | null;
  bannerURL: string | null;
  bio: string;
  country: string;
  language: string;
  timezone: string;
  memberSince: string;
  role: UserRole;
  status: AccountStatus;
  verificationStatus: VerificationStatus;
  badges: string[]; // Badge IDs
  contributor: ContributorIdentity;
  stats: ProfileStats;
  preferences: ProfilePreferences;
  security: SecurityHealth;
  recentSessions: SessionAudit[];
  trustedDevices: TrustedDevice[];
  isPublicProfileEnabled: boolean;
  portfolioUrlPlaceholder: string;
  reputationScorePlaceholder: number;
}

// Profile completeness response model
export interface ProfileCompleteness {
  percentage: number;
  completedCount: number;
  totalCount: number;
  remainingSteps: string[];
  completedSections: string[];
  recommendations: string[];
}
