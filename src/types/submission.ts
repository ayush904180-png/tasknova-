/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrustSnapshot } from './player';

/**
 * Enumeration of all 14 official Submission States.
 */
export enum SubmissionStatus {
  DRAFT = 'Draft',
  SAVING = 'Saving',
  SAVED = 'Saved',
  QUEUED = 'Queued',
  OFFLINE = 'Offline',
  PENDING_VALIDATION = 'Pending Validation',
  AI_REVIEWING = 'AI Reviewing',
  HUMAN_REVIEW = 'Human Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  REWARD_PENDING = 'Reward Pending',
  ARCHIVED = 'Archived',
  CANCELLED = 'Cancelled',
  EXPIRED = 'Expired'
}

/**
 * Sub-status representing pipeline automated validation outcomes.
 */
export enum ValidationStatus {
  PENDING = 'Pending',
  PASSED = 'Passed',
  FAILED = 'Failed',
  FLAGGED = 'Flagged'
}

/**
 * Sub-status representing manual reviewer pipeline allocations.
 */
export enum ReviewStatus {
  NONE = 'None',
  AI_PENDING = 'AI Pending',
  AI_COMPLETED = 'AI Completed',
  HUMAN_PENDING = 'Human Pending',
  HUMAN_COMPLETED = 'Human Completed'
}

/**
 * Drive/Cloud hosted asset metadata reference payload format.
 */
export interface DriveAttachmentMetadata {
  id: string;
  name: string;
  mimeType: string;
  url: string;
  driveFileId: string;
  sizeBytes: number;
  checksum?: string;
  dimensions?: { width: number; height: number }; // Optional for Images/Videos
  durationSeconds?: number;                      // Optional for Audio/Video
  pageCount?: number;                            // Optional for Documents
}

/**
 * Snapshot representation of client user agent specifications.
 */
export interface ClientDeviceSnapshot {
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  operatingSystem: string;
  browserName: string;
  screenResolution: string;
  userAgent: string;
}

/**
 * Comprehensive Enterprise Submission Domain Model.
 * Captures, versions, secures, and prepares contributor micro-task validation records.
 */
export interface Submission {
  submissionId: string;               // Cryptographically unique token prefixed with "SUB-"
  submissionVersion: number;          // Target schema specification version tracking
  taskId: string;                     // Core micro-task reference
  taskVersion: number;                // Permanent reference of task version at submission lock
  playerSessionId: string;            // Source player session reference
  userId: string;                     // Contributor user account ID
  role: 'contributor' | 'expert' | 'verifier' | 'admin';
  answers: Record<string, any>;       // Pure, structured response payloads captured from isolated plugins
  attachmentsMetadata: DriveAttachmentMetadata[]; // Secure links referencing assets (e.g. in Google Drive)
  startedAt: string;                  // ISO 8601 string
  completedAt: string;                // ISO 8601 string
  elapsedTime: number;                // Total focused clock seconds elapsed during validation work
  submissionStatus: SubmissionStatus;
  trustSnapshot: TrustSnapshot;       // Trust level snapshot evaluated prior to validation pipelines
  deviceSnapshot: ClientDeviceSnapshot;
  browserSnapshot: string;            // Simple browser string (e.g. "Chrome 114.0.0")
  country: string;                    // Target country boundaries (e.g. "US", "IN")
  language: string;                   // Localized language code constraints
  offlineFlag: boolean;               // Indicates if task completion was locked during disconnected states
  syncStatus: 'synced' | 'pending' | 'conflict_resolved' | 'failed';
  validationStatus: ValidationStatus;
  reviewStatus: ReviewStatus;
  qualityScorePlaceholder: number | null; // Nullable placeholder for future automated grading models
  rewardPlaceholder: number | null;      // Nullable placeholder for future XP/coin allocations (Do not write)
  metadata: Record<string, any>;      // Custom key-value extensions
  aiMetadata: {
    promptInjectionsDetected?: boolean;
    autoHateSpeechFlag?: boolean;
    heuristicRelevanceScore?: number;
    modelAssessmentNotes?: string;
  };
  humanMetadata: {
    reviewerComments?: string;
    escalationTriggered?: boolean;
    verificationBatchId?: string;
  };
  createdAt: string;                  // ISO 8601 creation record
  updatedAt: string;                  // ISO 8601 mutation record
}

/**
 * Structured options payload for creating highly scannable dynamic queries.
 */
export interface SubmissionFilterOptions {
  userId?: string;
  taskId?: string;
  submissionStatus?: SubmissionStatus;
  validationStatus?: ValidationStatus;
  reviewStatus?: ReviewStatus;
  offlineFlag?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'elapsedTime' | 'qualityScorePlaceholder';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Event Broker Types matching Prompt requirements.
 */
export enum SubmissionEventType {
  SubmissionCreated = 'SubmissionCreated',
  SubmissionSaved = 'SubmissionSaved',
  SubmissionQueued = 'SubmissionQueued',
  SubmissionSynced = 'SubmissionSynced',
  SubmissionValidationRequested = 'SubmissionValidationRequested',
  SubmissionApproved = 'SubmissionApproved',
  SubmissionRejected = 'SubmissionRejected',
  SubmissionArchived = 'SubmissionArchived'
}

export interface SubmissionEventPayloads {
  [SubmissionEventType.SubmissionCreated]: { submission: Submission; timestamp: string };
  [SubmissionEventType.SubmissionSaved]: { submissionId: string; status: SubmissionStatus; timestamp: string };
  [SubmissionEventType.SubmissionQueued]: { submissionId: string; queueType: 'offline' | 'priority' | 'retry'; timestamp: string };
  [SubmissionEventType.SubmissionSynced]: { submissionId: string; latencyMs: number; timestamp: string };
  [SubmissionEventType.SubmissionValidationRequested]: { submissionId: string; pipelineName: string; timestamp: string };
  [SubmissionEventType.SubmissionApproved]: { submissionId: string; reviewerId: string; score: number; timestamp: string };
  [SubmissionEventType.SubmissionRejected]: { submissionId: string; reviewerId: string; reason: string; timestamp: string };
  [SubmissionEventType.SubmissionArchived]: { submissionId: string; archiverId: string; timestamp: string };
}
