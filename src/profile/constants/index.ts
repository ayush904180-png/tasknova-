/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Badge, UserProfile, AccountStatus, VerificationStatus } from '../types';
import { UserRole } from '../../auth/types';

export const SYSTEM_BADGES: Badge[] = [
  {
    id: 'badge_verified',
    label: 'Verified Node',
    description: 'Fully audited identity checked against cryptographic standards.',
    icon: 'ShieldCheck',
    priority: 10,
    color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    category: 'system'
  },
  {
    id: 'badge_early_member',
    label: 'Early Member',
    description: 'Joined during the first genesis blocks of the TaskNova platform.',
    icon: 'Award',
    priority: 8,
    color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    category: 'system'
  },
  {
    id: 'badge_beta_tester',
    label: 'Beta Tester',
    description: 'Active contributor validating sandbox builds and custom protocols.',
    icon: 'Cpu',
    priority: 7,
    color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    category: 'event'
  },
  {
    id: 'badge_top_contributor',
    label: 'Top Contributor',
    description: 'Completed high density evaluations with an accuracy threshold exceeding 98%.',
    icon: 'Zap',
    priority: 9,
    color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    category: 'contribution'
  },
  {
    id: 'badge_trusted',
    label: 'Trusted Validator',
    description: 'Consistently high peer-review feedback score across complex alignment tasks.',
    icon: 'Star',
    priority: 6,
    color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    category: 'contribution'
  },
  {
    id: 'badge_community_helper',
    label: 'Community Guide',
    description: 'Provides constructive feedback and onboarding aids inside communication channels.',
    icon: 'Users',
    priority: 5,
    color: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    category: 'community'
  }
];

export const PROFILE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'ja', name: 'Japanese' }
];

export const PROFILE_TIMEZONES = [
  { code: 'UTC', name: 'UTC (Coordinated Universal Time)' },
  { code: 'GMT', name: 'GMT / London' },
  { code: 'EST', name: 'EST / New York' },
  { code: 'PST', name: 'PST / California' },
  { code: 'IST', name: 'IST / India' },
  { code: 'JST', name: 'JST / Tokyo' }
];

export const DEFAULT_MOCK_PROFILE: UserProfile = {
  uid: 'genesis_user_node_99',
  displayName: 'Captain Nova',
  username: 'captain_nova',
  photoURL: 'gradient:from-indigo-500 to-purple-500',
  bannerURL: 'gradient:from-slate-900 via-indigo-950/20 to-slate-900',
  bio: 'A veteran alignment node specialist configuring secure LLM fine-tuning arrays and reinforcing human-guided evaluation systems.',
  country: 'US',
  language: 'en',
  timezone: 'UTC',
  memberSince: '2026-01-15T00:00:00.000Z',
  role: UserRole.CONTRIBUTOR,
  status: AccountStatus.ACTIVE,
  verificationStatus: VerificationStatus.VERIFIED,
  badges: ['badge_verified', 'badge_early_member', 'badge_beta_tester'],
  contributor: {
    level: 12,
    experiencePoints: 4850,
    nextLevelXP: 6000,
    accuracyRate: 98.4,
    rank: 'Elite Sentinel',
    tier: 'Platinum',
    learningProgress: 75,
    nextMilestone: 'Achieve level 15 for Golden Shield Badge'
  },
  stats: {
    tasksCompleted: 342,
    tasksReviewed: 87,
    currentStreak: 14,
    longestStreak: 45,
    averageAccuracy: 98.4,
    countriesContributed: 4,
    achievementsEarned: 18,
    coinsPlaceholder: 1240
  },
  preferences: {
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    privacyLevel: 'public'
  },
  security: {
    score: 85,
    hasTwoFactorEnabled: true,
    passwordLastChanged: '2026-05-10T12:00:00.000Z',
    passkeySetupPlaceholder: false,
    magicLinkEnabledPlaceholder: true
  },
  recentSessions: [
    {
      id: 'session_1',
      device: 'Desktop Chrome on Linux',
      ip: '192.168.1.1',
      location: 'Oregon, US',
      active: true,
      timestamp: '2026-07-17T01:30:00.000Z'
    },
    {
      id: 'session_2',
      device: 'Mobile Safari on iPhone',
      ip: '10.0.0.4',
      location: 'Oregon, US',
      active: false,
      timestamp: '2026-07-16T18:45:00.000Z'
    }
  ],
  trustedDevices: [
    {
      id: 'dev_1',
      name: 'Staging Development Frame',
      lastUsed: '2026-07-17T01:30:00.000Z',
      trustedSince: '2026-01-15T00:30:00.000Z'
    }
  ],
  isPublicProfileEnabled: true,
  portfolioUrlPlaceholder: 'https://tasknova.ai/portfolio/captain_nova',
  reputationScorePlaceholder: 940
};
