/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneratedTaskEntity, TaskTemplate } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  qualityScore: number;
}

export class TaskGenerationValidator {
  /**
   * Validates a generated task against rigorous SOC-2 and operational schema definitions.
   */
  static validate(task: GeneratedTaskEntity, existingTasks: GeneratedTaskEntity[] = []): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let scoreMultiplier = 100;

    // 1. Core Field Completeness
    if (!task.id) errors.push('Task ID is missing.');
    if (!task.pipelineId) errors.push('Pipeline ID reference is missing.');
    if (!task.title || task.title.trim().length < 5) {
      errors.push('Task Title must be at least 5 characters.');
    }
    if (!task.description || task.description.trim().length < 15) {
      errors.push('Task Description must be at least 15 characters.');
    }
    if (!task.instructions || task.instructions.length === 0) {
      errors.push('Task must include at least one instruction step.');
    }

    // 2. Language & Location Integrity
    if (!task.language || task.language.length < 2) {
      errors.push('Valid ISO Language code required (e.g., "en-US").');
    }
    if (!task.country || task.country.length < 2) {
      errors.push('Valid Target Country constraint required (e.g., "US").');
    }

    // 3. Reward & Economy Boundaries
    if (task.rewardCoins <= 0) {
      errors.push('Task Reward Coins must be positive.');
    } else if (task.rewardCoins > 500) {
      warnings.push('Task Reward Coins is exceptionally high. Run economy check.');
      scoreMultiplier -= 10;
    }

    if (task.estimatedCompletionTime < 10) {
      errors.push('Task completion time cannot be under 10 seconds.');
    }

    // 4. Duplicate Detection (Similarity checking)
    const isDuplicate = existingTasks.some(
      (existing) => 
        existing.id !== task.id &&
        existing.title.toLowerCase() === task.title.toLowerCase() &&
        existing.chunkId === task.chunkId
    );
    if (isDuplicate) {
      errors.push('Duplicate task collision detected: identical title and chunkId in repository.');
    }

    // 5. Schema Integrity
    if (!task.taskType) {
      errors.push('Task Type classification identifier is missing.');
    }

    // 6. Attachment / Reference check
    task.attachments.forEach((attach, index) => {
      if (!attach.id) errors.push(`Attachment at index ${index} is missing an ID.`);
      if (!attach.url || !attach.url.startsWith('http')) {
        errors.push(`Attachment "${attach.name}" possesses an invalid download URL.`);
      }
    });

    // 7. Calculate Quality Score based on attributes
    let qualityScore = scoreMultiplier;
    if (task.description && task.description.length < 30) qualityScore -= 15;
    if (task.instructions && task.instructions.length < 3) qualityScore -= 10;
    if (task.minimumTrustScore < 70) qualityScore -= 5;
    if (task.requiredAccuracy < 90) qualityScore -= 10;
    
    // Safety boundaries
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      qualityScore
    };
  }

  /**
   * Validates a reusable template
   */
  static validateTemplate(template: TaskTemplate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!template.id) errors.push('Template ID is missing.');
    if (!template.name || template.name.trim().length < 3) errors.push('Template Name is too short.');
    if (!template.instructions || template.instructions.length === 0) {
      errors.push('Template instructions cannot be empty.');
    }
    if (template.rewardCoins <= 0) errors.push('Template default coins must be positive.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
