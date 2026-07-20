/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FirestoreRepository, MemoryDatabase } from '../../infrastructure/repositories/FirestoreRepository';
import { Campaign, CampaignStatus, CampaignVersion } from '../types';

export class CampaignRepository extends FirestoreRepository<Campaign> {
  constructor() {
    super('campaigns');
    this.seedInitialData();
  }

  private seedInitialData() {
    const existing = MemoryDatabase.list('campaigns');
    if (existing && existing.length > 0) {
      return;
    }

    const mockCampaigns: Campaign[] = [
      {
        id: 'camp_openai_gpt5_rlhf',
        name: 'GPT-5 Reasoning Alignment & Safety RLHF',
        description: 'Multi-turn adversarial alignment evaluations focusing on advanced multi-step planning, scientific capabilities, and potential security vulnerabilities.',
        companyName: 'OpenAI, Inc.',
        projectName: 'GPT-5-Core',
        internalNotes: 'Confidential research evaluation. Restrict contributor pool to Gold and Platinum tiers with trust scores above 95.',
        tags: ['RLHF', 'Safety', 'Reasoning', 'GPT-5'],
        taskType: 'RLHF',
        budget: {
          coins: 2500000,
          maxSpend: 25000,
          expectedCompletion: '72 hours',
          expectedContributors: 1500,
          rewardRuleMultiplier: 1.5,
          priority: 'critical',
        },
        targetAudience: {
          countries: ['United States', 'India', 'Germany', 'United Kingdom', 'Canada'],
          languages: ['English', 'German'],
          devices: ['Desktop', 'Tablet'],
          experienceLevel: 'expert',
          trustScoreMin: 95,
          accuracyMin: 92,
          role: ['AI Researcher', 'Graduate Student', 'Software Engineer'],
          contributorTier: 'gold',
        },
        datasetId: 'ds_openai_gpt5_prompts',
        qualityRules: {
          requiredAccuracy: 96,
          minimumTimePerTask: 45,
          spamProtection: true,
          manualReviewPercent: 15,
          aiReviewPercent: 85,
          consensusThreshold: 3,
          duplicateDetection: true,
        },
        status: CampaignStatus.PUBLISHED,
        version: 3,
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: 'camp_deepmind_gemini_multimodal',
        name: 'Gemini 2 Ultra Multimodal Visual Reasoning',
        description: 'Complex video and image visual evaluation for video understanding, optical character reading (OCR), and semantic scene extraction.',
        companyName: 'Google DeepMind',
        projectName: 'Gemini-Ultra',
        internalNotes: 'Focus on high quality bounding box feedback. Auto-review low speed outliers.',
        tags: ['Multimodal', 'Video OCR', 'Visual Reasoning'],
        taskType: 'Image',
        budget: {
          coins: 1800000,
          maxSpend: 18000,
          expectedCompletion: '96 hours',
          expectedContributors: 1200,
          rewardRuleMultiplier: 1.25,
          priority: 'high',
        },
        targetAudience: {
          countries: ['India', 'United Kingdom', 'Singapore', 'Japan'],
          languages: ['English', 'Hindi', 'Japanese'],
          devices: ['Desktop', 'Mobile', 'Tablet'],
          experienceLevel: 'intermediate',
          trustScoreMin: 90,
          accuracyMin: 88,
          role: ['Data Labeler', 'QA Specialist'],
          contributorTier: 'silver',
        },
        datasetId: 'ds_deepmind_gemini_scenes',
        qualityRules: {
          requiredAccuracy: 92,
          minimumTimePerTask: 30,
          spamProtection: true,
          manualReviewPercent: 10,
          aiReviewPercent: 90,
          consensusThreshold: 2,
          duplicateDetection: true,
        },
        status: CampaignStatus.PUBLISHED,
        version: 1,
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      },
      {
        id: 'camp_anthropic_claude_pairwise',
        name: 'Claude 4 Pairwise Helpfulness Preference',
        description: 'Evaluating model response preference grids for mathematical and coding prompts. Labelers select the most helpful, harmless, and honest option.',
        companyName: 'Anthropic PBC',
        projectName: 'Claude-4-Preference',
        internalNotes: 'Ensure coding evaluations are strictly verified by sandbox compilation.',
        tags: ['Pairwise', 'Preference', 'Coding', 'Claude-4'],
        taskType: 'Pairwise Comparison',
        budget: {
          coins: 1500000,
          maxSpend: 15000,
          expectedCompletion: '120 hours',
          expectedContributors: 800,
          rewardRuleMultiplier: 1.4,
          priority: 'high',
        },
        targetAudience: {
          countries: ['United States', 'India', 'Canada'],
          languages: ['English'],
          devices: ['Desktop'],
          experienceLevel: 'expert',
          trustScoreMin: 94,
          accuracyMin: 90,
          role: ['Software Engineer', 'Computer Science Student'],
          contributorTier: 'gold',
        },
        datasetId: 'ds_anthropic_code_evals',
        qualityRules: {
          requiredAccuracy: 95,
          minimumTimePerTask: 60,
          spamProtection: true,
          manualReviewPercent: 20,
          aiReviewPercent: 80,
          consensusThreshold: 3,
          duplicateDetection: true,
        },
        status: CampaignStatus.PAUSED,
        version: 2,
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      },
      {
        id: 'camp_meta_llama_safety',
        name: 'Llama 4 Red-Teaming Safety Inoculation',
        description: 'Evaluating toxic prompt containment, political bias neutrality, and extreme hazard mitigation scenarios in compliance with global safe AI regulations.',
        companyName: 'Meta AI',
        projectName: 'Llama-4',
        internalNotes: 'This involves highly sensitive content evaluations.',
        tags: ['Safety', 'Red-Teaming', 'Toxic Prompts'],
        taskType: 'Safety',
        budget: {
          coins: 800000,
          maxSpend: 8000,
          expectedCompletion: '48 hours',
          expectedContributors: 600,
          rewardRuleMultiplier: 1.1,
          priority: 'medium',
        },
        targetAudience: {
          countries: ['United States', 'Ireland', 'India', 'France'],
          languages: ['English', 'Spanish', 'French'],
          devices: ['Desktop', 'Mobile'],
          experienceLevel: 'all',
          trustScoreMin: 85,
          accuracyMin: 85,
          role: ['All Users'],
          contributorTier: 'bronze',
        },
        datasetId: 'ds_meta_safety_prompts',
        qualityRules: {
          requiredAccuracy: 90,
          minimumTimePerTask: 20,
          spamProtection: true,
          manualReviewPercent: 5,
          aiReviewPercent: 95,
          consensusThreshold: 2,
          duplicateDetection: true,
        },
        status: CampaignStatus.DRAFT,
        version: 1,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
    ];

    mockCampaigns.forEach((camp) => {
      MemoryDatabase.set('campaigns', camp.id, camp);
      
      // Save initial campaign versions
      const version: CampaignVersion = {
        id: `ver_${camp.id}_${camp.version}`,
        campaignId: camp.id,
        version: camp.version,
        snapshot: { ...camp },
        updatedAt: camp.updatedAt,
        updatedBy: 'SaaS Platform Admin',
        changeLog: `Initial baseline release version ${camp.version}`,
      };
      MemoryDatabase.set('campaignVersions', version.id, version);
    });
  }

  async getVersions(campaignId: string): Promise<CampaignVersion[]> {
    const versions = MemoryDatabase.list('campaignVersions') as CampaignVersion[];
    return versions
      .filter((v) => v.campaignId === campaignId)
      .sort((a, b) => b.version - a.version);
  }

  async saveVersion(version: CampaignVersion): Promise<void> {
    MemoryDatabase.set('campaignVersions', version.id, version);
  }
}
