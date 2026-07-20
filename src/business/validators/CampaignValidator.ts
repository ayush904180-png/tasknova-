/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Campaign } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export class CampaignValidator {
  static validate(campaign: Partial<Campaign>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!campaign.name || campaign.name.trim() === '') {
      errors.push({ field: 'name', message: 'Campaign name is required.' });
    }

    if (!campaign.companyName || campaign.companyName.trim() === '') {
      errors.push({ field: 'companyName', message: 'Company name is required.' });
    }

    if (!campaign.projectName || campaign.projectName.trim() === '') {
      errors.push({ field: 'projectName', message: 'Project name is required.' });
    }

    const budget = campaign.budget;
    if (budget) {
      if (budget.coins <= 0) {
        errors.push({ field: 'budget.coins', message: 'Budget Coins must be greater than 0.' });
      }
      if (budget.maxSpend <= 0) {
        errors.push({ field: 'budget.maxSpend', message: 'Maximum Spend must be greater than $0.' });
      }
      if (budget.expectedContributors <= 0) {
        errors.push({ field: 'budget.expectedContributors', message: 'Expected contributors must be greater than 0.' });
      }
    } else {
      errors.push({ field: 'budget', message: 'Budget settings are required.' });
    }

    const target = campaign.targetAudience;
    if (target) {
      if (target.trustScoreMin < 0 || target.trustScoreMin > 100) {
        errors.push({ field: 'targetAudience.trustScoreMin', message: 'Trust score threshold must be between 0 and 100.' });
      }
      if (target.accuracyMin < 0 || target.accuracyMin > 100) {
        errors.push({ field: 'targetAudience.accuracyMin', message: 'Accuracy threshold must be between 0 and 100.' });
      }
    }

    const quality = campaign.qualityRules;
    if (quality) {
      if (quality.requiredAccuracy < 50 || quality.requiredAccuracy > 100) {
        errors.push({ field: 'qualityRules.requiredAccuracy', message: 'Accuracy requirement must be between 50% and 100%.' });
      }
      if (quality.minimumTimePerTask < 1) {
        errors.push({ field: 'qualityRules.minimumTimePerTask', message: 'Minimum time per task must be at least 1 second.' });
      }
      if (quality.consensusThreshold < 1 || quality.consensusThreshold > 10) {
        errors.push({ field: 'qualityRules.consensusThreshold', message: 'Consensus redundancy must be between 1 and 10.' });
      }
    }

    return errors;
  }
}
