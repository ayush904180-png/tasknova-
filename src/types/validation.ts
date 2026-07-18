/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission, ValidationStatus } from './submission';
import { TrustSnapshot } from './player';

/**
 * All validation pipeline events.
 */
export enum ValidationEventType {
  ValidationStarted = 'ValidationStarted',
  ValidationPassed = 'ValidationPassed',
  ValidationFailed = 'ValidationFailed',
  ConfidenceCalculated = 'ConfidenceCalculated',
  QualityCalculated = 'QualityCalculated',
  RiskCalculated = 'RiskCalculated',
  ReviewRequested = 'ReviewRequested',
  ReviewCompleted = 'ReviewCompleted',
  ValidationFinished = 'ValidationFinished'
}

/**
 * Validation Pipeline Steps.
 */
export enum ValidationStepType {
  SCHEMA = 'Schema Validation',
  PAYLOAD = 'Payload Validation',
  DUPLICATE = 'Duplicate Detection',
  SPAM = 'Spam Detection',
  TRUST = 'Trust Snapshot',
  SPEED = 'Speed Analysis',
  CONSISTENCY = 'Consistency Analysis',
  AI = 'AI Validation',
  CONFIDENCE = 'Confidence Engine',
  QUALITY = 'Quality Score Engine',
  RISK = 'Risk Engine',
  DECISION = 'Decision Engine'
}

/**
 * Status of an individual validation step.
 */
export enum ValidationStepStatus {
  IDLE = 'Idle',
  RUNNING = 'Running',
  COMPLETED = 'Completed',
  SKIPPED = 'Skipped',
  FAILED = 'Failed'
}

/**
 * Confidence Levels.
 */
export enum ConfidenceLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

/**
 * Trust levels evaluated by the system.
 */
export enum TrustLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  SUSPICIOUS = 'Suspicious',
  BOT = 'Bot'
}

/**
 * Trend analysis of contributor trust.
 */
export enum TrustTrend {
  IMPROVING = 'Improving',
  STABLE = 'Stable',
  DECLINING = 'Declining'
}

/**
 * Review priority tiers.
 */
export enum ReviewPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

/**
 * Quality Score Schema.
 * Coordinates multidimensional scoring before final ledger settlements.
 */
export interface QualityScoreModel {
  accuracyScore: number;                 // Heuristic alignment (0-100)
  consistencyScore: number;              // User historical answer alignment (0-100)
  instructionFollowingScore: number;     // AI-evaluated compliance (0-100)
  completenessScore: number;             // Response length & coverage metrics (0-100)
  speedScore: number;                    // Score normalized against target task bounds (0-100)
  trustModifier: number;                 // Adjustment offset derived from reputation (-20 to +20)
  finalQualityScore: number;             // Weighted aggregate (0-100)
}

/**
 * Confidence Engine Metrics.
 */
export interface ConfidenceModel {
  confidencePercent: number;             // Calculated confidence accuracy (0-100)
  confidenceLevel: ConfidenceLevel;      // Normalized High/Medium/Low representation
  decisionThresholds: {                  // Active boundaries for automated decisions
    autoApproveThreshold: number;        // e.g. 85
    autoRejectThreshold: number;         // e.g. 30
  };
}

/**
 * Risk Engine Model.
 * Evaluates malicious activity vector indexes.
 */
export interface RiskModel {
  spamRisk: number;                      // Keyboard mashing & repetitive entry (0.0 to 1.0)
  fraudRisk: number;                     // Profile and device signature match anomalies (0.0 to 1.0)
  duplicateRisk: number;                 // Collision with other records in storage (0.0 to 1.0)
  automationRisk: number;                // Speed patterns suggesting scripts (0.0 to 1.0)
  botRisk: number;                       // Captcha / telemetry mismatch score (0.0 to 1.0)
  velocityRisk: number;                  // Completion velocity compared to limits (0.0 to 1.0)
  behaviorRisk: number;                  // Pattern of pausing and navigation focuses (0.0 to 1.0)
  deviceRisk: number;                    // VPN, rooted/emulated environments (0.0 to 1.0)
  networkRisk: number;                   // IP proxy / geo discrepancies (0.0 to 1.0)
  aiRisk: number;                        // LLM prompt injection and toxic text flag checks (0.0 to 1.0)
  aggregateRiskScore: number;            // Normalized index value (0-100)
}

/**
 * Trust Engine Record.
 */
export interface TrustEngineRecord {
  trustSnapshot: TrustSnapshot;          // Reputation reference from player profile
  trustHistory: number[];                // History list of scores (up to last 10 tasks)
  trustDelta: number;                    // Change from last validation (e.g. +1.5)
  trustLevel: TrustLevel;                // Overall reputation tier
  trustTrend: TrustTrend;                // Direction indicator
}

/**
 * Human Review Queue Item.
 * Staged for verification when automated confidence falls below thresholds.
 */
export interface HumanReviewItem {
  reviewId: string;                      // Cryptographically unique token prefixed with "REV-"
  submissionId: string;                  // Source submission reference
  status: 'Pending Review' | 'Assigned Reviewer' | 'Completed' | 'Escalated';
  priority: ReviewPriority;              // Criticality metric
  assignedReviewer: string | null;       // Expert auditor identifier
  reviewDeadline: string;                // ISO 8601 deadline threshold
  reviewNotes: string;                   // Audit feedback
  decision: 'Approved' | 'Rejected' | null; // Final consensus resolution
  escalationReason: string | null;       // Detailed flags explaining escalations
  history: Array<{                       // Audit ledger steps
    timestamp: string;
    action: string;
    actor: string;
    notes: string;
  }>;
}

/**
 * Comprehensive Validation Record.
 * Combines all engines into an auditable database block.
 */
export interface ValidationRecord {
  validationId: string;                  // Cryptographically unique token prefixed with "VAL-"
  submissionId: string;                  // Reference to Submission
  taskId: string;                        // Reference to Task
  userId: string;                        // Reference to Contributor
  validationStatus: 'Passed' | 'Failed' | 'Flagged' | 'Pending';
  decision: 'Approved' | 'Rejected' | 'Human Review Queue';
  startedAt: string;
  completedAt: string | null;
  elapsedMs: number;
  steps: Array<{
    type: ValidationStepType;
    name: string;
    status: ValidationStepStatus;
    startedAt: string;
    completedAt: string;
    error?: string;
    output?: Record<string, any>;
  }>;
  qualityScores: QualityScoreModel;
  confidence: ConfidenceModel;
  riskScores: RiskModel;
  trustState: TrustEngineRecord;
  signature: string;                     // Immutable validation audit block signature
  auditTrail: string[];                  // Serialized step entries
}

/**
 * Filtering options for validation record search queries.
 */
export interface ValidationFilterOptions {
  submissionId?: string;
  taskId?: string;
  userId?: string;
  validationStatus?: 'Passed' | 'Failed' | 'Flagged' | 'Pending';
  decision?: 'Approved' | 'Rejected' | 'Human Review Queue';
  minQualityScore?: number;
  maxRiskScore?: number;
  sortBy?: 'completedAt' | 'elapsedMs' | 'qualityScore' | 'riskScore';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Event payloads for Validation Event Bus.
 */
export interface ValidationEventPayloads {
  [ValidationEventType.ValidationStarted]: { validationId: string; submissionId: string; timestamp: string };
  [ValidationEventType.ValidationPassed]: { validationId: string; submissionId: string; finalScore: number; timestamp: string };
  [ValidationEventType.ValidationFailed]: { validationId: string; submissionId: string; reason: string; timestamp: string };
  [ValidationEventType.ConfidenceCalculated]: { validationId: string; percent: number; level: ConfidenceLevel; timestamp: string };
  [ValidationEventType.QualityCalculated]: { validationId: string; score: number; timestamp: string };
  [ValidationEventType.RiskCalculated]: { validationId: string; riskScore: number; timestamp: string };
  [ValidationEventType.ReviewRequested]: { reviewId: string; submissionId: string; priority: ReviewPriority; timestamp: string };
  [ValidationEventType.ReviewCompleted]: { reviewId: string; submissionId: string; reviewer: string; decision: 'Approved' | 'Rejected'; timestamp: string };
  [ValidationEventType.ValidationFinished]: { validationId: string; submissionId: string; decision: 'Approved' | 'Rejected' | 'Human Review Queue'; timestamp: string };
}

/**
 * Task validator plugin interface.
 * Every task type registers a validator plugin to assess custom response payloads.
 */
export interface TaskValidatorPlugin {
  type: string;                          // Target task category match (e.g. "Translation Validation")
  name: string;
  validateAnswers: (answers: Record<string, any>, referencePayload: Record<string, any>) => Promise<{
    isCompliant: boolean;
    accuracyScore: number;               // 0-100
    instructionFollowingScore: number;   // 0-100
    completenessScore: number;           // 0-100
    notes?: string;
  }>;
}

/**
 * Tabular export structures for Google Sheets.
 */
export interface SheetsReportPayload {
  headers: string[];
  rows: any[][];
}

/**
 * Google Drive metadata structures for validation assets.
 */
export interface DriveValidationMetadata {
  validationAssets: Array<{ id: string; name: string; url: string; category: 'Screenshot' | 'ReferenceFile' | 'ReviewerNote' | 'AIReport' }>;
  uploadedAt: string;
}
