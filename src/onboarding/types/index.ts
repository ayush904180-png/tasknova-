/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../../auth/types';

export enum OnboardingStep {
  WELCOME = 0,
  CHOOSE_ROLE = 1,
  ACCEPT_TERMS = 2,
  EMAIL_VERIFICATION = 3,
  PROFILE_SETUP = 4,
  INTERESTS_SKILLS = 5,
  NOTIFICATIONS = 6,
  COMPLETE = 7,
}

export interface OnboardingProfile {
  displayName: string;
  username: string;
  country: string;
  language: string;
  timezone: string;
  photoURL: string | null;
}

export interface OnboardingState {
  currentStep: OnboardingStep;
  role: UserRole | null;
  termsAccepted: {
    tos: boolean;
    privacy: boolean;
    community: boolean;
    dataUsage: boolean;
  };
  emailVerifiedSimulated: boolean;
  profile: OnboardingProfile;
  selectedInterests: string[];
  notifications: {
    email: boolean;
    taskAlerts: boolean;
    rewardUpdates: boolean;
    productNews: boolean;
    securityAlerts: boolean;
  };
  isCompleted: boolean;
}

export interface OnboardingRoleOption {
  role: UserRole;
  title: string;
  description: string;
  capabilities: string[];
  estimatedTime: string;
  badgeColor: string;
}

export interface OnboardingInterestOption {
  id: string;
  label: string;
  description: string;
  category: string;
}
