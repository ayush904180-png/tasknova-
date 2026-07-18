/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskDifficulty, TaskStatus, TaskPriority } from '../../types/tasks';
import { FirestoreTask } from '../../infrastructure/firebase/types';

/**
 * Maps raw database payloads (FirestoreTask) to enterprise domain objects (Task) and vice versa.
 */
export class TaskMapper {
  /**
   * Translates a Firestore database document to a fully-typed domain Task entity.
   */
  static toDomain(firestore: FirestoreTask): Task {
    const payload = firestore.payloadTemplate || {};
    
    // Extract metadata properties mapping seamlessly with backward-compatible models
    const metadata = payload.metadata || {};
    const aiMetadata = payload.aiMetadata || {};
    const humanMetadata = payload.humanMetadata || {};

    let difficulty: TaskDifficulty = TaskDifficulty.EASY;
    if (firestore.difficulty === 'medium') {
      difficulty = TaskDifficulty.MEDIUM;
    } else if (firestore.difficulty === 'hard') {
      difficulty = TaskDifficulty.HARD;
    }

    let status: TaskStatus = TaskStatus.DRAFT;
    switch (firestore.status) {
      case 'active':
        status = TaskStatus.ACTIVE;
        break;
      case 'paused':
        status = TaskStatus.PAUSED;
        break;
      case 'completed':
        status = TaskStatus.COMPLETED;
        break;
      case 'cancelled':
        status = TaskStatus.REJECTED;
        break;
      case 'draft':
      default:
        status = TaskStatus.DRAFT;
    }

    return {
      id: firestore.id,
      version: payload.version || 1,
      parentTaskId: payload.parentTaskId || null,
      taskType: payload.taskType || firestore.categoryId || 'AI Response Comparison',
      title: firestore.title,
      description: firestore.description,
      instructions: firestore.instructions || [],
      category: firestore.categoryId || 'General',
      difficulty,
      estimatedCompletionTime: firestore.estimatedSeconds || 60,
      rewardCoins: firestore.rewardCoins || 0,
      priority: payload.priority || TaskPriority.MEDIUM,
      language: payload.language || 'en-US',
      country: payload.country || 'ALL',
      region: payload.region || null,
      requiredAccuracy: payload.requiredAccuracy || 95,
      requiredTrustScore: payload.requiredTrustScore || 80,
      maximumAttempts: firestore.maxSubmissionsAllowed || 1,
      cooldownPeriod: payload.cooldownPeriod || 0,
      validationMethod: payload.validationMethod || 'Consensus',
      reviewStrategy: payload.reviewStrategy || 'Immediate',
      expiryDate: payload.expiryDate || null,
      visibility: payload.visibility || 'Public',
      currentStatus: status,
      tags: payload.tags || [],
      attachments: payload.attachments || [],
      creator: firestore.creatorId,
      business: firestore.campaignId || null,
      metadata,
      aiMetadata,
      humanMetadata,
      createdAt: firestore.createdAt || new Date().toISOString(),
      updatedAt: firestore.updatedAt || new Date().toISOString(),
      archivedAt: payload.archivedAt || null,
    };
  }

  /**
   * Serializes a rich domain Task entity into a schema-compliant FirestoreTask document write format.
   */
  static toFirestore(domain: Task): FirestoreTask {
    let fDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (domain.difficulty === TaskDifficulty.MEDIUM) {
      fDifficulty = 'medium';
    } else if (domain.difficulty === TaskDifficulty.HARD) {
      fDifficulty = 'hard';
    }

    let fStatus: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' = 'draft';
    switch (domain.currentStatus) {
      case TaskStatus.ACTIVE:
      case TaskStatus.PUBLISHED:
        fStatus = 'active';
        break;
      case TaskStatus.PAUSED:
        fStatus = 'paused';
        break;
      case TaskStatus.COMPLETED:
        fStatus = 'completed';
        break;
      case TaskStatus.REJECTED:
      case TaskStatus.EXPIRED:
      case TaskStatus.ARCHIVED:
        fStatus = 'cancelled';
        break;
      case TaskStatus.DRAFT:
      default:
        fStatus = 'draft';
    }

    return {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      categoryId: domain.category,
      campaignId: domain.business || undefined,
      creatorId: domain.creator,
      difficulty: fDifficulty,
      rewardCoins: domain.rewardCoins,
      estimatedSeconds: domain.estimatedCompletionTime,
      instructions: domain.instructions,
      maxSubmissionsAllowed: domain.maximumAttempts,
      submissionCount: 0, // Freshly serialized task defaults
      status: fStatus,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      // Wrap domain-only fields into payloadTemplate for lossless preservation
      payloadTemplate: {
        version: domain.version,
        parentTaskId: domain.parentTaskId,
        taskType: domain.taskType,
        priority: domain.priority,
        language: domain.language,
        country: domain.country,
        region: domain.region,
        requiredAccuracy: domain.requiredAccuracy,
        requiredTrustScore: domain.requiredTrustScore,
        cooldownPeriod: domain.cooldownPeriod,
        validationMethod: domain.validationMethod,
        reviewStrategy: domain.reviewStrategy,
        expiryDate: domain.expiryDate,
        visibility: domain.visibility,
        tags: domain.tags,
        attachments: domain.attachments,
        metadata: domain.metadata,
        aiMetadata: domain.aiMetadata,
        humanMetadata: domain.humanMetadata,
        archivedAt: domain.archivedAt
      }
    };
  }
}
