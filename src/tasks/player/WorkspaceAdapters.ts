/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerSession } from '../../types/player';
import { TaskAttachment } from '../../types/tasks';

/**
 * Drive attachment schema metadata mapping representation.
 */
export interface DriveMetadataTemplate {
  fileId: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  webViewLink: string;
  ownerEmail: string;
  isPublicInWorkspace: boolean;
  assetCategory: 'image' | 'audio' | 'video' | 'document' | 'unsupported';
}

/**
 * Converts local task attachment schemas into rich Google Drive metadata tags.
 */
export function mapAttachmentToDriveMetadata(attachment: TaskAttachment): DriveMetadataTemplate {
  let assetCategory: DriveMetadataTemplate['assetCategory'] = 'unsupported';
  if (attachment.fileType === 'image') assetCategory = 'image';
  else if (attachment.fileType === 'audio') assetCategory = 'audio';
  else if (attachment.fileType === 'video') assetCategory = 'video';
  else if (attachment.fileType === 'document') assetCategory = 'document';

  return {
    fileId: attachment.driveFileId || `DRIVE-MOCK-${attachment.id}`,
    originalFileName: attachment.name,
    mimeType: getMimeTypeByExtension(attachment.name),
    fileSizeBytes: attachment.sizeBytes,
    webViewLink: attachment.url,
    ownerEmail: 'workspace-sync-agent@tasknova-ai.iam.gserviceaccount.com',
    isPublicInWorkspace: true,
    assetCategory
  };
}

function getMimeTypeByExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'ogg': return 'audio/ogg';
    case 'pdf': return 'application/pdf';
    case 'mp4': return 'video/mp4';
    case 'json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

/**
 * Tabular report format representation for Google Sheets writes.
 */
export interface SheetsRowMatrix {
  headers: string[];
  rows: string[][];
}

/**
 * Adapts player alignment sessions, quality scores, and activity logs 
 * into formatted grids ready for Google Sheets Range update operations.
 */
export class WorkspaceSheetsAdapter {
  
  /**
   * Adapts active validator session records into high-fidelity rows.
   */
  adaptSessionsToGrid(sessions: PlayerSession[]): SheetsRowMatrix {
    const headers = [
      'Session ID', 'User ID', 'Task ID', 'Version', 
      'Started At', 'Completed At', 'Elapsed Seconds', 
      'Remaining Seconds', 'Pause Count', 'Answers JSON', 'Device', 'Language', 'Trust Accuracy'
    ];

    const rows = sessions.map(s => [
      s.sessionId,
      s.userId,
      s.taskId,
      String(s.taskVersion),
      s.startedAt,
      s.completedAt || 'Incomplete',
      String(s.elapsedTime),
      String(s.remainingTime),
      String(s.pauseCount),
      JSON.stringify(s.answers),
      s.deviceInformation,
      s.language,
      `${s.trustSnapshot.accuracy}%`
    ]);

    return { headers, rows };
  }

  /**
   * Adapts quality logs into validation auditing rows.
   */
  adaptQualityReports(sessions: PlayerSession[]): SheetsRowMatrix {
    const headers = [
      'Session ID', 'Task ID', 'Validator User', 'Duration (s)', 
      'Trust Score Score', 'Speed Index', 'Spam Probability (%)', 'Accuracy (%)'
    ];

    const rows = sessions.map(s => [
      s.sessionId,
      s.taskId,
      s.userId,
      String(s.elapsedTime),
      String(s.trustSnapshot.currentScore),
      String(s.trustSnapshot.speedIndex),
      `${(s.trustSnapshot.spamProbability * 100).toFixed(1)}%`,
      `${s.trustSnapshot.accuracy}%`
    ]);

    return { headers, rows };
  }

  /**
   * Compiles basic system-level operational transition activity audits.
   */
  adaptSessionActivityLogs(sessions: PlayerSession[]): SheetsRowMatrix {
    const headers = ['Timestamp', 'Session ID', 'Action Executed', 'Client Detail', 'Status'];
    const rows = sessions.map(s => [
      s.lastSaved,
      s.sessionId,
      s.completedAt ? 'Submit Task Alignment' : 'Periodic Autosave Sync',
      `${s.browserInformation} (${s.deviceInformation})`,
      s.completedAt ? 'SUCCESS_COMMIT' : 'DRAFT_CACHED'
    ]);

    return { headers, rows };
  }
}

export const GlobalWorkspaceSheetsAdapter = new WorkspaceSheetsAdapter();
