/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskCategory } from '../../types';

export enum BusinessRole {
  ADMIN = 'admin',
  CAMPAIGN_MANAGER = 'campaign_manager',
  ANALYST = 'analyst',
  FINANCE = 'finance',
  VIEWER = 'viewer',
}

export interface PermissionMatrix {
  canCreateCampaign: boolean;
  canEditCampaign: boolean;
  canPublishCampaign: boolean;
  canPauseCampaign: boolean;
  canDeleteCampaign: boolean;
  canViewAnalytics: boolean;
  canManageBilling: boolean;
  canViewBilling: boolean;
  canUploadDataset: boolean;
  canRunStressTest: boolean;
}

export interface UserBusinessProfile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: BusinessRole;
  avatarUrl?: string;
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  AI_PRE_VALIDATION = 'ai_pre_validation',
  PENDING_ADMIN_REVIEW = 'pending_admin_review',
  APPROVED = 'approved',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export interface CampaignBudget {
  coins: number;
  maxSpend: number; // in USD or equivalent
  expectedCompletion: string; // e.g. "48 hours"
  expectedContributors: number;
  rewardRuleMultiplier: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface CampaignTargetAudience {
  countries: string[];
  languages: string[];
  devices: string[];
  experienceLevel: 'all' | 'intermediate' | 'expert';
  trustScoreMin: number;
  accuracyMin: number;
  role: string[];
  contributorTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface CampaignQualityRules {
  requiredAccuracy: number; // % e.g. 95
  minimumTimePerTask: number; // seconds
  spamProtection: boolean;
  manualReviewPercent: number;
  aiReviewPercent: number;
  consensusThreshold: number; // e.g. 3 (number of redundant annotations)
  duplicateDetection: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  companyName: string;
  projectName: string;
  internalNotes?: string;
  tags: string[];
  taskType: TaskCategory | string;
  budget: CampaignBudget;
  targetAudience: CampaignTargetAudience;
  datasetId?: string;
  qualityRules: CampaignQualityRules;
  status: CampaignStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignVersion {
  id: string;
  campaignId: string;
  version: number;
  snapshot: Omit<Campaign, 'id'>;
  updatedAt: string;
  updatedBy: string;
  changeLog: string;
}

export interface Dataset {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'zip' | 'images' | 'audio' | 'video' | 'text';
  size: string; // e.g. "14.2 MB"
  rowCount: number;
  status: 'validating' | 'valid' | 'invalid';
  brokenFilesCount: number;
  missingColumnsCount: number;
  detectedSchema: string[];
  createdAt: string;
  downloadUrl?: string;
}

export interface CampaignAnalyticsSummary {
  campaignId: string;
  completionRate: number; // %
  qualityScore: number; // %
  accuracy: number; // %
  rejectionPercent: number; // %
  averageTimePerTask: number; // seconds
  coinsPaid: number;
  budgetRemaining: number;
  costPerQualitySubmission: number; // USD/Coins
}

export interface BusinessBillingSummary {
  id: string;
  companyName: string;
  reservedBudget: number; // coins
  spentBudget: number; // coins
  pendingBudget: number; // coins
  estimatedBudget: number; // coins
  refundBudget: number; // coins
  bonusBudget: number; // coins
  dailyLimit: number;
  campaignLimit: number;
  creditBalance: number; // coins
}

export interface BusinessInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  coinsPurchased: number;
  amountUsd: number;
  status: 'paid' | 'pending' | 'failed';
  gstNumber?: string;
  taxAmountUsd: number;
}

export interface BusinessTransaction {
  id: string;
  campaignId?: string;
  amount: number; // coins, can be positive or negative
  type: 'deposit' | 'spend' | 'refund' | 'bonus';
  description: string;
  timestamp: string;
  referenceId: string;
}

export interface ContributorMonitorStats {
  id: string;
  name: string;
  accuracy: number; // %
  trustScore: number; // %
  speed: number; // tasks/hr
  country: string;
  language: string;
  activeTask: string;
  rejectedTasks: number;
  completedCount: number;
  status: 'active' | 'idle' | 'suspended';
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  signature: string; // HMAC/SHA-256 style signature for immutable audit trial
  beforeState?: string;
  afterState?: string;
  reason?: string;
  device?: string;
}

export interface DatasetValidationResult {
  id: string;
  datasetId: string;
  healthScore: number; // 0 to 100
  checks: { name: string; status: 'pass' | 'fail' | 'warning'; detail: string }[];
  errors: string[];
  warnings: string[];
  suggestions: string[];
  rowCount: number;
  size: string;
  detectedMime: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  taskType: string;
  defaultBudget: CampaignBudget;
  defaultQualityRules: CampaignQualityRules;
  defaultAudience: CampaignTargetAudience;
  iconName: string;
}

export interface ApprovalHistoryLog {
  id: string;
  campaignId: string;
  fromStatus: CampaignStatus;
  toStatus: CampaignStatus;
  actor: string;
  timestamp: string;
  comments?: string;
  rejectionReason?: string;
}

export interface BusinessNotification {
  id: string;
  type: 'published' | 'paused' | 'budget_low' | 'dataset_error' | 'approval_required' | 'completed' | 'fraud_alert' | 'invoice_ready' | 'export_finished' | 'support_reply';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  campaignId?: string;
}

export interface BusinessExport {
  id: string;
  type: 'ledger' | 'reports' | 'budget' | 'approvals' | 'datasets' | 'contributors';
  name: string;
  format: 'csv' | 'json' | 'google_sheets';
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  downloadUrl?: string;
  sheetId?: string;
}

