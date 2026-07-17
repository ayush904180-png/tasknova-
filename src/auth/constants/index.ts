/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole, AuthPermission, RoleConfig } from '../types';

export const AUTH_ROLES_CONFIG: Record<UserRole, RoleConfig> = {
  [UserRole.CONTRIBUTOR]: {
    role: UserRole.CONTRIBUTOR,
    label: 'Model Alignment Contributor',
    accessLevel: 1,
    permissions: [
      AuthPermission.TAKE_MICRO_TASKS,
      AuthPermission.SUBMIT_MICRO_TASKS,
      AuthPermission.CLAIM_REWARDS,
      AuthPermission.VIEW_LEADERBOARD,
    ],
    futureDashboardPath: '/dashboard/contributor',
    futureNavigation: [
      { label: 'Evaluation Playground', path: '/sandbox', icon: 'Sparkles' },
      { label: 'Rewards Wallet', path: '/rewards', icon: 'Wallet' },
      { label: 'Validator Standings', path: '/leaderboard', icon: 'Award' },
    ],
    protectedRoutes: ['/sandbox', '/rewards', '/leaderboard'],
    futureAPIs: [
      '/api/v1/tasks/available',
      '/api/v1/tasks/submit',
      '/api/v1/rewards/claim',
    ],
  },
  [UserRole.CREATOR]: {
    role: UserRole.CREATOR,
    label: 'Campaign Creator / Evaluator',
    accessLevel: 3,
    permissions: [
      AuthPermission.TAKE_MICRO_TASKS,
      AuthPermission.SUBMIT_MICRO_TASKS,
      AuthPermission.CLAIM_REWARDS,
      AuthPermission.VIEW_LEADERBOARD,
      AuthPermission.CREATE_CAMPAIGN,
      AuthPermission.MANAGE_CAMPAIGN,
      AuthPermission.VIEW_ANALYTICS,
    ],
    futureDashboardPath: '/dashboard/creator',
    futureNavigation: [
      { label: 'Sandbox Tasks', path: '/sandbox', icon: 'Sparkles' },
      { label: 'Campaign Builder', path: '/creator/campaigns', icon: 'Layers' },
      { label: 'Model Metrics', path: '/creator/analytics', icon: 'BarChart' },
    ],
    protectedRoutes: ['/creator/campaigns', '/creator/analytics'],
    futureAPIs: [
      '/api/v1/campaigns/create',
      '/api/v1/campaigns/list',
      '/api/v1/analytics/overview',
    ],
  },
  [UserRole.BUSINESS]: {
    role: UserRole.BUSINESS,
    label: 'Enterprise Partner Node',
    accessLevel: 5,
    permissions: [
      AuthPermission.UPLOAD_PAYLOADS,
      AuthPermission.APPROVE_EVALUATIONS,
      AuthPermission.FUND_CAMPAIGN,
      AuthPermission.EXPORT_REPORTS,
      AuthPermission.VIEW_ANALYTICS,
    ],
    futureDashboardPath: '/dashboard/enterprise',
    futureNavigation: [
      { label: 'Enterprise Console', path: '/enterprise', icon: 'Building' },
      { label: 'Payload Uploader', path: '/enterprise/payloads', icon: 'Upload' },
      { label: 'Funding & Ledgers', path: '/enterprise/billing', icon: 'Coins' },
    ],
    protectedRoutes: ['/enterprise', '/enterprise/payloads', '/enterprise/billing'],
    futureAPIs: [
      '/api/v1/enterprise/payloads/upload',
      '/api/v1/enterprise/evaluations/verify',
      '/api/v1/enterprise/billing/fund',
    ],
  },
  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    label: 'Sovereign Systems Admin',
    accessLevel: 10,
    permissions: Object.values(AuthPermission),
    futureDashboardPath: '/dashboard/admin',
    futureNavigation: [
      { label: 'Admin Controller', path: '/admin', icon: 'ShieldAlert' },
      { label: 'User Operations', path: '/admin/users', icon: 'Users' },
      { label: 'Ledger Reconciliation', path: '/admin/audit', icon: 'FileText' },
      { label: 'System Configuration', path: '/admin/settings', icon: 'Cpu' },
    ],
    protectedRoutes: ['/admin', '/admin/users', '/admin/audit', '/admin/settings'],
    futureAPIs: [
      '/api/v1/admin/users/roles',
      '/api/v1/admin/ledger/audit',
      '/api/v1/admin/system/deploy',
    ],
  },
};

export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const AUTH_ERROR_MESSAGES = {
  invalidEmail: 'Please enter a valid, corporate or standard email address (e.g., name@domain.com).',
  weakPassword: 'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and a special character.',
  passwordsDoNotMatch: 'The passwords specified do not match. Please verify your typing.',
  requiredField: 'This parameter is strictly required to establish identity alignment.',
  emailNotVerified: 'SLA security guidelines require email verification to unlock ledger withdrawals.',
  tooManyRequests: 'Rate limit exceeded. System safety cooldown is active.',
};
