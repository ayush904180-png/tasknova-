/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskStatus } from '../../types/tasks';
import { ContributorProfile, TaskReservation } from '../types';

/**
 * Validates integrity of structures within the marketplace module.
 */
export class MarketplaceValidator {
  /**
   * Validates if a user's profile is qualified to reserve or see certain high-security/premium tasks.
   */
  public static validateContributorEligibility(
    profile: ContributorProfile,
    task: Task
  ): { eligible: boolean; error?: string } {
    // 1. Check trust score
    if (profile.trustScore < task.requiredTrustScore) {
      return {
        eligible: false,
        error: `Requires a Trust Score of at least ${task.requiredTrustScore}% (Current: ${profile.trustScore}%)`
      };
    }

    // 2. Check accuracy threshold
    if (profile.accuracy < task.requiredAccuracy) {
      return {
        eligible: false,
        error: `Requires an Accuracy Rating of at least ${task.requiredAccuracy}% (Current: ${profile.accuracy}%)`
      };
    }

    // 3. Check language requirements if specified and not 'All' or empty
    if (task.language && task.language !== 'ALL' && task.language !== 'All' && task.language.trim() !== '') {
      const knowsLanguage = profile.languages.some(lang => 
        lang.toLowerCase() === task.language.toLowerCase() || 
        lang.split('-')[0].toLowerCase() === task.language.split('-')[0].toLowerCase()
      );
      if (!knowsLanguage) {
        return {
          eligible: false,
          error: `Task requires proficiency in ${task.language} (Current profile: ${profile.languages.join(', ')})`
        };
      }
    }

    // 4. Check country restrictions
    if (task.country && task.country !== 'ALL' && task.country !== 'All' && task.country.trim() !== '') {
      const isCorrectCountry = profile.country.toLowerCase() === task.country.toLowerCase();
      if (!isCorrectCountry) {
        return {
          eligible: false,
          error: `Task restricted to contributors in country code '${task.country}' (Current country: ${profile.country})`
        };
      }
    }

    // 5. Check if task has expired
    if (task.expiryDate) {
      const expiry = new Date(task.expiryDate).getTime();
      if (Date.now() > expiry) {
        return {
          eligible: false,
          error: 'This task definition has expired and cannot be reserved.'
        };
      }
    }

    // 6. Check if task status is active
    if (task.currentStatus !== TaskStatus.ACTIVE && task.currentStatus !== TaskStatus.PUBLISHED) {
      return {
        eligible: false,
        error: `This task is currently in state '${task.currentStatus}' and cannot be reserved.`
      };
    }

    return { eligible: true };
  }

  /**
   * Validates if a reservation is active and valid.
   */
  public static validateReservationActive(reservation: TaskReservation): boolean {
    if (reservation.status !== 'Active') return false;
    const expires = new Date(reservation.expiresAt).getTime();
    return Date.now() < expires;
  }

  /**
   * Validates structural integrity of a custom filter object.
   */
  public static validateSavedFilter(name: string, filters: Record<string, any>): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Saved filter name cannot be empty.' };
    }
    if (name.length > 50) {
      return { valid: false, error: 'Saved filter name cannot exceed 50 characters.' };
    }
    if (!filters || typeof filters !== 'object' || Object.keys(filters).length === 0) {
      return { valid: false, error: 'Saved filter configuration must contain at least one parameter.' };
    }
    return { valid: true };
  }
}
