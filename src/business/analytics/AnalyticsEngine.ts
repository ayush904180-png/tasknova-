/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Campaign, CampaignAnalyticsSummary } from '../types';

export interface TimeSeriesPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface DistributionPoint {
  name: string;
  value: number;
  percentage: number;
}

export class AnalyticsEngine {
  /**
   * Generates analytical summary metrics for a given campaign
   */
  static getCampaignAnalytics(campaign: Campaign): CampaignAnalyticsSummary {
    // Standard mock analytics tied to campaign limits
    const budget = campaign.budget;
    let completionRate = 100;
    let qualityScore = 94.8;
    let accuracy = 95.2;
    let rejectionPercent = 3.6;
    let averageTimePerTask = campaign.qualityRules.minimumTimePerTask + 15;
    
    if (campaign.status === 'draft') {
      completionRate = 0;
      qualityScore = 0;
      accuracy = 0;
      rejectionPercent = 0;
      averageTimePerTask = 0;
    } else if (campaign.status === 'paused') {
      completionRate = 42.5;
      qualityScore = 91.2;
      accuracy = 92.1;
      rejectionPercent = 8.4;
    } else if (campaign.status === 'archived') {
      completionRate = 100;
      qualityScore = 95.5;
      accuracy = 96.0;
      rejectionPercent = 2.9;
    } else {
      // Published is rolling active
      completionRate = 78.4;
    }

    const coinsPaid = Math.floor(budget.coins * (completionRate / 100) * (1 - rejectionPercent / 100));
    const budgetRemaining = budget.coins - coinsPaid;
    const costPerQualitySubmission = budget.maxSpend / (budget.expectedContributors * (completionRate / 100));

    return {
      campaignId: campaign.id,
      completionRate,
      qualityScore,
      accuracy,
      rejectionPercent,
      averageTimePerTask,
      coinsPaid,
      budgetRemaining,
      costPerQualitySubmission: isNaN(costPerQualitySubmission) || !isFinite(costPerQualitySubmission) ? 0.12 : costPerQualitySubmission,
    };
  }

  /**
   * Generates budget spent over time (Daily / Weekly / Monthly) for visual chart bars
   */
  static getBudgetVelocity(timeframe: 'daily' | 'weekly' | 'monthly'): TimeSeriesPoint[] {
    if (timeframe === 'daily') {
      return [
        { label: '09:00 AM', value: 12000, secondaryValue: 8 },
        { label: '11:00 AM', value: 34000, secondaryValue: 12 },
        { label: '01:00 PM', value: 58000, secondaryValue: 15 },
        { label: '03:00 PM', value: 92000, secondaryValue: 24 },
        { label: '05:00 PM', value: 124000, secondaryValue: 28 },
        { label: '07:00 PM', value: 155000, secondaryValue: 32 },
        { label: '09:00 PM', value: 182000, secondaryValue: 36 },
      ];
    }
    if (timeframe === 'weekly') {
      return [
        { label: 'Mon', value: 150000, secondaryValue: 240 },
        { label: 'Tue', value: 240000, secondaryValue: 310 },
        { label: 'Wed', value: 380000, secondaryValue: 450 },
        { label: 'Thu', value: 520000, secondaryValue: 580 },
        { label: 'Fri', value: 680000, secondaryValue: 710 },
        { label: 'Sat', value: 810000, secondaryValue: 880 },
        { label: 'Sun', value: 950000, secondaryValue: 920 },
      ];
    }
    // Monthly default
    return [
      { label: 'Jan', value: 1200000, secondaryValue: 1200 },
      { label: 'Feb', value: 2400000, secondaryValue: 2400 },
      { label: 'Mar', value: 3900000, secondaryValue: 3900 },
      { label: 'Apr', value: 5100000, secondaryValue: 5200 },
      { label: 'May', value: 6800000, secondaryValue: 6500 },
      { label: 'Jun', value: 8200000, secondaryValue: 8100 },
      { label: 'Jul (YTD)', value: 10450000, secondaryValue: 10400 },
    ];
  }

  /**
   * Generates geographical distribution for contributor heatmaps
   */
  static getCountryDistribution(): DistributionPoint[] {
    return [
      { name: 'United States', value: 4200, percentage: 35 },
      { name: 'India', value: 3600, percentage: 30 },
      { name: 'Germany', value: 1440, percentage: 12 },
      { name: 'United Kingdom', value: 1080, percentage: 9 },
      { name: 'Canada', value: 720, percentage: 6 },
      { name: 'Others', value: 960, percentage: 8 },
    ];
  }

  /**
   * Language proficiency distribution
   */
  static getLanguageDistribution(): DistributionPoint[] {
    return [
      { name: 'English (US/UK)', value: 7800, percentage: 65 },
      { name: 'German', value: 1440, percentage: 12 },
      { name: 'Hindi/Regional', value: 1200, percentage: 10 },
      { name: 'French', value: 600, percentage: 5 },
      { name: 'Japanese', value: 480, percentage: 4 },
      { name: 'Spanish', value: 480, percentage: 4 },
    ];
  }

  /**
   * Devices split
   */
  static getDeviceDistribution(): DistributionPoint[] {
    return [
      { name: 'Desktop Workstations', value: 8400, percentage: 70 },
      { name: 'Mobile Devices', value: 2400, percentage: 20 },
      { name: 'Tablet Units', value: 1200, percentage: 10 },
    ];
  }
}
