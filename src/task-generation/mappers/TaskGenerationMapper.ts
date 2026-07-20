/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneratedTaskEntity, TaskTemplate } from '../types';
import { Task, TaskDifficulty, TaskPriority, TaskStatus, TaskAttachment } from '../../types/tasks';

export class TaskGenerationMapper {
  /**
   * Translates a GeneratedTaskEntity (after being approved) to the standard Task domain entity
   * expected by the marketplace Task Repository and Task Player, ensuring full compatibility.
   */
  static toMarketplaceTask(entity: GeneratedTaskEntity): Task {
    return {
      id: entity.id,
      version: 1,
      parentTaskId: null,
      taskType: entity.taskType,
      title: entity.title,
      description: entity.description,
      instructions: entity.instructions,
      category: entity.taskType, // Use taskType as standard category for player
      difficulty: entity.difficulty,
      estimatedCompletionTime: entity.estimatedCompletionTime,
      rewardCoins: entity.rewardCoins,
      priority: entity.priority,
      language: entity.language,
      country: entity.country,
      region: null,
      requiredAccuracy: entity.requiredAccuracy,
      requiredTrustScore: entity.minimumTrustScore,
      maximumAttempts: 1,
      cooldownPeriod: 0,
      validationMethod: 'Consensus',
      reviewStrategy: 'Immediate',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days active
      visibility: 'Public',
      currentStatus: TaskStatus.ACTIVE, // Make active immediately
      tags: ['AI Generated', entity.taskType.replace(/\s+/g, '-')],
      attachments: entity.attachments,
      creator: 'ai_task_generation_engine',
      business: 'tasknova_enterprise_gen',
      metadata: {
        ...entity.metadata,
        chunkId: entity.chunkId,
        pipelineId: entity.pipelineId,
        datasetId: entity.datasetId,
      },
      aiMetadata: {
        associatedModel: entity.aiMetadata.associatedModel || 'gemini-1.5-flash',
        evaluationMetric: 'SLA-Accuracy-Confidence'
      },
      humanMetadata: {
        contributorLevelRequired: entity.contributorLevelRequired,
        maxDailyAttemptsPerUser: 5,
        averageRatingScore: 5.0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archivedAt: null,
    };
  }

  /**
   * Formatting helper for bytes to readably scaled sizes
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Formatting helper for duration seconds
   */
  static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }
}
