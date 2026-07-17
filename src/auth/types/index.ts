/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  CONTRIBUTOR = 'contributor',
  BUSINESS = 'business',
  CREATOR = 'creator',
  ADMIN = 'admin',
}

export enum AuthPermission {
  // Contributor Permissions
  TAKE_MICRO_TASKS = 'tasks:take',
  SUBMIT_MICRO_TASKS = 'tasks:submit',
  CLAIM_REWARDS = 'rewards:claim',
  VIEW_LEADERBOARD = 'leaderboard:view',

  // Creator Permissions
  CREATE_CAMPAIGN = 'campaigns:create',
  MANAGE_CAMPAIGN = 'campaigns:manage',
  VIEW_ANALYTICS = 'analytics:view',

  // Business Permissions
  UPLOAD_PAYLOADS = 'payloads:upload',
  APPROVE_EVALUATIONS = 'evaluations:approve',
  FUND_CAMPAIGN = 'campaigns:fund',
  EXPORT_REPORTS = 'reports:export',

  // Admin Permissions
  MANAGE_USERS = 'users:manage',
  AUDIT_LEDGER = 'ledger:audit',
  SYSTEM_CONFIGURE = 'system:configure',
  DEPLOY_RULES = 'rules:deploy',
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: UserRole;
  permissions: AuthPermission[];
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSessionState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
}

export interface RoleConfig {
  role: UserRole;
  label: string;
  accessLevel: number; // 1 = lowest, 10 = admin
  permissions: AuthPermission[];
  futureDashboardPath: string;
  futureNavigation: Array<{ label: string; path: string; icon: string }>;
  protectedRoutes: string[];
  futureAPIs: string[];
}
