/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission } from '../../types/submission';

/**
 * Tabular sheet rows returned by Sheets adapters.
 */
export interface TabularSheetData {
  sheetName: string;
  headers: string[];
  rows: any[][];
}

/**
 * Drive export document shape.
 */
export interface GoogleDriveMetadataPayload {
  fileName: string;
  mimeType: string;
  folderStructure: string[];
  submissionId: string;
  associatedTaskType: string;
  payload: Record<string, any>;
  archivedAt: string;
}

/**
 * Decoupled integration adapter for Google Workspace applications (Drive + Sheets).
 * Conforms strictly to enterprise requirements: no active live binary uploads/network bindings,
 * mapping structural layouts safely instead.
 */
export class SubmissionAdapter {
  // ========================================================
  // GOOGLE SHEETS ADAPTER PIPELINES
  // ========================================================

  /**
   * Adapts submissions to a General Submission Report.
   */
  static toSubmissionReport(submissions: Submission[]): TabularSheetData {
    return {
      sheetName: 'Submission_Reports_Active',
      headers: ['Submission ID', 'Task ID', 'User ID', 'Completed At', 'Elapsed Time (s)', 'Status', 'Sync Status', 'Offline'],
      rows: submissions.map(s => [
        s.submissionId,
        s.taskId,
        s.userId,
        s.completedAt,
        s.elapsedTime,
        s.submissionStatus,
        s.syncStatus,
        s.offlineFlag ? 'YES' : 'NO'
      ])
    };
  }

  /**
   * Adapts submissions to a Validation Audit Report.
   */
  static toValidationReport(submissions: Submission[]): TabularSheetData {
    return {
      sheetName: 'Validation_Reports_Pipeline',
      headers: ['Submission ID', 'Task ID', 'Validation Status', 'Accuracy Score', 'Spam Probability', 'Speed Index', 'Signature Status'],
      rows: submissions.map(s => [
        s.submissionId,
        s.taskId,
        s.validationStatus,
        s.trustSnapshot.accuracy,
        s.trustSnapshot.spamProbability,
        s.trustSnapshot.speedIndex,
        s.metadata?.clientSignature ? 'VERIFIED' : 'UNSIGNED'
      ])
    };
  }

  /**
   * Adapts submissions to a Quality Assurance (QA) Report.
   */
  static toQAReport(submissions: Submission[]): TabularSheetData {
    return {
      sheetName: 'QA_Reports_Manual',
      headers: ['Submission ID', 'Review Status', 'Validator Comments', 'Escalated', 'Device Category', 'Operating System', 'Browser Version'],
      rows: submissions.map(s => [
        s.submissionId,
        s.reviewStatus,
        s.humanMetadata.reviewerComments || 'N/A',
        s.humanMetadata.escalationTriggered ? 'YES' : 'NO',
        s.deviceSnapshot.deviceType,
        s.deviceSnapshot.operatingSystem,
        s.browserSnapshot
      ])
    };
  }

  /**
   * Adapts submissions to a Business Campaign Funding Report.
   */
  static toBusinessReport(submissions: Submission[]): TabularSheetData {
    return {
      sheetName: 'Business_Reports_Financial',
      headers: ['Submission ID', 'Task ID', 'Estimated Duration (s)', 'Actual Duration (s)', 'Coin Multiplier Weight', 'Territory ISO', 'Language constraints'],
      rows: submissions.map(s => [
        s.submissionId,
        s.taskId,
        s.elapsedTime, // Representing elapsed seconds
        s.elapsedTime, 
        s.trustSnapshot.currentScore / 100, // Weighted multiplier based on trust score
        s.country,
        s.language
      ])
    };
  }

  /**
   * Adapts submissions to an Administrative Operations Master Report.
   */
  static toAdminReport(submissions: Submission[]): TabularSheetData {
    return {
      sheetName: 'Admin_Operations_Master',
      headers: ['Submission ID', 'Task Version', 'Player Version', 'Submission Version', 'Nonce Timestamp', 'AI Guardrail Violations', 'Created At', 'Last Mutated'],
      rows: submissions.map(s => [
        s.submissionId,
        s.taskVersion,
        1, // Player Version placeholder
        s.submissionVersion,
        s.metadata?.nonce || 'N/A',
        s.aiMetadata.autoHateSpeechFlag || s.aiMetadata.promptInjectionsDetected ? 'FLAGGED' : 'CLEAN',
        s.createdAt,
        s.updatedAt
      ])
    };
  }

  // ========================================================
  // GOOGLE DRIVE METADATA EXPORTS
  // ========================================================

  /**
   * Formats a submission payload and its accompanying attachments as standard Drive archive file assets.
   */
  static toDriveMetadata(submission: Submission, taskCategory: string): GoogleDriveMetadataPayload {
    const safeCategory = taskCategory.toLowerCase().replace(/\s+/g, '_');
    const folderStructure = ['TaskNova_Vault', 'Submissions', safeCategory, submission.userId];

    return {
      fileName: `submission_payload_${submission.submissionId}_V${submission.submissionVersion}.json`,
      mimeType: 'application/json',
      folderStructure,
      submissionId: submission.submissionId,
      associatedTaskType: taskCategory,
      payload: {
        answers: submission.answers,
        trustHeuristics: submission.trustSnapshot,
        clientContext: submission.deviceSnapshot,
        attachmentsReferenced: submission.attachmentsMetadata.map(att => ({
          name: att.name,
          driveFileId: att.driveFileId,
          sizeBytes: att.sizeBytes,
          fileMime: att.mimeType,
          checksum: att.checksum
        }))
      },
      archivedAt: new Date().toISOString()
    };
  }
}
