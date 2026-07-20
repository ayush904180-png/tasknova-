/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Campaign, CampaignStatus } from '../types';

export class CampaignMapper {
  static toDomain(raw: any): Campaign {
    return {
      id: raw.id || `camp_${Math.random().toString(36).substr(2, 9)}`,
      name: raw.name || 'Untitled Campaign',
      description: raw.description || '',
      companyName: raw.companyName || 'TaskNova Customer',
      projectName: raw.projectName || 'Default Project',
      internalNotes: raw.internalNotes || '',
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      taskType: raw.taskType || 'RLHF',
      budget: {
        coins: Number(raw.budget?.coins || 0),
        maxSpend: Number(raw.budget?.maxSpend || 0),
        expectedCompletion: raw.budget?.expectedCompletion || '72 hours',
        expectedContributors: Number(raw.budget?.expectedContributors || 100),
        rewardRuleMultiplier: Number(raw.budget?.rewardRuleMultiplier || 1),
        priority: raw.budget?.priority || 'medium',
      },
      targetAudience: {
        countries: Array.isArray(raw.targetAudience?.countries) ? raw.targetAudience.countries : ['All'],
        languages: Array.isArray(raw.targetAudience?.languages) ? raw.targetAudience.languages : ['English'],
        devices: Array.isArray(raw.targetAudience?.devices) ? raw.targetAudience.devices : ['Desktop'],
        experienceLevel: raw.targetAudience?.experienceLevel || 'all',
        trustScoreMin: Number(raw.targetAudience?.trustScoreMin || 80),
        accuracyMin: Number(raw.targetAudience?.accuracyMin || 80),
        role: Array.isArray(raw.targetAudience?.role) ? raw.targetAudience.role : ['All Users'],
        contributorTier: raw.targetAudience?.contributorTier || 'bronze',
      },
      datasetId: raw.datasetId || '',
      qualityRules: {
        requiredAccuracy: Number(raw.qualityRules?.requiredAccuracy || 90),
        minimumTimePerTask: Number(raw.qualityRules?.minimumTimePerTask || 10),
        spamProtection: raw.qualityRules?.spamProtection ?? true,
        manualReviewPercent: Number(raw.qualityRules?.manualReviewPercent ?? 10),
        aiReviewPercent: Number(raw.qualityRules?.aiReviewPercent ?? 90),
        consensusThreshold: Number(raw.qualityRules?.consensusThreshold ?? 3),
        duplicateDetection: raw.qualityRules?.duplicateDetection ?? true,
      },
      status: raw.status || CampaignStatus.DRAFT,
      version: Number(raw.version || 1),
      createdAt: raw.createdAt || new Date().toISOString(),
      updatedAt: raw.updatedAt || new Date().toISOString(),
    };
  }

  static toFirestore(domain: Campaign): Record<string, any> {
    // Strips references or maps types for DB storage
    return {
      ...domain,
      updatedAt: new Date().toISOString(),
    };
  }
}
