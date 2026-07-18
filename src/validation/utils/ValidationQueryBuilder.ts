/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationRecord, ValidationFilterOptions } from '../../types/validation';

/**
 * Heuristic compound query evaluator for Validation Records.
 * Resolves complex dynamic queries over memory blocks or localStorage arrays.
 */
export class ValidationQueryBuilder {
  private records: ValidationRecord[];

  constructor(records: ValidationRecord[]) {
    this.records = [...records];
  }

  /**
   * Evaluates compound dynamic filters and returns a tailored, sorted list of records.
   */
  execute(options: ValidationFilterOptions): ValidationRecord[] {
    let result = this.records;

    // 1. Filter by Submission ID
    if (options.submissionId) {
      const targetSub = options.submissionId.toLowerCase();
      result = result.filter(r => r.submissionId.toLowerCase().includes(targetSub));
    }

    // 2. Filter by Task ID
    if (options.taskId) {
      const targetTask = options.taskId.toLowerCase();
      result = result.filter(r => r.taskId.toLowerCase().includes(targetTask));
    }

    // 3. Filter by User ID
    if (options.userId) {
      const targetUser = options.userId.toLowerCase();
      result = result.filter(r => r.userId.toLowerCase().includes(targetUser));
    }

    // 4. Filter by Validation Status
    if (options.validationStatus) {
      result = result.filter(r => r.validationStatus === options.validationStatus);
    }

    // 5. Filter by Final Decision
    if (options.decision) {
      result = result.filter(r => r.decision === options.decision);
    }

    // 6. Filter by Minimum Quality Score threshold
    if (options.minQualityScore !== undefined) {
      result = result.filter(r => r.qualityScores.finalQualityScore >= options.minQualityScore!);
    }

    // 7. Filter by Maximum Risk Score threshold
    if (options.maxRiskScore !== undefined) {
      result = result.filter(r => r.riskScores.aggregateRiskScore <= options.maxRiskScore!);
    }

    // 8. Sorting logic
    if (options.sortBy) {
      const order = options.sortOrder === 'asc' ? 1 : -1;
      
      result.sort((a, b) => {
        if (options.sortBy === 'completedAt') {
          const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          return (timeA - timeB) * order;
        }
        
        if (options.sortBy === 'elapsedMs') {
          return (a.elapsedMs - b.elapsedMs) * order;
        }

        if (options.sortBy === 'qualityScore') {
          return (a.qualityScores.finalQualityScore - b.qualityScores.finalQualityScore) * order;
        }

        if (options.sortBy === 'riskScore') {
          return (a.riskScores.aggregateRiskScore - b.riskScores.aggregateRiskScore) * order;
        }

        return 0;
      });
    } else {
      // Default sort by completedAt descending
      result.sort((a, b) => {
        const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    // 9. Pagination (Offset + Limit)
    const offset = options.offset || 0;
    const limit = options.limit || result.length;

    return result.slice(offset, offset + limit);
  }
}
