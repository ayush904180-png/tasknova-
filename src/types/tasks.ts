/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * All possible operational states of a Task.
 */
export enum TaskStatus {
  DRAFT = 'Draft',
  SCHEDULED = 'Scheduled',
  PUBLISHED = 'Published',
  PAUSED = 'Paused',
  ACTIVE = 'Active',
  IN_REVIEW = 'In Review',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected',
  ARCHIVED = 'Archived',
  HIDDEN = 'Hidden',
  EXPIRED = 'Expired'
}

/**
 * Urgency/Priority level of tasks.
 */
export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

/**
 * Task Difficulty tiers.
 */
export enum TaskDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

/**
 * Structure of dynamic attachment assets representing files on Google Drive
 * or direct content assets. Includes metadata support without real binaries.
 */
export interface TaskAttachment {
  id: string;
  name: string;
  fileType: 'image' | 'audio' | 'video' | 'document' | 'zip' | 'ai_asset';
  url: string;
  driveFileId?: string; // For Google Drive backlink references
  sizeBytes: number;
  createdAt: string;
}

/**
 * Metadata structures for specific analytical payloads
 */
export interface TaskAIMetadata {
  associatedModel?: string;      // e.g. "gemini-2.0-flash"
  alignmentPromptId?: string;    // Prompt id reference
  expectedGroundingUrl?: string; // Search grounding reference URL
  evaluationMetric?: string;     // e.g. "SLA-Precision"
}

export interface TaskHumanMetadata {
  averageRatingScore?: number;
  demographicRequirement?: string;
  contributorLevelRequired?: number;
  maxDailyAttemptsPerUser?: number;
}

/**
 * Complete, enterprise-ready core Task Domain Model.
 */
export interface Task {
  id: string;                      // Core UUID
  version: number;                 // Task Definition version (e.g. 1, 2, 3)
  parentTaskId: string | null;     // References previous version if applicable
  taskType: string;                // Dynamic Plugin type (e.g., "AI Response Comparison")
  title: string;
  description: string;
  instructions: string[];
  category: string;                // Main grouping
  difficulty: TaskDifficulty;
  estimatedCompletionTime: number; // in seconds
  rewardCoins: number;
  priority: TaskPriority;
  language: string;                // ISO Code (e.g. "en-US", "hi-IN")
  country: string;                 // Target country boundary (e.g. "IN", "US")
  region: string | null;           // Sub-national boundary constraints
  requiredAccuracy: number;        // Percentage threshold (e.g. 98)
  requiredTrustScore: number;      // Trust percentage required
  maximumAttempts: number;         // Max attempts allowed per contributor
  cooldownPeriod: number;          // Cooldown between attempts in seconds
  validationMethod: string;        // "Consensus", "AdminReview", "AI_Heuristics"
  reviewStrategy: string;          // "Immediate", "DoubleBlind", "Batch"
  expiryDate: string | null;       // ISO datetime string
  visibility: 'Public' | 'Private' | 'Incentivized';
  currentStatus: TaskStatus;
  tags: string[];
  attachments: TaskAttachment[];
  creator: string;                 // User ID of the architect/creator
  business: string | null;         // Funding Business campaign reference
  metadata: Record<string, any>;   // Dynamic metadata properties
  aiMetadata: TaskAIMetadata;      // Specific AI pipelines
  humanMetadata: TaskHumanMetadata;// Contributor requirements
  createdAt: string;               // ISO Datetime
  updatedAt: string;               // ISO Datetime
  archivedAt: string | null;       // ISO Datetime if applicable
}

/**
 * Represents dynamic payload options for registering dynamic Task Type plugins.
 */
export interface TaskTypeDefinition {
  type: string;
  name: string;
  iconName: string;
  defaultDifficulty: TaskDifficulty;
  defaultCoins: number;
  validationRules: Record<string, any>;
  rendererComponent?: string;      // Visual handler mapping identifier
}
