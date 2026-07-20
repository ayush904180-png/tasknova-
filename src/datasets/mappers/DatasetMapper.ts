/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetEntity, DatasetVersion, DatasetFile, DatasetLifecycle, DatasetCategory } from '../types';

export class DatasetMapper {
  /**
   * Helper to format bytes into readable KB/MB string values
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Map raw files array and initial statistics into a clean DatasetVersion entity
   */
  static mapToVersion(
    versionString: string,
    changelog: string,
    creatorId: string,
    creatorName: string,
    files: DatasetFile[],
    rowCount: number,
    columnCount: number,
    fileSizeInBytes: number,
    missingCellsCount: number,
    duplicateRowsCount: number,
    invalidValuesCount: number,
    schemaFieldsCount: number
  ): DatasetVersion {
    const totalCells = rowCount * (columnCount || 1);
    const densityScore = parseFloat((((totalCells - missingCellsCount) / totalCells) * 100).toFixed(2)) || 100;

    return {
      id: `ver_${Date.now()}_${versionString.replace(/\./g, '_')}`,
      versionString,
      changelog,
      createdAt: new Date().toISOString(),
      createdById: creatorId,
      createdByName: creatorName,
      statistics: {
        rowCount,
        columnCount,
        fileSizeInBytes,
        missingCellsCount,
        duplicateRowsCount,
        invalidValuesCount,
        densityScore,
      },
      quality: {
        qualityScore: 90, // Placeholder, calculated later in QualityEngine
        integrityScore: 90,
        consistencyScore: 90,
        completenessScore: 90,
        confidenceScore: 90,
        riskScore: 10,
        warnings: [],
        recommendations: [],
        potentialProblems: [],
      },
      schema: {
        id: `sch_${Date.now()}`,
        confidenceScore: 98,
        detectedAt: new Date().toISOString(),
        fields: [], // Populated dynamically in validator
      },
      files: [...files],
    };
  }

  /**
   * Helper to parse raw JSON text and extract basic records count
   */
  static parseRawJSONString(raw: string): Record<string, any>[] {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.data)) return parsed.data;
        if (Array.isArray(parsed.rows)) return parsed.rows;
        return [parsed];
      }
      return [];
    } catch (e) {
      console.warn('Failed to map raw string to JSON data array');
      return [];
    }
  }
}
