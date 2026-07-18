/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskDifficulty, TaskStatus, TaskPriority } from '../../types/tasks';

export interface TaskFilterOptions {
  category?: string;
  difficulty?: TaskDifficulty;
  minReward?: number;
  maxReward?: number;
  country?: string;
  language?: string;
  priority?: TaskPriority;
  maxEstimatedTime?: number;
  status?: TaskStatus;
  bookmarkedOnly?: boolean;
  bookmarkedIds?: string[];
  searchQuery?: string;
  tags?: string[];
  sortBy?: 'Newest' | 'Oldest' | 'Alphabetical' | 'Popularity' | 'Recommended' | 'Recently Viewed';
}

/**
 * Rich, fluent search and filter query engine for tasks.
 * Performs lightning-fast local operations for offline resilience and cache-speed,
 * while being structured to mirror backend Firebase database compound queries.
 */
export class TaskQueryBuilder {
  private tasks: Task[];

  constructor(tasks: Task[]) {
    this.tasks = [...tasks];
  }

  /**
   * Evaluates if a task matches a keyword search query on title, description, or tags.
   */
  private matchesKeyword(task: Task, query: string): boolean {
    const q = query.toLowerCase().trim();
    if (!q) return true;

    return (
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q) ||
      task.taskType.toLowerCase().includes(q) ||
      task.category.toLowerCase().includes(q) ||
      task.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  /**
   * Programmatically executes full filter and sort options over the task collection.
   */
  execute(options: TaskFilterOptions): Task[] {
    let results = this.tasks;

    // 1. Status Filter (defaults to showing active/published tasks unless specifically filtering others)
    if (options.status) {
      results = results.filter(t => t.currentStatus === options.status);
    } else {
      results = results.filter(t => 
        t.currentStatus === TaskStatus.ACTIVE || 
        t.currentStatus === TaskStatus.PUBLISHED
      );
    }

    // 2. Category / Domain Filter
    if (options.category && options.category !== 'All') {
      results = results.filter(t => t.category.toLowerCase() === options.category!.toLowerCase());
    }

    // 3. Difficulty Filter
    if (options.difficulty) {
      results = results.filter(t => t.difficulty === options.difficulty);
    }

    // 4. Reward Range Filter
    if (options.minReward !== undefined) {
      results = results.filter(t => t.rewardCoins >= options.minReward!);
    }
    if (options.maxReward !== undefined) {
      results = results.filter(t => t.rewardCoins <= options.maxReward!);
    }

    // 5. Regional & Location Borders Filter
    if (options.country && options.country !== 'ALL') {
      results = results.filter(t => t.country === 'ALL' || t.country.toLowerCase() === options.country!.toLowerCase());
    }

    // 6. Language Border Filter
    if (options.language && options.language !== 'All') {
      results = results.filter(t => t.language.toLowerCase().startsWith(options.language!.toLowerCase().substring(0, 2)));
    }

    // 7. Priority Filter
    if (options.priority) {
      results = results.filter(t => t.priority === options.priority);
    }

    // 8. Max Time constraints
    if (options.maxEstimatedTime !== undefined) {
      results = results.filter(t => t.estimatedCompletionTime <= options.maxEstimatedTime!);
    }

    // 9. Bookmarks filter
    if (options.bookmarkedOnly && options.bookmarkedIds) {
      results = results.filter(t => options.bookmarkedIds!.includes(t.id));
    }

    // 10. Tags list intersection
    if (options.tags && options.tags.length > 0) {
      results = results.filter(t => 
        options.tags!.every(tag => t.tags.includes(tag))
      );
    }

    // 11. Keyword Search Text
    if (options.searchQuery) {
      results = results.filter(t => this.matchesKeyword(t, options.searchQuery!));
    }

    // 12. Sorting Execution
    const sort = options.sortBy || 'Newest';
    switch (sort) {
      case 'Oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'Alphabetical':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Popularity':
        // Sort by volume metric (simulated via estimated trust requirements or coin reward hierarchy)
        results.sort((a, b) => b.maximumAttempts - a.maximumAttempts);
        break;
      case 'Recommended':
        // Sort by value premium (rewardCoins x estimatedSeconds inverse ratio)
        results.sort((a, b) => (b.rewardCoins / b.estimatedCompletionTime) - (a.rewardCoins / a.estimatedCompletionTime));
        break;
      case 'Recently Viewed':
        results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'Newest':
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return results;
  }

  /**
   * Compiles filter options into structural compound query configurations for remote Firestore operations.
   * Useful for server-side index checks.
   */
  compileFirestoreQuerySpec(options: TaskFilterOptions): {
    collection: string;
    whereClauses: Array<{ field: string; operator: string; value: any }>;
    orderByClauses: Array<{ field: string; direction: 'asc' | 'desc' }>;
  } {
    const whereClauses: Array<{ field: string; operator: string; value: any }> = [];
    const orderByClauses: Array<{ field: string; direction: 'asc' | 'desc' }> = [];

    // Filter rules
    if (options.status) {
      whereClauses.push({ field: 'status', operator: '==', value: options.status.toLowerCase() });
    } else {
      whereClauses.push({ field: 'status', operator: '==', value: 'active' });
    }

    if (options.category && options.category !== 'All') {
      whereClauses.push({ field: 'categoryId', operator: '==', value: options.category });
    }

    if (options.difficulty) {
      whereClauses.push({ field: 'difficulty', operator: '==', value: options.difficulty.toLowerCase() });
    }

    if (options.minReward !== undefined) {
      whereClauses.push({ field: 'rewardCoins', operator: '>=', value: options.minReward });
    }

    // Sort mappings
    const sort = options.sortBy || 'Newest';
    if (sort === 'Oldest') {
      orderByClauses.push({ field: 'createdAt', direction: 'asc' });
    } else if (sort === 'Alphabetical') {
      orderByClauses.push({ field: 'title', direction: 'asc' });
    } else {
      orderByClauses.push({ field: 'createdAt', direction: 'desc' });
    }

    return {
      collection: 'tasks',
      whereClauses,
      orderByClauses
    };
  }
}
