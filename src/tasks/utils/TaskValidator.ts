/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskStatus, TaskDifficulty, TaskPriority } from '../../types/tasks';

/**
 * Service to validate Tasks and Submissions schema layout to guarantee mathematical invariants.
 */
export class TaskValidator {
  /**
   * Performs full-form schema validation on a Task document.
   */
  static validate(task: Task): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 1. Mandatory Identity and Version checks
    if (!task.id || typeof task.id !== 'string') {
      errors.push('Task ID is required and must be a string.');
    } else if (!/^[a-zA-Z0-9_\\-]+$/.test(task.id)) {
      errors.push('Task ID contains illegal characters. Allowed: alphanumeric, underscores, hyphens.');
    }

    if (task.version === undefined || typeof task.version !== 'number' || task.version < 1) {
      errors.push('Task version must be a positive integer starting at 1.');
    }

    // 2. Validate essential text properties
    if (!task.title || task.title.trim().length === 0 || task.title.length > 150) {
      errors.push('Task title is required and cannot exceed 150 characters.');
    }

    if (!task.description || task.description.trim().length === 0 || task.description.length > 2000) {
      errors.push('Task description is required and cannot exceed 2000 characters.');
    }

    if (!Array.isArray(task.instructions) || task.instructions.length === 0) {
      errors.push('Task must contain at least one step of instructions.');
    }

    // 3. Category & Type mapping
    if (!task.category || typeof task.category !== 'string') {
      errors.push('Task Category must be a non-empty string.');
    }

    if (!task.taskType || typeof task.taskType !== 'string') {
      errors.push('Task Type must be a non-empty string.');
    }

    // 4. Financial & Estimations boundaries
    if (task.rewardCoins === undefined || typeof task.rewardCoins !== 'number' || task.rewardCoins < 0) {
      errors.push('Reward Coins cannot be negative.');
    }

    if (task.estimatedCompletionTime === undefined || typeof task.estimatedCompletionTime !== 'number' || task.estimatedCompletionTime < 0) {
      errors.push('Estimated completion time cannot be negative.');
    }

    // 5. Schema Enum mappings
    if (!Object.values(TaskDifficulty).includes(task.difficulty)) {
      errors.push(`Invalid Difficulty level. Found: "${task.difficulty}".`);
    }

    if (!Object.values(TaskPriority).includes(task.priority)) {
      errors.push(`Invalid Priority level. Found: "${task.priority}".`);
    }

    if (!Object.values(TaskStatus).includes(task.currentStatus)) {
      errors.push(`Invalid Task Status. Found: "${task.currentStatus}".`);
    }

    // 6. Regional boundaries and Trust Score metrics
    if (task.requiredAccuracy !== undefined && (task.requiredAccuracy < 0 || task.requiredAccuracy > 100)) {
      errors.push('Required Accuracy must be a percentage between 0 and 100.');
    }

    if (task.requiredTrustScore !== undefined && (task.requiredTrustScore < 0 || task.requiredTrustScore > 100)) {
      errors.push('Required Trust Score must be a percentage between 0 and 100.');
    }

    // 7. Expire boundaries
    if (task.expiryDate) {
      const expiryTime = new Date(task.expiryDate).getTime();
      if (isNaN(expiryTime)) {
        errors.push('Expiry Date is not a valid ISO date.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates state transitions of a Task to safeguard workflow invariants.
   */
  static validateStateTransition(current: TaskStatus, next: TaskStatus): boolean {
    if (current === next) return true;

    const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.DRAFT]: [TaskStatus.SCHEDULED, TaskStatus.PUBLISHED, TaskStatus.ARCHIVED],
      [TaskStatus.SCHEDULED]: [TaskStatus.PUBLISHED, TaskStatus.PAUSED, TaskStatus.ARCHIVED, TaskStatus.EXPIRED],
      [TaskStatus.PUBLISHED]: [TaskStatus.ACTIVE, TaskStatus.PAUSED, TaskStatus.EXPIRED, TaskStatus.ARCHIVED],
      [TaskStatus.PAUSED]: [TaskStatus.ACTIVE, TaskStatus.ARCHIVED, TaskStatus.EXPIRED],
      [TaskStatus.ACTIVE]: [TaskStatus.PAUSED, TaskStatus.IN_REVIEW, TaskStatus.COMPLETED, TaskStatus.EXPIRED, TaskStatus.ARCHIVED],
      [TaskStatus.IN_REVIEW]: [TaskStatus.COMPLETED, TaskStatus.REJECTED, TaskStatus.PAUSED, TaskStatus.ARCHIVED],
      [TaskStatus.COMPLETED]: [TaskStatus.ARCHIVED], // Terminal status
      [TaskStatus.REJECTED]: [TaskStatus.DRAFT, TaskStatus.ARCHIVED], // Allowed back to draft for fixing
      [TaskStatus.ARCHIVED]: [], // Terminal status, absolute lock
      [TaskStatus.HIDDEN]: [TaskStatus.ACTIVE, TaskStatus.ARCHIVED],
      [TaskStatus.EXPIRED]: [TaskStatus.ARCHIVED]
    };

    return allowedTransitions[current]?.includes(next) || false;
  }
}
