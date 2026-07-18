/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskAttachment, TaskStatus } from '../../types/tasks';

/**
 * Adapter to translate task domain structures to third-party integration formats.
 * Fully compatible with Google Workspace (Sheets & Drive) and Firestore boundaries.
 */
export class TaskAdapter {
  /**
   * Translates a Google Drive API file metadata payload into a validated Domain TaskAttachment.
   */
  static mapDriveFileToAttachment(driveFile: {
    id: string;
    name: string;
    mimeType: string;
    sizeBytes: number;
    webViewLink: string;
  }): TaskAttachment {
    let fileType: TaskAttachment['fileType'] = 'document';

    const mime = driveFile.mimeType.toLowerCase();
    if (mime.startsWith('image/')) {
      fileType = 'image';
    } else if (mime.startsWith('audio/')) {
      fileType = 'audio';
    } else if (mime.startsWith('video/')) {
      fileType = 'video';
    } else if (mime.includes('zip') || mime.includes('compressed') || mime.includes('tar')) {
      fileType = 'zip';
    } else if (mime.includes('octet-stream') || mime.includes('model/')) {
      fileType = 'ai_asset';
    }

    return {
      id: `drive_${driveFile.id}`,
      name: driveFile.name,
      fileType,
      url: driveFile.webViewLink,
      driveFileId: driveFile.id,
      sizeBytes: driveFile.sizeBytes || 0,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Formats Task details into standard flat CSV arrays for Google Sheets export ranges.
   */
  static exportToSheetsRow(
    task: Task,
    reportType: 'Task' | 'Category' | 'Completion' | 'Quality' | 'Business' | 'Admin'
  ): any[] {
    const timestamp = new Date().toISOString();

    switch (reportType) {
      case 'Task':
        return [
          task.id,
          task.version,
          task.title,
          task.category,
          task.difficulty,
          task.rewardCoins,
          task.currentStatus,
          task.language,
          task.country,
          task.createdAt
        ];

      case 'Category':
        return [
          task.category,
          task.id,
          task.taskType,
          task.difficulty,
          task.rewardCoins,
          task.estimatedCompletionTime,
          timestamp
        ];

      case 'Completion':
        return [
          task.id,
          task.version,
          task.currentStatus,
          task.rewardCoins,
          task.maximumAttempts,
          task.cooldownPeriod,
          task.validationMethod,
          timestamp
        ];

      case 'Quality':
        return [
          task.id,
          task.requiredAccuracy,
          task.requiredTrustScore,
          task.validationMethod,
          task.reviewStrategy,
          task.aiMetadata.evaluationMetric || 'Consensus-SLA',
          timestamp
        ];

      case 'Business':
        return [
          task.business || 'N/A',
          task.creator,
          task.id,
          task.title,
          task.rewardCoins,
          task.currentStatus,
          task.visibility,
          timestamp
        ];

      case 'Admin':
        return [
          task.id,
          task.version,
          task.creator,
          task.currentStatus,
          task.priority,
          task.requiredTrustScore,
          task.createdAt,
          task.updatedAt,
          task.archivedAt || 'N/A'
        ];

      default:
        return [task.id, task.title, task.createdAt];
    }
  }

  /**
   * Generates headers matching sheets rows for report exports.
   */
  static getSheetsHeaders(reportType: 'Task' | 'Category' | 'Completion' | 'Quality' | 'Business' | 'Admin'): string[] {
    switch (reportType) {
      case 'Task':
        return ['Task ID', 'Version', 'Title', 'Category', 'Difficulty', 'Reward Coins', 'Status', 'Language', 'Country', 'Created At'];
      case 'Category':
        return ['Category Name', 'Sample Task ID', 'Plugin Type', 'Difficulty', 'Default Reward', 'Estimated Seconds', 'Exported At'];
      case 'Completion':
        return ['Task ID', 'Version', 'Status', 'Reward', 'Max Attempts', 'Cooldown (s)', 'Validation Method', 'Exported At'];
      case 'Quality':
        return ['Task ID', 'Target Accuracy %', 'Required Trust Score %', 'Validation Method', 'Review Strategy', 'AI Metric SLA', 'Exported At'];
      case 'Business':
        return ['Campaign ID', 'Creator ID', 'Task ID', 'Title', 'Cost Per Hit', 'Status', 'Visibility', 'Exported At'];
      case 'Admin':
        return ['Task ID', 'Version', 'Creator ID', 'Status', 'Priority', 'Trust Threshold', 'Created At', 'Updated At', 'Archived At'];
      default:
        return ['ID', 'Label', 'Timestamp'];
    }
  }
}
