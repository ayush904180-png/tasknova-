/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Enumeration representing all the major Firestore Collections in the TaskNova AI architecture.
 */
export enum FirestoreCollection {
  USERS = 'users',
  PROFILES = 'profiles',
  TASKS = 'tasks',
  TASK_CATEGORIES = 'taskCategories',
  TASK_SUBMISSIONS = 'taskSubmissions',
  WALLETS = 'wallets',
  TRANSACTIONS = 'transactions',
  NOTIFICATIONS = 'notifications',
  BADGES = 'badges',
  ACHIEVEMENTS = 'achievements',
  LEADERBOARDS = 'leaderboards',
  BUSINESS_ACCOUNTS = 'businessAccounts',
  CREATOR_ACCOUNTS = 'creatorAccounts',
  CAMPAIGNS = 'campaigns',
  REVIEWS = 'reviews',
  FEEDBACK = 'feedback',
  REPORTS = 'reports',
  SETTINGS = 'settings',
  FEATURE_FLAGS = 'featureFlags',
  ANALYTICS_EVENTS = 'analyticsEvents',
  AUDIT_LOGS = 'auditLogs',
  SYSTEM_CONFIGS = 'systemConfigs',
}

// ==========================================
// 1. Core Users & Profiles
// ==========================================

export interface FirestoreUser {
  id: string; // Document ID (UID from Firebase Auth)
  email: string;
  emailVerified: boolean;
  createdAt: string; // ISO 8601 string or ServerTimestamp
  updatedAt: string;
  lastActiveAt: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface FirestoreProfile {
  id: string; // Document ID (matches userId)
  username: string;
  role: 'contributor' | 'creator' | 'business' | 'admin';
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  country: string;
  skills: string[];
  level: number;
  xp: number;
  totalCoinsEarned: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 2. Tasks & Submissions
// ==========================================

export interface FirestoreTask {
  id: string;
  title: string;
  description: string;
  categoryId: string; // References taskCategories
  campaignId?: string; // Optional Campaign reference
  creatorId: string; // References profiles
  difficulty: 'easy' | 'medium' | 'hard';
  rewardCoins: number;
  estimatedSeconds: number;
  instructions: string[];
  payloadTemplate: Record<string, any>; // Describes inputs required
  maxSubmissionsAllowed: number;
  submissionCount: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreTaskCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isActive: boolean;
  allowedDifficulties: ('easy' | 'medium' | 'hard')[];
}

export interface FirestoreTaskSubmission {
  id: string;
  taskId: string;
  userId: string; // Contributor
  campaignId?: string;
  responsePayload: Record<string, any>; // Actual answers/evaluations
  durationSeconds: number;
  status: 'pending_review' | 'approved' | 'rejected';
  reviewerFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. Financial Infrastructure (Wallets & Transactions)
// ==========================================

export interface FirestoreWallet {
  id: string; // Document ID (matches userId or businessId)
  ownerId: string;
  balanceCoins: number;
  pendingCoins: number;
  currency: 'COIN' | 'USD';
  status: 'active' | 'frozen';
  updatedAt: string;
}

export interface FirestoreTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit';
  purpose: 'reward' | 'payout' | 'deposit' | 'purchase' | 'refund';
  referenceId?: string; // References taskId, campaignId, submissionId, etc.
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, any>;
  createdAt: string;
}

// ==========================================
// 4. Badges & Gamification
// ==========================================

export interface FirestoreBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'accuracy' | 'volume' | 'speed' | 'social';
  requirementXp?: number;
  requirementCount?: number;
}

export interface FirestoreAchievement {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: string;
  claimedReward: boolean;
}

export interface FirestoreLeaderboard {
  id: string; // e.g. "weekly_global", "monthly_RLHF"
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  category: string; // e.g., "global", "RLHF"
  rankings: {
    userId: string;
    username: string;
    score: number;
    rank: number;
  }[];
  updatedAt: string;
}

// ==========================================
// 5. Creator & Business Ecosystem
// ==========================================

export interface FirestoreBusinessAccount {
  id: string; // Document ID
  userId: string; // Creator/Admin UID
  companyName: string;
  website?: string;
  industry: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  taxId?: string;
  createdAt: string;
}

export interface FirestoreCreatorAccount {
  id: string; // Document ID
  userId: string;
  specialties: string[];
  portfolioUrls: string[];
  kycStatus: 'none' | 'pending' | 'verified';
  preferredLanguages: string[];
  createdAt: string;
}

export interface FirestoreCampaign {
  id: string;
  businessId: string; // References businessAccounts
  title: string;
  description: string;
  budgetCoins: number;
  spentCoins: number;
  status: 'draft' | 'pending_approval' | 'active' | 'completed' | 'paused';
  targetCriteria: {
    languages?: string[];
    minAccuracy?: number;
    requiredSkills?: string[];
  };
  taskIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 6. Quality Control & Audit (Reviews, Feedback, Reports)
// ==========================================

export interface FirestoreReview {
  id: string;
  targetId: string; // References taskSubmissions or campaigns
  reviewerId: string; // Expert/Admin UID
  score: number; // e.g., 1-5 or boolean evaluation
  comments?: string;
  status: 'accepted' | 'rejected';
  createdAt: string;
}

export interface FirestoreFeedback {
  id: string;
  userId: string;
  category: 'bug' | 'suggestion' | 'praise' | 'other';
  title: string;
  content: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
}

export interface FirestoreReport {
  id: string;
  reporterId: string;
  targetType: 'task' | 'profile' | 'submission';
  targetId: string;
  reason: string;
  comments?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

// ==========================================
// 7. Settings, Flags & System Metadata
// ==========================================

export interface FirestoreSettings {
  id: string; // userId or default
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  interface: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  privacy: {
    showRankOnLeaderboard: boolean;
    publicProfile: boolean;
  };
}

export interface FirestoreFeatureFlag {
  id: string; // Unique flag key
  description: string;
  isEnabled: boolean;
  rolloutPercentage: number; // 0 - 100 for canary deployment
  targetRoles: string[]; // empty for all
}

export interface FirestoreAnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  eventName: string;
  parameters: Record<string, any>;
  deviceInfo: {
    os: string;
    browser: string;
    isMobile: boolean;
  };
  timestamp: string;
}

export interface FirestoreAuditLog {
  id: string;
  actorId: string; // User or System service performing action
  action: string; // e.g. "USER_SUSPEND", "WALLET_FREEZE", "CAMPAIGN_APPROVE"
  resourceType: string; // e.g. "profiles", "wallets"
  resourceId: string;
  preImage?: Record<string, any>;
  postImage?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface FirestoreSystemConfig {
  id: string; // Configuration domain, e.g. "limits", "rates"
  values: Record<string, any>;
  updatedAt: string;
  updatedBy: string;
}
