/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1. Role-Based Access Control (RBAC)
export enum AdminRole {
  OWNER = 'Owner',
  SUPER_ADMIN = 'Super Admin',
  SECURITY_ADMIN = 'Security Admin',
  FINANCE_ADMIN = 'Finance Admin',
  OPERATIONS_ADMIN = 'Operations Admin',
  MODERATOR = 'Moderator',
  SUPPORT = 'Support',
  DEVELOPER = 'Developer',
  AUDITOR = 'Auditor',
  READ_ONLY = 'Read Only'
}

// 2. System Health Statuses
export enum HealthStatus {
  HEALTHY = 'Healthy',
  WARNING = 'Warning',
  CRITICAL = 'Critical',
  OFFLINE = 'Offline'
}

export interface ServiceHealth {
  name: string;
  status: HealthStatus;
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
}

// 3. Live Event Streams
export enum AdminEventType {
  USER_REGISTERED = 'User Registered',
  TASK_CREATED = 'Task Created',
  TASK_PUBLISHED = 'Task Published',
  SUBMISSION_RECEIVED = 'Submission Received',
  VALIDATION_COMPLETED = 'Validation Completed',
  REWARD_GRANTED = 'Reward Granted',
  WALLET_UPDATED = 'Wallet Updated',
  WITHDRAWAL_REQUESTED = 'Withdrawal Requested',
  BUSINESS_CAMPAIGN_CREATED = 'Business Campaign Created',
  INVOICE_PAID = 'Invoice Paid',
  DATASET_UPLOADED = 'Dataset Uploaded',
  MARKETPLACE_RESERVATION = 'Marketplace Reservation',
  ADMIN_LOGIN = 'Admin Login',
  SECURITY_ALERT = 'Security Alert',
  SYSTEM_ERROR = 'System Error'
}

export interface LiveEvent {
  id: string;
  type: AdminEventType;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details: Record<string, any>;
}

// 4. User Administration
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'contributor' | 'creator' | 'admin';
  status: 'Active' | 'Suspended' | 'Banned';
  trustScore: number;
  reputation: number;
  joinedAt: string;
  mfaEnabled: boolean;
  sessions: Array<{ id: string; ip: string; device: string; lastActive: string }>;
  walletBalance: number;
  rewardsEarned: number;
  validationHistory: Array<{ taskId: string; result: 'Approved' | 'Rejected'; date: string }>;
  marketplaceHistory: Array<{ listingId: string; type: string; date: string }>;
  billingDetails: Array<{ invoiceId: string; amount: number; status: string; date: string }>;
  campaignsList: string[];
}

// 5. Business & Organization Management
export interface AdminOrganization {
  id: string;
  name: string;
  domain: string;
  status: 'Active' | 'Suspended' | 'Billing_Frozen';
  budgetLimit: number;
  budgetSpent: number;
  campaignsCount: number;
  datasetsCount: number;
  apiCallsCount: number;
  invoices: Array<{ id: string; invoiceNo: string; amount: number; status: 'Paid' | 'Pending' | 'Overdue'; date: string }>;
}

// 6. Content Moderation
export enum ContentCategory {
  TASK = 'Task',
  DATASET = 'Dataset',
  IMAGE = 'Image',
  VIDEO = 'Video',
  TEXT = 'Text',
  PROMPT = 'Prompt',
  REVIEW = 'Review',
  MARKETPLACE_LISTING = 'Marketplace Listing',
  CAMPAIGN = 'Campaign'
}

export interface ModerationItem {
  id: string;
  category: ContentCategory;
  title: string;
  ownerId: string;
  ownerName: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Archived' | 'Escalated';
  mediaUrl?: string;
  textContent?: string;
  riskScore: number; // 0-100
}

// 7. Security Center
export interface SecurityAlert {
  id: string;
  category: 'Failed_Login' | 'Proxy' | 'VPN' | 'Bot' | 'Velocity' | 'Tamper' | 'Replay' | 'Fraud';
  timestamp: string;
  ip: string;
  username?: string;
  riskScore: number;
  details: string;
  status: 'Unresolved' | 'Investigating' | 'Resolved' | 'Whitelisted';
}

export interface ThreatFeedItem {
  id: string;
  timestamp: string;
  vector: string;
  ip: string;
  country: string;
  actionTaken: string;
}

// 8. Withdrawal Records
export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  channel: 'UPI' | 'Bank' | 'International';
  details: {
    upiId?: string;
    accountNo?: string;
    bankName?: string;
    iban?: string;
    swiftCode?: string;
  };
  status: 'Pending' | 'Approved' | 'Rejected' | 'Hold';
  requestDate: string;
  auditTrail: string[];
}

// 9. Immutable Audit logs
export interface AuditLog {
  id: string;
  adminId: string;
  adminRole: AdminRole;
  timestamp: string;
  ip: string;
  device: string;
  action: string;
  target: string;
  reason: string;
  hash: string;
}

// 10. Notifications Command Center
export interface AdminNotificationCampaign {
  id: string;
  title: string;
  channels: Array<'Email' | 'SMS' | 'Push' | 'In-App'>;
  targets: {
    roles: string[];
    countries: string[];
    languages: string[];
  };
  scheduledTime?: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  templateName: string;
  sentCount: number;
}
