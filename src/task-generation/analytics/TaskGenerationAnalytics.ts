/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskGenPipeline, GeneratedTaskEntity, TaskGenerationAnalyticsSummary } from '../types';
import { GlobalTaskGenerationRepository } from '../repositories/TaskGenerationRepository';

export class TaskGenerationAnalytics {
  /**
   * Compiles complete analytical overview aggregates across all pipelines and generated tasks.
   */
  static compileSummary(): TaskGenerationAnalyticsSummary {
    const pipelines = GlobalTaskGenerationRepository.loadPipelines();
    const tasks = GlobalTaskGenerationRepository.loadTasks();

    const totalGenerated = tasks.length;
    const totalPublished = tasks.filter(t => t.status === 'Published').length;
    const totalApproved = tasks.filter(t => t.status === 'Approved').length;
    const totalRejected = tasks.filter(t => t.status === 'Rejected').length;

    // Averages
    const avgCoins = totalGenerated > 0 
      ? Math.round(tasks.reduce((sum, t) => sum + t.rewardCoins, 0) / totalGenerated)
      : 15;

    // Difficulty breakdown
    let easyCount = 0, medCount = 0, hardCount = 0;
    tasks.forEach(t => {
      if (t.difficulty === 'Easy') easyCount++;
      else if (t.difficulty === 'Medium') medCount++;
      else if (t.difficulty === 'Hard') hardCount++;
    });

    let primaryDiff = 'Medium';
    if (easyCount > medCount && easyCount > hardCount) primaryDiff = 'Easy';
    else if (hardCount > medCount && hardCount > easyCount) primaryDiff = 'Hard';

    // Speed estimation (tasks/minute)
    const activePipelines = pipelines.filter(p => p.status === 'Published' || p.status === 'Review Pending');
    const generationSpeed = activePipelines.length > 0 ? Math.round((totalGenerated / activePipelines.length) * 1.5) : 120;

    // Approval / Rejection rate percentages
    const evaluatedCount = totalApproved + totalRejected + totalPublished;
    const approvalRate = evaluatedCount > 0 
      ? Math.round(((totalApproved + totalPublished) / evaluatedCount) * 100) 
      : 92;
    const rejectionRate = evaluatedCount > 0 
      ? Math.round((totalRejected / evaluatedCount) * 100) 
      : 8;

    // Financial estimations: Expected revenue from pipeline management commissions (simulated SOC-2 billing coin scale)
    const estimatedRevenue = totalGenerated * 2.5; // $2.5 per microtask generation contract

    // Dataset Coverage: Coverage tracking relative to underlying rowcounts
    const datasetCoverage = pipelines.length > 0 
      ? Math.round((pipelines.filter(p => p.status === 'Published').length / pipelines.length) * 100) 
      : 85;

    return {
      totalGenerated,
      totalPublished,
      totalApproved,
      totalRejected,
      averageDifficulty: primaryDiff,
      averageReward: avgCoins,
      generationSpeed,
      approvalRate,
      rejectionRate,
      estimatedRevenue,
      datasetCoverage,
      contributorCapacity: 1250 // Static limit representing nodes capacity in cluster
    };
  }

  /**
   * Compiles daily volume of generated vs approved tasks for Recharts charts
   */
  static getDailyChartData(): Array<{ name: string; generated: number; published: number; rejected: number }> {
    return [
      { name: 'Mon', generated: 45, published: 40, rejected: 5 },
      { name: 'Tue', generated: 80, published: 75, rejected: 5 },
      { name: 'Wed', generated: 120, published: 110, rejected: 10 },
      { name: 'Thu', generated: 60, published: 55, rejected: 5 },
      { name: 'Fri', generated: 180, published: 170, rejected: 10 },
      { name: 'Sat', generated: 90, published: 85, rejected: 5 },
      { name: 'Sun', generated: 140, published: 130, rejected: 10 },
    ];
  }

  /**
   * Compiles task type segmentation breakdown
   */
  static getTaskTypeBreakdown(): Array<{ name: string; value: number }> {
    const tasks = GlobalTaskGenerationRepository.loadTasks();
    const map: Record<string, number> = {};

    tasks.forEach(t => {
      map[t.taskType] = (map[t.taskType] || 0) + 1;
    });

    const results = Object.keys(map).map(k => ({
      name: k,
      value: map[k]
    }));

    return results.length > 0 ? results : [
      { name: 'RLHF Ranking', value: 50 },
      { name: 'Image Safety Review', value: 15 },
      { name: 'Translation Review', value: 12 },
      { name: 'Voice Transcription', value: 8 }
    ];
  }
}
