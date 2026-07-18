/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationRecord, SheetsReportPayload, DriveValidationMetadata, HumanReviewItem } from '../../types/validation';

/**
 * Enterprise Google Integration Adapter for the Validation Engine.
 * Formats complex hierarchical record sets into flat, two-dimensional structures for Google Sheets,
 * and compiles structured metadata directories for file indexing in Google Drive.
 */
export class ValidationAdapter {
  
  // ==========================================
  // 1. GOOGLE SHEETS REPORT GENERATORS
  // ==========================================

  /**
   * Generates a flat, tab-ready Validation Pipeline audit report.
   */
  static toValidationReport(records: ValidationRecord[]): SheetsReportPayload {
    return {
      headers: [
        'Validation ID',
        'Submission ID',
        'Task ID',
        'User ID',
        'Validation Status',
        'Decision',
        'Started At',
        'Completed At',
        'Elapsed (ms)',
        'Confidence Percent',
        'Confidence Level',
        'Cryptographic Signature'
      ],
      rows: records.map(r => [
        r.validationId,
        r.submissionId,
        r.taskId,
        r.userId,
        r.validationStatus,
        r.decision,
        r.startedAt,
        r.completedAt || 'N/A',
        r.elapsedMs,
        r.confidence.confidencePercent,
        r.confidence.confidenceLevel,
        r.signature
      ])
    };
  }

  /**
   * Generates a Quality Score details report tracking multidimensional scores.
   */
  static toQualityReport(records: ValidationRecord[]): SheetsReportPayload {
    return {
      headers: [
        'Validation ID',
        'User ID',
        'Accuracy Score',
        'Consistency Score',
        'Instruction Following Score',
        'Completeness Score',
        'Speed Score',
        'Trust Modifier',
        'Final Quality Score'
      ],
      rows: records.map(r => [
        r.validationId,
        r.userId,
        r.qualityScores.accuracyScore,
        r.qualityScores.consistencyScore,
        r.qualityScores.instructionFollowingScore,
        r.qualityScores.completenessScore,
        r.qualityScores.speedScore,
        r.qualityScores.trustModifier,
        r.qualityScores.finalQualityScore
      ])
    };
  }

  /**
   * Generates a security and risk audit vector report.
   */
  static toRiskReport(records: ValidationRecord[]): SheetsReportPayload {
    return {
      headers: [
        'Validation ID',
        'Spam Risk',
        'Fraud Risk',
        'Duplicate Risk',
        'Automation Risk',
        'Bot Risk',
        'Velocity Risk',
        'Behavior Risk',
        'Device Risk',
        'Network Risk',
        'AI Injection Risk',
        'Aggregate Risk Score'
      ],
      rows: records.map(r => [
        r.validationId,
        r.riskScores.spamRisk,
        r.riskScores.fraudRisk,
        r.riskScores.duplicateRisk,
        r.riskScores.automationRisk,
        r.riskScores.botRisk,
        r.riskScores.velocityRisk,
        r.riskScores.behaviorRisk,
        r.riskScores.deviceRisk,
        r.riskScores.networkRisk,
        r.riskScores.aiRisk,
        r.riskScores.aggregateRiskScore
      ])
    };
  }

  /**
   * Generates an operational manual auditor queue performance report.
   */
  static toReviewerReport(reviews: HumanReviewItem[]): SheetsReportPayload {
    return {
      headers: [
        'Review ID',
        'Submission ID',
        'Status',
        'Priority',
        'Assigned Reviewer',
        'Deadline',
        'Review Decision',
        'Escalated',
        'Escalation Reason',
        'Action Count'
      ],
      rows: reviews.map(rev => [
        rev.reviewId,
        rev.submissionId,
        rev.status,
        rev.priority,
        rev.assignedReviewer || 'Unassigned',
        rev.reviewDeadline,
        rev.decision || 'No Decision',
        rev.status === 'Escalated' ? 'Yes' : 'No',
        rev.escalationReason || 'None',
        rev.history.length
      ])
    };
  }

  /**
   * Generates financial, SLA duration, and business compliance datasets.
   */
  static toBusinessQAReport(records: ValidationRecord[]): SheetsReportPayload {
    return {
      headers: [
        'Validation ID',
        'Task ID',
        'User ID',
        'Duration SLA Check',
        'Trust Trend',
        'Validation Status',
        'Approved for Rewards'
      ],
      rows: records.map(r => [
        r.validationId,
        r.taskId,
        r.userId,
        r.qualityScores.speedScore > 50 ? 'Passed' : 'SLA Speed Violation',
        r.trustState.trustTrend,
        r.validationStatus,
        r.decision === 'Approved' ? 'APPROVED' : 'HOLD_REJECTED'
      ])
    };
  }

  // ==========================================
  // 2. GOOGLE DRIVE METADATA BUILDERS
  // ==========================================

  /**
   * Assembles a structured metadata container payload for filing documents in Google Drive.
   */
  static createDriveMetadata(
    validationId: string, 
    assets: Array<{ name: string; url: string; category: 'Screenshot' | 'ReferenceFile' | 'ReviewerNote' | 'AIReport' }>
  ): DriveValidationMetadata {
    return {
      validationAssets: assets.map((asset, index) => ({
        id: `DRV-VAL-AST-${validationId}-${index}`,
        name: asset.name,
        url: asset.url,
        category: asset.category
      })),
      uploadedAt: new Date().toISOString()
    };
  }
}
export default ValidationAdapter;
