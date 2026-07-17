/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../../auth/types';
import { OnboardingRoleOption, OnboardingInterestOption, OnboardingState } from '../types';

export const ONBOARDING_ROLES: OnboardingRoleOption[] = [
  {
    role: UserRole.CONTRIBUTOR,
    title: 'Model Alignment Contributor',
    description: 'Participate in micro-evaluation tasks to help align foundational model nodes.',
    capabilities: [
      'Take evaluation micro-tasks',
      'Submit training payloads',
      'Earn secure reward coins',
      'Compete on leaderboards'
    ],
    estimatedTime: '2 mins setup',
    badgeColor: 'indigo'
  },
  {
    role: UserRole.CREATOR,
    title: 'Campaign Creator / Evaluator',
    description: 'Design dynamic testing scenarios and evaluate participant contribution quality.',
    capabilities: [
      'Create and fund evaluation campaigns',
      'Review contributor alignment quality',
      'Access deep analytics & model metrics',
      'Build customized reinforcement loops'
    ],
    estimatedTime: '4 mins setup',
    badgeColor: 'purple'
  },
  {
    role: UserRole.BUSINESS,
    title: 'Enterprise Partner Node',
    description: 'Provide payload data packages and coordinate large-scale model testing arrays.',
    capabilities: [
      'Upload batch evaluation payloads',
      'Verify results on the public ledger',
      'Fund strategic campaigns with custom assets',
      'Export comprehensive reports'
    ],
    estimatedTime: '5 mins setup',
    badgeColor: 'emerald'
  }
];

export const ONBOARDING_INTERESTS: OnboardingInterestOption[] = [
  { id: 'img_rev', label: 'Image Review', description: 'Analyze synthesized illustrations and layout parameters', category: 'Visual' },
  { id: 'voice_rev', label: 'Voice Review', description: 'Evaluate natural voice modulation and phonetics databases', category: 'Audio' },
  { id: 'writing', label: 'Writing & RLHF', description: 'Refine written narratives and alignment response cards', category: 'Textual' },
  { id: 'translation', label: 'Translation Calibration', description: 'Review high-fidelity translingual mappings', category: 'Linguistics' },
  { id: 'ai_eval', label: 'AI Evaluation', description: 'Grade deep model outputs against safe rules criteria', category: 'Safety' },
  { id: 'search_qual', label: 'Search Quality', description: 'Grade search grounding accuracies and index alignment', category: 'Grounding' },
  { id: 'content_mod', label: 'Content Moderation', description: 'Detect bias, toxicity, and compliance exceptions', category: 'Safety' },
  { id: 'data_annot', label: 'Data Annotation', description: 'Label and clean large data vectors in specialized arrays', category: 'Visual' },
  { id: 'ui_testing', label: 'UI Testing & Usability', description: 'Assess web layouts, contrast, and visual design parameters', category: 'Visual' },
];

export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
];

export const LANGUAGES = [
  { code: 'en', name: 'English (US/UK)' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'EST / EDT (America/New_York)' },
  { value: 'America/Los_Angeles', label: 'PST / PDT (America/Los_Angeles)' },
  { value: 'Europe/London', label: 'GMT / BST (Europe/London)' },
  { value: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
  { value: 'Asia/Singapore', label: 'SGT (Asia/Singapore)' },
  { value: 'Asia/Tokyo', label: 'JST (Asia/Tokyo)' },
];

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  currentStep: 0,
  role: null,
  termsAccepted: {
    tos: false,
    privacy: false,
    community: false,
    dataUsage: false,
  },
  emailVerifiedSimulated: false,
  profile: {
    displayName: '',
    username: '',
    country: 'US',
    language: 'en',
    timezone: 'UTC',
    photoURL: null,
  },
  selectedInterests: [],
  notifications: {
    email: true,
    taskAlerts: true,
    rewardUpdates: true,
    productNews: false,
    securityAlerts: true,
  },
  isCompleted: false,
};
