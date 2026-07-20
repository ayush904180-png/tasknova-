/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskDifficulty, TaskPriority, TaskStatus, TaskAttachment } from '../../types/tasks';

export enum TaskGenPipelineStatus {
  DRAFT = 'Draft',
  ANALYZING = 'Analyzing',
  CHUNKING = 'Chunking',
  CLASSIFYING = 'Classifying',
  ESTIMATING = 'Estimating',
  REVIEW_PENDING = 'Review Pending',
  APPROVED = 'Approved',
  PUBLISHING = 'Publishing',
  PUBLISHED = 'Published',
  FAILED = 'Failed',
}

export enum GeneratedTaskStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  REVISION = 'Needs Revision',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived'
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  taskType: string;
  instructions: string[];
  examples: Array<{ input: string; output: string; rationale?: string }>;
  acceptedAnswers: string[];
  validationRules: Record<string, any>;
  attachments: TaskAttachment[];
  language: string;
  country: string;
  difficulty: TaskDifficulty;
  estimatedCompletionTime: number; // in seconds
  rewardCoins: number;
}

export interface DatasetChunk {
  id: string;
  pipelineId: string;
  index: number;
  content: string; // Serialized chunk content (CSV row or JSON string, or media link)
  mediaUrl?: string;
  mimeType: string;
  hash: string;
  createdAt: string;
}

export interface GeneratedTaskEntity {
  id: string;
  pipelineId: string;
  datasetId: string;
  chunkId: string;
  taskType: string;
  title: string;
  description: string;
  instructions: string[];
  difficulty: TaskDifficulty;
  estimatedCompletionTime: number;
  contributorLevelRequired: number;
  minimumTrustScore: number;
  requiredAccuracy: number;
  estimatedConsensusCount: number;
  qualityThreshold: number;
  rewardCoins: number;
  priority: TaskPriority;
  expectedCost: number;
  language: string;
  country: string;
  status: GeneratedTaskStatus;
  validationRules: Record<string, any>;
  attachments: TaskAttachment[];
  metadata: Record<string, any>;
  aiMetadata: {
    associatedModel?: string;
    anomalyScore?: number;
    duplicateScore?: number;
    confidenceScore?: number;
    validationFeedback?: string;
  };
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedTaskId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskGenPipeline {
  id: string;
  name: string;
  datasetId: string;
  datasetName: string;
  status: TaskGenPipelineStatus;
  taskType: string;
  templateId?: string;
  chunkSize: number;
  totalRows: number;
  generatedCount: number;
  approvedCount: number;
  rejectedCount: number;
  avgDifficulty: TaskDifficulty;
  avgRewardCoins: number;
  estimatedCost: number;
  progressPercentage: number; // 0 to 100
  telemetryLogs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskGenerationTelemetryEvent {
  id: string;
  pipelineId: string;
  eventType: string;
  actorId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface TaskGenerationFilterOptions {
  searchTerm?: string;
  datasetId?: string;
  taskType?: string;
  difficulty?: TaskDifficulty;
  status?: GeneratedTaskStatus;
  language?: string;
  country?: string;
  minReward?: number;
  maxReward?: number;
  sortBy?: 'newest' | 'oldest' | 'rewardHigh' | 'rewardLow' | 'difficultyHigh';
  page?: number;
  limit?: number;
}

export interface TaskGenerationAnalyticsSummary {
  totalGenerated: number;
  totalPublished: number;
  totalApproved: number;
  totalRejected: number;
  averageDifficulty: string;
  averageReward: number;
  generationSpeed: number; // tasks/minute
  approvalRate: number; // percentage
  rejectionRate: number; // percentage
  estimatedRevenue: number;
  datasetCoverage: number; // percentage
  contributorCapacity: number;
}
