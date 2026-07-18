/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission, SubmissionStatus, ValidationStatus, ReviewStatus } from '../../types/submission';
import { PlayerSession } from '../../types/player';
import { Task } from '../../types/tasks';

/**
 * Standard mapper class.
 * Ensures bidirectional transformation of Submission domains into Firestore/localStorage records
 * and handles the packaging pipeline.
 */
export class SubmissionMapper {
  /**
   * Compiles an active Player Session, parent Task context, and client browser specs
   * into a fully qualified, locked, and serialized Domain Submission structure.
   */
  static packageSessionToSubmission(
    session: PlayerSession,
    task: Task,
    browserAgent: string,
    offlineFlag: boolean,
    clientSignature?: string
  ): Submission {
    const now = new Date().toISOString();

    return {
      submissionId: `SUB-${session.sessionId.split('-')[1] || Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      submissionVersion: 1, // Current schema specification signature
      taskId: session.taskId,
      taskVersion: task.version,
      playerSessionId: session.sessionId,
      userId: session.userId,
      role: 'contributor', // Defaults to standard contributor grade
      answers: { ...session.answers },
      attachmentsMetadata: task.attachments.map(att => ({
        id: att.id,
        name: att.name,
        mimeType: this.getFileMimeType(att.fileType),
        url: att.url,
        driveFileId: att.driveFileId || `DRV-FILE-${att.id}`,
        sizeBytes: att.sizeBytes,
        checksum: `CHK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      })),
      startedAt: session.startedAt,
      completedAt: session.completedAt || now,
      elapsedTime: session.elapsedTime,
      submissionStatus: offlineFlag ? SubmissionStatus.OFFLINE : SubmissionStatus.PENDING_VALIDATION,
      trustSnapshot: { ...session.trustSnapshot },
      deviceSnapshot: {
        deviceType: this.detectDeviceType(browserAgent),
        operatingSystem: this.detectOS(browserAgent),
        browserName: this.detectBrowser(browserAgent),
        screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
        userAgent: browserAgent,
      },
      browserSnapshot: this.detectBrowser(browserAgent),
      country: session.country || 'ALL',
      language: session.language || 'en-US',
      offlineFlag,
      syncStatus: offlineFlag ? 'pending' : 'synced',
      validationStatus: ValidationStatus.PENDING,
      reviewStatus: ReviewStatus.NONE,
      qualityScorePlaceholder: null,
      rewardPlaceholder: null, // Immutable representation to preserve wallet calculations safely
      metadata: {
        nonce: `NONCE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        clientSignature: clientSignature || '',
        ...session.metadata,
      },
      aiMetadata: {},
      humanMetadata: {},
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Translates a pure domain Submission object into a serialized database-ready JSON record.
   */
  static toFirestore(submission: Submission): Record<string, any> {
    return {
      ...submission,
      // Map to uppercase values where helpful or flat representations
      answersJson: JSON.stringify(submission.answers),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Reconstitutes a database JSON document into a fully typed domain Submission model.
   */
  static fromFirestore(doc: Record<string, any>): Submission {
    return {
      submissionId: doc.submissionId,
      submissionVersion: doc.submissionVersion || 1,
      taskId: doc.taskId,
      taskVersion: doc.taskVersion || 1,
      playerSessionId: doc.playerSessionId,
      userId: doc.userId,
      role: doc.role || 'contributor',
      answers: typeof doc.answersJson === 'string' ? JSON.parse(doc.answersJson) : (doc.answers || {}),
      attachmentsMetadata: doc.attachmentsMetadata || [],
      startedAt: doc.startedAt,
      completedAt: doc.completedAt,
      elapsedTime: doc.elapsedTime || 0,
      submissionStatus: doc.submissionStatus as SubmissionStatus,
      trustSnapshot: doc.trustSnapshot || { currentScore: 100, accuracy: 100, speedIndex: 0, spamProbability: 0, flaggedAttemptsCount: 0 },
      deviceSnapshot: doc.deviceSnapshot || { deviceType: 'Desktop', operatingSystem: 'Unknown', browserName: 'Unknown', screenResolution: '1920x1080', userAgent: '' },
      browserSnapshot: doc.browserSnapshot || 'Unknown',
      country: doc.country || 'ALL',
      language: doc.language || 'en-US',
      offlineFlag: !!doc.offlineFlag,
      syncStatus: doc.syncStatus || 'synced',
      validationStatus: (doc.validationStatus || ValidationStatus.PENDING) as ValidationStatus,
      reviewStatus: (doc.reviewStatus || ReviewStatus.NONE) as ReviewStatus,
      qualityScorePlaceholder: doc.qualityScorePlaceholder !== undefined ? doc.qualityScorePlaceholder : null,
      rewardPlaceholder: doc.rewardPlaceholder !== undefined ? doc.rewardPlaceholder : null,
      metadata: doc.metadata || {},
      aiMetadata: doc.aiMetadata || {},
      humanMetadata: doc.humanMetadata || {},
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt || doc.createdAt,
    };
  }

  // ========================================================
  // DECOUPLED AGENT & OS PARSER HELPERS
  // ========================================================

  private static getFileMimeType(fileType: string): string {
    switch (fileType) {
      case 'image': return 'image/jpeg';
      case 'audio': return 'audio/wav';
      case 'video': return 'video/mp4';
      case 'document': return 'application/pdf';
      case 'zip': return 'application/zip';
      default: return 'application/octet-stream';
    }
  }

  private static detectDeviceType(ua: string): 'Desktop' | 'Mobile' | 'Tablet' {
    const agent = ua.toLowerCase();
    if (agent.includes('tablet') || agent.includes('ipad')) return 'Tablet';
    if (agent.includes('mobile') || agent.includes('iphone') || agent.includes('android')) return 'Mobile';
    return 'Desktop';
  }

  private static detectOS(ua: string): string {
    const agent = ua.toLowerCase();
    if (agent.includes('win')) return 'Windows';
    if (agent.includes('mac')) return 'macOS';
    if (agent.includes('linux')) return 'Linux';
    if (agent.includes('iphone') || agent.includes('ipad')) return 'iOS';
    if (agent.includes('android')) return 'Android';
    return 'Unknown OS';
  }

  private static detectBrowser(ua: string): string {
    const agent = ua.toLowerCase();
    if (agent.includes('chrome')) return 'Google Chrome';
    if (agent.includes('safari') && !agent.includes('chrome')) return 'Apple Safari';
    if (agent.includes('firefox')) return 'Mozilla Firefox';
    if (agent.includes('edge')) return 'Microsoft Edge';
    return 'Unknown Browser';
  }
}
