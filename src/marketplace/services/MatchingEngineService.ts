/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from '../../types/tasks';
import { ContributorProfile, SmartMatchingResult } from '../types';

/**
 * Heuristic-driven Smart Matching Engine for Contributor Task routing.
 */
export class MatchingEngineService {
  /**
   * Evaluates a single task against a contributor profile to generate a detailed Match Result.
   */
  public calculateMatch(task: Task, profile: ContributorProfile): SmartMatchingResult {
    const matchingReasons: string[] = [];
    let compatibilityScore = 70; // Baseline score
    let skillIntersectionCount = 0;

    // 1. SKILL INTERSECTION
    const taskKeywords = [
      task.category.toLowerCase(),
      task.taskType.toLowerCase(),
      ...(task.tags || []).map(t => t.toLowerCase())
    ];

    const matchedSkills = profile.skills.filter(skill => {
      const isMatched = taskKeywords.some(keyword => 
        keyword.includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(keyword)
      );
      if (isMatched) skillIntersectionCount++;
      return isMatched;
    });

    const skillMatchPercentage = profile.skills.length > 0 
      ? Math.round((skillIntersectionCount / Math.max(3, profile.skills.length)) * 100)
      : 50;

    if (skillIntersectionCount > 0) {
      compatibilityScore += skillIntersectionCount * 8;
      matchingReasons.push(`Matches ${skillIntersectionCount} of your listed skills (${matchedSkills.slice(0, 2).join(', ')})`);
    } else {
      compatibilityScore -= 10;
      matchingReasons.push('No direct skill overlap; open to general contributors.');
    }

    // 2. TRUST SCORE MATCHING
    const trustRequired = task.requiredTrustScore || 60;
    const trustDiff = profile.trustScore - trustRequired;
    if (trustDiff >= 0) {
      compatibilityScore += Math.min(10, trustDiff * 0.5);
      matchingReasons.push(`Your high Trust Score (${profile.trustScore}%) exceeds the ${trustRequired}% threshold`);
    } else {
      compatibilityScore -= Math.min(30, Math.abs(trustDiff) * 2);
      matchingReasons.push(`Trust Score (${profile.trustScore}%) is below recommended ${trustRequired}%`);
    }

    // 3. ACCURACY RATING MATCHING
    const accRequired = task.requiredAccuracy || 70;
    const accDiff = profile.accuracy - accRequired;
    if (accDiff >= 0) {
      compatibilityScore += Math.min(10, accDiff * 0.8);
    } else {
      compatibilityScore -= Math.min(25, Math.abs(accDiff) * 1.5);
    }

    // 4. LANGUAGE AND COUNTRY
    if (task.language && task.language !== 'ALL' && task.language !== 'All' && task.language.trim() !== '') {
      const isLangMatched = profile.languages.some(lang => 
        lang.toLowerCase() === task.language.toLowerCase() || 
        lang.split('-')[0].toLowerCase() === task.language.split('-')[0].toLowerCase()
      );
      if (isLangMatched) {
        compatibilityScore += 12;
        matchingReasons.push(`Language fluency verified for localized ${task.language} dataset`);
      } else {
        compatibilityScore -= 20;
      }
    }

    if (task.country && task.country !== 'ALL' && task.country !== 'All' && task.country.trim() !== '') {
      const isCountryMatched = profile.country.toLowerCase() === task.country.toLowerCase();
      if (isCountryMatched) {
        compatibilityScore += 10;
        matchingReasons.push(`Geographical alignment confirmed in ${profile.country}`);
      } else {
        compatibilityScore -= 25;
      }
    }

    // 5. DEVICE CAPABILITY
    // If task metadata has device requirements (e.g. requires High-Mem or GPU)
    const reqDevice = task.metadata?.requiredDevice || task.metadata?.deviceClass;
    if (reqDevice) {
      const userHasDevice = profile.deviceCapabilities.some(dev => dev.toLowerCase() === String(reqDevice).toLowerCase());
      if (userHasDevice) {
        compatibilityScore += 15;
        matchingReasons.push(`Device capability verified for '${reqDevice}' resource requirements`);
      } else {
        compatibilityScore -= 30;
        matchingReasons.push(`Potential device capability mismatch (Task prefers: ${reqDevice})`);
      }
    }

    // 6. PREFERENCE TIER MATCHING
    // Reward preference
    if (profile.rewardPreference === 'Coins' && task.rewardCoins >= 25) {
      compatibilityScore += 5;
    }
    // Difficulty preference
    if (profile.difficultyPreference.toLowerCase() === task.difficulty.toLowerCase()) {
      compatibilityScore += 8;
      matchingReasons.push(`Matches your ${profile.difficultyPreference} difficulty preference`);
    }

    // Bound the final compatibility score
    compatibilityScore = Math.max(15, Math.min(99, Math.round(compatibilityScore)));

    // Calculate Expected Success Rate (correlated with user accuracy + trust + skill overlap)
    const successFactor = (profile.accuracy * 0.5 + (100 - (100 - compatibilityScore) * 0.3) * 0.5);
    const expectedSuccessRate = Math.max(40, Math.min(99, Math.round(successFactor)));

    // Calculate Expected Completion Time (correlated with profile accuracy & level - experts are faster)
    const speedMultiplier = 1.2 - (profile.level * 0.03) - (profile.accuracy / 500);
    const expectedCompletionTimeSeconds = Math.max(
      10,
      Math.round(task.estimatedCompletionTime * Math.max(0.6, speedMultiplier))
    );

    // Calculate Estimated Earnings (base coin with possible bonus multiplier from level & high trust)
    const levelEarningMultiplier = 1 + (profile.level * 0.015) + (profile.trustScore > 90 ? 0.05 : 0);
    const estimatedEarningsCoins = Math.round(task.rewardCoins * levelEarningMultiplier);

    // Recommendation Confidence mapping
    let recommendationConfidence: 'Low' | 'Medium' | 'High' = 'Medium';
    if (compatibilityScore >= 85) {
      recommendationConfidence = 'High';
    } else if (compatibilityScore < 55) {
      recommendationConfidence = 'Low';
    }

    return {
      taskId: task.id,
      compatibilityScore,
      expectedSuccessRate,
      expectedCompletionTimeSeconds,
      estimatedEarningsCoins,
      skillMatchPercentage,
      matchedSkills,
      recommendationConfidence,
      matchingReasons
    };
  }

  /**
   * Ranks an array of tasks for a given contributor profile.
   */
  public rankTasks(tasks: Task[], profile: ContributorProfile): Array<{ task: Task; match: SmartMatchingResult }> {
    return tasks
      .map(task => ({
        task,
        match: this.calculateMatch(task, profile)
      }))
      .sort((a, b) => b.match.compatibilityScore - a.match.compatibilityScore);
  }
}
export const GlobalMatchingEngineService = new MatchingEngineService();
