/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetStatistics, DatasetQuality } from '../types';

export class QualityEngine {
  /**
   * Run structural inspection and compute scoring parameters
   */
  static calculateDatasetQuality(
    stats: DatasetStatistics,
    isConfidential: boolean,
    fileExtension: string
  ): DatasetQuality {
    const { rowCount, columnCount, missingCellsCount, duplicateRowsCount, invalidValuesCount } = stats;

    if (rowCount === 0) {
      return {
        qualityScore: 0,
        integrityScore: 0,
        consistencyScore: 0,
        completenessScore: 0,
        confidenceScore: 0,
        riskScore: 0,
        warnings: ['Dataset is empty.'],
        recommendations: ['Upload source files containing data.'],
        potentialProblems: ['Unusable schema.']
      };
    }

    // 1. Calculate Completeness Score
    // Penalty based on fraction of missing cells
    const totalCells = rowCount * columnCount;
    const missingFraction = missingCellsCount / totalCells;
    const completenessScore = Math.max(0, Math.min(100, Math.round((1 - missingFraction) * 100)));

    // 2. Calculate Integrity Score
    // Penalty based on duplicate rows and invalid fields
    const duplicatePenalty = (duplicateRowsCount / rowCount) * 100;
    const invalidPenalty = (invalidValuesCount / totalCells) * 100;
    const integrityScore = Math.max(0, Math.min(100, Math.round(100 - duplicatePenalty * 2 - invalidPenalty * 5)));

    // 3. Calculate Consistency Score
    // Based on the format and uniform row distribution
    let formatBonus = 100;
    if (fileExtension.toLowerCase() === 'zip') {
      formatBonus = 85; // Compression introduces structural ambiguity
    } else if (fileExtension.toLowerCase() === 'csv' && invalidValuesCount > 5) {
      formatBonus = 90;
    }
    const consistencyScore = Math.max(0, Math.min(100, Math.round(formatBonus - (invalidValuesCount / rowCount) * 10)));

    // 4. Calculate Confidence Score
    // Higher row counts and density give higher training confidence
    const densityPenalty = (100 - stats.densityScore) * 2;
    const volumeBonus = Math.min(15, Math.log10(rowCount) * 3); // More data increases model training confidence
    const confidenceScore = Math.max(0, Math.min(100, Math.round(90 - densityPenalty + volumeBonus)));

    // 5. Calculate Risk Score
    // High duplicates, unencrypted structures, or confidential flags increase security risks
    let riskBase = 5;
    if (isConfidential) {
      riskBase += 45; // Strictly restricted
    }
    if (duplicateRowsCount > rowCount * 0.1) {
      riskBase += 15; // Redundant patterns are vulnerable to over-fitting/poisoning
    }
    if (missingCellsCount > rowCount * 0.05) {
      riskBase += 10; // Bias leak risks
    }
    const riskScore = Math.max(0, Math.min(100, Math.round(riskBase)));

    // 6. Overall Quality Score
    const qualityScore = Math.round(
      completenessScore * 0.3 +
      integrityScore * 0.3 +
      consistencyScore * 0.2 +
      confidenceScore * 0.2
    );

    // 7. Generate actionable alerts
    const warnings: string[] = [];
    const recommendations: string[] = [];
    const potentialProblems: string[] = [];

    if (missingCellsCount > 0) {
      warnings.push(`Dataset contains ${missingCellsCount} missing/null data cells.`);
      recommendations.push('Execute statistical imputation or backfill missing values using median parameters.');
    }

    if (duplicateRowsCount > 0) {
      warnings.push(`Deduplication scan flagged ${duplicateRowsCount} exact row duplicates.`);
      recommendations.push('Activate the corporate pipeline deduplication script to clean redundant keys.');
      potentialProblems.push('Redundant inputs risk over-fitting local gradients during learning stages.');
    }

    if (invalidValuesCount > 0) {
      warnings.push(`${invalidValuesCount} cell values do not match strict schema type requirements.`);
      recommendations.push('Inspect source row formats or run the cleaning parser.');
      potentialProblems.push('Invalid parameters trigger runtime parsing issues in alignment workers.');
    }

    if (isConfidential && riskScore > 40) {
      warnings.push('High confidentiality tag is enabled. Encryption headers required.');
      recommendations.push('Establish GCP Cloud Storage KMS integration keys for this asset.');
    }

    if (rowCount < 500) {
      warnings.push('Low row count volume detected.');
      recommendations.push('Aggregate additional prompt samples to achieve balanced general weights.');
      potentialProblems.push('Insufficient size triggers severe generalization penalties.');
    }

    if (warnings.length === 0) {
      recommendations.push('Dataset is in optimal state. Ready for standard training pipeline publishing.');
    }

    return {
      qualityScore,
      integrityScore,
      consistencyScore,
      completenessScore,
      confidenceScore,
      riskScore,
      warnings,
      recommendations,
      potentialProblems,
    };
  }
}
