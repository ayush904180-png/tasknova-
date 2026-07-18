/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Submission, SubmissionFilterOptions } from '../../types/submission';

/**
 * High-performance query execution context for evaluating in-memory or cached submissions
 * prior to persisting them into cloud data pools.
 */
export class SubmissionQueryBuilder {
  private submissions: Submission[];

  constructor(submissions: Submission[]) {
    this.submissions = [...submissions];
  }

  /**
   * Executes a series of compound filter applications, order sorting, and pagination boundaries.
   */
  execute(options: SubmissionFilterOptions): Submission[] {
    let result = this.submissions;

    // 1. Direct Equal Filters
    if (options.userId) {
      result = result.filter(s => s.userId === options.userId);
    }
    if (options.taskId) {
      result = result.filter(s => s.taskId === options.taskId);
    }
    if (options.submissionStatus) {
      result = result.filter(s => s.submissionStatus === options.submissionStatus);
    }
    if (options.validationStatus) {
      result = result.filter(s => s.validationStatus === options.validationStatus);
    }
    if (options.reviewStatus) {
      result = result.filter(s => s.reviewStatus === options.reviewStatus);
    }
    if (options.offlineFlag !== undefined) {
      result = result.filter(s => s.offlineFlag === options.offlineFlag);
    }

    // 2. Chronological Boundaries
    if (options.startDate) {
      const startMs = new Date(options.startDate).getTime();
      result = result.filter(s => new Date(s.createdAt).getTime() >= startMs);
    }
    if (options.endDate) {
      const endMs = new Date(options.endDate).getTime();
      result = result.filter(s => new Date(s.createdAt).getTime() <= endMs);
    }

    // 3. Advanced Sort Compilations
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    result.sort((a, b) => {
      let fieldA: any = a[sortBy];
      let fieldB: any = b[sortBy];

      // Safe null mapping
      if (fieldA === null || fieldA === undefined) fieldA = 0;
      if (fieldB === null || fieldB === undefined) fieldB = 0;

      // Handle ISO timestamp string ordering
      if (typeof fieldA === 'string' && isNaN(Number(fieldA))) {
        const timeA = new Date(fieldA).getTime();
        const timeB = new Date(fieldB).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }

      // Standard numeric ordering
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

    // 4. Pagination (Offset & Limit limits)
    const offset = options.offset || 0;
    const limit = options.limit || result.length;

    return result.slice(offset, offset + limit);
  }
}
