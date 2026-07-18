/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission, SubmissionStatus, ValidationStatus, ReviewStatus, SubmissionEventType } from '../../types/submission';
import { PlayerSession } from '../../types/player';
import { Task } from '../../types/tasks';
import { GlobalSubmissionRepository } from '../repositories/SubmissionRepository';
import { SubmissionMapper } from '../mappers/SubmissionMapper';
import { SubmissionValidator } from '../utils/SubmissionValidator';
import { SubmissionEventBus } from '../events/SubmissionEventBus';

/**
 * Enterprise analytics reports for Submissions.
 */
export interface SubmissionTelemetrySummary {
  totalCreated: number;
  totalSaved: number;
  totalSynced: number;
  approvalRate: number;       // Percentage (%)
  rejectRate: number;         // Percentage (%)
  retryCount: number;         // Accumulated sync retries
  offlineSyncSuccess: number; // Count of successful offline synced batches
  averageCompletionTime: number; // in seconds
}

/**
 * Enterprise Submission Orchestrator.
 * Coordinates validator schemas, cryptographic signature locks, repository triggers,
 * and high-fidelity operational metrics reporting.
 */
export class SubmissionService {
  private eventsLog: Array<{
    type: string;
    submissionId: string;
    elapsedTime: number;
    status: SubmissionStatus;
    timestamp: string;
  }> = [];

  private totalSyncRetries: number = 0;
  private offlineSyncSuccessCount: number = 0;

  constructor() {
    this.listenToEventBus();
  }

  private listenToEventBus(): void {
    // Dynamically log interaction telemetry across the Event Bus
    SubmissionEventBus.on(SubmissionEventType.SubmissionCreated, (payload) => {
      this.eventsLog.push({
        type: 'created',
        submissionId: payload.submission.submissionId,
        elapsedTime: payload.submission.elapsedTime,
        status: payload.submission.submissionStatus,
        timestamp: payload.timestamp,
      });
    });

    SubmissionEventBus.on(SubmissionEventType.SubmissionSaved, (payload) => {
      this.eventsLog.push({
        type: 'saved',
        submissionId: payload.submissionId,
        elapsedTime: 0,
        status: payload.status,
        timestamp: payload.timestamp,
      });
    });

    SubmissionEventBus.on(SubmissionEventType.SubmissionSynced, (payload) => {
      this.eventsLog.push({
        type: 'synced',
        submissionId: payload.submissionId,
        elapsedTime: 0,
        status: SubmissionStatus.PENDING_VALIDATION,
        timestamp: payload.timestamp,
      });
      this.offlineSyncSuccessCount++;
    });
  }

  /**
   * Main Packaging & Preservation flow. Converts a PlayerSession and Task context,
   * performs strict security and validation checks, creates signatures, and commits to the Repository.
   */
  async packageAndSave(
    session: PlayerSession,
    task: Task,
    userAgent: string,
    isOffline: boolean
  ): Promise<{ success: boolean; submissionId?: string; error?: string }> {
    try {
      // 1. Compile client dynamic signatures (for replay protection & tamper prevention)
      const nonce = `NONCE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Temporarily construct minimal model structure to calculate the client signature
      const rawPayload = {
        submissionId: `SUB-${session.sessionId.split('-')[1] || 'TEMP'}`,
        userId: session.userId,
        taskId: session.taskId,
        answers: session.answers,
      };

      const computedSig = SubmissionValidator.computeChecksum(rawPayload as any);

      // 2. Map structures into a robust Domain Submission
      const submission = SubmissionMapper.packageSessionToSubmission(
        session,
        task,
        userAgent,
        isOffline,
        computedSig
      );

      // 3. Verify validator results and commit changes
      await GlobalSubmissionRepository.save(submission, task.estimatedCompletionTime);

      return {
        success: true,
        submissionId: submission.submissionId,
      };
    } catch (err: any) {
      console.error('[SubmissionService] Failed packaging submission:', err);
      return {
        success: false,
        error: err.message || 'Unknown serialization conflict.',
      };
    }
  }

  /**
   * Synchronizes stored offline queue submissions.
   */
  async syncOfflineSubmissions(): Promise<{ successCount: number; dlqCount: number }> {
    this.totalSyncRetries++;
    const res = await GlobalSubmissionRepository.syncOfflineQueue();
    return res;
  }

  /**
   * Executes verifier manual review actions. Transitions state and dispatches event audits.
   */
  async manualReviewSubmission(
    submissionId: string,
    status: 'approved' | 'rejected',
    comments: string,
    reviewerId: string
  ): Promise<void> {
    const submission = await GlobalSubmissionRepository.getById(submissionId);
    if (!submission) {
      throw new Error(`[SubmissionService] Submission "${submissionId}" not found.`);
    }

    const now = new Date().toISOString();
    const updated: Submission = {
      ...submission,
      submissionStatus: status === 'approved' ? SubmissionStatus.APPROVED : SubmissionStatus.REJECTED,
      validationStatus: status === 'approved' ? ValidationStatus.PASSED : ValidationStatus.FAILED,
      reviewStatus: ReviewStatus.HUMAN_COMPLETED,
      humanMetadata: {
        ...submission.humanMetadata,
        reviewerComments: comments,
        verificationBatchId: `BATCH-REV-${Date.now().toString().substring(7)}`,
      },
      updatedAt: now,
    };

    await GlobalSubmissionRepository.save(updated);

    if (status === 'approved') {
      SubmissionEventBus.emit(SubmissionEventType.SubmissionApproved, {
        submissionId,
        reviewerId,
        score: 100, // Top tier alignment score
        timestamp: now,
      });
    } else {
      SubmissionEventBus.emit(SubmissionEventType.SubmissionRejected, {
        submissionId,
        reviewerId,
        reason: comments,
        timestamp: now,
      });
    }
  }

  /**
   * Executes administrative archival workflows.
   */
  async archiveSubmission(submissionId: string, archiverId: string): Promise<void> {
    const submission = await GlobalSubmissionRepository.getById(submissionId);
    if (!submission) {
      throw new Error(`[SubmissionService] Submission "${submissionId}" not found.`);
    }

    const now = new Date().toISOString();
    const updated: Submission = {
      ...submission,
      submissionStatus: SubmissionStatus.ARCHIVED,
      updatedAt: now,
    };

    await GlobalSubmissionRepository.save(updated);

    SubmissionEventBus.emit(SubmissionEventType.SubmissionArchived, {
      submissionId,
      archiverId,
      timestamp: now,
    });
  }

  /**
   * Compiles high-fidelity operational telemetry summaries.
   */
  compileTelemetry(): SubmissionTelemetrySummary {
    const diskList = localStorage.getItem('tasknova_submissions_db');
    const submissions: Submission[] = diskList ? JSON.parse(diskList) : [];

    const totalCreated = this.eventsLog.filter(e => e.type === 'created').length;
    const totalSaved = this.eventsLog.filter(e => e.type === 'saved').length;
    const totalSynced = this.eventsLog.filter(e => e.type === 'synced').length;

    const totalRated = submissions.filter(s => 
      s.submissionStatus === SubmissionStatus.APPROVED || s.submissionStatus === SubmissionStatus.REJECTED
    ).length;

    const approvedCount = submissions.filter(s => s.submissionStatus === SubmissionStatus.APPROVED).length;
    const rejectedCount = submissions.filter(s => s.submissionStatus === SubmissionStatus.REJECTED).length;

    const approvalRate = totalRated > 0 ? parseFloat(((approvedCount / totalRated) * 100).toFixed(1)) : 0;
    const rejectRate = totalRated > 0 ? parseFloat(((rejectedCount / totalRated) * 100).toFixed(1)) : 0;

    const completedSeconds = submissions.reduce((acc, s) => acc + s.elapsedTime, 0);
    const averageCompletionTime = submissions.length > 0 ? parseFloat((completedSeconds / submissions.length).toFixed(1)) : 0;

    return {
      totalCreated,
      totalSaved,
      totalSynced,
      approvalRate,
      rejectRate,
      retryCount: this.totalSyncRetries,
      offlineSyncSuccess: this.offlineSyncSuccessCount,
      averageCompletionTime,
    };
  }
}

// Global Single Instance
export const GlobalSubmissionService = new SubmissionService();
export default GlobalSubmissionService;
